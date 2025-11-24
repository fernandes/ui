# Field Component - Phlex

Compose accessible form fields with labels, controls, help text, and validation messages. The Field system provides 10 components for building complex form layouts with support for horizontal, vertical, and responsive orientations.

## Overview

Field is a composition-based system from shadcn/ui based on semantic HTML (`<fieldset>`, `<legend>`) and ARIA patterns. It coordinates multiple sub-components to create accessible, flexible form fields.

## Component Hierarchy

```
UI::Field::Set (fieldset)
├── UI::Field::Legend (legend)
├── UI::Field::Group (div) - Stacks fields
│   ├── UI::Field::Field (div[role=group]) - Single field wrapper
│   │   ├── UI::Field::Label (label)
│   │   ├── [Input/Checkbox/RadioButton/Switch/Select]
│   │   ├── UI::Field::Description (p)
│   │   └── UI::Field::Error (p)
│   └── UI::Field::Separator (hr)
```

## All Components

### 1. UI::Field::Field

**Path**: `app/components/ui/field/field.rb`

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
<%= render UI::Field::Field.new do %>
  <%= render UI::Label::Label.new(for: "email", data: { slot: "field-label" }) { "Email" } %>
  <%= render UI::Input::Input.new(id: "email", type: "email") %>
  <%= render UI::Field::Description.new { "We'll never share your email." } %>
<% end %>
```

### 2. UI::Field::Set

**Path**: `app/components/ui/field/set.rb`

Semantic fieldset container for grouped fields.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render UI::Field::Set.new do %>
  <%= render UI::Field::Legend.new { "Contact Information" } %>
  <%= render UI::Field::Group.new do %>
    <%= render UI::Field::Field.new do %>
      <%= render UI::Label::Label.new(for: "name", data: { slot: "field-label" }) { "Name" } %>
      <%= render UI::Input::Input.new(id: "name") %>
    <% end %>
  <% end %>
<% end %>
```

### 3. UI::Field::Legend

**Path**: `app/components/ui/field/legend.rb`

Legend element for FieldSet with variant support.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | String | `"legend"` | Style: `"legend"` (text-base) or `"label"` (text-sm) |
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render UI::Field::Legend.new { "Personal Information" } %>
<%= render UI::Field::Legend.new(variant: "label") { "Preferences" } %>
```

### 4. UI::Field::Group

**Path**: `app/components/ui/field/group.rb`

Layout wrapper that stacks Field components with container query support.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render UI::Field::Group.new do %>
  <%= render UI::Field::Field.new do %>
    <%= render UI::Label::Label.new(for: "first-name", data: { slot: "field-label" }) { "First Name" } %>
    <%= render UI::Input::Input.new(id: "first-name") %>
  <% end %>

  <%= render UI::Field::Field.new do %>
    <%= render UI::Label::Label.new(for: "last-name", data: { slot: "field-label" }) { "Last Name" } %>
    <%= render UI::Input::Input.new(id: "last-name") %>
  <% end %>
<% end %>
```

### 5. UI::Field::Label

**Path**: `app/components/ui/field/label.rb`

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
<%= render UI::Field::Label.new(for_id: "email", data: { slot: "field-label" }) do %>
  Email Address
<% end %>
```

### 6. UI::Field::Content

**Path**: `app/components/ui/field/content.rb`

Wrapper for label and description when input comes after.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render UI::Field::Field.new(orientation: "horizontal") do %>
  <%= render UI::Field::Content.new do %>
    <%= render UI::Label::Label.new(for: "marketing", data: { slot: "field-label" }) { "Marketing emails" } %>
    <%= render UI::Field::Description.new { "Receive emails about new products." } %>
  <% end %>
  <%= render UI::Checkbox::Checkbox.new(id: "marketing") %>
<% end %>
```

### 7. UI::Field::Description

**Path**: `app/components/ui/field/description.rb`

Helper text for form fields.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render UI::Field::Description.new do %>
  Use 8 or more characters with a mix of letters, numbers & symbols.
<% end %>
```

### 8. UI::Field::Error

**Path**: `app/components/ui/field/error.rb`

Validation error message for form fields.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render UI::Field::Field.new(data_invalid: true) do %>
  <%= render UI::Label::Label.new(for: "email", data: { slot: "field-label" }) { "Email" } %>
  <%= render UI::Input::Input.new(id: "email", type: "email") %>
  <%= render UI::Field::Error.new { "Email address is required." } %>
<% end %>
```

