# ViewComponent Components - Overview

## About ViewComponent

ViewComponent is GitHub's framework for creating reusable, testable & encapsulated view components. UI Engine will support ViewComponent in the future.

## Status

ViewComponent support is **planned** but not yet implemented.

## Planned Pattern

```ruby
# Future ViewComponent usage
render UI::Button::ButtonComponent.new(variant: :outline) do
  "Click me"
end
```

## Migration from Phlex

When ViewComponent support is added, components will follow this naming:

- Phlex: `UI::Button::Button`
- ViewComponent: `UI::Button::ButtonComponent`

## Available Components

- [Accordion](vc/accordion.md)
- [Alert Dialog](vc/alert_dialog.md)
- [Button](vc/button.md)
- [Dialog](vc/dialog.md)
- [Label](vc/label.md)

## See Also

- Current supported formats: Phlex (primary), ERB (via Phlex rendering)
- Documentation: `docs/llm/phlex.md`, `docs/llm/erb.md`
