# Dropdown Menu - Phlex

## Component Path

```ruby
UI::DropdownMenu::DropdownMenu
```

## Description

Displays a menu to the user—such as a set of actions or functions—triggered by a button. Supports submenus, checkboxes, radio groups, keyboard navigation, and separators.

Based on [shadcn/ui Dropdown Menu](https://ui.shadcn.com/docs/components/dropdown-menu) and [Radix UI Dropdown Menu](https://www.radix-ui.com/primitives/docs/components/dropdown-menu).

## Basic Usage

```ruby
render UI::DropdownMenu::DropdownMenu.new do
  render UI::DropdownMenu::Trigger.new do
    render UI::Button::Button.new(variant: :outline) { "Open" }
  end

  render UI::DropdownMenu::Content.new do
    render UI::DropdownMenu::Item.new { "Profile" }
    render UI::DropdownMenu::Item.new { "Settings" }
    render UI::DropdownMenu::Separator.new
    render UI::DropdownMenu::Item.new { "Logout" }
  end
end
```

## Sub-Components

### DropdownMenu

Main container for the dropdown.

**Parameters:**
- `placement:` String - Floating UI placement ("bottom-start", "bottom-end", "top-start", etc.) (default: "bottom-start")
- `offset:` Integer - Offset from trigger in pixels (default: 4)
- `flip:` Boolean - Enable flip middleware (default: true)
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

### Trigger

Wrapper for the trigger element (usually a button).

**Parameters:**
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

### Content

Container for menu items.

**Parameters:**
- `side_offset:` Integer - Offset from trigger side (default: 4)
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
- `disabled:` Boolean - Whether disabled (default: false)
- `classes:` String - Additional CSS classes

### RadioGroup

Container for radio items.

**Parameters:**
- `classes:` String - Additional CSS classes

### RadioItem

Radio selection item.

**Parameters:**
- `value:` String - Value of radio item (required)
- `checked:` Boolean - Whether checked (default: false)
- `disabled:` Boolean - Whether disabled (default: false)
- `classes:` String - Additional CSS classes

### Sub

Container for submenu.

**Parameters:**
- `classes:` String - Additional CSS classes

### SubTrigger

Item that opens submenu.

**Parameters:**
- `inset:` Boolean - Add left padding (default: false)
- `classes:` String - Additional CSS classes

### SubContent

Submenu items container.

**Parameters:**
- `side:` String - Side to position ("right", "left") (default: "right")
- `classes:` String - Additional CSS classes

## Examples

### With Items and Separator

```ruby
render UI::DropdownMenu::DropdownMenu.new do
  render UI::DropdownMenu::Trigger.new do
    render UI::Button::Button.new(variant: :outline) { "Account" }
  end

  render UI::DropdownMenu::Content.new do
    render UI::DropdownMenu::Label.new { "My Account" }
    render UI::DropdownMenu::Separator.new
    render UI::DropdownMenu::Item.new { "Profile" }
    render UI::DropdownMenu::Item.new { "Billing" }
    render UI::DropdownMenu::Item.new { "Settings" }
    render UI::DropdownMenu::Separator.new
    render UI::DropdownMenu::Item.new { "Logout" }
  end
end
```

### With Keyboard Shortcuts

```ruby
render UI::DropdownMenu::DropdownMenu.new do
  render UI::DropdownMenu::Trigger.new do
    render UI::Button::Button.new(variant: :outline) { "File" }
  end

  render UI::DropdownMenu::Content.new do
    render UI::DropdownMenu::Item.new do
      plain "New File"
      render UI::DropdownMenu::Shortcut.new { "⌘N" }
    end
    render UI::DropdownMenu::Item.new do
      plain "Save"
      render UI::DropdownMenu::Shortcut.new { "⌘S" }
    end
  end
end
```

### With Checkboxes

```ruby
render UI::DropdownMenu::DropdownMenu.new do
  render UI::DropdownMenu::Trigger.new do
    render UI::Button::Button.new(variant: :outline) { "View" }
  end

  render UI::DropdownMenu::Content.new do
    render UI::DropdownMenu::CheckboxItem.new(checked: true) { "Show Sidebar" }
    render UI::DropdownMenu::CheckboxItem.new(checked: false) { "Show Toolbar" }
    render UI::DropdownMenu::CheckboxItem.new(checked: true) { "Show Status Bar" }
  end
end
```

### With Radio Group

```ruby
render UI::DropdownMenu::DropdownMenu.new do
  render UI::DropdownMenu::Trigger.new do
    render UI::Button::Button.new(variant: :outline) { "Position" }
  end

  render UI::DropdownMenu::Content.new do
    render UI::DropdownMenu::Label.new { "Panel Position" }
    render UI::DropdownMenu::Separator.new
    render UI::DropdownMenu::RadioGroup.new do
      render UI::DropdownMenu::RadioItem.new(value: "top", checked: true) { "Top" }
      render UI::DropdownMenu::RadioItem.new(value: "bottom") { "Bottom" }
      render UI::DropdownMenu::RadioItem.new(value: "right") { "Right" }
    end
  end
end
```

### With Submenu

```ruby
render UI::DropdownMenu::DropdownMenu.new do
  render UI::DropdownMenu::Trigger.new do
    render UI::Button::Button.new(variant: :outline) { "More" }
  end

  render UI::DropdownMenu::Content.new do
    render UI::DropdownMenu::Item.new { "Profile" }
    render UI::DropdownMenu::Separator.new
    render UI::DropdownMenu::Sub.new do
      render UI::DropdownMenu::SubTrigger.new { "Share" }
      render UI::DropdownMenu::SubContent.new do
        render UI::DropdownMenu::Item.new { "Email" }
        render UI::DropdownMenu::Item.new { "Message" }
        render UI::DropdownMenu::Item.new { "Copy Link" }
      end
    end
  end
end
```

### Destructive Item

```ruby
render UI::DropdownMenu::DropdownMenu.new do
  render UI::DropdownMenu::Trigger.new do
    render UI::Button::Button.new(variant: :outline) { "Actions" }
  end

  render UI::DropdownMenu::Content.new do
    render UI::DropdownMenu::Item.new { "Edit" }
    render UI::DropdownMenu::Item.new { "Duplicate" }
    render UI::DropdownMenu::Separator.new
    render UI::DropdownMenu::Item.new(variant: "destructive") { "Delete" }
  end
end
```

## Features

- **Keyboard Navigation**: Full keyboard support (Arrow keys, Enter, Space, Escape, Home, End)
- **Auto-positioning**: Automatically adjusts position to stay within viewport
- **Submenus**: Nested menus with hover and keyboard support
- **Checkboxes**: Toggle items with state management
- **Radio Groups**: Single-selection groups
- **Accessibility**: Full ARIA support with proper roles and attributes

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space/Enter | Open menu / Select item |
| ArrowDown | Navigate to next item |
| ArrowUp | Navigate to previous item |
| ArrowRight | Open submenu |
| ArrowLeft | Close submenu |
| Escape | Close menu |
| Home | Jump to first item |
| End | Jump to last item |

## See Also

- Phlex guide: `docs/llm/phlex.md`
- ERB implementation: `docs/llm/erb/dropdown_menu.md`
- ViewComponent implementation: `docs/llm/vc/dropdown_menu.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/dropdown-menu
- Radix UI: https://www.radix-ui.com/primitives/docs/components/dropdown-menu
