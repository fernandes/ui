# Snap Points - Current Issues Analysis

This document compares our current snap points implementation with Vaul's approach and identifies what needs to be fixed.

## Critical Issues Found

### 1. ❌ **Incorrect Transform Calculation**

**Our Implementation:**
```javascript
// snapTo() method - line 324-329
const snapPosition = snapPercentage * drawerSize
const transform = this.getTransformForDirection(-snapPosition)
```

**Problem:** We're using negative values incorrectly. For a bottom drawer:
- Fully open (snap point 1.0) should be `translateY(0px)`
- Half open (snap point 0.5) should be `translateY(300px)` for a 600px drawer
- But we're calculating: `-1.0 * 600 = -600px` → Wrong direction!

**Vaul's Approach:**
```javascript
// For bottom drawer
const offset = containerHeight - (snapPercentage * containerHeight)
// Fully open (1.0): 600 - (1.0 * 600) = 0px ✓
// Half open (0.5): 600 - (0.5 * 600) = 300px ✓
```

### 2. ❌ **No Snap Point Offsets Pre-calculation**

**Our Implementation:**
- Calculating percentages on-the-fly during drag
- No stored pixel offsets
- Recalculating every time

**Vaul's Approach:**
```javascript
// Pre-calculate all offsets on mount/resize
snapPointOffsets = [300, 0] // For [0.5, 1] on 600px container
// Then just use the offsets directly
```

### 3. ❌ **Wrong Direction Logic**

**Our getTransformForDirection():**
```javascript
case "bottom":
  return `translateY(${delta}px)` // Wrong! Should be translate3d
```

**Should be:**
```javascript
case "bottom":
  return `translate3d(0, ${delta}px, 0)` // GPU accelerated
```

### 4. ❌ **Velocity Not Being Used Correctly**

**Our Implementation:**
```javascript
// Line 282-285
if (Math.abs(velocity) > this.VELOCITY_THRESHOLD && this.isClosingDirection(delta)) {
  this.close() // Just closes, doesn't go to next snap point!
}
```

**Vaul's Approach:**
```javascript
if (velocity > VELOCITY_THRESHOLD) {
  // Go to NEXT snap point, not just close
  const nextIndex = isClosing ? currentIndex - 1 : currentIndex + 1
  snapToPoint(nextIndex)
}
```

### 5. ❌ **fadeFromIndex Not Working**

**Our updateOverlayOpacity():**
```javascript
// Lines 507-516
const fadeIndex = this.fadeFromIndexValue >= 0
  ? this.fadeFromIndexValue
  : this.snapPointsValue.length - 1

if (dragPercentage >= this.snapPointToPercentage(this.snapPointsValue[fadeIndex])) {
  const opacity = 1 - dragPercentage
  this.overlayTarget.style.opacity = opacity
}
```

**Problems:**
- Not calculating relative position between snap points
- Using overall drag percentage instead of position between fade point and max
- Formula is wrong (should be based on position, not percentage)

**Correct Implementation:**
```javascript
const fadePoint = snapPointOffsets[fadeFromIndex]
const currentPosition = Math.abs(delta)

// Only fade if past the fade point
if (currentPosition < fadePoint) {
  overlay.style.opacity = 1 // Full opacity before fade point
} else {
  const maxPoint = snapPointOffsets[0] // Assuming sorted high to low
  const progress = (currentPosition - fadePoint) / (maxPoint - fadePoint)
  overlay.style.opacity = Math.max(0, 1 - progress)
}
```

### 6. ❌ **No Resize Handler**

**Our Implementation:** No window resize handling

**Need to add:**
```javascript
handleResize() {
  this.calculateSnapPointOffsets()
  // Re-snap to current point with new offsets
  if (this.openValue && this.activeSnapPointValue >= 0) {
    this.snapTo(this.activeSnapPointValue, false)
  }
}
```

### 7. ❌ **Snap Animation Issues**

**Our snapTo():** No transition management
```javascript
// Just sets transform directly
this.contentTarget.style.transform = transform
```

**Should be:**
```javascript
// Apply transition for animation
this.contentTarget.style.transition = `transform ${DURATION}s ${EASE}`
this.contentTarget.style.transform = transform

// Clear transition after animation
setTimeout(() => {
  this.contentTarget.style.transition = ""
}, DURATION * 1000)
```

### 8. ❌ **Initial Position Not Set**

**Our Implementation:** Drawer starts at undefined position

**Should be:**
```javascript
connect() {
  // ... existing code ...

  // Set initial snap point position
  if (this.snapPointsValue.length > 0) {
    const initialIndex = this.activeSnapPointValue || 0
    this.snapTo(initialIndex, false) // No animation on initial
  }
}
```

## Required Fixes

### Fix 1: Pre-calculate Snap Point Offsets
```javascript
calculateSnapPointOffsets() {
  if (!this.snapPointsValue.length) return

  const containerSize = this.getDrawerSize()

  this.snapPointOffsets = this.snapPointsValue.map(point => {
    if (typeof point === 'string' && point.includes('px')) {
      // Pixel value
      const pixels = parseInt(point)
      return this.directionValue === 'bottom' || this.directionValue === 'right'
        ? containerSize - pixels
        : pixels
    } else {
      // Percentage (0-1 or 1-100)
      const percentage = point > 1 ? point / 100 : point
      const pixels = percentage * containerSize
      return this.directionValue === 'bottom' || this.directionValue === 'right'
        ? containerSize - pixels
        : pixels
    }
  })

  // Sort offsets for easier calculations
  this.snapPointOffsets.sort((a, b) => a - b)
}
```

