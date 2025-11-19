# Accordion Component - ViewComponent

Collapsible content sections with smooth animations.

## Basic Usage

```ruby
<%= render UI::Accordion::AccordionComponent.new do %>
  <%= render UI::Accordion::AccordionItemComponent.new(value: "item-1") do %>
    <%= render UI::Accordion::AccordionTriggerComponent.new { "Section 1" } %>
    <%= render UI::Accordion::AccordionContentComponent.new { "Content for section 1" } %>
  <% end %>
<% end %>
```

## Component Structure

The accordion consists of 4 nested components:

1. **AccordionComponent** - Root container
2. **AccordionItemComponent** - Individual collapsible section
3. **AccordionTriggerComponent** - Clickable header (button)
4. **AccordionContentComponent** - Collapsible content area

## Components

### Accordion (Root)

**Class**: `UI::Accordion::AccordionComponent`

**Parameters**:
- `type:` - `"single"` (default) or `"multiple"` - Controls if multiple items can be open
- `collapsible:` - Boolean - If single item can be collapsed
- `orientation:` - `"vertical"` (default) or `"horizontal"`
- `classes:` - Additional CSS classes
- `**attributes` - Additional HTML attributes

### Item

**Class**: `UI::Accordion::AccordionItemComponent`

**Parameters**:
- `value:` - **Required** - Unique identifier for this item
- `initial_open:` - Boolean - Whether item starts open
- `orientation:` - `"vertical"` (default) or `"horizontal"`
- `classes:` - Additional CSS classes
- `**attributes` - Additional HTML attributes

### Trigger

**Class**: `UI::Accordion::AccordionTriggerComponent`

**Parameters**:
- `item_value:` - Item value (auto-passed from parent in ERB, must pass explicitly in ViewComponent)
- `initial_open:` - Initial state (auto-passed from parent in ERB, must pass explicitly in ViewComponent)
- `classes:` - Additional CSS classes
- `**attributes` - Additional HTML attributes

### Content

**Class**: `UI::Accordion::AccordionContentComponent`

**Parameters**:
- `item_value:` - Item value (auto-passed from parent in ERB, must pass explicitly in ViewComponent)
- `initial_open:` - Initial state (auto-passed from parent in ERB, must pass explicitly in ViewComponent)
- `classes:` - Additional CSS classes
- `**attributes` - Additional HTML attributes

## Examples

### Basic Accordion (Single Item Open)

```ruby
<%= render UI::Accordion::AccordionComponent.new do %>
  <%= render UI::Accordion::AccordionItemComponent.new(value: "item-1") do %>
    <%= render UI::Accordion::AccordionTriggerComponent.new(item_value: "item-1") { "Is it accessible?" } %>
    <%= render UI::Accordion::AccordionContentComponent.new(item_value: "item-1") do %>
      Yes. It adheres to the WAI-ARIA design pattern.
    <% end %>
  <% end %>

  <%= render UI::Accordion::AccordionItemComponent.new(value: "item-2") do %>
    <%= render UI::Accordion::AccordionTriggerComponent.new(item_value: "item-2") { "Is it styled?" } %>
    <%= render UI::Accordion::AccordionContentComponent.new(item_value: "item-2") do %>
      Yes. It comes with default styles that matches the design system.
    <% end %>
  <% end %>
<% end %>
```

### Multiple Items Open (type: "multiple")

```ruby
<%= render UI::Accordion::AccordionComponent.new(type: "multiple") do %>
  <%= render UI::Accordion::AccordionItemComponent.new(value: "item-1") do %>
    <%= render UI::Accordion::AccordionTriggerComponent.new(item_value: "item-1") { "Section 1" } %>
    <%= render UI::Accordion::AccordionContentComponent.new(item_value: "item-1") { "Content 1" } %>
  <% end %>

  <%= render UI::Accordion::AccordionItemComponent.new(value: "item-2") do %>
    <%= render UI::Accordion::AccordionTriggerComponent.new(item_value: "item-2") { "Section 2" } %>
    <%= render UI::Accordion::AccordionContentComponent.new(item_value: "item-2") { "Content 2" } %>
  <% end %>
<% end %>
```

