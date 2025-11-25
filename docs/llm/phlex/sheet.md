# Sheet - Phlex

## Component Path

```ruby
UI::Sheet::Sheet       # Main container
UI::Sheet::Trigger     # Opens the sheet
UI::Sheet::Overlay     # Backdrop and container
UI::Sheet::Content     # Main content area (with side variants)
UI::Sheet::Header      # Header section
UI::Sheet::Title       # Sheet title (h2)
UI::Sheet::Description # Sheet description (p)
UI::Sheet::Footer      # Footer section for actions
UI::Sheet::Close       # Close button
```

## Description

A sheet component that slides in from the edge of the screen. Extends the Dialog component to display content that complements the main content of the screen. Supports four sides (top, right, bottom, left) with slide animations.

**Key difference from Dialog:** Sheet uses slide animations instead of zoom/fade, and positions content at screen edges instead of center.

## Basic Usage

```ruby
render UI::Sheet::Sheet.new do
  render UI::Sheet::Trigger.new do
    "Open Sheet"
  end

  render UI::Sheet::Overlay.new do
    render UI::Sheet::Content.new do
      render UI::Sheet::Header.new do
        render UI::Sheet::Title.new do
          "Sheet Title"
        end
        render UI::Sheet::Description.new do
          "Sheet description goes here"
        end
      end

      # Your content here

      render UI::Sheet::Footer.new do
        render UI::Sheet::Close.new do
          "Close"
        end
      end
    end
  end
end
```

## Main Component: UI::Sheet::Sheet

Container that manages sheet state and behavior. Uses the same `ui--dialog` Stimulus controller as Dialog.

### Parameters

#### Optional

- `open:` Boolean - Initial open state
  - Default: `false`

- `close_on_escape:` Boolean - Close sheet when Escape key is pressed
  - Default: `true`

- `close_on_overlay_click:` Boolean - Close sheet when clicking the overlay backdrop
  - Default: `true`

- `classes:` String - Additional Tailwind CSS classes

- `**attributes` Hash - Any additional HTML attributes (id, data, aria, etc.)

### Example

```ruby
render UI::Sheet::Sheet.new(
  open: false,
  close_on_escape: true,
  close_on_overlay_click: true
) do
  # Sub-components here
end
```

## Sub-Components

### UI::Sheet::Trigger

Opens the sheet when clicked. Supports asChild composition for custom triggers.

#### Parameters

- `as_child:` Boolean - Enable composition pattern
  - When `true`, yields attributes hash to block instead of rendering button wrapper
  - When `false`, renders as a plain button element
  - Default: `false`

- `**attributes` Hash - Additional HTML attributes

#### Examples

**Default (button wrapper):**
```ruby
render UI::Sheet::Trigger.new do
  "Edit Profile"
end
```

**With asChild (custom button composition):**
```ruby
render UI::Sheet::Trigger.new(as_child: true) do |trigger_attrs|
  render UI::Button::Button.new(**trigger_attrs, variant: :outline) do
    "Edit Profile"
  end
end
```

---

### UI::Sheet::Overlay

Renders the backdrop (dim overlay) and container for the sheet content. Always include this.

#### Parameters

- `open:` Boolean - Current open state (mirrors Sheet state)
  - Default: `false`

- `classes:` String - Additional Tailwind CSS classes for content wrapper

- `**attributes` Hash - Additional HTML attributes

#### Example

```ruby
render UI::Sheet::Overlay.new(open: false) do
  render UI::Sheet::Content.new do
    # Content here
  end
end
```

---

### UI::Sheet::Content

Main content area with side positioning and slide animations.

#### Parameters

- `side:` String - Position of the sheet
  - Options: `"top"`, `"right"`, `"bottom"`, `"left"`
  - Default: `"right"`

- `open:` Boolean - Current open state
  - Default: `false`

- `show_close:` Boolean - Show the built-in close button (X) in top-right corner
  - Default: `true`

- `classes:` String - Additional Tailwind CSS classes (useful for customizing width)
  - Example: `"sm:max-w-xl"` for wider sheet

