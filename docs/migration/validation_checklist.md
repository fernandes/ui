# Component Migration Validation Checklist

## Overview

This checklist ensures component migrations maintain quality, consistency, and follow UI Engine patterns.

## Pre-Migration Research

- [ ] Visited shadcn/ui component page
- [ ] Visited Radix UI primitives documentation
    - [ ] Learn about component anatomy (Anatomy Section)
    - [ ] Learn about each component part parameters on API Reference section
    - [ ] Check `Accessibility` section to learn its keyboard usage, so Usability agent can work on it
- [ ] **Checked shadcn/ui API Reference section for `asChild` prop**
    - [ ] If `asChild` is listed in API Reference, component MUST implement it
    - [ ] Include `UI::Shared::AsChildBehavior` module
    - [ ] Add `as_child: false` parameter to initialize
    - [ ] Implement conditional rendering (yield attrs vs render element)
    - [ ] Add showcase examples demonstrating asChild usage
- [ ] Inspected live example in browser DevTools
- [ ] Extracted HTML structure
- [ ] Extracted all CSS classes
- [ ] Documented ARIA attributes
- [ ] Documented data attributes
- [ ] Identified animation timings and easing functions
- [ ] Checked for asChild composition needs

## Styling Rules (CRITICAL)

### ✅ ALWAYS Use Tailwind

- [ ] All styling uses Tailwind utility classes
- [ ] No custom CSS in `<style>` tags
- [ ] No inline `style=""` attributes
- [ ] Use arbitrary values for custom values: `h-[300px]`, `transition-[height]`

### ❌ NEVER Write Custom CSS

```ruby
# ❌ WRONG
div(style: "height: 300px; transition: height 300ms")

# ✅ CORRECT
div(class: "h-[300px] transition-[height] duration-300")
```

## Animation Rules (CRITICAL)

### ✅ Use tw-animate-css Classes

- [ ] Used `animate-in` / `animate-out` for show/hide
- [ ] Used `fade-in-*` / `fade-out-*` for opacity
- [ ] Used `zoom-in-*` / `zoom-out-*` for scale
- [ ] Used `slide-in-*` / `slide-out-*` for position
- [ ] Used `data-[state=open]:animate-in` pattern
- [ ] Used `data-[state=closed]:animate-out` pattern

### ❌ NEVER Animate in JavaScript

```javascript
// ❌ WRONG: Manual animation in JS
element.style.opacity = "0"
setTimeout(() => element.style.opacity = "1", 100)

// ✅ CORRECT: Let CSS handle it
element.setAttribute("data-state", "open")
// CSS: data-[state=open]:animate-in data-[state=open]:fade-in-0
```

## Visibility Rules (CRITICAL)

### ✅ Use invisible for Animated Elements

- [ ] Used `invisible` class (visibility: hidden)
- [ ] Used `data-[state=closed]:invisible` pattern
- [ ] Used `data-[state=open]:visible` pattern

### ❌ NEVER Use hidden for Animated Elements

```ruby
# ❌ WRONG: display: none kills animations
"hidden data-[state=open]:block"

# ✅ CORRECT: visibility: hidden allows animations
"invisible data-[state=closed]:invisible data-[state=open]:visible"
```

## Pointer Events Pattern

- [ ] Used `data-[state=open]:pointer-events-auto`
- [ ] Used `data-[state=closed]:pointer-events-none`
- [ ] Combined with opacity for smooth interaction blocking

## State Management

### data-state Attribute

- [ ] Component uses `data-state="open"` / `data-state="closed"`
- [ ] JavaScript only changes state, not styles
- [ ] CSS handles all visual changes via `data-[state=*]:`

### JavaScript Controller

```javascript
// ✅ CORRECT Pattern
show() {
  this.containerTarget.setAttribute("data-state", "open")
  // CSS does the rest!
}

hide() {
  this.containerTarget.setAttribute("data-state", "closed")
  // No setTimeout, no manual animation!
}
```

## CSS Variables

### Definition

- [ ] Variables defined in `:root` (for browser)
- [ ] Variables defined in `@theme` (for Tailwind)
- [ ] Variables actually used in component classes

Example:
```css
:root {
  --duration-accordion: 300ms;
}

@theme {
  --duration-accordion: 300ms;
}
```

Usage:
```ruby
"transition-[height] duration-[var(--duration-accordion)]"
```

