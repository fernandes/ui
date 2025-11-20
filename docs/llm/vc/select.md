# Select Component - ViewComponent

Custom select component with keyboard navigation, scrollable viewport, and form integration.

## Basic Usage

```ruby
<%= render UI::Select::SelectComponent.new(value: "apple") do %>
  <%= render UI::Select::TriggerComponent.new(placeholder: "Select a fruit...") %>
  <%= render UI::Select::ContentComponent.new do %>
    <%= render UI::Select::ItemComponent.new(value: "apple") { "Apple" } %>
    <%= render UI::Select::ItemComponent.new(value: "banana") { "Banana" } %>
  <% end %>
<% end %>
```

## Components

### Select (Root) - UI::Select::SelectComponent

**Parameters**:
- `value:` - Currently selected value
- `classes:` - Additional CSS classes
- `**attributes` - Additional HTML attributes

### Trigger - UI::Select::TriggerComponent

**Parameters**:
- `placeholder:` - Placeholder text (default: "Select...")
- `classes:` - Additional CSS classes
- `**attributes` - Additional HTML attributes

### Content - UI::Select::ContentComponent

**Parameters**:
- `classes:` - Additional CSS classes
- `**attributes` - Additional HTML attributes

### Item - UI::Select::ItemComponent

**Parameters**:
- `value:` - **Required** - Value of this option
- `disabled:` - Boolean - Whether item is disabled
- `classes:` - Additional CSS classes
- `**attributes` - Additional HTML attributes

### Group - UI::Select::GroupComponent

### Label - UI::Select::LabelComponent

## Examples

### Basic Select

```ruby
<%= render UI::Select::SelectComponent.new(value: "apple") do %>
  <%= render UI::Select::TriggerComponent.new(placeholder: "Select a fruit...") %>
  <%= render UI::Select::ContentComponent.new do %>
    <%= render UI::Select::ItemComponent.new(value: "apple") { "Apple" } %>
    <%= render UI::Select::ItemComponent.new(value: "banana") { "Banana" } %>
  <% end %>
<% end %>
```

### With Grouped Options

```ruby
<%= render UI::Select::SelectComponent.new(value: "america/new_york") do %>
  <%= render UI::Select::TriggerComponent.new(placeholder: "Select timezone...") %>
  <%= render UI::Select::ContentComponent.new do %>
    <%= render UI::Select::GroupComponent.new do %>
      <%= render UI::Select::LabelComponent.new { "North America" } %>
      <%= render UI::Select::ItemComponent.new(value: "america/new_york") { "Eastern Time (ET)" } %>
      <%= render UI::Select::ItemComponent.new(value: "america/chicago") { "Central Time (CT)" } %>
    <% end %>
  <% end %>
<% end %>
```

### With Disabled Items

```ruby
<%= render UI::Select::SelectComponent.new(value: "react") do %>
  <%= render UI::Select::TriggerComponent.new(placeholder: "Select framework...") %>
  <%= render UI::Select::ContentComponent.new do %>
    <%= render UI::Select::ItemComponent.new(value: "react") { "React" } %>
    <%= render UI::Select::ItemComponent.new(value: "angular", disabled: true) { "Angular (Coming Soon)" } %>
  <% end %>
<% end %>
```

## Error Prevention

### ❌ Wrong: Missing Component suffix

```ruby
<%= render UI::Select::Select.new { ... } %>
# ERROR: Only Phlex uses this naming
```

### ✅ Correct: Use Component suffix

```ruby
<%= render UI::Select::SelectComponent.new { ... } %>
```
