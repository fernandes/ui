# Accordion Component - Phlex

Collapsible content sections with smooth animations.

## Basic Usage

```ruby
<%= render UI::Accordion::Accordion.new do %>
  <%= render UI::Accordion::Item.new(value: "item-1") do %>
    <%= render UI::Accordion::Trigger.new { "Section 1" } %>
    <%= render UI::Accordion::Content.new { "Content for section 1" } %>
  <% end %>
<% end %>
```

## Component Structure

The accordion consists of 4 nested components:

1. **Accordion** - Root container
2. **Item** - Individual collapsible section
3. **Trigger** - Clickable header (button)
4. **Content** - Collapsible content area

## Components

### Accordion (Root)

**Class**: `UI::Accordion::Accordion`

**Parameters**:
- `type:` - `"single"` (default) or `"multiple"` - Controls if multiple items can be open
- `collapsible:` - Boolean - If single item can be collapsed
- `orientation:` - `"vertical"` (default) or `"horizontal"`
- `classes:` - Additional CSS classes
- `**attributes` - Additional HTML attributes

### Item

**Class**: `UI::Accordion::Item`

**Parameters**:
- `value:` - **Required** - Unique identifier for this item
- `initial_open:` - Boolean - Whether item starts open
- `orientation:` - `"vertical"` (default) or `"horizontal"`
- `classes:` - Additional CSS classes
- `**attributes` - Additional HTML attributes

### Trigger

**Class**: `UI::Accordion::Trigger`

**Parameters**:
- `item_value:` - Item value (auto-passed from parent in ERB, must pass explicitly in Phlex)
- `initial_open:` - Initial state (auto-passed from parent in ERB, must pass explicitly in Phlex)
- `classes:` - Additional CSS classes
- `**attributes` - Additional HTML attributes

### Content

**Class**: `UI::Accordion::Content`

**Parameters**:
- `item_value:` - Item value (auto-passed from parent in ERB, must pass explicitly in Phlex)
- `initial_open:` - Initial state (auto-passed from parent in ERB, must pass explicitly in Phlex)
- `classes:` - Additional CSS classes
- `**attributes` - Additional HTML attributes

## Examples

### Basic Accordion (Single Item Open)

```ruby
<%= render UI::Accordion::Accordion.new do %>
  <%= render UI::Accordion::Item.new(value: "item-1") do %>
    <%= render UI::Accordion::Trigger.new(item_value: "item-1") { "Is it accessible?" } %>
    <%= render UI::Accordion::Content.new(item_value: "item-1") do %>
      Yes. It adheres to the WAI-ARIA design pattern.
    <% end %>
  <% end %>

  <%= render UI::Accordion::Item.new(value: "item-2") do %>
    <%= render UI::Accordion::Trigger.new(item_value: "item-2") { "Is it styled?" } %>
    <%= render UI::Accordion::Content.new(item_value: "item-2") do %>
      Yes. It comes with default styles that matches the design system.
    <% end %>
  <% end %>
<% end %>
```

### Multiple Items Open (type: "multiple")

```ruby
<%= render UI::Accordion::Accordion.new(type: "multiple") do %>
  <%= render UI::Accordion::Item.new(value: "item-1") do %>
    <%= render UI::Accordion::Trigger.new(item_value: "item-1") { "Section 1" } %>
    <%= render UI::Accordion::Content.new(item_value: "item-1") { "Content 1" } %>
  <% end %>

  <%= render UI::Accordion::Item.new(value: "item-2") do %>
    <%= render UI::Accordion::Trigger.new(item_value: "item-2") { "Section 2" } %>
    <%= render UI::Accordion::Content.new(item_value: "item-2") { "Content 2" } %>
  <% end %>
<% end %>
```

### Initially Open Item

```ruby
<%= render UI::Accordion::Accordion.new do %>
  <%= render UI::Accordion::Item.new(value: "item-1", initial_open: true) do %>
    <%= render UI::Accordion::Trigger.new(item_value: "item-1", initial_open: true) { "Already Open" } %>
    <%= render UI::Accordion::Content.new(item_value: "item-1", initial_open: true) do %>
      This item starts in the open state.
    <% end %>
  <% end %>
<% end %>
```

### Always Collapsible (Single Type)

```ruby
<%= render UI::Accordion::Accordion.new(type: "single", collapsible: true) do %>
  <%# Items can all be closed with collapsible: true %>
<% end %>
```

## Important Notes

### ⚠️ Phlex Requires Explicit Parameter Passing

Unlike ERB partials, Phlex components don't automatically pass context to children. You **must** explicitly pass `item_value` and `initial_open` to Trigger and Content:

```ruby
<%# ✅ Correct - explicit parameters %>
<%= render UI::Accordion::Item.new(value: "item-1", initial_open: true) do %>
  <%= render UI::Accordion::Trigger.new(item_value: "item-1", initial_open: true) { "Title" } %>
  <%= render UI::Accordion::Content.new(item_value: "item-1", initial_open: true) { "Content" } %>
<% end %>

<%# ❌ Wrong - missing parameters %>
<%= render UI::Accordion::Item.new(value: "item-1", initial_open: true) do %>
  <%= render UI::Accordion::Trigger.new { "Title" } %>  <%# Missing item_value! %>
  <%= render UI::Accordion::Content.new { "Content" } %>  <%# Missing item_value! %>
<% end %>
```

### Item Values Must Be Unique

Each `Item` must have a unique `value`:

```ruby
<%# ✅ Correct - unique values %>
<%= render UI::Accordion::Item.new(value: "item-1") do %> ... <% end %>
<%= render UI::Accordion::Item.new(value: "item-2") do %> ... <% end %>

<%# ❌ Wrong - duplicate values %>
<%= render UI::Accordion::Item.new(value: "item-1") do %> ... <% end %>
<%= render UI::Accordion::Item.new(value: "item-1") do %> ... <% end %>  <%# Duplicate! %>
```

## Type Behavior

- `type: "single"` (default) - Only one item can be open at a time
- `type: "single", collapsible: true` - Single item open, but can close all
- `type: "multiple"` - Multiple items can be open simultaneously

## Animation

Accordion uses Tailwind CSS transitions for smooth animations:
- Duration: 300ms
- Easing: `cubic-bezier(0.87, 0, 0.13, 1)`
- CSS variables: `--duration-accordion` and `--ease-accordion`

## Error Prevention

### ❌ Wrong: Missing item_value

```ruby
<%= render UI::Accordion::Trigger.new { "Title" } %>
# Will generate random ID, won't match Item
```

### ✅ Correct: Pass item_value explicitly

```ruby
<%= render UI::Accordion::Trigger.new(item_value: "item-1") { "Title" } %>
```
