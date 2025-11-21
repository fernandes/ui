# Card Component - Phlex

A container component for displaying content in a structured format with header, content, and footer sections.

## Basic Usage

```ruby
<%= render UI::Card::Card.new do %>
  <%= render UI::Card::Header.new do %>
    <%= render UI::Card::Title.new { "Card Title" } %>
    <%= render UI::Card::Description.new { "Card description" } %>
  <% end %>
  <%= render UI::Card::Content.new do %>
    <p>Card content goes here.</p>
  <% end %>
  <%= render UI::Card::Footer.new do %>
    <%= render UI::Button::Button.new { "Action" } %>
  <% end %>
<% end %>
```

## Component Paths

| Component | Class | File |
|-----------|-------|------|
| Card | `UI::Card::Card` | `app/components/ui/card/card.rb` |
| Header | `UI::Card::Header` | `app/components/ui/card/header.rb` |
| Title | `UI::Card::Title` | `app/components/ui/card/title.rb` |
| Description | `UI::Card::Description` | `app/components/ui/card/description.rb` |
| Content | `UI::Card::Content` | `app/components/ui/card/content.rb` |
| Footer | `UI::Card::Footer` | `app/components/ui/card/footer.rb` |
| Action | `UI::Card::Action` | `app/components/ui/card/action.rb` |

## Parameters (All Components)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

## Sub-Components

### Card
Main container with border, shadow, and rounded corners.

### Header
Grid layout for title, description, and optional action button.

### Title
Semibold text for card title.

### Description
Muted text for card description.

### Content
Main content area with horizontal padding.

### Footer
Flex container for action buttons.

### Action
Positioned in the header's top-right corner (used for menu/action buttons).

## Examples

### Basic Card

```ruby
<%= render UI::Card::Card.new do %>
  <%= render UI::Card::Header.new do %>
    <%= render UI::Card::Title.new { "Notifications" } %>
    <%= render UI::Card::Description.new { "You have 3 unread messages." } %>
  <% end %>
  <%= render UI::Card::Content.new do %>
    <p>Your notification content here.</p>
  <% end %>
<% end %>
```

### Card with Footer Buttons

```ruby
<%= render UI::Card::Card.new do %>
  <%= render UI::Card::Header.new do %>
    <%= render UI::Card::Title.new { "Create Project" } %>
    <%= render UI::Card::Description.new { "Deploy your new project in one-click." } %>
  <% end %>
  <%= render UI::Card::Content.new do %>
    <!-- Form fields here -->
  <% end %>
  <%= render UI::Card::Footer.new do %>
    <%= render UI::Button::Button.new(variant: :outline) { "Cancel" } %>
    <%= render UI::Button::Button.new { "Deploy" } %>
  <% end %>
<% end %>
```

### Card with Header Action

```ruby
<%= render UI::Card::Card.new do %>
  <%= render UI::Card::Header.new do %>
    <%= render UI::Card::Title.new { "Team Settings" } %>
    <%= render UI::Card::Description.new { "Manage your team members." } %>
    <%= render UI::Card::Action.new do %>
      <%= render UI::Button::Button.new(variant: :ghost, size: :icon) do %>
        <%= lucide_icon("ellipsis") %>
      <% end %>
    <% end %>
  <% end %>
  <%= render UI::Card::Content.new do %>
    <!-- Team list here -->
  <% end %>
<% end %>
```

### Stats Card

```ruby
<%= render UI::Card::Card.new do %>
  <%= render UI::Card::Header.new do %>
    <%= render UI::Card::Description.new { "Total Revenue" } %>
    <%= render UI::Card::Title.new(classes: "text-2xl") { "$45,231.89" } %>
  <% end %>
  <%= render UI::Card::Content.new do %>
    <p class="text-xs text-muted-foreground">+20.1% from last month</p>
  <% end %>
<% end %>
```

### Card with Custom Classes

```ruby
<%= render UI::Card::Card.new(classes: "max-w-sm") do %>
  <!-- card content -->
<% end %>
```

### Card with Border Sections

```ruby
<%= render UI::Card::Card.new do %>
  <%= render UI::Card::Header.new(classes: "border-b") do %>
    <%= render UI::Card::Title.new { "Payment Method" } %>
  <% end %>
  <%= render UI::Card::Content.new(classes: "pt-6") do %>
    <!-- content -->
  <% end %>
  <%= render UI::Card::Footer.new(classes: "border-t pt-6") do %>
    <%= render UI::Button::Button.new { "Continue" } %>
  <% end %>
<% end %>
```

## Common Patterns

### Login Card

```ruby
<%= render UI::Card::Card.new(classes: "max-w-sm") do %>
  <%= render UI::Card::Header.new do %>
    <%= render UI::Card::Title.new { "Login" } %>
    <%= render UI::Card::Description.new { "Enter your credentials." } %>
    <%= render UI::Card::Action.new do %>
      <%= render UI::Button::Button.new(variant: :link) { "Sign up" } %>
    <% end %>
  <% end %>
  <%= render UI::Card::Content.new do %>
    <!-- Login form fields -->
  <% end %>
  <%= render UI::Card::Footer.new(classes: "flex-col gap-2") do %>
    <%= render UI::Button::Button.new(classes: "w-full") { "Login" } %>
  <% end %>
<% end %>
```

### Grid of Stats Cards

```ruby
<div class="grid gap-4 md:grid-cols-3">
  <%= render UI::Card::Card.new do %>
    <%= render UI::Card::Header.new do %>
      <%= render UI::Card::Description.new { "Revenue" } %>
      <%= render UI::Card::Title.new(classes: "text-2xl") { "$12,345" } %>
    <% end %>
  <% end %>
  <!-- more cards... -->
</div>
```

## Error Prevention

### Wrong: Missing nested Card class

```ruby
<%= render UI::Card.new { "Content" } %>
# ERROR: undefined method 'new' for module UI::Card
```

### Correct: Use full path

```ruby
<%= render UI::Card::Card.new { "Content" } %>  # Correct!
```

### Wrong: Confusing Card and Content

```ruby
<%= render UI::Card::Card.new do %>
  Direct content here  # Missing Content wrapper
<% end %>
```

### Correct: Use Content component

```ruby
<%= render UI::Card::Card.new do %>
  <%= render UI::Card::Content.new do %>
    Your content here
  <% end %>
<% end %>
```
