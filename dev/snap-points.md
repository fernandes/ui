# Snap Points - Implementation Reference

This document describes how snap points work in Vaul and how we should implement them correctly in our Rails drawer component.

## What Are Snap Points?

Snap points are predefined positions where the drawer can "rest" at different heights/widths. Instead of just being fully open or closed, a drawer can have multiple stable positions.

### Common Examples:
- **Bottom Sheet**: `[0.2, 0.5, 1]` - 20% open, 50% open, fully open
- **Peek Mode**: `['120px', 1]` - Shows 120px initially, can expand to full
- **Multi-stage**: `[0.25, 0.5, 0.75, 1]` - Quarter increments

## Core Architecture in Vaul

### 1. Data Structure
```javascript
// Snap points can be:
// - Decimal (0-1): Percentage of container height
// - Integer (1-100): Percentage of container height
// - String with 'px': Pixel value from edge
snapPoints: [0.5, 1]           // 50% and 100% open
snapPoints: [148, 355]          // 148px and 355px from closed position
snapPoints: ['148px', '355px']  // Same but explicit pixels
```

### 2. Key Properties

```javascript
{
  snapPoints: [0.5, 1],              // Define snap positions
  activeSnapPoint: 0.5,              // Current/initial snap point
  setActiveSnapPoint: (val) => {},  // Callback when snap point changes
  fadeFromIndex: 1,                  // Which index starts overlay fade (default: last)
  snapToSequentialPoint: false,     // Disable velocity-based skipping
}
```

## How Snap Points Work

### 1. Initialization
1. Convert all snap points to pixel offsets based on container size
2. Store offsets in `snapPointsOffset` array
3. Set initial position to `activeSnapPoint` or first snap point

### 2. During Drag
1. Track drag distance and calculate percentage dragged
2. Find closest snap point based on current position
3. Apply visual feedback (opacity changes if past fadeFromIndex)
4. NO snapping during drag - smooth following of pointer

### 3. On Release (The Magic)
```javascript
function onReleaseSnapPoints(draggedDistance, velocity) {
  // High velocity - skip to next snap point
  if (velocity > VELOCITY_THRESHOLD) {
    if (isClosingDirection) {
      // Skip to next snap point in closing direction
      currentSnapIndex = Math.max(0, currentSnapIndex - 1)
    } else {
      // Skip to next snap point in opening direction
      currentSnapIndex = Math.min(snapPoints.length - 1, currentSnapIndex + 1)
    }
  }
  // Low velocity - find closest snap point
  else {
    currentSnapIndex = findClosestSnapPoint(draggedDistance)
  }

  // Animate to target snap point
  snapToPoint(snapPoints[currentSnapIndex])
}
```

### 4. Finding Closest Snap Point
```javascript
function findClosestSnapPoint(currentPosition) {
  let closestIndex = 0
  let closestDistance = Infinity

  snapPointsOffset.forEach((offset, index) => {
    const distance = Math.abs(currentPosition - offset)
    if (distance < closestDistance) {
      closestDistance = distance
      closestIndex = index
    }
  })

  return closestIndex
}
```

## Animation Strategy

### CSS-Driven Animations
```css
/* During drag - no transition */
.drawer[data-dragging="true"] {
  transition: none !important;
}

/* On release - smooth snap animation */
.drawer {
  transition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}
```

### Transform Calculation
```javascript
// For bottom drawer with snap points [0.5, 1]
// snapPointsOffset might be [300, 0] (for 600px high container)

function getTransform(snapPointIndex) {
  const offset = snapPointsOffset[snapPointIndex]
  return `translate3d(0, ${offset}px, 0)`
}

// Fully open (index 1): translate3d(0, 0px, 0)
// Half open (index 0): translate3d(0, 300px, 0)
```

## Overlay Opacity with fadeFromIndex

The overlay fades based on position relative to fadeFromIndex snap point:

```javascript
function updateOverlayOpacity(currentPosition) {
  if (fadeFromIndex === null) return

  const fadePoint = snapPointsOffset[fadeFromIndex]
  const maxPoint = snapPointsOffset[snapPointsOffset.length - 1]

  // Calculate percentage between fade point and max
  const progress = (currentPosition - fadePoint) / (maxPoint - fadePoint)

  // Opacity is inverse of progress (closer to max = less opacity)
  overlay.style.opacity = Math.max(0, Math.min(1, 1 - progress))
}
```

### Example with fadeFromIndex
```javascript
snapPoints: [0.2, 0.5, 1]
fadeFromIndex: 1  // Start fading from index 1 (0.5 position)

// At 0.2 position: overlay fully visible (opacity: 1)
// At 0.5 position: overlay starts fading (opacity: 1)
// At 0.75 position: overlay half faded (opacity: 0.5)
// At 1.0 position: overlay fully faded (opacity: 0)
```

## Velocity-Based Snapping

### The Physics
```javascript
const VELOCITY_THRESHOLD = 0.4  // Threshold for "flick" gesture

function calculateVelocity(distance, time) {
  return Math.abs(distance) / time
}

// Fast flick down -> close or go to lower snap point
// Fast flick up -> open or go to higher snap point
// Slow drag -> snap to closest point
```

### snapToSequentialPoint Behavior
When `snapToSequentialPoint: true`:
- Velocity is ignored
- Always snap to nearest point
- No skipping intermediate snap points
- Better for equally important snap positions

## Implementation in Our Rails Drawer

### Current Issues to Fix:

