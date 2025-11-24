# Field Component - ERB

Compose accessible form fields with labels, controls, help text, and validation messages. The Field system provides 10 components for building complex form layouts with support for horizontal, vertical, and responsive orientations.

## Overview

Field is a composition-based system from shadcn/ui based on semantic HTML (`<fieldset>`, `<legend>`) and ARIA patterns. It coordinates multiple sub-components to create accessible, flexible form fields.

## Component Hierarchy

```
ui/field/field_set (fieldset)
├── ui/field/field_legend (legend)
├── ui/field/field_group (div) - Stacks fields
│   ├── ui/field/field (div[role=group]) - Single field wrapper
│   │   ├── ui/field/field_label (label)
│   │   ├── [Input/Checkbox/RadioButton/Switch/Select]
│   │   ├── ui/field/field_description (p)
│   │   └── ui/field/field_error (p)
│   └── ui/field/field_separator (hr)
```

## All Components

### 1. ui/field/field

**Path**: `app/views/ui/field/_field.html.erb`

Core wrapper for a single form field.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `orientation` | String | `nil` | Layout: `"vertical"`, `"horizontal"`, `"responsive"` |
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```erb
<%= render "ui/field/field" do %>
  <%= render "ui/label/label", for_id: "email", attributes: { data: { slot: "field-label" } }, content: "Email" %>
  <%= render "ui/input/input", id: "email", type: "email" %>
  <%= render "ui/field/field_description" do %>
    We'll never share your email.
  <% end %>
<% end %>
```

### 2. ui/field/field_set

**Path**: `app/views/ui/field/_field_set.html.erb`

Semantic fieldset container for grouped fields.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```erb
<%= render "ui/field/field_set" do %>
  <%= render "ui/field/field_legend", content: "Contact Information" %>
  <%= render "ui/field/field_group" do %>
    <%= render "ui/field/field" do %>
      <%= render "ui/label/label", for_id: "name", attributes: { data: { slot: "field-label" } }, content: "Name" %>
      <%= render "ui/input/input", id: "name" %>
    <% end %>
  <% end %>
<% end %>
```

### 3. ui/field/field_legend

**Path**: `app/views/ui/field/_field_legend.html.erb`

Legend element for FieldSet with variant support.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `content` | String | `nil` | Legend text (or use block) |
| `variant` | String | `nil` | Style: `"legend"` (text-base) or `"label"` (text-sm) |
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```erb
<%= render "ui/field/field_legend", content: "Personal Information" %>
<%= render "ui/field/field_legend", variant: "label", content: "Preferences" %>

<%# Or with block %>
<%= render "ui/field/field_legend" do %>
  Personal Information
<% end %>
```

### 4. ui/field/field_group

**Path**: `app/views/ui/field/_field_group.html.erb`

Layout wrapper that stacks Field components with container query support.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```erb
<%= render "ui/field/field_group" do %>
  <%= render "ui/field/field" do %>
    <%= render "ui/label/label", for_id: "first-name", attributes: { data: { slot: "field-label" } }, content: "First Name" %>
    <%= render "ui/input/input", id: "first-name" %>
  <% end %>

  <%= render "ui/field/field" do %>
    <%= render "ui/label/label", for_id: "last-name", attributes: { data: { slot: "field-label" } }, content: "Last Name" %>
    <%= render "ui/input/input", id: "last-name" %>
  <% end %>
<% end %>
```

### 5. ui/field/field_label

**Path**: `app/views/ui/field/_field_label.html.erb`

Label styled for form fields with disability states.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `for_id` | String | `nil` | ID of the associated form control |
| `content` | String | `nil` | Label text (or use block) |
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

**Important**: Always add `attributes: { data: { slot: "field-label" } }` for proper Field integration.

**Example**:
```erb
<%= render "ui/field/field_label", for_id: "email", attributes: { data: { slot: "field-label" } }, content: "Email Address" %>

<%# Or with block %>
<%= render "ui/field/field_label", for_id: "email", attributes: { data: { slot: "field-label" } } do %>
  Email Address
<% end %>
```

### 6. ui/field/field_content

**Path**: `app/views/ui/field/_field_content.html.erb`

Wrapper for label and description when input comes after.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```erb
<%= render "ui/field/field", orientation: "horizontal" do %>
  <%= render "ui/field/field_content" do %>
    <%= render "ui/label/label", for_id: "marketing", attributes: { data: { slot: "field-label" } }, content: "Marketing emails" %>
    <%= render "ui/field/field_description" do %>
      Receive emails about new products.
    <% end %>
  <% end %>
  <%= render "ui/checkbox/checkbox", id: "marketing" %>
<% end %>
```

### 7. ui/field/field_description

**Path**: `app/views/ui/field/_field_description.html.erb`

Helper text for form fields.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `content` | String | `nil` | Description text (or use block) |
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```erb
<%= render "ui/field/field_description", content: "Use 8 or more characters with a mix of letters, numbers & symbols." %>

<%# Or with block %>
<%= render "ui/field/field_description" do %>
  Use 8 or more characters with a mix of letters, numbers & symbols.
<% end %>
```

