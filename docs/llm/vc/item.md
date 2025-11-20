# Item Component - ViewComponent

Flexible list item component with multiple sub-components for building complex list layouts.

## Basic Usage

```ruby
<%= render UI::Item::ItemComponent.new do %>
  <%= render UI::Item::ContentComponent.new do %>
    <%= render UI::Item::TitleComponent.new { "Item Title" } %>
    <%= render UI::Item::DescriptionComponent.new { "Item description" } %>
  <% end %>
<% end %>
```

## Component Paths

### Main Components

- **Item**: `UI::Item::ItemComponent` - Main container
- **Group**: `UI::Item::GroupComponent` - Groups multiple items
- **Media**: `UI::Item::MediaComponent` - Media content (icon, image)
- **Content**: `UI::Item::ContentComponent` - Text content wrapper
- **Title**: `UI::Item::TitleComponent` - Item title
- **Description**: `UI::Item::DescriptionComponent` - Item description
- **Actions**: `UI::Item::ActionsComponent` - Action buttons container
- **Header**: `UI::Item::HeaderComponent` - Header section
- **Footer**: `UI::Item::FooterComponent` - Footer section
- **Separator**: `UI::Item::SeparatorComponent` - Visual separator

### Files

- **Components**: `app/components/ui/item/*_component.rb`
- **Behavior Modules**: `app/models/ui/item/*_behavior.rb`

## Item Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | String/Symbol | `"default"` | Visual style variant |
| `size` | String/Symbol | `"default"` | Size variant |
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

## Sub-component Parameters

All sub-components accept:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

## Variants

- `default` - Standard item with subtle background
- `outline` - Item with border
- `muted` - Item with muted background

## Sizes

- `default` - Standard padding (p-4 gap-4)
- `sm` - Compact padding (p-3 gap-3)

## Examples

### Basic Item

```ruby
<%= render UI::Item::ItemComponent.new do %>
  <%= render UI::Item::ContentComponent.new do %>
    <%= render UI::Item::TitleComponent.new { "Simple Item" } %>
    <%= render UI::Item::DescriptionComponent.new { "A basic list item" } %>
  <% end %>
<% end %>
```

### Item with Media

```ruby
<%= render UI::Item::ItemComponent.new do %>
  <%= render UI::Item::MediaComponent.new do %>
    <div class="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
      <%= lucide_icon("user", class: "w-5 h-5") %>
    </div>
  <% end %>
  <%= render UI::Item::ContentComponent.new do %>
    <%= render UI::Item::TitleComponent.new { "John Doe" } %>
    <%= render UI::Item::DescriptionComponent.new { "john.doe@example.com" } %>
  <% end %>
<% end %>
```

### Item with Actions

```ruby
<%= render UI::Item::ItemComponent.new do %>
  <%= render UI::Item::ContentComponent.new do %>
    <%= render UI::Item::TitleComponent.new { "Document.pdf" } %>
    <%= render UI::Item::DescriptionComponent.new { "Last modified 2 hours ago" } %>
  <% end %>
  <%= render UI::Item::ActionsComponent.new do %>
    <%= render UI::Button::ButtonComponent.new(variant: :ghost, size: :sm) { "Download" } %>
    <%= render UI::Button::ButtonComponent.new(variant: :ghost, size: :sm) { "Share" } %>
  <% end %>
<% end %>
```

### With Variants

```ruby
<%= render UI::Item::ItemComponent.new(variant: :default) do %>
  <%= render UI::Item::ContentComponent.new do %>
    <%= render UI::Item::TitleComponent.new { "Default Variant" } %>
  <% end %>
<% end %>

<%= render UI::Item::ItemComponent.new(variant: :outline) do %>
  <%= render UI::Item::ContentComponent.new do %>
    <%= render UI::Item::TitleComponent.new { "Outline Variant" } %>
  <% end %>
<% end %>

<%= render UI::Item::ItemComponent.new(variant: :muted) do %>
  <%= render UI::Item::ContentComponent.new do %>
    <%= render UI::Item::TitleComponent.new { "Muted Variant" } %>
  <% end %>
<% end %>
```

### With Sizes

```ruby
<%= render UI::Item::ItemComponent.new(size: :sm) do %>
  <%= render UI::Item::ContentComponent.new do %>
    <%= render UI::Item::TitleComponent.new { "Small Item" } %>
  <% end %>
<% end %>

<%= render UI::Item::ItemComponent.new(size: :default) do %>
  <%= render UI::Item::ContentComponent.new do %>
    <%= render UI::Item::TitleComponent.new { "Default Item" } %>
  <% end %>
<% end %>
```

### Item Group

```ruby
<%= render UI::Item::GroupComponent.new(classes: "space-y-2") do %>
  <%= render UI::Item::ItemComponent.new(variant: :outline) do %>
    <%= render UI::Item::ContentComponent.new do %>
      <%= render UI::Item::TitleComponent.new { "First Item" } %>
    <% end %>
  <% end %>

  <%= render UI::Item::ItemComponent.new(variant: :outline) do %>
    <%= render UI::Item::ContentComponent.new do %>
      <%= render UI::Item::TitleComponent.new { "Second Item" } %>
    <% end %>
  <% end %>
<% end %>
```

