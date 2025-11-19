# The `asChild` Composition Pattern

## Overview

The `asChild` pattern enables **composition without wrapper elements**, inspired by [Radix UI's Slot component](https://www.radix-ui.com/primitives/docs/guides/composition). When `as_child: true`, components don't render their own element wrapper. Instead, they yield attributes to a block, allowing the child element to receive them.

This solves the "wrapper div hell" problem and preserves layout structures (flex, grid, etc.).

## Problem Statement

**Without asChild:**
```ruby
render UI::Dialog::Trigger.new do
  "Open"
end

# Renders: <button data-action="click->ui--dialog#open">Open</button>
# ✅ Works, but inflexible
```

**What if you want a custom styled button?**
```ruby
# ❌ Creates wrapper div that breaks layouts
render UI::Dialog::Trigger.new do
  render UI::Button::Button.new(variant: :destructive) do
    "Delete"
  end
end

# Renders:
# <button data-action="click->ui--dialog#open">
#   <button class="destructive-styles">Delete</button>
# </button>
# ❌ Nested buttons! Invalid HTML! Broken layout!
```

**With asChild:**
```ruby
# ✅ Merges attributes into child
render UI::Dialog::Trigger.new(as_child: true) do |trigger_attrs|
  render UI::Button::Button.new(**trigger_attrs, variant: :destructive) do
    "Delete"
  end
end

# Renders:
# <button
#   class="destructive-styles"
#   data-action="click->ui--dialog#open"
# >Delete</button>
# ✅ Single button! Valid HTML! Layout preserved!
```

## How It Works

### 1. Component Implementation

Components that support `asChild` follow this pattern:

```ruby
class Trigger < Phlex::HTML
  include UI::Shared::AsChildBehavior

  def initialize(as_child: false, **attributes)
    @as_child = as_child
    @attributes = attributes
  end

  def view_template(&block)
    trigger_attrs = {
      data: { action: "click->ui--dialog#open" },
      **@attributes
    }

    if @as_child
      # Yield attributes to block - child must accept them
      yield(trigger_attrs) if block_given?
    else
      # Default: render as button
      button(**trigger_attrs, &block)
    end
  end
end
```

### 2. Attribute Merging

The `AsChildBehavior` module provides intelligent attribute merging:

```ruby
module UI::Shared::AsChildBehavior
  def merge_attributes(parent_attrs, child_attrs)
    # 1. deep_merge for nested hashes (data attributes)
    merged = parent_attrs.deep_merge(child_attrs)

    # 2. TailwindMerge for CSS classes (resolves conflicts)
    if parent_attrs[:class] && child_attrs[:class]
      merged[:class] = TailwindMerge::Merger.new.merge(
        [parent_attrs[:class], child_attrs[:class]].join(" ")
      )
    end

    # 3. Concatenate Stimulus actions (both should execute)
    if parent_attrs.dig(:data, :action) && child_attrs.dig(:data, :action)
      merged[:data][:action] = [
        parent_attrs.dig(:data, :action),
        child_attrs.dig(:data, :action)
      ].join(" ")
    end

    # 4. Concatenate styles
    if parent_attrs[:style] && child_attrs[:style]
      merged[:style] = "#{parent_attrs[:style]}; #{child_attrs[:style]}"
    end

    merged
  end
end
```

## Usage Examples

### Example 1: Dialog Trigger with Custom Button

```ruby
render UI::Dialog::Dialog.new do
  # With asChild - compose with Button component
  render UI::Dialog::Trigger.new(as_child: true) do |trigger_attrs|
    render UI::Button::Button.new(**trigger_attrs, variant: :outline) do
      "Open Dialog"
    end
  end

  render UI::Dialog::Overlay.new do
    # ... dialog content
  end
end
```

**Result:** Single `<button>` with Button's styling + Dialog's click handler.

### Example 2: Manual Attribute Merge

```ruby
render UI::Dialog::Trigger.new(as_child: true) do |trigger_attrs|
  # Manually merge with custom attributes
  button_attrs = {
    class: "my-custom-class",
    data: { testid: "dialog-trigger" }
  }

  button(**merge_attributes(trigger_attrs, button_attrs)) do
    "Open"
  end
end
```

**Result:**
```html
<button
  class="my-custom-class"
  data-action="click->ui--dialog#open"
  data-testid="dialog-trigger"
>Open</button>
```

### Example 3: Multiple Stimulus Actions

```ruby
render UI::Dialog::Trigger.new(as_child: true) do |trigger_attrs|
  button_attrs = {
    data: { action: "click->analytics#track" }
  }

  button(**merge_attributes(trigger_attrs, button_attrs)) do
    "Track & Open"
  end
end
```

**Result:** `data-action="click->ui--dialog#open click->analytics#track"`

Both handlers execute!

### Example 4: Preserving Layout

```ruby
# Flexbox layout with dialog trigger
div(class: "flex gap-4") do
  button(class: "flex-1") { "Item 1" }

  # Without asChild - breaks flex with wrapper div
  render UI::Dialog::Trigger.new { "Item 2" }  # ❌

  # With asChild - preserves flex layout
  render UI::Dialog::Trigger.new(as_child: true) do |attrs|
    button(**attrs, class: "flex-1") { "Item 3" }  # ✅
  end
end
```

## Merge Rules

### 1. CSS Classes (TailwindMerge)

**Why TailwindMerge?** Resolves conflicting utility classes intelligently.

```ruby
parent = { class: "p-4 text-sm" }
child = { class: "p-2 text-lg" }

# Without TailwindMerge:
# "p-4 text-sm p-2 text-lg" ❌ (both p-4 and p-2 apply)

# With TailwindMerge:
TailwindMerge::Merger.new.merge("p-4 text-sm p-2 text-lg")
# => "p-2 text-lg" ✅ (last value wins, no duplication)
```

**Precedence:** Later classes override earlier conflicting classes.

### 2. Data Attributes (deep_merge)

**Why deep_merge?** Preserves nested hash structure.

```ruby
parent = { data: { controller: "dialog", action: "click->dialog#open" } }
child = { data: { testid: "trigger" } }

# Without deep_merge:
parent.merge(child)
# => { data: { testid: "trigger" } } ❌ Lost controller and action!

# With deep_merge:
parent.deep_merge(child)
# => { data: { controller: "dialog", action: "...", testid: "trigger" } } ✅
```

**Precedence:** Child values override parent for same keys.

### 3. Stimulus Actions (Concatenation)

```ruby
parent = { data: { action: "click->dialog#open" } }
child = { data: { action: "click->analytics#track" } }

# Special handling: concatenate with space
merged[:data][:action] = [
  parent.dig(:data, :action),
  child.dig(:data, :action)
].join(" ")
# => "click->dialog#open click->analytics#track"
```

**Both handlers execute** in Stimulus.

### 4. Styles (Concatenation)

```ruby
parent = { style: "padding: 8px" }
child = { style: "background: blue" }

merged[:style] = "#{parent[:style]}; #{child[:style]}"
# => "padding: 8px; background: blue"
```

### 5. Other Attributes (Child Wins)

For all other attributes, child values completely override parent values:

```ruby
parent = { id: "parent-id", title: "Parent Title" }
child = { id: "child-id" }

parent.deep_merge(child)
# => { id: "child-id", title: "Parent Title" }
```

## When to Use asChild

### ✅ Use asChild When:

1. **Composing with existing components**
   ```ruby
   render UI::Dialog::Trigger.new(as_child: true) do |attrs|
     render UI::Button::Button.new(**attrs) { "Open" }
   end
   ```

2. **Preserving layout structures**
   ```ruby
   div(class: "flex gap-2") do
     render UI::Dropdown::Trigger.new(as_child: true) do |attrs|
       button(**attrs, class: "flex-1") { "Item" }
     end
   end
   ```

3. **Custom styling/behavior needed**
   ```ruby
   render UI::Dialog::Trigger.new(as_child: true) do |attrs|
     link_to "Open", "#", **attrs, class: "custom-link"
   end
   ```

4. **Multiple Stimulus actions required**
   ```ruby
   render UI::Tooltip::Trigger.new(as_child: true) do |attrs|
     button(**merge_attributes(attrs, {
       data: { action: "click->analytics#track" }
     })) { "Track me" }
   end
   ```

### ❌ Don't Use asChild When:

1. **Default styling is sufficient**
   ```ruby
   # Simple case - no need for asChild
   render UI::Dialog::Trigger.new { "Open" }
   ```

2. **No composition needed**
   ```ruby
   # Just want a trigger button - use default
   render UI::Dropdown::Trigger.new { "Menu" }
   ```

## Implementation Checklist

When adding `asChild` support to a new component:

1. ✅ Include `UI::Shared::AsChildBehavior`
2. ✅ Accept `as_child: false` parameter
3. ✅ Prepare attributes hash with component's default behavior
4. ✅ Branch on `@as_child`:
   - If true: `yield(attrs)` to block
   - If false: render default element
5. ✅ Document usage in component comments
6. ✅ Add showcase examples demonstrating both modes
7. ✅ Test with and without asChild

## Framework-Specific Notes

### Phlex (Primary Support)

```ruby
render UI::Dialog::Trigger.new(as_child: true) do |attrs|
  render UI::Button::Button.new(**attrs) { "Open" }
end
```

**Splat operator (`**attrs`)** merges attributes into keyword arguments.

### ERB (Partial Support)

```erb
<%= render "ui/dialog/trigger", as_child: true do |attrs| %>
  <button <%= ui_attributes(merge_ui_attributes(attrs, class: "custom")) %>>
    Open
  </button>
<% end %>
```

**Helper methods** (`ui_attributes`, `merge_ui_attributes`) required for attribute conversion.

### ViewComponent (Future)

```ruby
render UI::Dialog::TriggerComponent.new(as_child: true) do |attrs|
  tag.button(**attrs) { "Open" }
end
```

**`tag` helper** converts hash to HTML attributes.

## Common Pitfalls

### 1. Forgetting to Accept Block Parameter

```ruby
# ❌ Wrong - attrs not captured
render UI::Dialog::Trigger.new(as_child: true) do
  button { "Open" }  # No data-action!
end

# ✅ Correct - attrs captured and used
render UI::Dialog::Trigger.new(as_child: true) do |attrs|
  button(**attrs) { "Open" }
end
```

### 2. Not Using Splat Operator

```ruby
# ❌ Wrong - attrs passed as single hash argument
render UI::Button::Button.new(attrs) { "Open" }

# ✅ Correct - attrs expanded to keyword arguments
render UI::Button::Button.new(**attrs) { "Open" }
```

### 3. Overriding Critical Attributes

```ruby
# ⚠️ Be careful - child can override parent completely
render UI::Dialog::Trigger.new(as_child: true) do |attrs|
  # This removes the dialog action!
  button(data: { action: "click->other#handler" }) { "Open" }
end

# ✅ Better - merge to preserve both actions
render UI::Dialog::Trigger.new(as_child: true) do |attrs|
  button(**merge_attributes(attrs, {
    data: { action: "click->other#handler" }
  })) { "Open" }
end
```

### 4. Invalid HTML Nesting

```ruby
# ❌ Wrong - button inside button (without asChild)
render UI::Dialog::Trigger.new do
  render UI::Button::Button.new { "Open" }
end
# Result: <button><button>Open</button></button> ❌

# ✅ Correct - use asChild to merge
render UI::Dialog::Trigger.new(as_child: true) do |attrs|
  render UI::Button::Button.new(**attrs) { "Open" }
end
# Result: <button>Open</button> ✅
```

## Differences from Radix UI

| Feature | Radix (React) | Our Implementation (Ruby) |
|---------|---------------|---------------------------|
| Mechanism | `React.cloneElement` | `yield` with hash |
| Event Composition | Automatic | Manual (Stimulus actions concat) |
| Type Safety | TypeScript | Documentation |
| Ref Composition | Yes | N/A (server-side) |
| Child Enforcement | Single child only | Developer responsibility |
| Performance | Runtime cloning | Zero runtime overhead |

## See Also

- [Radix UI Composition Guide](https://www.radix-ui.com/primitives/docs/guides/composition)
- `app/models/ui/shared/as_child_behavior.rb` - Core implementation
- `app/components/ui/dialog/trigger.rb` - Example usage
- `/components/dialog` - Live showcase