### 8. ui/field/field_error

**Path**: `app/views/ui/field/_field_error.html.erb`

Validation error message for form fields.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `content` | String | `nil` | Error message (or use block) |
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```erb
<%= render "ui/field/field", attributes: { "data-invalid": true } do %>
  <%= render "ui/label/label", for_id: "email", attributes: { data: { slot: "field-label" } }, content: "Email" %>
  <%= render "ui/input/input", id: "email", type: "email" %>
  <%= render "ui/field/field_error", content: "Email address is required." %>
<% end %>
```

### 9. ui/field/field_title

**Path**: `app/views/ui/field/_field_title.html.erb`

Title text for complex field layouts.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `content` | String | `nil` | Title text (or use block) |
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```erb
<%= render "ui/field/field_title", content: "Payment method" %>
```

### 10. ui/field/field_separator

**Path**: `app/views/ui/field/_field_separator.html.erb`

Visual separator between field groups.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```erb
<%= render "ui/field/field_separator" %>
```

## Orientation Patterns

### Vertical (Default)

Label above input, full width:

```erb
<%= render "ui/field/field", orientation: "vertical" do %>
  <%= render "ui/label/label", for_id: "username", attributes: { data: { slot: "field-label" } }, content: "Username" %>
  <%= render "ui/input/input", id: "username" %>
<% end %>
```

### Horizontal

Label and input side-by-side:

```erb
<%= render "ui/field/field", orientation: "horizontal" do %>
  <%= render "ui/field/field_content" do %>
    <%= render "ui/label/label", for_id: "notifications", attributes: { data: { slot: "field-label" } }, content: "Email notifications" %>
    <%= render "ui/field/field_description" do %>
      Receive notifications via email.
    <% end %>
  <% end %>
  <%= render "ui/switch/switch", id: "notifications" %>
<% end %>
```

### Responsive

Vertical on mobile, horizontal on larger screens (requires `@container/field-group`):

```erb
<%= render "ui/field/field_group" do %>
  <%= render "ui/field/field", orientation: "responsive" do %>
    <%= render "ui/label/label", for_id: "city", attributes: { data: { slot: "field-label" } }, content: "City" %>
    <%= render "ui/input/input", id: "city" %>
  <% end %>
<% end %>
```

## Common Patterns

### Input Field with Description

```erb
<%= render "ui/field/field" do %>
  <%= render "ui/label/label", for_id: "bio", attributes: { data: { slot: "field-label" } }, content: "Bio" %>
  <%= render "ui/textarea/textarea", id: "bio", placeholder: "Tell us about yourself" %>
  <%= render "ui/field/field_description" do %>
    You can @mention other users.
  <% end %>
<% end %>
```

### Checkbox with Label

```erb
<%= render "ui/field/field", orientation: "horizontal" do %>
  <%= render "ui/checkbox/checkbox", id: "terms" %>
  <%= render "ui/label/label", for_id: "terms", classes: "font-normal", attributes: { data: { slot: "field-label" } } do %>
    I accept the terms and conditions
  <% end %>
<% end %>
```

### Radio Group

```erb
<%= render "ui/field/field_set" do %>
  <%= render "ui/field/field_legend", variant: "label", content: "Choose a plan" %>
  <%= render "ui/field/field_description" do %>
    Select the plan that works best for you.
  <% end %>

  <%= render "ui/field/field_group", classes: "gap-3" do %>
    <%= render "ui/field/field", orientation: "horizontal" do %>
      <%= render "ui/radio_button/radio_button", id: "plan-free", name: "plan", value: "free", checked: true %>
      <%= render "ui/label/label", for_id: "plan-free", classes: "font-normal", attributes: { data: { slot: "field-label" } }, content: "Free" %>
    <% end %>

    <%= render "ui/field/field", orientation: "horizontal" do %>
      <%= render "ui/radio_button/radio_button", id: "plan-pro", name: "plan", value: "pro" %>
      <%= render "ui/label/label", for_id: "plan-pro", classes: "font-normal", attributes: { data: { slot: "field-label" } }, content: "Pro" %>
    <% end %>
  <% end %>
<% end %>
```

### Select with Description

```erb
<%= render "ui/field/field" do %>
  <%= render "ui/label/label", for_id: "department", attributes: { data: { slot: "field-label" } }, content: "Department" %>
  <%= render "ui/select/select", value: "engineering" do %>
    <%= render "ui/select/select_trigger", id: "department", placeholder: "Choose department" %>
    <%= render "ui/select/select_content" do %>
      <%= render "ui/select/select_item", value: "engineering" do %>Engineering<% end %>
      <%= render "ui/select/select_item", value: "design" do %>Design<% end %>
    <% end %>
  <% end %>
  <%= render "ui/field/field_description" do %>
    Choose your primary department.
  <% end %>
<% end %>
```

### Field with Validation Error