1. **Snap points not being calculated correctly**
   - Need to calculate pixel offsets on mount and resize
   - Store offsets for use during drag/release

2. **No velocity tracking**
   - Need to track dragStartTime and calculate velocity
   - Use velocity for snap point selection

3. **Missing fadeFromIndex logic**
   - Implement overlay opacity based on position
   - Calculate relative position between snap points

4. **Animation issues with snapping**
   - Ensure smooth transitions between snap points
   - No transition during drag, smooth transition on release

### Required Changes:

#### 1. JavaScript Controller
```javascript
// Calculate snap point offsets
calculateSnapPointOffsets() {
  if (!this.snapPointsValue.length) return

  const containerHeight = this.getContainerSize().height
  this.snapPointOffsets = this.snapPointsValue.map(point => {
    if (typeof point === 'string' && point.includes('px')) {
      return parseInt(point)
    }
    const percentage = point > 1 ? point / 100 : point
    return containerHeight - (containerHeight * percentage)
  })
}

// Find closest snap point
findClosestSnapPointIndex(currentY) {
  let closest = 0
  let minDistance = Infinity

  this.snapPointOffsets.forEach((offset, i) => {
    const distance = Math.abs(currentY - offset)
    if (distance < minDistance) {
      minDistance = distance
      closest = i
    }
  })

  return closest
}

// Snap to specific point
snapToPoint(index) {
  const offset = this.snapPointOffsets[index]
  this.contentTarget.style.transition = `transform ${DURATION}s ${EASE}`
  this.contentTarget.style.transform = `translate3d(0, ${offset}px, 0)`
  this.activeSnapPointIndex = index
  this.updateOverlayForSnapPoint(index)
}
```

#### 2. HTML Attributes
```erb
<div data-ui--drawer-snap-points-value="[0.5, 1]"
     data-ui--drawer-active-snap-point-value="0.5"
     data-ui--drawer-fade-from-index-value="1">
```

#### 3. CSS Classes
```css
/* Snap point indicators (optional) */
.drawer-content[data-snap-point="0"] { /* First snap point styles */ }
.drawer-content[data-snap-point="1"] { /* Second snap point styles */ }

/* Dragging state */
.drawer-content[data-dragging="true"] {
  transition: none !important;
}
```

## Testing Snap Points

### Test Scenarios:

1. **Basic Snapping**
   - Drag drawer to 30% -> Should snap to 50%
   - Drag drawer to 70% -> Should snap to 100%
   - Drag drawer to 10% -> Should close (if dismissible)

2. **Velocity Snapping**
   - Quick flick up from 50% -> Should go to 100%
   - Quick flick down from 50% -> Should close
   - Slow drag from 50% to 60% -> Should return to 50%

3. **Overlay Fade**
   - At snap point 0 (50%) -> Full overlay
   - Between 50% and 100% -> Fading overlay
   - At 100% open -> No overlay (or minimal)

4. **Resize Handling**
   - Rotate device/resize window
   - Snap points should recalculate
   - Drawer should maintain relative position

## Common Patterns

### 1. Peek and Expand
```javascript
snapPoints: ['200px', 1]  // Peek at 200px, expand to full
fadeFromIndex: 0          // Start fading immediately
```

### 2. Three-Stage Drawer
```javascript
snapPoints: [0.25, 0.75, 1]  // Collapsed, normal, expanded
fadeFromIndex: 1              // Fade only in last stage
```

### 3. Maps-Style Bottom Sheet
```javascript
snapPoints: ['100px', 0.5, 1]  // Minimal, half, full
snapToSequentialPoint: true     // Each position is important
```

## Debugging Snap Points

### Console Helpers
```javascript
// Log snap point calculations
console.log('Snap points:', this.snapPointsValue)
console.log('Offsets:', this.snapPointOffsets)
console.log('Current position:', this.currentY)
console.log('Closest snap:', this.findClosestSnapPointIndex(this.currentY))
console.log('Velocity:', this.velocity)
```

### Visual Debugging
```css
/* Show snap point positions */
.drawer::before {
  content: attr(data-debug-snap-points);
  position: fixed;
  top: 10px;
  right: 10px;
  background: red;
  color: white;
  padding: 5px;
  z-index: 9999;
}
```

## Key Differences from Simple Open/Close

| Simple Drawer | Snap Points Drawer |
|--------------|-------------------|
| Two states: open/closed | Multiple stable positions |
| Binary animation | Multi-stage animations |
| Fixed overlay opacity | Dynamic overlay fade |
| Simple threshold check | Velocity + distance calculation |
| No position memory | Tracks active snap point |

## Implementation Checklist

- [ ] Calculate snap point offsets on mount
- [ ] Recalculate on window resize
- [ ] Track drag velocity
- [ ] Find closest snap point algorithm
- [ ] Implement snap animation
- [ ] Handle fadeFromIndex for overlay
- [ ] Support pixel and percentage values
- [ ] Add activeSnapPoint tracking
- [ ] Implement snapToSequentialPoint option
- [ ] Test with multiple snap points
- [ ] Handle edge cases (no snap points, single point)
- [ ] Dispatch events on snap point change

## References

- [Vaul useSnapPoints hook](https://github.com/emilkowalski/vaul/blob/main/src/use-snap-points.ts)
- [Vaul main component](https://github.com/emilkowalski/vaul/blob/main/src/index.tsx)
- [Bottom Sheet UX patterns](https://material.io/components/sheets-bottom)