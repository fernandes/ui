# Field Component - ViewComponent

Compose accessible form fields with labels, controls, help text, and validation messages. The Field system provides 10 components for building complex form layouts with support for horizontal, vertical, and responsive orientations.

## Overview

Field is a composition-based system from shadcn/ui based on semantic HTML (`<fieldset>`, `<legend>`) and ARIA patterns. It coordinates multiple sub-components to create accessible, flexible form fields.

## Component Hierarchy

```
UI::Field::SetComponent (fieldset)
├── UI::Field::LegendComponent (legend)
├── UI::Field::GroupComponent (div) - Stacks fields
│   ├── UI::Field::FieldComponent (div[role=group]) - Single field wrapper
│   │   ├── UI::Field::LabelComponent (label)
│   │   ├── [Input/Checkbox/RadioButton/Switch/Select]
│   │   ├── UI::Field::DescriptionComponent (p)
│   │   └── UI::Field::ErrorComponent (p)
│   └── UI::Field::SeparatorComponent (hr)
```

## All Components

### 1. UI::Field::FieldComponent

**Path**: `app/components/ui/field/field_component.rb`

Core wrapper for a single form field.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `orientation` | String | `"vertical"` | Layout: `"vertical"`, `"horizontal"`, `"responsive"` |
| `data_invalid` | Boolean | `nil` | Whether field is in invalid state |
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render UI::Field::FieldComponent.new do %>
  <%= render UI::Label::LabelComponent.new(for: "email", data: { slot: "field-label" }) { "Email" } %>
  <%= render UI::Input::InputComponent.new(id: "email", type: "email") %>
  <%= render UI::Field::DescriptionComponent.new { "We'll never share your email." } %>
<% end %>
```

### 2. UI::Field::SetComponent

**Path**: `app/components/ui/field/field_set_component.rb`

Semantic fieldset container for grouped fields.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render UI::Field::SetComponent.new do %>
  <%= render UI::Field::LegendComponent.new { "Contact Information" } %>
  <%= render UI::Field::GroupComponent.new do %>
    <%= render UI::Field::FieldComponent.new do %>
      <%= render UI::Label::LabelComponent.new(for: "name", data: { slot: "field-label" }) { "Name" } %>
      <%= render UI::Input::InputComponent.new(id: "name") %>
    <% end %>
  <% end %>
<% end %>
```

### 3. UI::Field::LegendComponent

**Path**: `app/components/ui/field/field_legend_component.rb`

Legend element for FieldSet with variant support.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | String | `"legend"` | Style: `"legend"` (text-base) or `"label"` (text-sm) |
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render UI::Field::LegendComponent.new { "Personal Information" } %>
<%= render UI::Field::LegendComponent.new(variant: "label") { "Preferences" } %>
```

### 4. UI::Field::GroupComponent

**Path**: `app/components/ui/field/field_group_component.rb`

Layout wrapper that stacks Field components with container query support.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render UI::Field::GroupComponent.new do %>
  <%= render UI::Field::FieldComponent.new do %>
    <%= render UI::Label::LabelComponent.new(for: "first-name", data: { slot: "field-label" }) { "First Name" } %>
    <%= render UI::Input::InputComponent.new(id: "first-name") %>
  <% end %>

  <%= render UI::Field::FieldComponent.new do %>
    <%= render UI::Label::LabelComponent.new(for: "last-name", data: { slot: "field-label" }) { "Last Name" } %>
    <%= render UI::Input::InputComponent.new(id: "last-name") %>
  <% end %>
<% end %>
```

### 5. UI::Field::LabelComponent

**Path**: `app/components/ui/field/field_label_component.rb`

Label styled for form fields with disability states.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `for_id` | String | `nil` | ID of the associated form control |
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

**Important**: Always add `data: { slot: "field-label" }` for proper Field integration.

**Example**:
```ruby
<%= render UI::Field::LabelComponent.new(for_id: "email", data: { slot: "field-label" }) do %>
  Email Address
<% end %>
```

### 6. UI::Field::ContentComponent

**Path**: `app/components/ui/field/field_content_component.rb`

Wrapper for label and description when input comes after.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render UI::Field::FieldComponent.new(orientation: "horizontal") do %>
  <%= render UI::Field::ContentComponent.new do %>
    <%= render UI::Label::LabelComponent.new(for: "marketing", data: { slot: "field-label" }) { "Marketing emails" } %>
    <%= render UI::Field::DescriptionComponent.new { "Receive emails about new products." } %>
  <% end %>
  <%= render UI::Checkbox::CheckboxComponent.new(id: "marketing") %>
<% end %>
```

### 7. UI::Field::DescriptionComponent

**Path**: `app/components/ui/field/field_description_component.rb`

Helper text for form fields.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render UI::Field::DescriptionComponent.new do %>
  Use 8 or more characters with a mix of letters, numbers & symbols.
<% end %>
```

### 8. UI::Field::ErrorComponent

**Path**: `app/components/ui/field/field_error_component.rb`

