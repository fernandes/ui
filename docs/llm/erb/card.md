# Card Component - ERB

A container component for displaying content in a structured format with header, content, and footer sections.

## Basic Usage

```erb
<%= render "ui/card/card" do %>
  <%= render "ui/card/header" do %>
    <%= render "ui/card/title", content: "Card Title" %>
    <%= render "ui/card/description", content: "Card description" %>
  <% end %>
  <%= render "ui/card/content" do %>
    <p>Card content goes here.</p>
  <% end %>
  <%= render "ui/card/footer" do %>
    <%= render "ui/button", content: "Action" %>
  <% end %>
<% end %>
```

## Partial Paths

| Component | Partial Path |
|-----------|--------------|
| Card | `ui/card/card` |
| Header | `ui/card/header` |
| Title | `ui/card/title` |
| Description | `ui/card/description` |
| Content | `ui/card/content` |
| Footer | `ui/card/footer` |
| Action | `ui/card/action` |

## Parameters (All Components)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

### Title and Description Only

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `content` | String | `nil` | Text content (alternative to block) |

## Examples

### Basic Card

```erb
<%= render "ui/card/card" do %>
  <%= render "ui/card/header" do %>
    <%= render "ui/card/title", content: "Notifications" %>
    <%= render "ui/card/description", content: "You have 3 unread messages." %>
  <% end %>
  <%= render "ui/card/content" do %>
    <p>Your notification content here.</p>
  <% end %>
<% end %>
```

### Card with Footer Buttons

```erb
<%= render "ui/card/card" do %>
  <%= render "ui/card/header" do %>
    <%= render "ui/card/title", content: "Create Project" %>
    <%= render "ui/card/description", content: "Deploy your new project." %>
  <% end %>
  <%= render "ui/card/content" do %>
    <!-- Form fields here -->
  <% end %>
  <%= render "ui/card/footer" do %>
    <%= render "ui/button", variant: "outline", content: "Cancel" %>
    <%= render "ui/button", content: "Deploy" %>
  <% end %>
<% end %>
```

### Card with Header Action

```erb
<%= render "ui/card/card" do %>
  <%= render "ui/card/header" do %>
    <%= render "ui/card/title", content: "Team Settings" %>
    <%= render "ui/card/description", content: "Manage your team." %>
    <%= render "ui/card/action" do %>
      <%= render "ui/button", variant: "ghost", size: "icon" do %>
        <%= lucide_icon("ellipsis") %>
      <% end %>
    <% end %>
  <% end %>
  <%= render "ui/card/content" do %>
    <!-- Team list here -->
  <% end %>
<% end %>
```

### Stats Card

```erb
<%= render "ui/card/card" do %>
  <%= render "ui/card/header" do %>
    <%= render "ui/card/description", content: "Total Revenue" %>
    <%= render "ui/card/title", content: "$45,231.89", classes: "text-2xl" %>
  <% end %>
  <%= render "ui/card/content" do %>
    <p class="text-xs text-muted-foreground">+20.1% from last month</p>
  <% end %>
<% end %>
```

### Card with Custom Classes

```erb
<%= render "ui/card/card", classes: "max-w-sm" do %>
  <!-- card content -->
<% end %>
```

### Card with Border Sections

```erb
<%= render "ui/card/card" do %>
  <%= render "ui/card/header", classes: "border-b" do %>
    <%= render "ui/card/title", content: "Payment Method" %>
  <% end %>
  <%= render "ui/card/content", classes: "pt-6" do %>
    <!-- content -->
  <% end %>
  <%= render "ui/card/footer", classes: "border-t pt-6" do %>
    <%= render "ui/button", content: "Continue" %>
  <% end %>
<% end %>
```

## Common Patterns

### Login Card

```erb
<%= render "ui/card/card", classes: "max-w-sm" do %>
  <%= render "ui/card/header" do %>
    <%= render "ui/card/title", content: "Login" %>
    <%= render "ui/card/description", content: "Enter your credentials." %>
    <%= render "ui/card/action" do %>
      <%= render "ui/button", variant: "link", content: "Sign up" %>
    <% end %>
  <% end %>
  <%= render "ui/card/content" do %>
    <!-- Login form fields -->
  <% end %>
  <%= render "ui/card/footer", classes: "flex-col gap-2" do %>
    <%= render "ui/button", classes: "w-full", content: "Login" %>
  <% end %>
<% end %>
```

## Error Prevention

### Wrong: Using component syntax

```erb
<%= render UI::Card::Card.new do %>
# This is Phlex syntax, not ERB partial syntax
```

### Correct: Use partial path

```erb
<%= render "ui/card/card" do %>
  <!-- content -->
<% end %>
```

### Wrong: Missing nested path

```erb
<%= render "ui/card" do %>
# ERROR: Missing template
```

### Correct: Include subcomponent name

```erb
<%= render "ui/card/card" do %>
  <!-- content -->
<% end %>
```