### 9. UI::Field::Title

**Path**: `app/components/ui/field/title.rb`

Title text for complex field layouts.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render UI::Field::Title.new { "Payment method" } %>
```

### 10. UI::Field::Separator

**Path**: `app/components/ui/field/separator.rb`

Visual separator between field groups.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render UI::Field::Separator.new %>
```

## Orientation Patterns

### Vertical (Default)

Label above input, full width:

```ruby
<%= render UI::Field::Field.new(orientation: "vertical") do %>
  <%= render UI::Label::Label.new(for: "username", data: { slot: "field-label" }) { "Username" } %>
  <%= render UI::Input::Input.new(id: "username") %>
<% end %>
```

### Horizontal

Label and input side-by-side:

```ruby
<%= render UI::Field::Field.new(orientation: "horizontal") do %>
  <%= render UI::Field::Content.new do %>
    <%= render UI::Label::Label.new(for: "notifications", data: { slot: "field-label" }) { "Email notifications" } %>
    <%= render UI::Field::Description.new { "Receive notifications via email." } %>
  <% end %>
  <%= render UI::Switch::Switch.new(id: "notifications") %>
<% end %>
```

### Responsive

Vertical on mobile, horizontal on larger screens (requires `@container/field-group`):

```ruby
<%= render UI::Field::Group.new do %>
  <%= render UI::Field::Field.new(orientation: "responsive") do %>
    <%= render UI::Label::Label.new(for: "city", data: { slot: "field-label" }) { "City" } %>
    <%= render UI::Input::Input.new(id: "city") %>
  <% end %>
<% end %>
```

## Common Patterns

### Input Field with Description

```ruby
<%= render UI::Field::Field.new do %>
  <%= render UI::Label::Label.new(for: "bio", data: { slot: "field-label" }) { "Bio" } %>
  <%= render UI::Textarea::Textarea.new(id: "bio", placeholder: "Tell us about yourself") %>
  <%= render UI::Field::Description.new { "You can @mention other users." } %>
<% end %>
```

### Checkbox with Label

```ruby
<%= render UI::Field::Field.new(orientation: "horizontal") do %>
  <%= render UI::Checkbox::Checkbox.new(id: "terms") %>
  <%= render UI::Label::Label.new(for: "terms", classes: "font-normal", data: { slot: "field-label" }) do %>
    I accept the terms and conditions
  <% end %>
<% end %>
```

### Radio Group

```ruby
<%= render UI::Field::Set.new do %>
  <%= render UI::Field::Legend.new(variant: "label") { "Choose a plan" } %>
  <%= render UI::Field::Description.new { "Select the plan that works best for you." } %>

  <%= render UI::Field::Group.new(classes: "gap-3") do %>
    <%= render UI::Field::Field.new(orientation: "horizontal") do %>
      <%= render UI::RadioButton::RadioButton.new(id: "plan-free", name: "plan", value: "free", checked: true) %>
      <%= render UI::Label::Label.new(for: "plan-free", classes: "font-normal", data: { slot: "field-label" }) { "Free" } %>
    <% end %>

    <%= render UI::Field::Field.new(orientation: "horizontal") do %>
      <%= render UI::RadioButton::RadioButton.new(id: "plan-pro", name: "plan", value: "pro") %>
      <%= render UI::Label::Label.new(for: "plan-pro", classes: "font-normal", data: { slot: "field-label" }) { "Pro" } %>
    <% end %>
  <% end %>
<% end %>
```

### Select with Description

```ruby
<%= render UI::Field::Field.new do %>
  <%= render UI::Label::Label.new(for: "department", data: { slot: "field-label" }) { "Department" } %>
  <%= render "ui/select/select", value: "engineering" do %>
    <%= render "ui/select/select_trigger", id: "department", placeholder: "Choose department" %>
    <%= render "ui/select/select_content" do %>
      <%= render "ui/select/select_item", value: "engineering" do %>Engineering<% end %>
      <%= render "ui/select/select_item", value: "design" do %>Design<% end %>
    <% end %>
  <% end %>
  <%= render UI::Field::Description.new { "Choose your primary department." } %>
<% end %>
```

### Field with Validation Error