Validation error message for form fields.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render UI::Field::FieldComponent.new(data_invalid: true) do %>
  <%= render UI::Label::LabelComponent.new(for: "email", data: { slot: "field-label" }) { "Email" } %>
  <%= render UI::Input::InputComponent.new(id: "email", type: "email") %>
  <%= render UI::Field::ErrorComponent.new { "Email address is required." } %>
<% end %>
```

### 9. UI::Field::TitleComponent

**Path**: `app/components/ui/field/field_title_component.rb`

Title text for complex field layouts.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render UI::Field::TitleComponent.new { "Payment method" } %>
```

### 10. UI::Field::SeparatorComponent

**Path**: `app/components/ui/field/field_separator_component.rb`

Visual separator between field groups.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render UI::Field::SeparatorComponent.new %>
```

## Orientation Patterns

### Vertical (Default)

Label above input, full width:

```ruby
<%= render UI::Field::FieldComponent.new(orientation: "vertical") do %>
  <%= render UI::Label::LabelComponent.new(for: "username", data: { slot: "field-label" }) { "Username" } %>
  <%= render UI::Input::InputComponent.new(id: "username") %>
<% end %>
```

### Horizontal

Label and input side-by-side:

```ruby
<%= render UI::Field::FieldComponent.new(orientation: "horizontal") do %>
  <%= render UI::Field::ContentComponent.new do %>
    <%= render UI::Label::LabelComponent.new(for: "notifications", data: { slot: "field-label" }) { "Email notifications" } %>
    <%= render UI::Field::DescriptionComponent.new { "Receive notifications via email." } %>
  <% end %>
  <%= render UI::Switch::SwitchComponent.new(id: "notifications") %>
<% end %>
```

### Responsive

Vertical on mobile, horizontal on larger screens (requires `@container/field-group`):

```ruby
<%= render UI::Field::GroupComponent.new do %>
  <%= render UI::Field::FieldComponent.new(orientation: "responsive") do %>
    <%= render UI::Label::LabelComponent.new(for: "city", data: { slot: "field-label" }) { "City" } %>
    <%= render UI::Input::InputComponent.new(id: "city") %>
  <% end %>
<% end %>
```

## Common Patterns

### Input Field with Description

```ruby
<%= render UI::Field::FieldComponent.new do %>
  <%= render UI::Label::LabelComponent.new(for: "bio", data: { slot: "field-label" }) { "Bio" } %>
  <%= render UI::Textarea::TextareaComponent.new(id: "bio", placeholder: "Tell us about yourself") %>
  <%= render UI::Field::DescriptionComponent.new { "You can @mention other users." } %>
<% end %>
```

### Checkbox with Label

```ruby
<%= render UI::Field::FieldComponent.new(orientation: "horizontal") do %>
  <%= render UI::Checkbox::CheckboxComponent.new(id: "terms") %>
  <%= render UI::Label::LabelComponent.new(for: "terms", classes: "font-normal", data: { slot: "field-label" }) do %>
    I accept the terms and conditions
  <% end %>
<% end %>
```

### Radio Group

```ruby
<%= render UI::Field::SetComponent.new do %>
  <%= render UI::Field::LegendComponent.new(variant: "label") { "Choose a plan" } %>
  <%= render UI::Field::DescriptionComponent.new { "Select the plan that works best for you." } %>

  <%= render UI::Field::GroupComponent.new(classes: "gap-3") do %>
    <%= render UI::Field::FieldComponent.new(orientation: "horizontal") do %>
      <%= render UI::RadioButton::RadioButtonComponent.new(id: "plan-free", name: "plan", value: "free", checked: true) %>
      <%= render UI::Label::LabelComponent.new(for: "plan-free", classes: "font-normal", data: { slot: "field-label" }) { "Free" } %>
    <% end %>

    <%= render UI::Field::FieldComponent.new(orientation: "horizontal") do %>
      <%= render UI::RadioButton::RadioButtonComponent.new(id: "plan-pro", name: "plan", value: "pro") %>
      <%= render UI::Label::LabelComponent.new(for: "plan-pro", classes: "font-normal", data: { slot: "field-label" }) { "Pro" } %>
    <% end %>
  <% end %>
<% end %>
```

### Select with Description

```ruby
<%= render UI::Field::FieldComponent.new do %>
  <%= render UI::Label::LabelComponent.new(for: "department", data: { slot: "field-label" }) { "Department" } %>
  <%= render "ui/select/select", value: "engineering" do %>
    <%= render "ui/select/select_trigger", id: "department", placeholder: "Choose department" %>
    <%= render "ui/select/select_content" do %>
      <%= render "ui/select/select_item", value: "engineering" do %>Engineering<% end %>
      <%= render "ui/select/select_item", value: "design" do %>Design<% end %>
    <% end %>
  <% end %>
  <%= render UI::Field::DescriptionComponent.new { "Choose your primary department." } %>
<% end %>
```

### Field with Validation Error

```ruby
<%= render UI::Field::FieldComponent.new(data_invalid: true) do %>
  <%= render UI::Label::LabelComponent.new(for: "password", data: { slot: "field-label" }) { "Password" } %>
  <%= render UI::Input::InputComponent.new(id: "password", type: "password") %>
  <%= render UI::Field::ErrorComponent.new { "Password must be at least 8 characters." } %>