### Initially Open Item

```ruby
<%= render UI::Accordion::AccordionComponent.new do %>
  <%= render UI::Accordion::AccordionItemComponent.new(value: "item-1", initial_open: true) do %>
    <%= render UI::Accordion::AccordionTriggerComponent.new(item_value: "item-1", initial_open: true) { "Already Open" } %>
    <%= render UI::Accordion::AccordionContentComponent.new(item_value: "item-1", initial_open: true) do %>
      This item starts in the open state.
    <% end %>
  <% end %>
<% end %>
```

### Always Collapsible (Single Type)

```ruby
<%= render UI::Accordion::AccordionComponent.new(type: "single", collapsible: true) do %>
  <%# Items can all be closed with collapsible: true %>
<% end %>
```

## Important Notes

### ⚠️ ViewComponent Requires Explicit Parameter Passing

Like Phlex, ViewComponent doesn't automatically pass context to children. You **must** explicitly pass `item_value` and `initial_open` to Trigger and Content:

```ruby
<%# ✅ Correct - explicit parameters %>
<%= render UI::Accordion::AccordionItemComponent.new(value: "item-1", initial_open: true) do %>
  <%= render UI::Accordion::AccordionTriggerComponent.new(item_value: "item-1", initial_open: true) { "Title" } %>
  <%= render UI::Accordion::AccordionContentComponent.new(item_value: "item-1", initial_open: true) { "Content" } %>
<% end %>

<%# ❌ Wrong - missing parameters %>
<%= render UI::Accordion::AccordionItemComponent.new(value: "item-1", initial_open: true) do %>
  <%= render UI::Accordion::AccordionTriggerComponent.new { "Title" } %>  <%# Missing item_value! %>
  <%= render UI::Accordion::AccordionContentComponent.new { "Content" } %>  <%# Missing item_value! %>
<% end %>
```

### Item Values Must Be Unique

Each `AccordionItemComponent` must have a unique `value`:

```ruby
<%# ✅ Correct - unique values %>
<%= render UI::Accordion::AccordionItemComponent.new(value: "item-1") do %> ... <% end %>
<%= render UI::Accordion::AccordionItemComponent.new(value: "item-2") do %> ... <% end %>

<%# ❌ Wrong - duplicate values %>
<%= render UI::Accordion::AccordionItemComponent.new(value: "item-1") do %> ... <% end %>
<%= render UI::Accordion::AccordionItemComponent.new(value: "item-1") do %> ... <% end %>  <%# Duplicate! %>
```

## Type Behavior

- `type: "single"` (default) - Only one item can be open at a time
- `type: "single", collapsible: true` - Single item can be closed
- `type: "multiple"` - Multiple items can be open simultaneously

## Animation

Accordion uses Tailwind CSS transitions for smooth animations:
- Duration: 300ms
- Easing: `cubic-bezier(0.87, 0, 0.13, 1)`
- CSS variables: `--duration-accordion` and `--ease-accordion`

## Error Prevention

### ❌ Wrong: Missing Component suffix

```ruby
<%= render UI::Accordion::Accordion.new do %> ... <% end %>
# ERROR: This is the Phlex component
```

### ✅ Correct: Use AccordionComponent

```ruby
<%= render UI::Accordion::AccordionComponent.new do %> ... <% end %>
```

### ❌ Wrong: Missing item_value

```ruby
<%= render UI::Accordion::AccordionTriggerComponent.new { "Title" } %>
# Will generate random ID, won't match Item
```

### ✅ Correct: Pass item_value explicitly

```ruby
<%= render UI::Accordion::AccordionTriggerComponent.new(item_value: "item-1") { "Title" } %>
```