- `**attributes` Hash - Additional HTML attributes

#### Side Variants

| Side | Position | Default Size | Border |
|------|----------|--------------|--------|
| `"right"` | Right edge, full height | `w-3/4 sm:max-w-sm` | Left border |
| `"left"` | Left edge, full height | `w-3/4 sm:max-w-sm` | Right border |
| `"top"` | Top edge, auto height | Full width | Bottom border |
| `"bottom"` | Bottom edge, auto height | Full width | Top border |

#### Example

```ruby
render UI::Sheet::Content.new(side: "left", classes: "sm:max-w-md") do
  # Header, body, footer
end
```

---

### UI::Sheet::Header

Header section container for Title and Description. Uses vertical flex layout.

**Default classes:** `"flex flex-col gap-1.5 p-4"`

#### Parameters

- `classes:` String - Additional Tailwind CSS classes

#### Example

```ruby
render UI::Sheet::Header.new do
  render UI::Sheet::Title.new do
    "Edit Profile"
  end
  render UI::Sheet::Description.new do
    "Make changes to your profile here."
  end
end
```

---

### UI::Sheet::Title

Sheet title. Renders as an `<h2>` with semantic styling.

#### Parameters

- `classes:` String - Additional Tailwind CSS classes to merge with defaults

**Default classes:** `"text-lg font-semibold"`

#### Example

```ruby
render UI::Sheet::Title.new do
  "Your Sheet Title"
end
```

---

### UI::Sheet::Description

Sheet description. Renders as a `<p>` with muted foreground color.

#### Parameters

- `classes:` String - Additional Tailwind CSS classes to merge with defaults

**Default classes:** `"text-muted-foreground text-sm"`

#### Example

```ruby
render UI::Sheet::Description.new do
  "This is a description of what the sheet does."
end
```

---

### UI::Sheet::Footer

Footer section for action buttons. Uses vertical flex layout with auto margin-top.

**Default classes:** `"mt-auto flex flex-col gap-2 p-4"`

#### Parameters

- `classes:` String - Additional Tailwind CSS classes

#### Example

```ruby
render UI::Sheet::Footer.new do
  render UI::Sheet::Close.new(variant: :outline) do
    "Cancel"
  end
  render UI::Button::Button.new(variant: :default) do
    "Save"
  end
end
```

---

### UI::Sheet::Close

Close button. Supports both default button rendering and asChild composition.

#### Parameters

- `as_child:` Boolean - Enable composition pattern
  - When `true`, yields attributes hash to block
  - When `false`, renders as Button
  - Default: `false`

- `variant:` Symbol - Button variant (when not using asChild)
  - Options: `:default`, `:outline`, `:destructive`, `:secondary`, `:ghost`
  - Default: `:outline`

- `size:` Symbol - Button size (when not using asChild)
  - Options: `:sm`, `:default`, `:lg`
  - Default: `:default`

- `classes:` String - Additional Tailwind CSS classes

- `**attributes` Hash - Additional HTML attributes

#### Examples

**Default (renders as Button):**
```ruby
render UI::Sheet::Close.new(variant: :default) do
  "Save Changes"
end
```

**With asChild (custom composition):**
```ruby
render UI::Sheet::Close.new(as_child: true) do |close_attrs|
  render UI::Button::Button.new(**close_attrs, variant: :outline) do
    "Close"
  end
end
```

## Examples

### Complete Edit Form Sheet