<% end %>
```

### Complex Multi-Section Form

```ruby
<%= render UI::Field::SetComponent.new do %>
  <%= render UI::Field::LegendComponent.new { "Profile Information" } %>

  <%= render UI::Field::GroupComponent.new do %>
    <%= render UI::Field::FieldComponent.new do %>
      <%= render UI::Label::LabelComponent.new(for: "display-name", data: { slot: "field-label" }) { "Display Name" } %>
      <%= render UI::Input::InputComponent.new(id: "display-name") %>
      <%= render UI::Field::DescriptionComponent.new { "This is your public display name." } %>
    <% end %>

    <%= render UI::Field::FieldComponent.new do %>
      <%= render UI::Label::LabelComponent.new(for: "email", data: { slot: "field-label" }) { "Email" } %>
      <%= render UI::Input::InputComponent.new(id: "email", type: "email") %>
    <% end %>

    <%= render UI::Field::SeparatorComponent.new %>

    <%= render UI::Field::FieldComponent.new(orientation: "horizontal") do %>
      <%= render UI::Field::ContentComponent.new do %>
        <%= render UI::Label::LabelComponent.new(for: "marketing", data: { slot: "field-label" }) { "Marketing emails" } %>
        <%= render UI::Field::DescriptionComponent.new { "Receive emails about new products." } %>
      <% end %>
      <%= render UI::Checkbox::CheckboxComponent.new(id: "marketing") %>
    <% end %>
  <% end %>
<% end %>
```

## Integration Notes

### Always Use data-slot Attribute

For proper Field styling and behavior, always add `data: { slot: "field-label" }` to labels:

```ruby
# ✅ Correct
<%= render UI::Label::LabelComponent.new(for: "email", data: { slot: "field-label" }) { "Email" } %>

# ❌ Wrong - missing data-slot
<%= render UI::Label::LabelComponent.new(for: "email") { "Email" } %>
```

### Container Query Support

FieldGroup uses `@container/field-group` for responsive layouts. When using `orientation: "responsive"`, wrap fields in a FieldGroup:

```ruby
<%= render UI::Field::GroupComponent.new do %>
  <%= render UI::Field::FieldComponent.new(orientation: "responsive") do %>
    <%# Field content %>
  <% end %>
<% end %>
```

### Validation State

Set `data_invalid: true` on Field to enable error styling:

```ruby
<%= render UI::Field::FieldComponent.new(data_invalid: true) do %>
  <%# Input and error message %>
<% end %>
```

## Error Prevention

### ❌ Wrong: Missing Component suffix

```ruby
<%= render UI::Field::Set.new { "Content" } %>
# ERROR: This is the Phlex component, not ViewComponent
```

### ✅ Correct: Use SetComponent

```ruby
<%= render UI::Field::SetComponent.new { "Content" } %>  # Correct!
```

### ❌ Wrong: Missing nested module

```ruby
<%= render UI::SetComponent.new { "Content" } %>
# ERROR: Component is inside UI::Field module
```

### ✅ Correct: Full path

```ruby
<%= render UI::Field::SetComponent.new { "Content" } %>  # Correct!
```

### ❌ Wrong: Using Phlex syntax

```ruby
<%= render UI::Field::Set.new { "Content" } %>
# ERROR: Missing Component suffix - this is Phlex, not ViewComponent
```

### ✅ Correct: ViewComponent syntax

```ruby
<%= render UI::Field::SetComponent.new { "Content" } %>  # Correct!
```

### ❌ Wrong: Missing data-slot attribute

```ruby
<%= render UI::Label::LabelComponent.new(for: "email") { "Email" } %>
# Label won't have proper Field styling
```

### ✅ Correct: Include data-slot

```ruby
<%= render UI::Label::LabelComponent.new(for: "email", data: { slot: "field-label" }) { "Email" } %>  # Correct!
```

### ❌ Wrong: Using Content outside horizontal layout

```ruby
<%= render UI::Field::FieldComponent.new do %>
  <%= render UI::Field::ContentComponent.new do %>
    <%= render UI::Label::LabelComponent.new(for: "email", data: { slot: "field-label" }) { "Email" } %>
  <% end %>
  <%= render UI::Input::InputComponent.new(id: "email") %>
<% end %>
# Content is mainly for horizontal layouts with switches/checkboxes
```

### ✅ Correct: Content for horizontal checkbox/switch

```ruby
<%= render UI::Field::FieldComponent.new(orientation: "horizontal") do %>
  <%= render UI::Field::ContentComponent.new do %>
    <%= render UI::Label::LabelComponent.new(for: "notifications", data: { slot: "field-label" }) { "Notifications" } %>
    <%= render UI::Field::DescriptionComponent.new { "Receive notifications." } %>
  <% end %>
  <%= render UI::Switch::SwitchComponent.new(id: "notifications") %>
<% end %>
```

## Reference

- **shadcn/ui**: https://ui.shadcn.com/docs/components/field
- **Radix UI**: https://www.radix-ui.com/primitives (semantic HTML patterns)
