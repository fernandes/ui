# Vaul Drawer - Implementation Reference

This document describes how Vaul (the React drawer library that shadcn/ui uses) implements its drawer functionality. This serves as our reference for implementing the drawer correctly in Rails.

## Core Architecture

Vaul is a drawer component for React that provides:
- Touch-enabled drag interactions
- Multiple snap points
- Nested drawer support
- Keyboard-aware positioning
- Smooth animations

## Key Principles

### 1. Transform-Based Positioning
- **NEVER uses `display: none` or `visibility: hidden`**
- Everything is controlled via CSS transforms
- Drawer is always in the DOM, just moved off-screen when closed

```css
/* Closed state - drawer moved off-screen */
transform: translate3d(0, 100%, 0); /* bottom drawer */
transform: translate3d(0, -100%, 0); /* top drawer */
transform: translate3d(100%, 0, 0); /* right drawer */
transform: translate3d(-100%, 0, 0); /* left drawer */

/* Open state - drawer in view */
transform: translate3d(0, 0, 0);
```

### 2. Animation Strategy
- **CSS transitions handle animations, NOT JavaScript**
- JavaScript only sets transform values and data attributes
- During drag: `transition: none` for immediate feedback
- On release: CSS transition with cubic-bezier easing

```javascript
// During drag - no transition for responsive feel
element.style.transition = 'none';
element.style.transform = `translate3d(0, ${dragY}px, 0)`;

// On release - smooth transition to final position
element.style.transition = `transform ${DURATION}s cubic-bezier(0.32, 0.72, 0, 1)`;
element.style.transform = `translate3d(0, ${finalY}px, 0)`;
```

### 3. State Management via Data Attributes

Vaul uses data attributes to manage state, NOT classes:

```html
<!-- Container -->
<div data-vaul-drawer-wrapper="">

  <!-- Overlay -->
  <div data-vaul-overlay="" style="opacity: 1"></div>

  <!-- Drawer Content -->
  <div
    data-vaul-drawer=""
    data-vaul-drawer-direction="bottom"
    data-vaul-animate="true"
    style="transform: translate3d(0, 0, 0)">

    <!-- Handle (optional) -->
    <div data-vaul-handle=""></div>

    <!-- Content -->
  </div>
</div>
```

### 4. Scroll Locking

When modal drawer is open:
- Adds `data-scroll-locked="1"` to body
- Sets `overflow: hidden` on body
- Does NOT use `pointer-events: none` on body (would break drag)

```javascript
// Lock scroll
document.body.style.overflow = 'hidden';
document.body.setAttribute('data-scroll-locked', '1');

// Unlock scroll
document.body.style.overflow = '';
document.body.removeAttribute('data-scroll-locked');
```

### 5. Pointer Events Control

- **Content element**: Always has pointer events enabled
- **Interaction control**: Via `data-[state=closed]:pointer-events-none`
- **During drag**: Element remains interactive

```css
/* Drawer content - interaction control via state */
.drawer-content {
  /* Always visible, control via pointer-events */
  pointer-events: auto;
}

.drawer-content[data-state="closed"] {
  pointer-events: none;
}
```

## HTML Structure

### Basic Drawer
```html
<!-- Root container -->
<div data-vaul-drawer-wrapper="" data-state="open">

  <!-- Overlay (only for modal drawers) -->
  <div
    data-vaul-overlay=""
    data-state="open"
    style="opacity: 1; transition: opacity 0.5s cubic-bezier(0.32, 0.72, 0, 1)">
  </div>

  <!-- Drawer content -->
  <div
    data-vaul-drawer=""
    data-vaul-drawer-direction="bottom"
    data-state="open"
    role="dialog"
    aria-modal="true"
    style="transform: translate3d(0, 0, 0); transition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)">

    <!-- Optional handle -->
    <div data-vaul-handle=""></div>

    <!-- Actual content -->
    <div>Content here...</div>
  </div>
</div>
```

## JavaScript Behavior

### Core Functions

1. **Opening**:
   - Set `data-state="open"` on all elements
   - Animate transform to `translate3d(0, 0, 0)`
   - Lock scroll if modal
   - Setup focus trap

2. **Closing**:
   - Set `data-state="closed"` on all elements
   - Animate transform to off-screen position
   - Unlock scroll
   - Remove focus trap

3. **Dragging**:
   - Track pointer position
   - Update transform in real-time (no transition)
   - Check drag thresholds
   - Determine if should close or snap back

### Key Implementation Details

```javascript
// Constants from Vaul
const TRANSITIONS = {
  DURATION: 0.5,
  EASE: [0.32, 0.72, 0, 1]
};

const VELOCITY_THRESHOLD = 0.4;
const CLOSE_THRESHOLD = 0.25; // Close if dragged 25% of height

// Helper to set transform
function set(element, value, direction = 'bottom') {
  if (!element) return;

  const transform = direction === 'bottom' || direction === 'top'
    ? `translate3d(0, ${value}px, 0)`
    : `translate3d(${value}px, 0, 0)`;

  element.style.transform = transform;
}
```

## Critical Differences from Traditional Modals

### ❌ What NOT to do:
1. **Don't use `display: none` or `visibility: hidden`**
   - Kills animations
   - Causes flicker
   - Breaks smooth transitions

2. **Don't animate via JavaScript**
   - No `setTimeout` for animations
   - No manual class toggling for visibility
   - No `animationend` listeners for cleanup

3. **Don't use `hidden` or `invisible` classes on drawer content**
   - Content stays visible, moved off-screen via transform
   - Only overlay can fade via opacity

### ✅ What TO do:
1. **Use transforms for positioning**
   - GPU-accelerated
   - Smooth animations
   - No layout recalculation

2. **Use CSS transitions**
   - Set transition property
   - Change transform value
   - Let CSS handle the animation

3. **Use data attributes for state**
   - `data-state="open"` or `data-state="closed"`
   - CSS selectors target these for styling
   - JavaScript only manages attributes

## Our Implementation Checklist

To match Vaul's behavior, our Rails drawer must:

- [ ] Remove ALL `invisible`/`visible` classes from drawer content
- [ ] Use transform to move drawer off-screen when closed
- [ ] Set `data-state` attributes for state management
- [ ] Use CSS transitions for animations (not JS)
- [ ] Lock scroll with `overflow: hidden` (not `pointer-events: none`)
- [ ] Keep drawer in DOM at all times
- [ ] Use pointer-events control for interaction blocking
- [ ] Handle drag events properly without preventing all pointer events
- [ ] Ensure smooth animations in and out

## Animation Timeline

### Opening:
1. Container becomes visible (if was invisible)
2. Set all `data-state="open"`
3. Overlay fades in (opacity 0 → 1)
4. Content slides in (transform from off-screen → 0)
5. All animations via CSS transitions

### Closing:
1. Set all `data-state="closed"`
2. Overlay fades out (opacity 1 → 0)
3. Content slides out (transform 0 → off-screen)
4. After animation completes, container can become invisible
5. NO immediate visibility changes that would kill animations

## Testing Points

1. **Open animation**: Should slide in smoothly from edge
2. **Close animation**: Should slide out smoothly to edge
3. **Overlay fade**: Should fade in/out with content slide
4. **Scroll lock**: Body should not scroll when drawer open
5. **Drag interaction**: Should be able to drag drawer
6. **No flicker**: No visibility flashing or jumps
7. **Performance**: Smooth 60fps animations

## References

- [Vaul GitHub](https://github.com/emilkowalski/vaul)
- [Vaul Demo](https://vaul.emilkowal.ski/)
- [shadcn/ui Drawer](https://ui.shadcn.com/docs/components/drawer)