```ruby
render UI::Sheet::Sheet.new(open: false) do
  render UI::Sheet::Trigger.new(as_child: true) do |trigger_attrs|
    render UI::Button::Button.new(**trigger_attrs, variant: :outline) do
      "Edit Profile"
    end
  end

  render UI::Sheet::Overlay.new do
    render UI::Sheet::Content.new do
      render UI::Sheet::Header.new do
        render UI::Sheet::Title.new do
          "Edit profile"
        end
        render UI::Sheet::Description.new do
          "Make changes to your profile here. Click save when you're done."
        end
      end

      div(class: "grid flex-1 auto-rows-min gap-6 px-4") do
        div(class: "grid gap-3") do
          label(for: "name", class: "text-sm font-medium") { "Name" }
          input(id: "name", type: "text", value: "Pedro Duarte",
                class: "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm")
        end
        div(class: "grid gap-3") do
          label(for: "username", class: "text-sm font-medium") { "Username" }
          input(id: "username", type: "text", value: "@peduarte",
                class: "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm")
        end
      end

      render UI::Sheet::Footer.new do
        render UI::Button::Button.new(variant: :default) do
          "Save changes"
        end
        render UI::Sheet::Close.new(as_child: true) do |close_attrs|
          render UI::Button::Button.new(**close_attrs, variant: :outline) do
            "Close"
          end
        end
      end
    end
  end
end
```

### Side Variants

```ruby
# Right side (default)
render UI::Sheet::Sheet.new do
  render UI::Sheet::Trigger.new { "Right" }
  render UI::Sheet::Overlay.new do
    render UI::Sheet::Content.new(side: "right") do
      render UI::Sheet::Header.new do
        render UI::Sheet::Title.new { "Right Sheet" }
        render UI::Sheet::Description.new { "Slides in from the right." }
      end
      div(class: "p-4 flex-1") { "Content" }
      render UI::Sheet::Footer.new do
        render UI::Sheet::Close.new { "Close" }
      end
    end
  end
end

# Left side
render UI::Sheet::Sheet.new do
  render UI::Sheet::Trigger.new { "Left" }
  render UI::Sheet::Overlay.new do
    render UI::Sheet::Content.new(side: "left") do
      render UI::Sheet::Header.new do
        render UI::Sheet::Title.new { "Left Sheet" }
        render UI::Sheet::Description.new { "Slides in from the left." }
      end
      div(class: "p-4 flex-1") { "Content" }
      render UI::Sheet::Footer.new do
        render UI::Sheet::Close.new { "Close" }
      end
    end
  end
end

# Top
render UI::Sheet::Sheet.new do
  render UI::Sheet::Trigger.new { "Top" }
  render UI::Sheet::Overlay.new do
    render UI::Sheet::Content.new(side: "top") do
      render UI::Sheet::Header.new do
        render UI::Sheet::Title.new { "Top Sheet" }
      end
      div(class: "p-4") { "Content" }
    end
  end
end

# Bottom
render UI::Sheet::Sheet.new do
  render UI::Sheet::Trigger.new { "Bottom" }
  render UI::Sheet::Overlay.new do
    render UI::Sheet::Content.new(side: "bottom") do
      render UI::Sheet::Header.new do
        render UI::Sheet::Title.new { "Bottom Sheet" }
      end
      div(class: "p-4") { "Content" }
    end
  end
end
```

### Custom Width Sheet

```ruby
render UI::Sheet::Sheet.new do
  render UI::Sheet::Trigger.new(as_child: true) do |trigger_attrs|
    render UI::Button::Button.new(**trigger_attrs, variant: :outline) do
      "Wide Sheet"
    end
  end

  render UI::Sheet::Overlay.new do
    render UI::Sheet::Content.new(classes: "sm:max-w-xl") do
      render UI::Sheet::Header.new do
        render UI::Sheet::Title.new { "Wide Sheet" }
        render UI::Sheet::Description.new { "This sheet has a custom width." }
      end

      div(class: "p-4 flex-1") { "More space for content!" }

      render UI::Sheet::Footer.new do
        render UI::Sheet::Close.new { "Close" }
      end
    end
  end
end
```

### Without Built-in Close Button

```ruby
render UI::Sheet::Sheet.new do
  render UI::Sheet::Trigger.new { "No X Button" }

  render UI::Sheet::Overlay.new do
    render UI::Sheet::Content.new(show_close: false) do
      render UI::Sheet::Header.new do
        render UI::Sheet::Title.new { "Custom Close" }
        render UI::Sheet::Description.new do
          "This sheet doesn't have the default X button."
        end
      end

      div(class: "p-4 flex-1") do
        "Close by clicking overlay, pressing Escape, or using the footer button."
      end

      render UI::Sheet::Footer.new do
        render UI::Sheet::Close.new(variant: :default) { "Close Sheet" }
      end
    end
  end
end
```