```erb
<%= render "ui/field/field", attributes: { "data-invalid": true } do %>
  <%= render "ui/label/label", for_id: "password", attributes: { data: { slot: "field-label" } }, content: "Password" %>
  <%= render "ui/input/input", id: "password", type: "password" %>
  <%= render "ui/field/field_error" do %>
    Password must be at least 8 characters.
  <% end %>
<% end %>
```

### Complex Multi-Section Form

```erb
<%= render "ui/field/field_set" do %>
  <%= render "ui/field/field_legend", content: "Profile Information" %>

  <%= render "ui/field/field_group" do %>
    <%= render "ui/field/field" do %>
      <%= render "ui/label/label", for_id: "display-name", attributes: { data: { slot: "field-label" } }, content: "Display Name" %>
      <%= render "ui/input/input", id: "display-name" %>
      <%= render "ui/field/field_description" do %>
        This is your public display name.
      <% end %>
    <% end %>

    <%= render "ui/field/field" do %>
      <%= render "ui/label/label", for_id: "email", attributes: { data: { slot: "field-label" } }, content: "Email" %>
      <%= render "ui/input/input", id: "email", type: "email" %>
    <% end %>

    <%= render "ui/field/field_separator" %>

    <%= render "ui/field/field", orientation: "horizontal" do %>
      <%= render "ui/field/field_content" do %>
        <%= render "ui/label/label", for_id: "marketing", attributes: { data: { slot: "field-label" } }, content: "Marketing emails" %>
        <%= render "ui/field/field_description" do %>
          Receive emails about new products.
        <% end %>
      <% end %>
      <%= render "ui/checkbox/checkbox", id: "marketing" %>
    <% end %>
  <% end %>
<% end %>
```

## Content: Two Ways

Most Field components support both parameter and block syntax:

```erb
<%# Approach 1: content parameter %>
<%= render "ui/field/field_legend", content: "Personal Information" %>

<%# Approach 2: block (useful for HTML content) %>
<%= render "ui/field/field_legend" do %>
  Personal Information
<% end %>
```

## Integration Notes

### Always Use data-slot Attribute

For proper Field styling and behavior, always add `attributes: { data: { slot: "field-label" } }` to labels:

```erb
<%# ✅ Correct %>
<%= render "ui/label/label", for_id: "email", attributes: { data: { slot: "field-label" } }, content: "Email" %>

<%# ❌ Wrong - missing data-slot %>
<%= render "ui/label/label", for_id: "email", content: "Email" %>
```

### Container Query Support

FieldGroup uses `@container/field-group` for responsive layouts. When using `orientation: "responsive"`, wrap fields in a FieldGroup:

```erb
<%= render "ui/field/field_group" do %>
  <%= render "ui/field/field", orientation: "responsive" do %>
    <%# Field content %>
  <% end %>
<% end %>
```

### Validation State

Set `attributes: { "data-invalid": true }` on Field to enable error styling:

```erb
<%= render "ui/field/field", attributes: { "data-invalid": true } do %>
  <%# Input and error message %>
<% end %>
```

## Error Prevention

### ❌ Wrong: Using Phlex syntax

```erb
<%= render UI::Field::Set.new { "Content" } %>
# ERROR: This is Phlex syntax, not ERB
```

### ✅ Correct: Use string path

```erb
<%= render "ui/field/field_set" do %>
  Content
<% end %>  # Correct!
```

### ❌ Wrong: Incorrect partial path

```erb
<%= render "ui/field" do %>
  <%# Content %>
<% end %>
# ERROR: Missing /field suffix - renders field/field.html.erb, not field.html.erb
```

### ✅ Correct: Full partial path

```erb
<%= render "ui/field/field" do %>
  <%# Content %>
<% end %>  # Correct!
```

### ❌ Wrong: Missing data-slot attribute

```erb
<%= render "ui/label/label", for_id: "email", content: "Email" %>
# Label won't have proper Field styling
```

### ✅ Correct: Include data-slot

```erb
<%= render "ui/label/label", for_id: "email", attributes: { data: { slot: "field-label" } }, content: "Email" %>  # Correct!
```

### ❌ Wrong: Using Content outside horizontal layout

```erb
<%= render "ui/field/field" do %>
  <%= render "ui/field/field_content" do %>
    <%= render "ui/label/label", for_id: "email", attributes: { data: { slot: "field-label" } }, content: "Email" %>
  <% end %>
  <%= render "ui/input/input", id: "email" %>
<% end %>
# Content is mainly for horizontal layouts with switches/checkboxes
```

### ✅ Correct: Content for horizontal checkbox/switch

```erb
<%= render "ui/field/field", orientation: "horizontal" do %>
  <%= render "ui/field/field_content" do %>
    <%= render "ui/label/label", for_id: "notifications", attributes: { data: { slot: "field-label" } }, content: "Notifications" %>
    <%= render "ui/field/field_description" do %>
      Receive notifications.
    <% end %>
  <% end %>
  <%= render "ui/switch/switch", id: "notifications" %>
<% end %>
```

## Reference

- **shadcn/ui**: https://ui.shadcn.com/docs/components/field
- **Radix UI**: https://www.radix-ui.com/primitives (semantic HTML patterns)
