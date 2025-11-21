# Context Menu - Phlex

## Component Path

```ruby
UI::ContextMenu::ContextMenu
```

## Description

Displays a menu to the user—such as a set of actions or functions—triggered by a right-click. Supports checkboxes, radio groups, keyboard navigation, and separators.

Based on [shadcn/ui Context Menu](https://ui.shadcn.com/docs/components/context-menu) and [Radix UI Context Menu](https://www.radix-ui.com/primitives/docs/components/context-menu).

## Basic Usage

```ruby
render UI::ContextMenu::ContextMenu.new do
  render UI::ContextMenu::Trigger.new do
    "Right click here"
  end

  render UI::ContextMenu::Content.new do
    render UI::ContextMenu::Item.new { "Back" }
    render UI::ContextMenu::Item.new { "Forward" }
    render UI::ContextMenu::Separator.new
    render UI::ContextMenu::Item.new { "Reload" }
  end
end
```

## Sub-Components

### ContextMenu

Main container for the context menu.

**Parameters:**
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

### Trigger

Area that triggers the context menu on right-click. Default styling provides a bordered dashed box.

**Parameters:**
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

### Content

Container for menu items. Positioned at cursor location.

**Parameters:**
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

### Item

Individual menu item.

**Parameters:**
- `href:` String - Optional URL to make item a link
- `inset:` Boolean - Add left padding for alignment (default: false)
- `variant:` String - "default" or "destructive" (default: "default")
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

### Label

Section header/label.

**Parameters:**
- `inset:` Boolean - Add left padding (default: false)
- `classes:` String - Additional CSS classes

### Separator

Visual separator between items.

**Parameters:**
- `classes:` String - Additional CSS classes

### Shortcut

Keyboard shortcut indicator.

**Parameters:**
- `classes:` String - Additional CSS classes

### CheckboxItem

Menu item with checkbox state.

**Parameters:**
- `checked:` Boolean - Whether checked (default: false)
- `classes:` String - Additional CSS classes

### RadioGroup

Container for radio items.

**Parameters:**
- `classes:` String - Additional CSS classes

### RadioItem

Radio selection item.

**Parameters:**
- `checked:` Boolean - Whether checked (default: false)
- `classes:` String - Additional CSS classes

## Examples

### With Items and Separator

```ruby
render UI::ContextMenu::ContextMenu.new do
  render UI::ContextMenu::Trigger.new do
    "Right click here"
  end

  render UI::ContextMenu::Content.new(classes: "w-64") do
    render UI::ContextMenu::Item.new do
      "Back"
      render UI::ContextMenu::Shortcut.new { "⌘[" }
    end
    render UI::ContextMenu::Item.new do
      "Forward"
      render UI::ContextMenu::Shortcut.new { "⌘]" }
    end
    render UI::ContextMenu::Separator.new
    render UI::ContextMenu::Item.new do
      "Reload"
      render UI::ContextMenu::Shortcut.new { "⌘R" }
    end
  end
end
```

### With Checkboxes

```ruby
render UI::ContextMenu::ContextMenu.new do
  render UI::ContextMenu::Trigger.new do
    "Right click for options"
  end

  render UI::ContextMenu::Content.new do
    render UI::ContextMenu::CheckboxItem.new(checked: true) do
      "Show Bookmarks Bar"
      render UI::ContextMenu::Shortcut.new { "⌘⇧B" }
    end
    render UI::ContextMenu::CheckboxItem.new { "Show Full URLs" }
  end
end
```

### With Radio Group

```ruby
render UI::ContextMenu::ContextMenu.new do
  render UI::ContextMenu::Trigger.new do
    "Right click for people"
  end

  render UI::ContextMenu::Content.new do
    render UI::ContextMenu::RadioGroup.new do
      render UI::ContextMenu::Label.new(inset: true) { "People" }
      render UI::ContextMenu::Separator.new
      render UI::ContextMenu::RadioItem.new(checked: true) { "Pedro Duarte" }
      render UI::ContextMenu::RadioItem.new { "Colm Tuite" }
    end
  end
end
```

### Destructive Item

```ruby
render UI::ContextMenu::ContextMenu.new do
  render UI::ContextMenu::Trigger.new do
    "Right click for actions"
  end

  render UI::ContextMenu::Content.new do
    render UI::ContextMenu::Item.new { "Edit" }
    render UI::ContextMenu::Item.new { "Duplicate" }
    render UI::ContextMenu::Separator.new
    render UI::ContextMenu::Item.new(variant: "destructive") { "Delete" }
  end
end
```

### With Icons

```ruby
render UI::ContextMenu::ContextMenu.new do
  render UI::ContextMenu::Trigger.new do
    "Right click here"
  end

  render UI::ContextMenu::Content.new(classes: "w-48") do
    render UI::ContextMenu::Item.new do
      lucide_icon("copy")
      "Copy"
    end
    render UI::ContextMenu::Item.new do
      lucide_icon("scissors")
      "Cut"
    end
    render UI::ContextMenu::Item.new do
      lucide_icon("clipboard")
      "Paste"
    end
  end
end
```

## Features

- **Right-click Trigger**: Menu appears on right-click at cursor position
- **Keyboard Navigation**: Full keyboard support (Arrow keys, Enter, Space, Escape, Home, End)
- **Auto-positioning**: Automatically adjusts position to stay within viewport
- **Checkboxes**: Toggle items with state management
- **Radio Groups**: Single-selection groups
- **Accessibility**: Full ARIA support with proper roles and attributes

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space/Enter | Select item |
| ArrowDown | Navigate to next item |
| ArrowUp | Navigate to previous item |
| Escape | Close menu |
| Home | Jump to first item |
| End | Jump to last item |

## See Also

- Phlex guide: `docs/llm/phlex.md`
- ERB implementation: `docs/llm/erb/context_menu.md`
- ViewComponent implementation: `docs/llm/vc/context_menu.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/context-menu
- Radix UI: https://www.radix-ui.com/primitives/docs/components/context-menu
