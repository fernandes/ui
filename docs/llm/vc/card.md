# Card Component - ViewComponent

A container component for displaying content in a structured format with header, content, and footer sections.

## Basic Usage

```erb
<%= render(UI::Card::CardComponent.new) do %>
  <%= render(UI::Card::HeaderComponent.new) do %>
    <%= render(UI::Card::TitleComponent.new) { "Card Title" } %>
    <%= render(UI::Card::DescriptionComponent.new) { "Card description" } %>
  <% end %>
  <%= render(UI::Card::ContentComponent.new) do %>
    <p>Card content goes here.</p>
  <% end %>
  <%= render(UI::Card::FooterComponent.new) do %>
    <%= render(UI::Button::ButtonComponent.new) { "Action" } %>
  <% end %>
<% end %>
```

## Component Paths

| Component | Class | File |
|-----------|-------|------|
| Card | `UI::Card::CardComponent` | `app/components/ui/card/card_component.rb` |
| Header | `UI::Card::HeaderComponent` | `app/components/ui/card/header_component.rb` |
| Title | `UI::Card::TitleComponent` | `app/components/ui/card/title_component.rb` |
| Description | `UI::Card::DescriptionComponent` | `app/components/ui/card/description_component.rb` |
| Content | `UI::Card::ContentComponent` | `app/components/ui/card/content_component.rb` |
| Footer | `UI::Card::FooterComponent` | `app/components/ui/card/footer_component.rb` |
| Action | `UI::Card::ActionComponent` | `app/components/ui/card/action_component.rb` |

## Parameters (All Components)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

## Examples

### Basic Card

```erb
<%= render(UI::Card::CardComponent.new) do %>
  <%= render(UI::Card::HeaderComponent.new) do %>
    <%= render(UI::Card::TitleComponent.new) { "Notifications" } %>
    <%= render(UI::Card::DescriptionComponent.new) { "You have 3 unread messages." } %>
  <% end %>
  <%= render(UI::Card::ContentComponent.new) do %>
    <p>Your notification content here.</p>
  <% end %>
<% end %>
```

### Card with Footer Buttons

```erb
<%= render(UI::Card::CardComponent.new) do %>
  <%= render(UI::Card::HeaderComponent.new) do %>
    <%= render(UI::Card::TitleComponent.new) { "Create Project" } %>
    <%= render(UI::Card::DescriptionComponent.new) { "Deploy your new project." } %>
  <% end %>
  <%= render(UI::Card::ContentComponent.new) do %>
    <!-- Form fields here -->
  <% end %>
  <%= render(UI::Card::FooterComponent.new) do %>
    <%= render(UI::Button::ButtonComponent.new(variant: :outline)) { "Cancel" } %>
    <%= render(UI::Button::ButtonComponent.new) { "Deploy" } %>
  <% end %>
<% end %>
```

### Card with Header Action

```erb
<%= render(UI::Card::CardComponent.new) do %>
  <%= render(UI::Card::HeaderComponent.new) do %>
    <%= render(UI::Card::TitleComponent.new) { "Team Settings" } %>
    <%= render(UI::Card::DescriptionComponent.new) { "Manage your team." } %>
    <%= render(UI::Card::ActionComponent.new) do %>
      <%= render(UI::Button::ButtonComponent.new(variant: :ghost, size: :icon)) do %>
        <%= lucide_icon("ellipsis") %>
      <% end %>
    <% end %>
  <% end %>
  <%= render(UI::Card::ContentComponent.new) do %>
    <!-- Team list here -->
  <% end %>
<% end %>
```

### Stats Card

```erb
<%= render(UI::Card::CardComponent.new) do %>
  <%= render(UI::Card::HeaderComponent.new) do %>
    <%= render(UI::Card::DescriptionComponent.new) { "Total Revenue" } %>
    <%= render(UI::Card::TitleComponent.new(classes: "text-2xl")) { "$45,231.89" } %>
  <% end %>
  <%= render(UI::Card::ContentComponent.new) do %>
    <p class="text-xs text-muted-foreground">+20.1% from last month</p>
  <% end %>
<% end %>
```

### Card with Custom Classes

```erb
<%= render(UI::Card::CardComponent.new(classes: "max-w-sm")) do %>
  <!-- card content -->
<% end %>
```

### Card with Border Sections

```erb
<%= render(UI::Card::CardComponent.new) do %>
  <%= render(UI::Card::HeaderComponent.new(classes: "border-b")) do %>
    <%= render(UI::Card::TitleComponent.new) { "Payment Method" } %>
  <% end %>
  <%= render(UI::Card::ContentComponent.new(classes: "pt-6")) do %>
    <!-- content -->
  <% end %>
  <%= render(UI::Card::FooterComponent.new(classes: "border-t pt-6")) do %>
    <%= render(UI::Button::ButtonComponent.new) { "Continue" } %>
  <% end %>
<% end %>
```

## Common Patterns

### Login Card

```erb
<%= render(UI::Card::CardComponent.new(classes: "max-w-sm")) do %>
  <%= render(UI::Card::HeaderComponent.new) do %>
    <%= render(UI::Card::TitleComponent.new) { "Login" } %>
    <%= render(UI::Card::DescriptionComponent.new) { "Enter your credentials." } %>
    <%= render(UI::Card::ActionComponent.new) do %>
      <%= render(UI::Button::ButtonComponent.new(variant: :link)) { "Sign up" } %>
    <% end %>
  <% end %>
  <%= render(UI::Card::ContentComponent.new) do %>
    <!-- Login form fields -->
  <% end %>
  <%= render(UI::Card::FooterComponent.new(classes: "flex-col gap-2")) do %>
    <%= render(UI::Button::ButtonComponent.new(classes: "w-full")) { "Login" } %>
  <% end %>
<% end %>
```

## Error Prevention

### Wrong: Missing Component suffix

```erb
<%= render(UI::Card::Card.new) do %>
# This is Phlex syntax, ViewComponent uses CardComponent
```

### Correct: Use Component suffix

```erb
<%= render(UI::Card::CardComponent.new) do %>
  <!-- content -->
<% end %>
```

### Wrong: Missing parentheses for blocks

```erb
<%= render UI::Card::CardComponent.new do %>
# Block may not be passed correctly without parentheses
```

### Correct: Use parentheses

```erb
<%= render(UI::Card::CardComponent.new) do %>
  <!-- content -->
<% end %>
```

### Wrong: Using module directly

```erb
<%= render(UI::Card.new) do %>
# ERROR: undefined method 'new' for module UI::Card
```

### Correct: Use CardComponent class

```erb
<%= render(UI::Card::CardComponent.new) do %>
  <!-- content -->
<% end %>
```
