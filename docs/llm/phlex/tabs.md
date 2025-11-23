# Tabs Component - Phlex

Tabbed interface with keyboard navigation and ARIA support.

## Basic Usage

```ruby
<%= render UI::Tabs::Tabs.new(default_value: "account") do %>
  <%= render UI::Tabs::List.new do %>
    <%= render UI::Tabs::Trigger.new(value: "account", default_value: "account") { "Account" } %>
    <%= render UI::Tabs::Trigger.new(value: "password", default_value: "account") { "Password" } %>
  <% end %>
  <%= render UI::Tabs::Content.new(value: "account", default_value: "account") do %>
    Account settings content
  <% end %>
  <%= render UI::Tabs::Content.new(value: "password", default_value: "account") do %>
    Password settings content
  <% end %>
<% end %>
```

## Component Structure

The tabs component consists of 4 nested components:

1. **Tabs** - Root container with state management
2. **List** - Container for tab triggers
3. **Trigger** - Individual tab button
4. **Content** - Content panel for each tab

## Components

### Tabs (Root)

**Class**: `UI::Tabs::Tabs`

**Parameters**:
- `default_value:` - **Required** - Initial active tab value
- `orientation:` - `"horizontal"` (default) or `"vertical"` - Tab orientation
- `activation_mode:` - `"automatic"` (default) or `"manual"` - Keyboard navigation mode
- `classes:` - Additional CSS classes
- `**attributes` - Additional HTML attributes

### List

**Class**: `UI::Tabs::List`

**Parameters**:
- `orientation:` - `"horizontal"` (default) or `"vertical"`
- `classes:` - Additional CSS classes
- `**attributes` - Additional HTML attributes

### Trigger

**Class**: `UI::Tabs::Trigger`

**Parameters**:
- `value:` - **Required** - Unique identifier for this trigger
- `default_value:` - Current active tab value (must pass explicitly in Phlex)
- `orientation:` - `"horizontal"` (default) or `"vertical"`
- `disabled:` - Boolean - Whether trigger is disabled
- `classes:` - Additional CSS classes
- `**attributes` - Additional HTML attributes

### Content

**Class**: `UI::Tabs::Content`

**Parameters**:
- `value:` - **Required** - Unique identifier for this content panel
- `default_value:` - Current active tab value (must pass explicitly in Phlex)
- `orientation:` - `"horizontal"` (default) or `"vertical"`
- `classes:` - Additional CSS classes
- `**attributes` - Additional HTML attributes

## Examples

### Basic Tabs (Horizontal)

```ruby
<%= render UI::Tabs::Tabs.new(default_value: "account") do %>
  <%= render UI::Tabs::List.new do %>
    <%= render UI::Tabs::Trigger.new(value: "account", default_value: "account") { "Account" } %>
    <%= render UI::Tabs::Trigger.new(value: "password", default_value: "account") { "Password" } %>
  <% end %>
  <%= render UI::Tabs::Content.new(value: "account", default_value: "account") do %>
    <div class="space-y-4">
      <h3 class="text-lg font-medium">Account</h3>
      <p class="text-sm text-muted-foreground">
        Make changes to your account here. Click save when you're done.
      </p>
    </div>
  <% end %>
  <%= render UI::Tabs::Content.new(value: "password", default_value: "account") do %>
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

```ruby
<%= render UI::Tabs::Tabs.new(default_value: "general", orientation: "vertical") do %>
  <%= render UI::Tabs::List.new(orientation: "vertical") do %>
    <%= render UI::Tabs::Trigger.new(value: "general", default_value: "general", orientation: "vertical") do %>
      General
    <% end %>
    <%= render UI::Tabs::Trigger.new(value: "security", default_value: "general", orientation: "vertical") do %>
      Security
    <% end %>
  <% end %>
  <%= render UI::Tabs::Content.new(value: "general", default_value: "general", orientation: "vertical") do %>
    General settings content
  <% end %>
  <%= render UI::Tabs::Content.new(value: "security", default_value: "general", orientation: "vertical") do %>
    Security settings content
  <% end %>
