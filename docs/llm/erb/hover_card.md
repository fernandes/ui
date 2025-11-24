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
- `tag` (Symbol, default: :span) - HTML tag when not using asChild
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

## See Also

- asChild Pattern: `docs/patterns/as_child.md`
- Button ERB: `docs/llm/erb/button.md`
