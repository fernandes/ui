# Button Group - ERB

## Component Paths

- **ButtonGroup**: `ui/button_group/button_group`
- **Separator**: `ui/button_group/separator`
- **Text**: `ui/button_group/text`

## Description

A container that groups related buttons together with consistent styling.

## Basic Usage

```erb
<%= render "ui/button_group/button_group" do %>
  <%= render "ui/button/button", variant: :outline do %>Button 1<% end %>
  <%= render "ui/button/button", variant: :outline do %>Button 2<% end %>
<% end %>
```

## ButtonGroup Parameters

### Required

None

### Optional

- `orientation:` Symbol - Direction of the button group
  - Options: `:horizontal`, `:vertical`
  - Default: `:horizontal`

- `classes:` String - Additional Tailwind CSS classes

- Additional HTML attributes can be passed directly (id, data, aria, etc.)

## ButtonGroupSeparator Parameters

### Optional

- `orientation:` Symbol - Direction of the separator
  - Options: `:horizontal`, `:vertical`
  - Default: `:vertical`

- `classes:` String - Additional Tailwind CSS classes

- Additional HTML attributes can be passed directly

## ButtonGroupText Parameters

### Optional

- `classes:` String - Additional Tailwind CSS classes

- Additional HTML attributes can be passed directly

## Examples

### Basic Button Group

```erb
<%= render "ui/button_group/button_group" do %>
  <%= render "ui/button/button", variant: :outline do %>Archive<% end %>
  <%= render "ui/button/button", variant: :outline do %>Report<% end %>
<% end %>
```

### Vertical Orientation

```erb
<%= render "ui/button_group/button_group", orientation: :vertical, classes: "h-fit" do %>
  <%= render "ui/button/button", variant: :outline, size: :icon do %>
    <!-- Plus icon SVG -->
  <% end %>
  <%= render "ui/button/button", variant: :outline, size: :icon do %>
    <!-- Minus icon SVG -->
  <% end %>
<% end %>
```

### Different Sizes

```erb
<!-- Small size -->
<%= render "ui/button_group/button_group" do %>
  <%= render "ui/button/button", variant: :outline, size: :sm do %>Small<% end %>
  <%= render "ui/button/button", variant: :outline, size: :sm do %>Button<% end %>
  <%= render "ui/button/button", variant: :outline, size: :sm do %>Group<% end %>
<% end %>

<!-- Default size -->
<%= render "ui/button_group/button_group" do %>
  <%= render "ui/button/button", variant: :outline do %>Default<% end %>
  <%= render "ui/button/button", variant: :outline do %>Button<% end %>
  <%= render "ui/button/button", variant: :outline do %>Group<% end %>
<% end %>

<!-- Large size -->
<%= render "ui/button_group/button_group" do %>
  <%= render "ui/button/button", variant: :outline, size: :lg do %>Large<% end %>
  <%= render "ui/button/button", variant: :outline, size: :lg do %>Button<% end %>
  <%= render "ui/button/button", variant: :outline, size: :lg do %>Group<% end %>
<% end %>
```

### Nested Button Groups

```erb
<!-- Create spacing between button groups -->
<%= render "ui/button_group/button_group" do %>
  <%= render "ui/button_group/button_group" do %>
    <%= render "ui/button/button", variant: :outline, size: :sm do %>1<% end %>
    <%= render "ui/button/button", variant: :outline, size: :sm do %>2<% end %>
    <%= render "ui/button/button", variant: :outline, size: :sm do %>3<% end %>
  <% end %>

  <%= render "ui/button_group/button_group" do %>
    <%= render "ui/button/button", variant: :outline, size: "icon-sm" do %>
      <!-- Previous icon SVG -->
    <% end %>
    <%= render "ui/button/button", variant: :outline, size: "icon-sm" do %>
      <!-- Next icon SVG -->
    <% end %>
  <% end %>
<% end %>
```

### With Separator

```erb
<!-- Use separator for non-outline variants -->
<%= render "ui/button_group/button_group" do %>
  <%= render "ui/button/button", variant: :secondary, size: :sm do %>Copy<% end %>
  <%= render "ui/button_group/separator" %>
  <%= render "ui/button/button", variant: :secondary, size: :sm do %>Paste<% end %>
<% end %>
```

### Split Button

```erb
<%= render "ui/button_group/button_group" do %>
  <%= render "ui/button/button", variant: :secondary do %>Button<% end %>
  <%= render "ui/button_group/separator" %>
  <%= render "ui/button/button", size: :icon, variant: :secondary do %>
    <!-- Plus icon SVG -->
  <% end %>
<% end %>
```

### With Input

```erb
<%= render "ui/button_group/button_group" do %>
  <input type="text" placeholder="Search..." class="...">
  <%= render "ui/button/button", variant: :outline, "aria-label": "Search" do %>
    <!-- Search icon SVG -->
  <% end %>
<% end %>
```

### With Text

```erb
<%= render "ui/button_group/button_group" do %>
  <%= render "ui/button_group/text" do %>Label<% end %>
  <%= render "ui/button/button", variant: :outline do %>Button<% end %>
<% end %>
```

## Accessibility

- **ARIA**: The button group has `role="group"`
- **Navigation**: Use Tab to navigate between buttons
- **Labeling**: Use `aria-label` or `aria-labelledby` to label the button group

```erb
<%= render "ui/button_group/button_group", "aria-label": "Button group" do %>
  <%= render "ui/button/button", variant: :outline do %>Button 1<% end %>
  <%= render "ui/button/button", variant: :outline do %>Button 2<% end %>
<% end %>
```

## ButtonGroup vs ToggleGroup

- Use `button_group` when buttons **perform an action**
- Use `toggle_group` when buttons **toggle a state**

## Common Mistakes

### ❌ Wrong: Missing underscore in partial name

```erb
<%= render "ui/buttongroup/buttongroup" %>  <!-- Wrong path -->
```

### ✅ Correct: Use underscores in path

```erb
<%= render "ui/button_group/button_group" %>  <!-- Correct! -->
```

### ❌ Wrong: Adding separator to outline buttons

```erb
<!-- Unnecessary - outline buttons already have borders -->
<%= render "ui/button_group/button_group" do %>
  <%= render "ui/button/button", variant: :outline do %>Copy<% end %>
  <%= render "ui/button_group/separator" %>  <!-- Not needed! -->
  <%= render "ui/button/button", variant: :outline do %>Paste<% end %>
<% end %>
```

### ✅ Correct: Use separator for non-outline variants only

```erb
<%= render "ui/button_group/button_group" do %>
  <%= render "ui/button/button", variant: :secondary do %>Copy<% end %>
  <%= render "ui/button_group/separator" %>  <!-- Needed for visual hierarchy -->
  <%= render "ui/button/button", variant: :secondary do %>Paste<% end %>
<% end %>
```

## See Also

- shadcn/ui: https://ui.shadcn.com/docs/components/button-group
- Button component: `docs/llm/erb/button.md`
- Separator component: `docs/llm/erb/separator.md`