### Fix 2: Correct Transform Calculation
```javascript
getTransformForSnapPoint(index) {
  const offset = this.snapPointOffsets[index]

  switch (this.directionValue) {
    case "bottom":
      return `translate3d(0, ${offset}px, 0)`
    case "top":
      return `translate3d(0, ${-offset}px, 0)`
    case "left":
      return `translate3d(${-offset}px, 0, 0)`
    case "right":
      return `translate3d(${offset}px, 0, 0)`
    default:
      return `translate3d(0, ${offset}px, 0)`
  }
}
```

### Fix 3: Velocity-Based Snap Point Selection
```javascript
handlePointerUp(event) {
  // ... existing drag end code ...

  if (this.snapPointsValue.length > 0) {
    const velocity = this.calculateVelocity()
    const currentPosition = Math.abs(delta)

    let targetIndex

    // High velocity - skip to next/prev snap point
    if (velocity > this.VELOCITY_THRESHOLD && !this.snapToSequentialPointValue) {
      if (this.isClosingDirection(delta)) {
        // Moving toward closed - go to lower index
        targetIndex = Math.max(0, this.activeSnapPointValue - 1)
      } else {
        // Moving toward open - go to higher index
        targetIndex = Math.min(this.snapPointsValue.length - 1, this.activeSnapPointValue + 1)
      }
    } else {
      // Low velocity - find closest snap point
      targetIndex = this.findClosestSnapPointIndex(currentPosition)
    }

    // Check if should close instead
    if (targetIndex === 0 && this.dismissibleValue &&
        currentPosition > this.snapPointOffsets[0] * 1.5) {
      this.close()
    } else {
      this.snapTo(targetIndex)
    }
  }
}
```

### Fix 4: Correct Overlay Fade
```javascript
updateOverlayOpacity(currentPosition) {
  if (!this.hasOverlayTarget) return
  if (this.snapPointsValue.length === 0) return

  const fadeIndex = this.fadeFromIndexValue >= 0
    ? this.fadeFromIndexValue
    : this.snapPointsValue.length - 1

  const fadePoint = this.snapPointOffsets[fadeIndex]
  const absPosition = Math.abs(currentPosition)

  // Before fade point - full opacity
  if (absPosition >= fadePoint) {
    this.overlayTarget.style.opacity = "1"
    return
  }

  // After fade point - calculate fade
  const minPoint = this.snapPointOffsets[0] // Closest to open

  if (absPosition <= minPoint) {
    this.overlayTarget.style.opacity = "0"
  } else {
    const range = fadePoint - minPoint
    const progress = (absPosition - minPoint) / range
    this.overlayTarget.style.opacity = Math.min(1, Math.max(0, progress))
  }
}
```

### Fix 5: Add Resize Handler
```javascript
connect() {
  // ... existing code ...

  // Add resize observer
  this.resizeObserver = new ResizeObserver(() => {
    this.handleResize()
  })
  this.resizeObserver.observe(document.body)

  // Calculate initial offsets
  this.calculateSnapPointOffsets()

  // Set initial position
  if (this.openValue && this.snapPointsValue.length > 0) {
    const initialIndex = this.activeSnapPointValue || 0
    this.snapTo(initialIndex, false)
  }
}

disconnect() {
  // ... existing code ...

  if (this.resizeObserver) {
    this.resizeObserver.disconnect()
  }
}

handleResize() {
  const oldOffsets = [...(this.snapPointOffsets || [])]
  this.calculateSnapPointOffsets()

  // Maintain relative position after resize
  if (this.openValue && this.activeSnapPointValue >= 0) {
    this.snapTo(this.activeSnapPointValue, false)
  }
}
```

## Testing Checklist

- [ ] Drawer opens to first snap point (not fully open)
- [ ] Dragging between snap points feels smooth
- [ ] Release snaps to correct nearest point
- [ ] Fast flick skips snap points correctly
- [ ] Overlay fades correctly from fadeFromIndex
- [ ] Resize maintains relative position
- [ ] Pixel-based snap points work (`['200px', '400px']`)
- [ ] Percentage snap points work (`[0.5, 1]`)
- [ ] Sequential snap mode disables velocity skipping
- [ ] Events fire on snap point changes

## Priority Order

1. **Fix transform calculation** (drawer going wrong direction)
2. **Pre-calculate offsets** (performance and correctness)
3. **Fix velocity handling** (proper snap point skipping)
4. **Fix overlay fade** (visual feedback)
5. **Add resize handler** (responsive behavior)
6. **Set initial position** (start at correct snap point)

## Summary

Our current implementation has fundamental calculation errors that make snap points unusable. The main issues are:

1. **Transform math is inverted** - drawer moves opposite direction
2. **No offset pre-calculation** - inefficient and error-prone
3. **Velocity just closes** - should go to next snap point
4. **Fade calculation wrong** - not relative to snap points
5. **Missing resize handling** - breaks on viewport change

These need to be fixed systematically following the Vaul implementation pattern.