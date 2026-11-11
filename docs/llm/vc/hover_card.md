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
- `tag` (Symbol, default: :a) - HTML tag when not using asChild. Pass `href:` so the default `<a>` is a real link; tags that are not focusable on their own get `tabindex="0"`
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

## Accessibility

Like Radix HoverCard, the card is a preview for sighted pointer users:

- Opens on hover and on keyboard focus of the trigger; Escape closes it (WCAG 1.4.13)
- Links and buttons inside the card are taken out of the Tab order (`tabindex="-1"`), so Tab
  from the trigger moves on and the card closes. Don't put anything essential only in the card.
- Focus that does reach the card (a click on a link inside) closes it once it leaves
- The default trigger is an `<a>`: pass `href:` (or use `as_child` with a link/button) so screen
  readers get a real link or button

## See Also

- asChild Pattern: `docs/patterns/as_child.md`
- Button ViewComponent: `docs/llm/vc/button.md`
