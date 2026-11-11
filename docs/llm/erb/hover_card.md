# Hover Card Component - ERB

For sighted users to preview content available behind a link.

## Basic Usage

```erb
<%= render "ui/hover_card/hover_card" do %>
  <%= render "ui/hover_card/trigger" do %>
    @nextjs
  <% end %>

  <%= render "ui/hover_card/content" do %>
    <div class="flex gap-4">
      <!-- Content here -->
    </div>
  <% end %>
<% end %>
```

## asChild Pattern

**The trigger supports asChild for composition:**

```erb
<%= render "ui/hover_card/hover_card" do %>
  <%# Trigger with asChild - yields attributes %>
  <%= render "ui/hover_card/trigger", as_child: true do |attrs| %>
    <%= render "ui/button/button", **attrs, variant: :link do %>
      @nextjs
    <% end %>
  <% end %>

  <%= render "ui/hover_card/content" do %>
    Next.js is a React framework.
  <% end %>
<% end %>
```

## Parameters

### Trigger

- `as_child` (Boolean, default: false) - Enable composition
- `tag` (Symbol, default: :a) - HTML tag when not using asChild. Pass `href:` so the default `<a>` is a real link; tags that are not focusable on their own get `tabindex="0"`
- `classes` (String) - Additional CSS classes
- `attributes` (Hash) - Additional HTML attributes

### Content

- `align` (String, default: "center") - "start", "center", "end"
- `side_offset` (Integer, default: 4) - Distance from trigger
- `classes` (String) - Additional CSS classes
- `attributes` (Hash) - Additional HTML attributes

## Custom Positioning

```erb
<%= render "ui/hover_card/content", align: "start", side_offset: 8 do %>
  Content aligned to start
<% end %>
```

## Common Mistakes

❌ **WRONG** - Not using asChild with buttons:
```erb
<%= render "ui/hover_card/trigger" do %>
  <%= render "ui/button/button" { "Click" } %>
<% end %>
```

✅ **CORRECT** - Using asChild:
```erb
<%= render "ui/hover_card/trigger", as_child: true do |attrs| %>
  <%= render "ui/button/button", **attrs do %>
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
- Button ERB: `docs/llm/erb/button.md`