<% end %>
```

### Disabled Tab

```ruby
<%= render UI::Tabs::Tabs.new(default_value: "tab1") do %>
  <%= render UI::Tabs::List.new do %>
    <%= render UI::Tabs::Trigger.new(value: "tab1", default_value: "tab1") { "Tab 1" } %>
    <%= render UI::Tabs::Trigger.new(value: "tab2", default_value: "tab1", disabled: true) do %>
      Tab 2 (Disabled)
    <% end %>
  <% end %>
  <%= render UI::Tabs::Content.new(value: "tab1", default_value: "tab1") { "Content 1" } %>
  <%= render UI::Tabs::Content.new(value: "tab2", default_value: "tab1") { "Content 2" } %>
<% end %>
```

### Manual Activation Mode

```ruby
<%= render UI::Tabs::Tabs.new(default_value: "tab1", activation_mode: "manual") do %>
  <%= render UI::Tabs::List.new do %>
    <%= render UI::Tabs::Trigger.new(value: "tab1", default_value: "tab1") { "Tab 1" } %>
    <%= render UI::Tabs::Trigger.new(value: "tab2", default_value: "tab1") { "Tab 2" } %>
  <% end %>
  <%# In manual mode, arrow keys only focus triggers, Enter/Space activates %>
  <%= render UI::Tabs::Content.new(value: "tab1", default_value: "tab1") { "Content 1" } %>
  <%= render UI::Tabs::Content.new(value: "tab2", default_value: "tab1") { "Content 2" } %>
<% end %>
```

## Important Notes

### ⚠️ Phlex Requires Explicit Parameter Passing

Unlike ERB partials, Phlex components don't automatically pass context to children. You **must** explicitly pass `default_value` to Trigger and Content:

```ruby
<%# ✅ Correct - explicit default_value %>
<%= render UI::Tabs::Tabs.new(default_value: "account") do %>
  <%= render UI::Tabs::Trigger.new(value: "account", default_value: "account") { "Account" } %>
  <%= render UI::Tabs::Content.new(value: "account", default_value: "account") { "Content" } %>
<% end %>

<%# ❌ Wrong - missing default_value %>
<%= render UI::Tabs::Tabs.new(default_value: "account") do %>
  <%= render UI::Tabs::Trigger.new(value: "account") { "Account" } %>  <%# Missing default_value! %>
  <%= render UI::Tabs::Content.new(value: "account") { "Content" } %>  <%# Missing default_value! %>
<% end %>
```

### Tab Values Must Be Unique

Each Trigger and Content must have matching unique `value` attributes:

```ruby
<%# ✅ Correct - matching values %>
<%= render UI::Tabs::Trigger.new(value: "account", default_value: "account") { "Account" } %>
<%= render UI::Tabs::Content.new(value: "account", default_value: "account") { "Account content" } %>

<%# ❌ Wrong - mismatched values %>
<%= render UI::Tabs::Trigger.new(value: "account", default_value: "account") { "Account" } %>
<%= render UI::Tabs::Content.new(value: "settings", default_value: "account") { "Content" } %>  <%# Won't show! %>
```

### Default Value Must Match a Tab

The `default_value` must match one of the trigger values:

```ruby
<%# ✅ Correct - default_value matches a trigger %>
<%= render UI::Tabs::Tabs.new(default_value: "account") do %>
  <%= render UI::Tabs::Trigger.new(value: "account", default_value: "account") { "Account" } %>
<% end %>

<%# ❌ Wrong - default_value doesn't match any trigger %>
<%= render UI::Tabs::Tabs.new(default_value: "invalid") do %>
  <%= render UI::Tabs::Trigger.new(value: "account", default_value: "invalid") { "Account" } %>
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

### ❌ Wrong: Missing default_value in children

```ruby
<%= render UI::Tabs::Trigger.new(value: "account") { "Account" } %>
# Won't know which tab is active initially
```

### ✅ Correct: Pass default_value explicitly

```ruby
<%= render UI::Tabs::Trigger.new(value: "account", default_value: "account") { "Account" } %>
```

### ❌ Wrong: Mismatched trigger and content values

```ruby
<%= render UI::Tabs::Trigger.new(value: "account", default_value: "account") { "Account" } %>
<%= render UI::Tabs::Content.new(value: "profile", default_value: "account") { "Content" } %>
# Content won't show for this trigger!
```

### ✅ Correct: Matching values

```ruby
<%= render UI::Tabs::Trigger.new(value: "account", default_value: "account") { "Account" } %>
<%= render UI::Tabs::Content.new(value: "account", default_value: "account") { "Content" } %>
```