### With Separator

```ruby
<%= render UI::Item::ItemComponent.new do %>
  <%= render UI::Item::ContentComponent.new do %>
    <%= render UI::Item::TitleComponent.new { "First Item" } %>
  <% end %>
<% end %>

<%= render UI::Item::SeparatorComponent.new(classes: "my-2") %>

<%= render UI::Item::ItemComponent.new do %>
  <%= render UI::Item::ContentComponent.new do %>
    <%= render UI::Item::TitleComponent.new { "Second Item" } %>
  <% end %>
<% end %>
```

### With Header and Footer

```ruby
<%= render UI::Item::ItemComponent.new(variant: :outline, classes: "flex-col") do %>
  <%= render UI::Item::HeaderComponent.new(classes: "w-full pb-2 border-b") do %>
    <div class="font-semibold">Item Header</div>
  <% end %>

  <%= render UI::Item::ContentComponent.new(classes: "w-full py-4") do %>
    <%= render UI::Item::TitleComponent.new { "Main Content" } %>
    <%= render UI::Item::DescriptionComponent.new { "With header and footer" } %>
  <% end %>

  <%= render UI::Item::FooterComponent.new(classes: "w-full pt-2 border-t text-sm text-muted-foreground") do %>
    Last updated: Today
  <% end %>
<% end %>
```

## Common Patterns

### User List Item

```ruby
<%= render UI::Item::ItemComponent.new(variant: :outline) do %>
  <%= render UI::Item::MediaComponent.new do %>
    <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
      JD
    </div>
  <% end %>
  <%= render UI::Item::ContentComponent.new do %>
    <%= render UI::Item::TitleComponent.new { "Jane Doe" } %>
    <%= render UI::Item::DescriptionComponent.new { "Product Designer • San Francisco, CA" } %>
  <% end %>
  <%= render UI::Item::ActionsComponent.new do %>
    <%= render UI::Button::ButtonComponent.new(variant: :outline, size: :sm) { "Follow" } %>
  <% end %>
<% end %>
```

### Notification Item

```ruby
<%= render UI::Item::ItemComponent.new do %>
  <%= render UI::Item::MediaComponent.new do %>
    <div class="w-10 h-10 bg-green-500/10 rounded flex items-center justify-center">
      <%= lucide_icon("check", class: "w-5 h-5 text-green-500") %>
    </div>
  <% end %>
  <%= render UI::Item::ContentComponent.new do %>
    <%= render UI::Item::TitleComponent.new { "Task Completed" } %>
    <%= render UI::Item::DescriptionComponent.new { "Your task was successfully completed" } %>
  <% end %>
<% end %>
```

### File List Item

```ruby
<%= render UI::Item::ItemComponent.new do %>
  <%= render UI::Item::MediaComponent.new do %>
    <div class="w-10 h-10 bg-blue-500/10 rounded flex items-center justify-center">
      <%= lucide_icon("file-text", class: "w-5 h-5 text-blue-500") %>
    </div>
  <% end %>
  <%= render UI::Item::ContentComponent.new do %>
    <%= render UI::Item::TitleComponent.new { "Report.xlsx" } %>
    <%= render UI::Item::DescriptionComponent.new { "Updated yesterday" } %>
  <% end %>
  <%= render UI::Item::ActionsComponent.new do %>
    <%= render UI::Button::ButtonComponent.new(variant: :ghost, size: :icon) do %>
      <%= lucide_icon("more-horizontal", class: "w-4 h-4") %>
    <% end %>
  <% end %>
<% end %>
```

## Error Prevention

### ❌ Wrong: Missing "Component" suffix

```ruby
<%= render UI::Item::Item.new { "Text" } %>
# ERROR: This is the Phlex class, not ViewComponent
```

### ✅ Correct: Use full component names with "Component" suffix

```ruby
<%= render UI::Item::ItemComponent.new { "Content" } %>  # Correct!
<%= render UI::Item::ContentComponent.new { "Content" } %>  # Correct!
<%= render UI::Item::TitleComponent.new { "Title" } %>  # Correct!
```

### ❌ Wrong: Standalone Title without Content wrapper

```ruby
<%= render UI::Item::ItemComponent.new do %>
  <%= render UI::Item::TitleComponent.new { "Title" } %>
<% end %>
# Works but loses Content wrapper styling
```

### ✅ Correct: Always wrap Title and Description in Content

```ruby
<%= render UI::Item::ItemComponent.new do %>
  <%= render UI::Item::ContentComponent.new do %>
    <%= render UI::Item::TitleComponent.new { "Title" } %>
    <%= render UI::Item::DescriptionComponent.new { "Description" } %>
  <% end %>
<% end %>
```