### Verification

- [ ] Rebuilt CSS with `bun run build:css`
- [ ] Verified variable in `:root` using grep
- [ ] Verified utility class generated using grep

## Component Structure

### Phlex Implementation

- [ ] Class inherits from `Phlex::HTML`
- [ ] Follows `UI::ComponentName::SubComponent` namespace
- [ ] Uses `def initialize(**attributes)` pattern
- [ ] Uses `def view_template(&block)` pattern
- [ ] Properly handles block content

### asChild Support

- [ ] Evaluated if component needs `as_child` parameter
- [ ] Included `UI::Shared::AsChildBehavior` if needed
- [ ] Yields attributes hash to block when `as_child: true`
- [ ] Renders default element when `as_child: false`

```ruby
def view_template(&block)
  attrs = { class: "...", data: { ... } }

  if @as_child
    yield(attrs) if block_given?
  else
    button(**attrs, &block)
  end
end
```

## Accessibility (ARIA)

- [ ] All ARIA attributes from Radix UI included
- [ ] `role` attributes correct
- [ ] `aria-label` / `aria-labelledby` present
- [ ] `aria-describedby` for descriptions
- [ ] `aria-hidden` for decorative elements
- [ ] `aria-expanded` for collapsible content
- [ ] `aria-controls` linking elements
- [ ] Keyboard navigation works (if applicable)

## Stimulus Controller

### Structure

- [ ] Named `ui--component-name_controller.js`
- [ ] Registered in `app/javascript/ui/index.js`
- [ ] Uses `targets` for elements
- [ ] Uses `values` for configuration
- [ ] Follows state management pattern

### Actions

- [ ] All `data-action` attributes correct
- [ ] Event names match Stimulus conventions
- [ ] Controller methods exist for all actions

## Documentation

### Component Files

- [ ] Component has inline comments explaining purpose
- [ ] Parameters documented with `@param` tags
- [ ] Complex logic has explanatory comments

### Showcase Page

- [ ] Created `test/dummy/app/views/components/{name}.html.erb`
- [ ] Shows default example
- [ ] Shows asChild composition (if supported)
- [ ] Shows variants/sizes
- [ ] Shows edge cases
- [ ] Added route to `config/routes.rb`
- [ ] Added to `/components` index page

### LLM Documentation

- [ ] Created `docs/llm/phlex/{name}.md`
- [ ] Created `docs/llm/erb/{name}.md`
- [ ] Created `docs/llm/vc/{name}.md` (if applicable)
- [ ] Includes all parameters with types
- [ ] Includes usage examples
- [ ] Includes common mistakes
- [ ] Includes integration patterns

## Testing

### Manual Browser Testing

- [ ] Component renders correctly
- [ ] Animations smooth (no flicker/glitches)
- [ ] Open/close multiple times works
- [ ] Keyboard navigation works
- [ ] Accessibility features work
- [ ] Works with asChild (if supported)

### System Tests

- [ ] Write a system test that operates on the showcase UI
- [ ] Create a Component Object Model, that is a component that helps the system test manipulate our component, because then users can take advantage of this model to simplify their tests (and not break when we update the UI library)

### Javascript Tests

- [ ] Write the javascript tests focused 100% on the behavior, using dom-testing-library
- [ ] Do NOT test the implementation


### Visual Comparison

- [ ] Opened shadcn/ui example in browser
- [ ] Opened our component in browser
- [ ] Compared side-by-side
- [ ] CSS classes match
- [ ] Animations match
- [ ] Behavior matches

### Playwright Testing (Optional)

- [ ] Created Playwright test
- [ ] Visual regression test passes
- [ ] Interaction test passes

## Code Quality

### Ruby Style

- [ ] Follows Ruby style guide
- [ ] No unnecessary complexity
- [ ] Clear variable names
- [ ] No magic numbers (use CSS variables)

### JavaScript Style

- [ ] Follows Stimulus conventions
- [ ] No jQuery or vanilla DOM manipulation
- [ ] Uses Stimulus targets/values
- [ ] Clear method names

### ⚠️ CRITICAL: Controller Registration

**MUST DO for every component with JavaScript:**

- [ ] Controller imported in `app/javascript/ui/index.js`
- [ ] Controller added to `registerControllers` function
- [ ] Controller exported at the bottom
- [ ] JavaScript rebuilt with `bun run build:js`

