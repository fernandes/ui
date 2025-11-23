# Tabs Component - ERB

Tabbed interface with keyboard navigation and ARIA support.

## Basic Usage

```erb
<%= render "ui/tabs/tabs", default_value: "account" do %>
  <%= render "ui/tabs/tabs_list" do %>
    <%= render "ui/tabs/tabs_trigger", value: "account", content: "Account" %>
    <%= render "ui/tabs/tabs_trigger", value: "password", content: "Password" %>
  <% end %>
  <%= render "ui/tabs/tabs_content", value: "account" do %>
    Account settings content
  <% end %>
  <%= render "ui/tabs/tabs_content", value: "password" do %>
    Password settings content
  <% end %>
<% end %>
```

## Component Structure

The tabs component consists of 4 nested components:

1. **tabs** - Root container with state management
2. **tabs_list** - Container for tab triggers
3. **tabs_trigger** - Individual tab button
4. **tabs_content** - Content panel for each tab

## Components

### tabs (Root)

**Partial**: `ui/tabs/tabs`

**Parameters**:
- `default_value:` - **Required** - Initial active tab value
- `orientation:` - `"horizontal"` (default) or `"vertical"` - Tab orientation
- `activation_mode:` - `"automatic"` (default) or `"manual"` - Keyboard navigation mode
- `classes:` - Additional CSS classes
- `attributes:` - Additional HTML attributes (Hash)

**Context Variables Passed to Children**:
- `@_tabs_default_value` - Default active tab value
- `@_tabs_orientation` - Orientation setting

### tabs_list

**Partial**: `ui/tabs/tabs_list`

**Parameters**:
- `orientation:` - `"horizontal"` (default) or `"vertical"` - Inherits from parent if not set
- `classes:` - Additional CSS classes
- `attributes:` - Additional HTML attributes (Hash)

### tabs_trigger

**Partial**: `ui/tabs/tabs_trigger`

**Parameters**:
- `value:` - **Required** - Unique identifier for this trigger
- `default_value:` - Current active tab value (auto-passed from parent via `@_tabs_default_value`)
- `orientation:` - `"horizontal"` (default) or `"vertical"` - Inherits from parent
- `disabled:` - Boolean - Whether trigger is disabled
- `classes:` - Additional CSS classes
- `attributes:` - Additional HTML attributes (Hash)
- `content:` - Text content (alternative to block)

### tabs_content

**Partial**: `ui/tabs/tabs_content`

**Parameters**:
- `value:` - **Required** - Unique identifier for this content panel
- `default_value:` - Current active tab value (auto-passed from parent via `@_tabs_default_value`)
- `orientation:` - `"horizontal"` (default) or `"vertical"` - Inherits from parent
- `classes:` - Additional CSS classes
- `attributes:` - Additional HTML attributes (Hash)
- `content:` - Text content (alternative to block)

## Examples

### Basic Tabs (Horizontal)

```erb
<%= render "ui/tabs/tabs", default_value: "account" do %>
  <%= render "ui/tabs/tabs_list" do %>
    <%= render "ui/tabs/tabs_trigger", value: "account", content: "Account" %>
    <%= render "ui/tabs/tabs_trigger", value: "password", content: "Password" %>
  <% end %>
  <%= render "ui/tabs/tabs_content", value: "account" do %>
    <div class="space-y-4">
      <h3 class="text-lg font-medium">Account</h3>
      <p class="text-sm text-muted-foreground">
        Make changes to your account here. Click save when you're done.
      </p>
    </div>
  <% end %>
  <%= render "ui/tabs/tabs_content", value: "password" do %>
    <div class="space-y-4">
      <h3 class="text-lg font-medium">Password</h3>
      <p class="text-sm text-muted-foreground">
        Change your password here. After saving, you'll be logged out.
      </p>
    </div>
  <% end %>
<% end %>
```

### Vertical Tabs

```erb
<%= render "ui/tabs/tabs", default_value: "general", orientation: "vertical" do %>
  <%= render "ui/tabs/tabs_list", orientation: "vertical" do %>
    <%= render "ui/tabs/tabs_trigger", value: "general", content: "General" %>
    <%= render "ui/tabs/tabs_trigger", value: "security", content: "Security" %>
  <% end %>
  <%= render "ui/tabs/tabs_content", value: "general" do %>
    General settings content
  <% end %>
  <%= render "ui/tabs/tabs_content", value: "security" do %>
    Security settings content
  <% end %>
<% end %>
```

### Disabled Tab

```erb
<%= render "ui/tabs/tabs", default_value: "tab1" do %>
  <%= render "ui/tabs/tabs_list" do %>
    <%= render "ui/tabs/tabs_trigger", value: "tab1", content: "Tab 1" %>
    <%= render "ui/tabs/tabs_trigger", value: "tab2", disabled: true, content: "Tab 2 (Disabled)" %>
  <% end %>
  <%= render "ui/tabs/tabs_content", value: "tab1", content: "Content 1" %>
  <%= render "ui/tabs/tabs_content", value: "tab2", content: "Content 2" %>
<% end %>
```

### Manual Activation Mode

```erb
<%= render "ui/tabs/tabs", default_value: "tab1", activation_mode: "manual" do %>
  <%= render "ui/tabs/tabs_list" do %>
    <%= render "ui/tabs/tabs_trigger", value: "tab1", content: "Tab 1" %>
    <%= render "ui/tabs/tabs_trigger", value: "tab2", content: "Tab 2" %>
  <% end %>
  <%# In manual mode, arrow keys only focus triggers, Enter/Space activates %>
  <%= render "ui/tabs/tabs_content", value: "tab1", content: "Content 1" %>
  <%= render "ui/tabs/tabs_content", value: "tab2", content: "Content 2" %>
<% end %>
```

