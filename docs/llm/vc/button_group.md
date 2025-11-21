# Button Group - ViewComponent

## Component Paths

- **ButtonGroup**: `UI::ButtonGroup::ButtonGroupComponent`
- **Separator**: `UI::ButtonGroup::SeparatorComponent`
- **Text**: `UI::ButtonGroup::TextComponent`

## Description

A container that groups related buttons together with consistent styling.

## Basic Usage

```erb
<%= render UI::ButtonGroup::ButtonGroupComponent.new do %>
  <%= render UI::Button::ButtonComponent.new(variant: :outline) { "Button 1" } %>
  <%= render UI::Button::ButtonComponent.new(variant: :outline) { "Button 2" } %>
<% end %>
```

## ButtonGroupComponent Parameters

### Required

None

### Optional

- `orientation:` Symbol - Direction of the button group
  - Options: `:horizontal`, `:vertical`
  - Default: `:horizontal`

- `classes:` String - Additional Tailwind CSS classes

- `**attributes` Hash - Any additional HTML attributes (id, data, aria, etc.)

## SeparatorComponent Parameters

### Optional

- `orientation:` Symbol - Direction of the separator
  - Options: `:horizontal`, `:vertical`
  - Default: `:vertical`

- `classes:` String - Additional Tailwind CSS classes

- `**attributes` Hash - Any additional HTML attributes

## TextComponent Parameters

### Optional

- `classes:` String - Additional Tailwind CSS classes

- `**attributes` Hash - Any additional HTML attributes

## Examples

### Basic Button Group

```erb
<%= render UI::ButtonGroup::ButtonGroupComponent.new do %>
  <%= render UI::Button::ButtonComponent.new(variant: :outline) { "Archive" } %>
  <%= render UI::Button::ButtonComponent.new(variant: :outline) { "Report" } %>
<% end %>
```

### Vertical Orientation

```erb
<%= render UI::ButtonGroup::ButtonGroupComponent.new(orientation: :vertical, classes: "h-fit") do %>
  <%= render UI::Button::ButtonComponent.new(variant: :outline, size: :icon) do %>
    <!-- Plus icon SVG -->
  <% end %>
  <%= render UI::Button::ButtonComponent.new(variant: :outline, size: :icon) do %>
    <!-- Minus icon SVG -->
  <% end %>
<% end %>
```

### Different Sizes

```erb
<!-- Small size -->
<%= render UI::ButtonGroup::ButtonGroupComponent.new do %>
  <%= render UI::Button::ButtonComponent.new(variant: :outline, size: :sm) { "Small" } %>
  <%= render UI::Button::ButtonComponent.new(variant: :outline, size: :sm) { "Button" } %>
  <%= render UI::Button::ButtonComponent.new(variant: :outline, size: :sm) { "Group" } %>
<% end %>

<!-- Default size -->
<%= render UI::ButtonGroup::ButtonGroupComponent.new do %>
  <%= render UI::Button::ButtonComponent.new(variant: :outline) { "Default" } %>
  <%= render UI::Button::ButtonComponent.new(variant: :outline) { "Button" } %>
  <%= render UI::Button::ButtonComponent.new(variant: :outline) { "Group" } %>
<% end %>

<!-- Large size -->
<%= render UI::ButtonGroup::ButtonGroupComponent.new do %>
  <%= render UI::Button::ButtonComponent.new(variant: :outline, size: :lg) { "Large" } %>
  <%= render UI::Button::ButtonComponent.new(variant: :outline, size: :lg) { "Button" } %>
  <%= render UI::Button::ButtonComponent.new(variant: :outline, size: :lg) { "Group" } %>
<% end %>
```

### Nested Button Groups

```erb
<!-- Create spacing between button groups -->
<%= render UI::ButtonGroup::ButtonGroupComponent.new do %>
  <%= render UI::ButtonGroup::ButtonGroupComponent.new do %>
    <%= render UI::Button::ButtonComponent.new(variant: :outline, size: :sm) { "1" } %>
    <%= render UI::Button::ButtonComponent.new(variant: :outline, size: :sm) { "2" } %>
    <%= render UI::Button::ButtonComponent.new(variant: :outline, size: :sm) { "3" } %>
  <% end %>

  <%= render UI::ButtonGroup::ButtonGroupComponent.new do %>
    <%= render UI::Button::ButtonComponent.new(variant: :outline, size: :"icon-sm") do %>
      <!-- Previous icon SVG -->
    <% end %>
    <%= render UI::Button::ButtonComponent.new(variant: :outline, size: :"icon-sm") do %>
      <!-- Next icon SVG -->
    <% end %>
  <% end %>
<% end %>
```