**Example:**
```javascript
// 1. Import
import AvatarController from "./controllers/avatar_controller.js";

// 2. Register (alphabetical order)
export function registerControllers(application) {
  return registerControllersInto(application, {
    "ui--avatar": AvatarController,
    // ...
  });
}

// 3. Export
export { AvatarController };
```

**⚠️ If you forget this, the controller will NOT load and component will NOT work!**

## asChild Implementation (CRITICAL)

**ALWAYS check shadcn/ui API Reference for `asChild` prop!**

### When to Implement

- [ ] **Checked API Reference section on shadcn/ui component page**
- [ ] If `asChild` prop is listed → MUST implement it
- [ ] If `asChild` prop is NOT listed → Skip this section

### Implementation Checklist

If `asChild` is required:

- [ ] Include `UI::Shared::AsChildBehavior` in Phlex component
- [ ] Include `UI::Shared::AsChildBehavior` in ViewComponent
- [ ] Add `as_child: false` parameter to `initialize` method
- [ ] Implement conditional rendering in `view_template` / `call`:
  ```ruby
  if @as_child
    yield(component_attrs) if block_given?
  else
    div(**component_attrs, &block)  # or appropriate element
  end
  ```
- [ ] Add `as_child` to `attr_reader` (ViewComponent only)
- [ ] Add showcase examples demonstrating `asChild` usage
- [ ] Test with custom element (e.g., `<a>` tag)
- [ ] Verify attributes merge correctly

### Example Implementation

**Phlex:**
```ruby
class Item < Phlex::HTML
  include UI::Item::ItemBehavior
  include UI::Shared::AsChildBehavior

  def initialize(variant: "default", as_child: false, **attributes)
    @variant = variant
    @as_child = as_child
    @attributes = attributes
  end

  def view_template(&block)
    item_attrs = item_html_attributes.merge(@attributes)

    if @as_child
      yield(item_attrs) if block_given?
    else
      div(**item_attrs, &block)
    end
  end
end
```

**Usage in Showcase:**
```erb
<%= render UI::Item::Item.new(as_child: true) do |item_attrs| %>
  <%= content_tag(:a, href: "#", **item_attrs) do %>
    <%= render UI::Item::Content.new do %>
      <%= render UI::Item::Title.new { "Click me" } %>
    <% end %>
  <% end %>
<% end %>
```

### Reference Documentation

- Pattern documentation: `docs/patterns/as_child.md`
- Behavior module: `app/models/ui/shared/as_child_behavior.rb`
- Live example: Dialog Trigger component

## Final Verification

- [ ] Component works in isolation
- [ ] Component works with other components
- [ ] No console errors
- [ ] No visual glitches
- [ ] Performance is acceptable
- [ ] Matches shadcn/ui reference exactly
- [ ] If `asChild` in API Reference → Implementation complete and tested

## Common Mistakes to Avoid

### ❌ Using .hidden instead of .invisible
```ruby
# WRONG
"hidden data-[state=open]:block"

# CORRECT
"invisible data-[state=open]:visible"
```

### ❌ Animating in JavaScript
```javascript
// WRONG
setTimeout(() => element.classList.add("opacity-0"), 200)

// CORRECT
element.setAttribute("data-state", "closed")
```

### ❌ Using inline styles
```ruby
# WRONG
div(style: "padding: 20px")

# CORRECT
div(class: "p-5")
```

### ❌ Not using asChild for composition
```ruby
# WRONG (nested buttons)
render UI::Dialog::Trigger.new do
  render UI::Button::Button.new { "Open" }
end

# CORRECT
render UI::Dialog::Trigger.new(as_child: true) do |attrs|
  render UI::Button::Button.new(**attrs) { "Open" }
end
```

### ❌ Missing CSS variables in both places
```css
/* WRONG: only in :root */
:root { --my-var: 10px; }

/* CORRECT: in both :root and @theme */
:root { --my-var: 10px; }
@theme { --my-var: 10px; }
```

## Completion

When all items are checked:

1. ✅ Component migration complete
2. ✅ Documentation generated
3. ✅ Tests passing
4. ✅ Visual verification done
5. ✅ Ready for commit

## See Also

- `docs/patterns/as_child.md` - asChild composition pattern
- `CLAUDE.md` - Component migration checklist
- `docs/llm/` - LLM documentation templates
