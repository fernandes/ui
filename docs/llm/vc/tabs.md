# Tabs Component - ViewComponent

Tabbed interface with keyboard navigation and ARIA support.

## Basic Usage

```erb
<%= render UI::Tabs::TabsComponent.new(default_value: "account") do %>
  <%= render UI::Tabs::TabsListComponent.new do %>
    <%= render UI::Tabs::TabsTriggerComponent.new(value: "account", default_value: "account") do %>
      Account
    <% end %>
    <%= render UI::Tabs::TabsTriggerComponent.new(value: "password", default_value: "account") do %>
      Password
    <% end %>
  <% end %>
  <%= render UI::Tabs::TabsContentComponent.new(value: "account", default_value: "account") do %>
    Account settings content
  <% end %>
  <%= render UI::Tabs::TabsContentComponent.new(value: "password", default_value: "account") do %>
    Password settings content
  <% end %>
<% end %>
```

## Component Structure

The tabs component consists of 4 nested components:

1. **TabsComponent** - Root container with state management
2. **TabsListComponent** - Container for tab triggers
3. **TabsTriggerComponent** - Individual tab button
4. **TabsContentComponent** - Content panel for each tab

## Components

### TabsComponent (Root)

**Class**: `UI::Tabs::TabsComponent`

**Parameters**:
- `default_value:` - **Required** - Initial active tab value
- `orientation:` - `"horizontal"` (default) or `"vertical"` - Tab orientation
- `activation_mode:` - `"automatic"` (default) or `"manual"` - Keyboard navigation mode
- `classes:` - Additional CSS classes (String)
- `attributes:` - Additional HTML attributes (Hash)

### TabsListComponent

**Class**: `UI::Tabs::TabsListComponent`

**Parameters**:
- `orientation:` - `"horizontal"` (default) or `"vertical"`
- `classes:` - Additional CSS classes (String)
- `attributes:` - Additional HTML attributes (Hash)

### TabsTriggerComponent

**Class**: `UI::Tabs::TabsTriggerComponent`

**Parameters**:
- `value:` - **Required** - Unique identifier for this trigger
- `default_value:` - Current active tab value (must pass explicitly in ViewComponent)
- `orientation:` - `"horizontal"` (default) or `"vertical"`
- `disabled:` - Boolean - Whether trigger is disabled
- `classes:` - Additional CSS classes (String)
- `attributes:` - Additional HTML attributes (Hash)

### TabsContentComponent

**Class**: `UI::Tabs::TabsContentComponent`

**Parameters**:
- `value:` - **Required** - Unique identifier for this content panel
- `default_value:` - Current active tab value (must pass explicitly in ViewComponent)
- `orientation:` - `"horizontal"` (default) or `"vertical"`
- `classes:` - Additional CSS classes (String)
- `attributes:` - Additional HTML attributes (Hash)

## Examples

### Basic Tabs (Horizontal)

```erb
<%= render UI::Tabs::TabsComponent.new(default_value: "account") do %>
  <%= render UI::Tabs::TabsListComponent.new do %>
    <%= render UI::Tabs::TabsTriggerComponent.new(value: "account", default_value: "account") do %>
      Account
    <% end %>
    <%= render UI::Tabs::TabsTriggerComponent.new(value: "password", default_value: "account") do %>
      Password
    <% end %>
  <% end %>
  <%= render UI::Tabs::TabsContentComponent.new(value: "account", default_value: "account") do %>
    <div class="space-y-4">
      <h3 class="text-lg font-medium">Account</h3>
      <p class="text-sm text-muted-foreground">
        Make changes to your account here. Click save when you're done.
      </p>
    </div>
  <% end %>
  <%= render UI::Tabs::TabsContentComponent.new(value: "password", default_value: "account") do %>
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
<%= render UI::Tabs::TabsComponent.new(default_value: "general", orientation: "vertical") do %>
  <%= render UI::Tabs::TabsListComponent.new(orientation: "vertical") do %>
    <%= render UI::Tabs::TabsTriggerComponent.new(value: "general", default_value: "general", orientation: "vertical") do %>
      General
    <% end %>
    <%= render UI::Tabs::TabsTriggerComponent.new(value: "security", default_value: "general", orientation: "vertical") do %>
      Security
    <% end %>
  <% end %>
  <%= render UI::Tabs::TabsContentComponent.new(value: "general", default_value: "general", orientation: "vertical") do %>
    General settings content
  <% end %>
  <%= render UI::Tabs::TabsContentComponent.new(value: "security", default_value: "general", orientation: "vertical") do %>
    Security settings content
  <% end %>
<% end %>
```

### Disabled Tab

```erb
<%= render UI::Tabs::TabsComponent.new(default_value: "tab1") do %>
  <%= render UI::Tabs::TabsListComponent.new do %>
    <%= render UI::Tabs::TabsTriggerComponent.new(value: "tab1", default_value: "tab1") do %>
      Tab 1
    <% end %>
    <%= render UI::Tabs::TabsTriggerComponent.new(value: "tab2", default_value: "tab1", disabled: true) do %>
      Tab 2 (Disabled)
    <% end %>
  <% end %>
  <%= render UI::Tabs::TabsContentComponent.new(value: "tab1", default_value: "tab1") do %>
    Content 1
  <% end %>
  <%= render UI::Tabs::TabsContentComponent.new(value: "tab2", default_value: "tab1") do %>
    Content 2
  <% end %>
<% end %>
```