### Using Blocks Instead of content Parameter

```erb
<%= render "ui/tabs/tabs", default_value: "account" do %>
  <%= render "ui/tabs/tabs_list" do %>
    <%= render "ui/tabs/tabs_trigger", value: "account" do %>
      <svg class="size-4"><use href="#account-icon"/></svg>
      <span>Account</span>
    <% end %>
    <%= render "ui/tabs/tabs_trigger", value: "password" do %>
      <svg class="size-4"><use href="#lock-icon"/></svg>
      <span>Password</span>
    <% end %>
  <% end %>
  <%= render "ui/tabs/tabs_content", value: "account" do %>
    <div class="space-y-4">
      <!-- Complex content with forms, etc. -->
    </div>
  <% end %>
  <%= render "ui/tabs/tabs_content", value: "password" do %>
    <div class="space-y-4">
      <!-- Complex content with forms, etc. -->
    </div>
  <% end %>
<% end %>
```

## Important Notes

### ✅ ERB Auto-Passes Context

ERB partials automatically pass context variables to children via instance variables:
- `@_tabs_default_value` - Auto-passed to trigger and content
- `@_tabs_orientation` - Auto-passed to list, trigger, and content

You **don't need** to manually pass `default_value` or `orientation` to children!

```erb
<%# ✅ Correct - context is auto-passed %>
<%= render "ui/tabs/tabs", default_value: "account" do %>
  <%= render "ui/tabs/tabs_trigger", value: "account", content: "Account" %>
  <%= render "ui/tabs/tabs_content", value: "account", content: "Account settings" %>
<% end %>

<%# Also works - but redundant %>
<%= render "ui/tabs/tabs", default_value: "account" do %>
  <%= render "ui/tabs/tabs_trigger", value: "account", default_value: "account", content: "Account" %>
<% end %>
```

### Tab Values Must Be Unique

Each trigger and content must have matching unique `value` attributes:

```erb
<%# ✅ Correct - matching values %>
<%= render "ui/tabs/tabs_trigger", value: "account", content: "Account" %>
<%= render "ui/tabs/tabs_content", value: "account", content: "Account content" %>

<%# ❌ Wrong - mismatched values %>
<%= render "ui/tabs/tabs_trigger", value: "account", content: "Account" %>
<%= render "ui/tabs/tabs_content", value: "settings", content: "Content" %>  <%# Won't show! %>
```

### Default Value Must Match a Tab

The `default_value` must match one of the trigger values:

```erb
<%# ✅ Correct - default_value matches a trigger %>
<%= render "ui/tabs/tabs", default_value: "account" do %>
  <%= render "ui/tabs/tabs_trigger", value: "account", content: "Account" %>
<% end %>

<%# ❌ Wrong - default_value doesn't match any trigger %>
<%= render "ui/tabs/tabs", default_value: "invalid" do %>
  <%= render "ui/tabs/tabs_trigger", value: "account", content: "Account" %>
<% end %>
```

## Keyboard Navigation

### Horizontal Tabs (default)
- **Tab** - Focuses active trigger; Shift+Tab focuses active content
- **ArrowRight** - Moves focus to next trigger (activates in automatic mode)
- **ArrowLeft** - Moves focus to previous trigger (activates in automatic mode)
- **Home** - Focuses first trigger (and activates in automatic mode)
- **End** - Focuses last trigger (and activates in automatic mode)

### Vertical Tabs
- **Tab** - Focuses active trigger; Shift+Tab focuses active content
- **ArrowDown** - Moves focus to next trigger (activates in automatic mode)
- **ArrowUp** - Moves focus to previous trigger (activates in automatic mode)
- **Home** - Focuses first trigger (and activates in automatic mode)
- **End** - Focuses last trigger (and activates in automatic mode)

### Activation Modes
- **Automatic** (default) - Arrow keys focus AND activate trigger
- **Manual** - Arrow keys only focus, Enter/Space activates

## Accessibility

- Full ARIA support with `role="tablist"`, `role="tab"`, `role="tabpanel"`
- Proper `aria-selected`, `aria-controls`, `aria-labelledby` attributes
- Keyboard navigation following WAI-ARIA Tabs pattern
- Disabled state support
- Orientation-aware keyboard navigation

## Styling

The component uses shadcn/ui styling with Tailwind classes:
- Active tab: `data-[state=active]:bg-background data-[state=active]:text-foreground`
- Inactive tab: Muted colors
- Focus ring: `focus-visible:ring-2 focus-visible:ring-ring/50`

## Error Prevention

### ❌ Wrong: Mismatched trigger and content values

```erb
<%= render "ui/tabs/tabs_trigger", value: "account", content: "Account" %>
<%= render "ui/tabs/tabs_content", value: "profile", content: "Content" %>
# Content won't show for this trigger!
```

### ✅ Correct: Matching values

```erb
<%= render "ui/tabs/tabs_trigger", value: "account", content: "Account" %>
<%= render "ui/tabs/tabs_content", value: "account", content: "Content" %>
```

### ❌ Wrong: Missing value attribute

```erb
<%= render "ui/tabs/tabs_trigger", content: "Account" %>
# No value specified, won't work!
```

### ✅ Correct: Always specify value

```erb
<%= render "ui/tabs/tabs_trigger", value: "account", content: "Account" %>
```
