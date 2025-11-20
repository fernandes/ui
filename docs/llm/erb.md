# ERB Components - Overview

## About ERB Components

ERB (Embedded Ruby) is the traditional Rails view format. UI Engine components work seamlessly with ERB.

## Rendering Pattern

```erb
<%= render UI::ComponentName::SubComponent.new(**options) do %>
  <!-- Block content -->
<% end %>
```

## Examples

### Basic Usage

```erb
<%= render UI::Button::Button.new(variant: :outline) do %>
  Click me
<% end %>
```

### With Parameters

```erb
<%= render UI::Dialog::Dialog.new(open: false) do %>
  <%= render UI::Dialog::Trigger.new do %>
    Open Dialog
  <% end %>

  <%= render UI::Dialog::Overlay.new(open: false) do %>
    <%= render UI::Dialog::Content.new do %>
      <!-- Content here -->
    <% end %>
  <% end %>
<% end %>
```

### With asChild Composition

```erb
<%= render UI::Dialog::Trigger.new(as_child: true) do |trigger_attrs| %>
  <%= render UI::Button::Button.new(**trigger_attrs, variant: :destructive) do %>
    Delete
  <% end %>
<% end %>
```

## Common Parameters

- `variant:` - Symbol, component variant (`:default`, `:outline`, `:destructive`, etc.)
- `size:` - Symbol, component size (`:sm`, `:default`, `:lg`, etc.)
- `classes:` - String, additional Tailwind classes
- `open:` - Boolean, initial state for dialog/accordion components
- `as_child:` - Boolean, yields attributes for composition

## Important Notes

### ❌ Common Mistakes

```erb
<!-- WRONG: String instead of symbol -->
<%= render UI::Button::Button.new(variant: "outline") %>

<!-- CORRECT: Use symbol -->
<%= render UI::Button::Button.new(variant: :outline) %>
```

```erb
<!-- WRONG: Missing = in render tag -->
<% render UI::Button::Button.new %>

<!-- CORRECT: Use <%= to output content -->
<%= render UI::Button::Button.new %>
```

### ✅ Block Parameter Pattern

```erb
<!-- When component yields block parameter -->
<%= render ComponentName.new(as_child: true) do |attrs| %>
  <!-- Use |attrs| to capture block parameter -->
  <%= render OtherComponent.new(**attrs) do %>
    Content
  <% end %>
<% end %>
```

## Available Components

- [Accordion](erb/accordion.md)
- [Alert Dialog](erb/alert_dialog.md)
- [Button](erb/button.md)
- [Dialog](erb/dialog.md)
- [Label](erb/label.md)

## See Individual Component Docs

Each component has detailed documentation in `docs/llm/erb/{component}.md`.