## Common Mistakes

### ❌ Wrong - Missing Overlay

```ruby
render UI::Sheet::Sheet.new do
  render UI::Sheet::Trigger.new { "Open" }

  # MISSING OVERLAY!
  render UI::Sheet::Content.new do
    render UI::Sheet::Title.new { "Title" }
  end
end
```

**Why it's wrong:** The Overlay component renders the backdrop and manages visual separation. Without it, the content appears floating without context.

### ✅ Correct - Include Overlay

```ruby
render UI::Sheet::Sheet.new do
  render UI::Sheet::Trigger.new { "Open" }

  render UI::Sheet::Overlay.new do
    render UI::Sheet::Content.new do
      render UI::Sheet::Title.new { "Title" }
    end
  end
end
```

---

### ❌ Wrong - Using Dialog Component Classes

```ruby
render UI::Dialog::Dialog.new do  # Wrong component!
  render UI::Dialog::Trigger.new { "Open Sheet" }
  # ...
end
```

**Why it's wrong:** Sheet has different styling (slide animations, edge positioning). Use Sheet components.

### ✅ Correct - Use Sheet Components

```ruby
render UI::Sheet::Sheet.new do
  render UI::Sheet::Trigger.new { "Open Sheet" }
  # ...
end
```

---

### ❌ Wrong - Not Yielding Attributes with asChild

```ruby
render UI::Sheet::Trigger.new(as_child: true) do
  # WRONG: Not using the yielded attributes!
  render UI::Button::Button.new(variant: :outline) do
    "Open Sheet"
  end
end
```

**Why it's wrong:** The block parameter contains the sheet action attributes. Without merging them, the sheet won't open.

### ✅ Correct - Merge Yielded Attributes

```ruby
render UI::Sheet::Trigger.new(as_child: true) do |trigger_attrs|
  render UI::Button::Button.new(**trigger_attrs, variant: :outline) do
    "Open Sheet"
  end
end
```

---

### ❌ Wrong - Module Instead of Component

```ruby
render UI::Sheet.new do  # UI::Sheet is a module!
  # ...
end
```

**Why it's wrong:** `UI::Sheet` is a module, not a component.

### ✅ Correct - Use Full Component Path

```ruby
render UI::Sheet::Sheet.new do  # UI::Sheet::Sheet is the component
  # ...
end
```

---

### ❌ Wrong - Using String Instead of Symbol for Side

```ruby
render UI::Sheet::Content.new(side: :right) do  # Symbol works but...
  # ...
end
```

**Note:** While symbols may work, the component expects strings for side parameter.

### ✅ Correct - Use String for Side

```ruby
render UI::Sheet::Content.new(side: "right") do
  # ...
end
```

## Accessibility

- **Keyboard Navigation**:
  - `Escape` - Close sheet (if `close_on_escape: true`)
  - `Tab` - Navigate between focusable elements
  - Focus is trapped within the sheet while open
  - Focus returns to trigger when sheet closes

- **ARIA Attributes**:
  - Sheet container has `role="dialog"` (managed by Stimulus controller)
  - Title is associated with sheet via `aria-labelledby`
  - Description is associated with sheet via `aria-describedby`
  - Overlay prevents interaction with background content

- **Visual**:
  - Overlay provides visual separation
  - Clear, readable typography for Title and Description
  - Sufficient contrast for buttons

## Sheet vs Dialog

| Feature | Sheet | Dialog |
|---------|-------|--------|
| Position | Screen edge | Center |
| Animation | Slide | Zoom + Fade |
| Use case | Navigation, forms | Confirmations, alerts |
| Header/Footer | Vertical flex | Standard |

## See Also

- shadcn/ui: https://ui.shadcn.com/docs/components/sheet
- Dialog component: `docs/llm/phlex/dialog.md`
- Drawer component: `docs/llm/phlex/drawer.md`
- Button component: `docs/llm/phlex/button.md`