```ruby
<%= render UI::Field::Field.new(data_invalid: true) do %>
  <%= render UI::Label::Label.new(for: "password", data: { slot: "field-label" }) { "Password" } %>
  <%= render UI::Input::Input.new(id: "password", type: "password") %>
  <%= render UI::Field::Error.new { "Password must be at least 8 characters." } %>
<% end %>
```

### Complex Multi-Section Form

```ruby
<%= render UI::Field::Set.new do %>
  <%= render UI::Field::Legend.new { "Profile Information" } %>

  <%= render UI::Field::Group.new do %>
    <%= render UI::Field::Field.new do %>
      <%= render UI::Label::Label.new(for: "display-name", data: { slot: "field-label" }) { "Display Name" } %>
      <%= render UI::Input::Input.new(id: "display-name") %>
      <%= render UI::Field::Description.new { "This is your public display name." } %>
    <% end %>

    <%= render UI::Field::Field.new do %>
      <%= render UI::Label::Label.new(for: "email", data: { slot: "field-label" }) { "Email" } %>
      <%= render UI::Input::Input.new(id: "email", type: "email") %>
    <% end %>

    <%= render UI::Field::Separator.new %>

    <%= render UI::Field::Field.new(orientation: "horizontal") do %>
      <%= render UI::Field::Content.new do %>
        <%= render UI::Label::Label.new(for: "marketing", data: { slot: "field-label" }) { "Marketing emails" } %>
        <%= render UI::Field::Description.new { "Receive emails about new products." } %>
      <% end %>
      <%= render UI::Checkbox::Checkbox.new(id: "marketing") %>
    <% end %>
  <% end %>
<% end %>
```

## Integration Notes

### Always Use data-slot Attribute

For proper Field styling and behavior, always add `data: { slot: "field-label" }` to labels:

```ruby
# ✅ Correct
<%= render UI::Label::Label.new(for: "email", data: { slot: "field-label" }) { "Email" } %>

# ❌ Wrong - missing data-slot
<%= render UI::Label::Label.new(for: "email") { "Email" } %>
```

### Container Query Support

FieldGroup uses `@container/field-group` for responsive layouts. When using `orientation: "responsive"`, wrap fields in a FieldGroup:

```ruby
<%= render UI::Field::Group.new do %>
  <%= render UI::Field::Field.new(orientation: "responsive") do %>
    <%# Field content %>
  <% end %>
<% end %>
```

### Validation State

Set `data_invalid: true` on Field to enable error styling:

```ruby
<%= render UI::Field::Field.new(data_invalid: true) do %>
  <%# Input and error message %>
<% end %>
```

## Error Prevention

### ❌ Wrong: Missing UI::Field module

```ruby
<%= render UI::Set.new { "Content" } %>
# ERROR: undefined method 'new' for module UI
```

### ✅ Correct: Full path

```ruby
<%= render UI::Field::Set.new { "Content" } %>  # Correct!
```

### ❌ Wrong: Missing data-slot attribute

```ruby
<%= render UI::Label::Label.new(for: "email") { "Email" } %>
# Label won't have proper Field styling
```

### ✅ Correct: Include data-slot

```ruby
<%= render UI::Label::Label.new(for: "email", data: { slot: "field-label" }) { "Email" } %>  # Correct!
```

### ❌ Wrong: Using Content outside horizontal layout

```ruby
<%= render UI::Field::Field.new do %>
  <%= render UI::Field::Content.new do %>
    <%= render UI::Label::Label.new(for: "email", data: { slot: "field-label" }) { "Email" } %>
  <% end %>
  <%= render UI::Input::Input.new(id: "email") %>
<% end %>
# Content is mainly for horizontal layouts with switches/checkboxes
```

### ✅ Correct: Content for horizontal checkbox/switch

```ruby
<%= render UI::Field::Field.new(orientation: "horizontal") do %>
  <%= render UI::Field::Content.new do %>
    <%= render UI::Label::Label.new(for: "notifications", data: { slot: "field-label" }) { "Notifications" } %>
    <%= render UI::Field::Description.new { "Receive notifications." } %>
  <% end %>
  <%= render UI::Switch::Switch.new(id: "notifications") %>
<% end %>
```

## Reference

- **shadcn/ui**: https://ui.shadcn.com/docs/components/field
- **Radix UI**: https://www.radix-ui.com/primitives (semantic HTML patterns)
