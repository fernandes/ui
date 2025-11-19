# Accordion Component - ERB

Collapsible content sections with smooth animations.

## Basic Usage

```erb
<%= render "ui/accordion/accordion" do %>
  <%= render "ui/accordion/accordion_item", value: "item-1" do %>
    <%= render "ui/accordion/accordion_trigger", content: "Section 1" %>
    <%= render "ui/accordion/accordion_content", content: "Content for section 1" %>
  <% end %>
<% end %>
```

## Component Structure

The accordion consists of 4 nested partials:

1. **accordion** - Root container
2. **accordion_item** - Individual collapsible section
3. **accordion_trigger** - Clickable header (button)
4. **accordion_content** - Collapsible content area

## Components

### Accordion (Root)

**Path**: `ui/accordion/accordion`

**Parameters**:
- `type:` - `"single"` (default) or `"multiple"` - Controls if multiple items can be open
- `collapsible:` - Boolean - If single item can be collapsed
- `orientation:` - `"vertical"` (default) or `"horizontal"`
- `classes:` - Additional CSS classes
- `attributes:` - Additional HTML attributes (Hash)

### Item

**Path**: `ui/accordion/accordion_item`

**Parameters**:
- `value:` - **Required** - Unique identifier for this item
- `initial_open:` - Boolean - Whether item starts open
- `orientation:` - `"vertical"` (default) or `"horizontal"`
- `classes:` - Additional CSS classes
- `attributes:` - Additional HTML attributes (Hash)

### Trigger

**Path**: `ui/accordion/accordion_trigger`

**Parameters**:
- `content:` - Text content (or use block)
- `classes:` - Additional CSS classes
- `attributes:` - Additional HTML attributes (Hash)

**Note**: `item_value` and `initial_open` are automatically passed from parent Item context.

### Content

**Path**: `ui/accordion/accordion_content`

**Parameters**:
- `content:` - Text content (or use block)
- `classes:` - Additional CSS classes
- `attributes:` - Additional HTML attributes (Hash)

**Note**: `item_value` and `initial_open` are automatically passed from parent Item context.

## Examples

### Basic Accordion (Single Item Open)

```erb
<%= render "ui/accordion/accordion" do %>
  <%= render "ui/accordion/accordion_item", value: "item-1" do %>
    <%= render "ui/accordion/accordion_trigger", content: "Is it accessible?" %>
    <%= render "ui/accordion/accordion_content" do %>
      Yes. It adheres to the WAI-ARIA design pattern.
    <% end %>
  <% end %>

  <%= render "ui/accordion/accordion_item", value: "item-2" do %>
    <%= render "ui/accordion/accordion_trigger", content: "Is it styled?" %>
    <%= render "ui/accordion/accordion_content" do %>
      Yes. It comes with default styles that matches the design system.
    <% end %>
  <% end %>
<% end %>
```

### Multiple Items Open (type: "multiple")

```erb
<%= render "ui/accordion/accordion", type: "multiple" do %>
  <%= render "ui/accordion/accordion_item", value: "item-1" do %>
    <%= render "ui/accordion/accordion_trigger", content: "Section 1" %>
    <%= render "ui/accordion/accordion_content", content: "Content 1" %>
  <% end %>

  <%= render "ui/accordion/accordion_item", value: "item-2" do %>
    <%= render "ui/accordion/accordion_trigger", content: "Section 2" %>
    <%= render "ui/accordion/accordion_content", content: "Content 2" %>
  <% end %>
<% end %>
```

### Initially Open Item

```erb
<%= render "ui/accordion/accordion" do %>
  <%= render "ui/accordion/accordion_item", value: "item-1", initial_open: true do %>
    <%= render "ui/accordion/accordion_trigger", content: "Already Open" %>
    <%= render "ui/accordion/accordion_content" do %>
      This item starts in the open state.
    <% end %>
  <% end %>
<% end %>
```

### Always Collapsible (Single Type)

```erb
<%= render "ui/accordion/accordion", type: "single", collapsible: true do %>
  <%# Items can all be closed with collapsible: true %>
<% end %>
```

### Content: Two Ways

```erb
<%# Approach 1: content parameter %>
<%= render "ui/accordion/accordion_content", content: "Simple text content" %>

<%# Approach 2: block (for HTML content) %>
<%= render "ui/accordion/accordion_content" do %>
  <p>Paragraph with <strong>formatting</strong></p>
  <ul>
    <li>List item 1</li>
    <li>List item 2</li>
  </ul>
<% end %>
```

## Important Notes

### ✅ ERB Auto-Passes Context

Unlike Phlex, ERB partials automatically pass `item_value` and `initial_open` from Item to its children (Trigger and Content). You don't need to pass these manually:

```erb
<%# ✅ Correct - context is automatic %>
<%= render "ui/accordion/accordion_item", value: "item-1", initial_open: true do %>
  <%= render "ui/accordion/accordion_trigger", content: "Title" %>
  <%= render "ui/accordion/accordion_content", content: "Content" %>
<% end %>
```

### Item Values Must Be Unique

Each `accordion_item` must have a unique `value`:

```erb
<%# ✅ Correct - unique values %>
<%= render "ui/accordion/accordion_item", value: "item-1" do %> ... <% end %>
<%= render "ui/accordion/accordion_item", value: "item-2" do %> ... <% end %>

<%# ❌ Wrong - duplicate values %>
<%= render "ui/accordion/accordion_item", value: "item-1" do %> ... <% end %>
<%= render "ui/accordion/accordion_item", value: "item-1" do %> ... <% end %>  <%# Duplicate! %>
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

### ❌ Wrong: Using Phlex syntax

```erb
<%= render UI::Accordion::Accordion.new do %> ... <% end %>
# Wrong - this is Phlex syntax
```

### ✅ Correct: Use string paths

```erb
<%= render "ui/accordion/accordion" do %> ... <% end %>
```