### With Separator

```erb
<!-- Use separator for non-outline variants -->
<%= render UI::ButtonGroup::ButtonGroupComponent.new do %>
  <%= render UI::Button::ButtonComponent.new(variant: :secondary, size: :sm) { "Copy" } %>
  <%= render UI::ButtonGroup::SeparatorComponent.new %>
  <%= render UI::Button::ButtonComponent.new(variant: :secondary, size: :sm) { "Paste" } %>
<% end %>
```

### Split Button

```erb
<%= render UI::ButtonGroup::ButtonGroupComponent.new do %>
  <%= render UI::Button::ButtonComponent.new(variant: :secondary) { "Button" } %>
  <%= render UI::ButtonGroup::SeparatorComponent.new %>
  <%= render UI::Button::ButtonComponent.new(size: :icon, variant: :secondary) do %>
    <!-- Plus icon SVG -->
  <% end %>
<% end %>
```

### With Input

```erb
<%= render UI::ButtonGroup::ButtonGroupComponent.new do %>
  <input type="text" placeholder="Search..." class="...">
  <%= render UI::Button::ButtonComponent.new(variant: :outline, attributes: { "aria-label": "Search" }) do %>
    <!-- Search icon SVG -->
  <% end %>
<% end %>
```

### With Text

```erb
<%= render UI::ButtonGroup::ButtonGroupComponent.new do %>
  <%= render UI::ButtonGroup::TextComponent.new { "Label" } %>
  <%= render UI::Button::ButtonComponent.new(variant: :outline) { "Button" } %>
<% end %>
```

## Accessibility

- **ARIA**: The button group has `role="group"`
- **Navigation**: Use Tab to navigate between buttons
- **Labeling**: Use `aria-label` or `aria-labelledby` to label the button group

```erb
<%= render UI::ButtonGroup::ButtonGroupComponent.new(attributes: { "aria-label": "Button group" }) do %>
  <%= render UI::Button::ButtonComponent.new(variant: :outline) { "Button 1" } %>
  <%= render UI::Button::ButtonComponent.new(variant: :outline) { "Button 2" } %>
<% end %>
```

## ButtonGroup vs ToggleGroup

- Use `ButtonGroupComponent` when buttons **perform an action**
- Use `ToggleGroupComponent` when buttons **toggle a state**

## Common Mistakes

### ❌ Wrong: Using module instead of component class

```erb
<%= render UI::ButtonGroup.new %>  <!-- ERROR: undefined method 'new' for module -->
```

### ✅ Correct: Use full component class name

```erb
<%= render UI::ButtonGroup::ButtonGroupComponent.new %>  <!-- Correct! -->
```

### ❌ Wrong: Adding separator to outline buttons

```erb
<!-- Unnecessary - outline buttons already have borders -->
<%= render UI::ButtonGroup::ButtonGroupComponent.new do %>
  <%= render UI::Button::ButtonComponent.new(variant: :outline) { "Copy" } %>
  <%= render UI::ButtonGroup::SeparatorComponent.new %>  <!-- Not needed! -->
  <%= render UI::Button::ButtonComponent.new(variant: :outline) { "Paste" } %>
<% end %>
```

### ✅ Correct: Use separator for non-outline variants only

```erb
<%= render UI::ButtonGroup::ButtonGroupComponent.new do %>
  <%= render UI::Button::ButtonComponent.new(variant: :secondary) { "Copy" } %>
  <%= render UI::ButtonGroup::SeparatorComponent.new %>  <!-- Needed for visual hierarchy -->
  <%= render UI::Button::ButtonComponent.new(variant: :secondary) { "Paste" } %>
<% end %>
```

## See Also

- shadcn/ui: https://ui.shadcn.com/docs/components/button-group
- Button component: `docs/llm/vc/button.md`
- Separator component: `docs/llm/vc/separator.md`
