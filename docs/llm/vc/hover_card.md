# Hover Card Component - ViewComponent

For sighted users to preview content available behind a link.

## Component Paths

- `UI::HoverCard::HoverCardComponent`
- `UI::HoverCard::TriggerComponent`
- `UI::HoverCard::ContentComponent`

## Basic Usage

**IMPORTANT:** ViewComponent requires parentheses when passing blocks!

```erb
<%= render UI::HoverCard::HoverCardComponent.new do %>
  <%= render UI::HoverCard::TriggerComponent.new do %>
    @nextjs
  <% end %>

  <%= render UI::HoverCard::ContentComponent.new do %>
    <div class="flex gap-4">
      <!-- Content -->
    </div>
  <% end %>
<% end %>
```

## asChild Pattern

**The trigger supports asChild for composition:**

```erb
<%= render UI::HoverCard::HoverCardComponent.new do %>
  <%# Trigger with asChild - yields attributes %>
  <%= render UI::HoverCard::TriggerComponent.new(as_child: true) do |attrs| %>
    <%= render UI::Button::ButtonComponent.new(**attrs, variant: :link) do %>
      @nextjs
    <% end %>
  <% end %>

  <%= render UI::HoverCard::ContentComponent.new do %>
    Next.js is a React framework.
  <% end %>
<% end %>
```

## Parameters

### TriggerComponent

- `as_child` (Boolean, default: false) - Enable composition
- `tag` (Symbol, default: :span) - HTML tag when not using asChild
- `classes` (String) - Additional CSS classes
- `attributes` (Hash) - Additional HTML attributes

### ContentComponent

- `align` (String, default: "center") - "start", "center", "end"
- `side_offset` (Integer, default: 4) - Distance from trigger
- `classes` (String) - Additional CSS classes
- `attributes` (Hash) - Additional HTML attributes

## Custom Positioning

```erb
<%= render UI::HoverCard::ContentComponent.new(align: "start", side_offset: 8) do %>
  Content aligned to start
<% end %>
```

## Common Mistakes

❌ **WRONG** - Missing parentheses:
```erb
<%= render UI::HoverCard::HoverCardComponent.new do %>
```

✅ **CORRECT** - With parentheses:
```erb
<%= render(UI::HoverCard::HoverCardComponent.new) do %>
```

❌ **WRONG** - Not using asChild with buttons:
```erb
<%= render UI::HoverCard::TriggerComponent.new do %>
  <%= render UI::Button::ButtonComponent.new { "Click" } %>
<% end %>
```

✅ **CORRECT** - Using asChild:
```erb
<%= render UI::HoverCard::TriggerComponent.new(as_child: true) do |attrs| %>
  <%= render UI::Button::ButtonComponent.new(**attrs) do %>
    Click
  <% end %>
<% end %>
```

## See Also

- asChild Pattern: `docs/patterns/as_child.md`
- Button ViewComponent: `docs/llm/vc/button.md`