### Manual Activation Mode

```erb
<%= render UI::Tabs::TabsComponent.new(default_value: "tab1", activation_mode: "manual") do %>
  <%= render UI::Tabs::TabsListComponent.new do %>
    <%= render UI::Tabs::TabsTriggerComponent.new(value: "tab1", default_value: "tab1") do %>
      Tab 1
    <% end %>
    <%= render UI::Tabs::TabsTriggerComponent.new(value: "tab2", default_value: "tab1") do %>
      Tab 2
    <% end %>
  <% end %>
  <%# In manual mode, arrow keys only focus triggers, Enter/Space activates %>
  <%= render UI::Tabs::TabsContentComponent.new(value: "tab1", default_value: "tab1") do %>
    Content 1
  <% end %>
  <%= render UI::Tabs::TabsContentComponent.new(value: "tab2", default_value: "tab1") do %>
    Content 2
  <% end %>
<% end %>
```

## Important Notes

### ⚠️ ViewComponent Requires Explicit Parameter Passing

Unlike ERB partials, ViewComponent doesn't automatically pass context to children. You **must** explicitly pass `default_value` to TabsTriggerComponent and TabsContentComponent:

```erb
<%# ✅ Correct - explicit default_value %>
<%= render UI::Tabs::TabsComponent.new(default_value: "account") do %>
  <%= render UI::Tabs::TabsTriggerComponent.new(value: "account", default_value: "account") do %>
    Account
  <% end %>
  <%= render UI::Tabs::TabsContentComponent.new(value: "account", default_value: "account") do %>
    Content
  <% end %>
<% end %>

<%# ❌ Wrong - missing default_value %>
<%= render UI::Tabs::TabsComponent.new(default_value: "account") do %>
  <%= render UI::Tabs::TabsTriggerComponent.new(value: "account") do %>
    Account
  <% end %>  <%# Missing default_value! %>
  <%= render UI::Tabs::TabsContentComponent.new(value: "account") do %>
    Content
  <% end %>  <%# Missing default_value! %>
<% end %>
```

### Tab Values Must Be Unique

Each TabsTriggerComponent and TabsContentComponent must have matching unique `value` attributes:

```erb
<%# ✅ Correct - matching values %>
<%= render UI::Tabs::TabsTriggerComponent.new(value: "account", default_value: "account") { "Account" } %>
<%= render UI::Tabs::TabsContentComponent.new(value: "account", default_value: "account") { "Account content" } %>

<%# ❌ Wrong - mismatched values %>
<%= render UI::Tabs::TabsTriggerComponent.new(value: "account", default_value: "account") { "Account" } %>
<%= render UI::Tabs::TabsContentComponent.new(value: "settings", default_value: "account") { "Content" } %>  <%# Won't show! %>
```

### Default Value Must Match a Tab

The `default_value` must match one of the trigger values:

```erb
<%# ✅ Correct - default_value matches a trigger %>
<%= render UI::Tabs::TabsComponent.new(default_value: "account") do %>
  <%= render UI::Tabs::TabsTriggerComponent.new(value: "account", default_value: "account") { "Account" } %>
<% end %>

<%# ❌ Wrong - default_value doesn't match any trigger %>
<%= render UI::Tabs::TabsComponent.new(default_value: "invalid") do %>
  <%= render UI::Tabs::TabsTriggerComponent.new(value: "account", default_value: "invalid") { "Account" } %>
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

### ❌ Wrong: Using module instead of component class

```erb
<%= render UI::Tabs do %>  <%# UI::Tabs is a module! %>
```

### ✅ Correct: Use full component class name

```erb
<%= render UI::Tabs::TabsComponent.new(default_value: "account") do %>
```

### ❌ Wrong: Missing default_value in children

```erb
<%= render UI::Tabs::TabsTriggerComponent.new(value: "account") { "Account" } %>
# Won't know which tab is active initially
```

### ✅ Correct: Pass default_value explicitly

```erb
<%= render UI::Tabs::TabsTriggerComponent.new(value: "account", default_value: "account") { "Account" } %>
```

### ❌ Wrong: Mismatched trigger and content values

```erb
<%= render UI::Tabs::TabsTriggerComponent.new(value: "account", default_value: "account") { "Account" } %>
<%= render UI::Tabs::TabsContentComponent.new(value: "profile", default_value: "account") { "Content" } %>
# Content won't show for this trigger!
```

### ✅ Correct: Matching values

```erb
<%= render UI::Tabs::TabsTriggerComponent.new(value: "account", default_value: "account") { "Account" } %>
<%= render UI::Tabs::TabsContentComponent.new(value: "account", default_value: "account") { "Content" } %>
```
