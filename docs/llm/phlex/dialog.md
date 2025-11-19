# Dialog - Phlex

## Component Path

```ruby
UI::Dialog::Dialog       # Main container
UI::Dialog::Trigger      # Opens the dialog
UI::Dialog::Overlay      # Backdrop and container
UI::Dialog::Content      # Main content area
UI::Dialog::Header       # Header section
UI::Dialog::Title        # Dialog title (h2)
UI::Dialog::Description  # Dialog description (p)
UI::Dialog::Footer       # Footer section for actions
UI::Dialog::Close        # Close button
```

## Description

A window overlaid on either the primary window or another dialog window, rendering the content underneath inert. Supports keyboard navigation (Escape to close), focus management, and prevents background scrolling.

## Basic Usage

```ruby
render UI::Dialog::Dialog.new do
  render UI::Dialog::Trigger.new do
    "Open Dialog"
  end

  render UI::Dialog::Overlay.new do
    render UI::Dialog::Content.new do
      render UI::Dialog::Header.new do
        render UI::Dialog::Title.new do
          "Dialog Title"
        end
        render UI::Dialog::Description.new do
          "Dialog description goes here"
        end
      end

      # Your content here

      render UI::Dialog::Footer.new do
        render UI::Dialog::Close.new do
          "Close"
        end
      end
    end
  end
end
```

## Main Component: UI::Dialog::Dialog

Container that manages dialog state and behavior.

### Parameters

#### Optional

- `open:` Boolean - Initial open state
  - Default: `false`

- `close_on_escape:` Boolean - Close dialog when Escape key is pressed
  - Default: `true`

- `close_on_overlay_click:` Boolean - Close dialog when clicking the overlay backdrop
  - Default: `true`

- `classes:` String - Additional Tailwind CSS classes

- `**attributes` Hash - Any additional HTML attributes (id, data, aria, etc.)

### Example

```ruby
render UI::Dialog::Dialog.new(
  open: false,
  close_on_escape: true,
  close_on_overlay_click: true
) do
  # Sub-components here
end
```

## Sub-Components

### UI::Dialog::Trigger

Opens the dialog when clicked. Supports asChild composition for custom triggers.

#### Parameters

- `as_child:` Boolean - Enable composition pattern
  - When `true`, yields attributes hash to block instead of rendering button wrapper
  - When `false`, renders as a plain button element
  - Default: `false`

- `**attributes` Hash - Additional HTML attributes

#### Examples

**Default (button wrapper):**
```ruby
render UI::Dialog::Trigger.new do
  "Edit Profile"
end
```

**With asChild (custom button composition):**
```ruby
render UI::Dialog::Trigger.new(as_child: true) do |trigger_attrs|
  render UI::Button::Button.new(**trigger_attrs, variant: :outline) do
    "Edit Profile"
  end
end
```

---

### UI::Dialog::Overlay

Renders the backdrop (dim overlay) and container for the dialog content. Always include this.

#### Parameters

- `open:` Boolean - Current open state (mirrors Dialog state)
  - Default: `false`

- `classes:` String - Additional Tailwind CSS classes for content wrapper

- `**attributes` Hash - Additional HTML attributes

#### Example

```ruby
render UI::Dialog::Overlay.new(open: false) do
  render UI::Dialog::Content.new do
    # Content here
  end
end
```

---

### UI::Dialog::Content

Main content area. Contains header, body, and footer.

#### Parameters

- `classes:` String - Additional Tailwind CSS classes (useful for customizing width)
  - Example: `"sm:max-w-[425px]"` or `"sm:max-w-[725px]"`

- `**attributes` Hash - Additional HTML attributes

#### Example

```ruby
render UI::Dialog::Content.new(classes: "sm:max-w-[425px]") do
  # Header, body, footer
end
```

---

### UI::Dialog::Header

Header section container for Title and Description.

#### Parameters

- `classes:` String - Additional Tailwind CSS classes

#### Example

```ruby
render UI::Dialog::Header.new do
  render UI::Dialog::Title.new do
    "Edit Profile"
  end
  render UI::Dialog::Description.new do
    "Make changes to your profile here."
  end
end
```

---

### UI::Dialog::Title

Dialog title. Renders as an `<h2>` with semantic styling.

#### Parameters

- `classes:` String - Additional Tailwind CSS classes to merge with defaults

**Default classes:** `"text-lg font-semibold"`

#### Example

```ruby
render UI::Dialog::Title.new do
  "Your Dialog Title"
end
```

---

### UI::Dialog::Description

Dialog description. Renders as a `<p>` with muted foreground color.

#### Parameters

- `classes:` String - Additional Tailwind CSS classes to merge with defaults

**Default classes:** `"text-muted-foreground text-sm"`

#### Example

```ruby
render UI::Dialog::Description.new do
  "This is a description of what the dialog does."
end
```

---

### UI::Dialog::Footer

Footer section for action buttons. Usually contains Close or action buttons.

#### Parameters

- `classes:` String - Additional Tailwind CSS classes

#### Example

```ruby
render UI::Dialog::Footer.new do
  render UI::Dialog::Close.new(variant: :outline) do
    "Cancel"
  end
  render UI::Dialog::Close.new(variant: :default) do
    "Save"
  end
end
```

---

### UI::Dialog::Close

Close button. Renders as a Button component with close action.

#### Parameters

- `variant:` Symbol - Button variant (from UI::Button)
  - Options: `:default`, `:outline`, `:destructive`, `:secondary`, `:ghost`
  - Default: `:outline`

- `size:` Symbol - Button size (from UI::Button)
  - Options: `:sm`, `:default`, `:lg`
  - Default: `:default`

- `classes:` String - Additional Tailwind CSS classes

- `**attributes` Hash - Additional HTML attributes

#### Example

```ruby
render UI::Dialog::Close.new(variant: :default, size: :lg) do
  "Save Changes"
end
```

## Examples

### Complete Edit Form Dialog

```ruby
render UI::Dialog::Dialog.new(open: false) do
  render UI::Dialog::Trigger.new do
    "Edit Profile"
  end

  render UI::Dialog::Overlay.new(open: false) do
    render UI::Dialog::Content.new(classes: "sm:max-w-[425px]") do
      render UI::Dialog::Header.new do
        render UI::Dialog::Title.new do
          "Edit profile"
        end
        render UI::Dialog::Description.new do
          "Make changes to your profile here. Click save when you're done."
        end
      end

      div(class: "grid gap-4 py-4") do
        div(class: "grid grid-cols-4 items-center gap-4") do
          label(for: "name", class: "text-right text-sm font-medium") { "Name" }
          input(id: "name", type: "text", value: "Pedro Duarte",
                class: "col-span-3 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm")
        end
        div(class: "grid grid-cols-4 items-center gap-4") do
          label(for: "username", class: "text-right text-sm font-medium") { "Username" }
          input(id: "username", type: "text", value: "@peduarte",
                class: "col-span-3 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm")
        end
      end

      render UI::Dialog::Footer.new do
        render UI::Dialog::Close.new do
          "Save changes"
        end
      end
    end
  end
end
```

### Dialog with asChild Composition

Use `as_child: true` on Trigger to merge dialog action directly into a Button without a wrapper:

```ruby
render UI::Dialog::Dialog.new(open: false) do
  render UI::Dialog::Trigger.new(as_child: true) do |trigger_attrs|
    render UI::Button::Button.new(**trigger_attrs, variant: :outline) do
      "Open with asChild"
    end
  end

  render UI::Dialog::Overlay.new(open: false) do
    render UI::Dialog::Content.new do
      render UI::Dialog::Header.new do
        render UI::Dialog::Title.new do
          "asChild Composition"
        end
        render UI::Dialog::Description.new do
          "This dialog was opened using asChild composition. The trigger button has no wrapper element!"
        end
      end

      render UI::Dialog::Footer.new do
        render UI::Dialog::Close.new do
          "Got it!"
        end
      end
    end
  end
end
```

### Confirmation Dialog (No Overlay Click)

Dialog that only closes via buttons or Escape key:

```ruby
render UI::Dialog::Dialog.new(open: false, close_on_overlay_click: false) do
  render UI::Button::Button.new(variant: :destructive, data: { action: "click->ui--dialog#open" }) do
    "Delete Account"
  end

  render UI::Dialog::Overlay.new(open: false) do
    render UI::Dialog::Content.new do
      render UI::Dialog::Header.new do
        render UI::Dialog::Title.new do
          "Are you sure?"
        end
        render UI::Dialog::Description.new do
          "This action cannot be undone. You must explicitly confirm or cancel."
        end
      end

      render UI::Dialog::Footer.new do
        render UI::Dialog::Close.new(variant: :outline) do
          "Cancel"
        end
        render UI::Dialog::Close.new(variant: :destructive) do
          "Delete"
        end
      end
    end
  end
end
```

### Custom Width Dialog

Use `classes:` parameter on Content to customize width:

```ruby
render UI::Dialog::Dialog.new(open: false) do
  render UI::Dialog::Trigger.new(as_child: true) do |trigger_attrs|
    render UI::Button::Button.new(**trigger_attrs, variant: :outline) do
      "View Details"
    end
  end

  render UI::Dialog::Overlay.new(open: false) do
    render UI::Dialog::Content.new(classes: "sm:max-w-[725px]") do
      render UI::Dialog::Header.new do
        render UI::Dialog::Title.new do
          "Share this document"
        end
        render UI::Dialog::Description.new do
          "Anyone with the link can view this document."
        end
      end

      div(class: "space-y-4 py-4") do
        # Large content goes here
      end

      render UI::Dialog::Footer.new do
        render UI::Dialog::Close.new do
          "Close"
        end
      end
    end
  end
end
```

## Common Patterns

### Multiple Close Buttons with Different Actions

```ruby
render UI::Dialog::Footer.new do
  render UI::Dialog::Close.new(variant: :outline) do
    "Cancel"
  end
  render UI::Dialog::Close.new(variant: :default) do
    "Save"
  end
  render UI::Dialog::Close.new(variant: :destructive) do
    "Delete"
  end
end
```

### Dialog with Custom Header Styling

```ruby
render UI::Dialog::Header.new(classes: "border-b pb-4") do
  render UI::Dialog::Title.new(classes: "text-xl text-destructive") do
    "Warning"
  end
  render UI::Dialog::Description.new do
    "This is a destructive action"
  end
end
```

### Dialog Without Description

Include only Title in Header:

```ruby
render UI::Dialog::Header.new do
  render UI::Dialog::Title.new do
    "Title Only"
  end
end
```

### Disabled Close Button

```ruby
render UI::Dialog::Close.new do
  # This renders as a Button with close action
  # To disable, you might want to use a different component or add disabled state
  "Save (processing...)"
end
```

## Accessibility

- **Keyboard Navigation**:
  - `Escape` - Close dialog (if `close_on_escape: true`)
  - `Tab` - Navigate between focusable elements
  - Focus is trapped within the dialog while open
  - Focus returns to trigger when dialog closes

- **ARIA Attributes**:
  - Dialog container has `role="dialog"` (managed by Stimulus controller)
  - Title is associated with dialog via `aria-labelledby`
  - Description is associated with dialog via `aria-describedby`
  - Overlay prevents interaction with background content (`aria-hidden="true"`)

- **Visual**:
  - Overlay provides visual separation
  - Clear, readable typography for Title and Description
  - Sufficient contrast for buttons

## Common Mistakes

### ❌ Wrong - Missing Overlay

```ruby
render UI::Dialog::Dialog.new do
  render UI::Dialog::Trigger.new do
    "Open"
  end

  # MISSING OVERLAY!
  render UI::Dialog::Content.new do
    render UI::Dialog::Title.new do
      "Title"
    end
  end
end
```

**Why it's wrong:** The Overlay component renders the backdrop and manages visual separation. Without it, the content appears floating without context.

### ✅ Correct - Include Overlay

```ruby
render UI::Dialog::Dialog.new do
  render UI::Dialog::Trigger.new do
    "Open"
  end

  render UI::Dialog::Overlay.new do
    render UI::Dialog::Content.new do
      render UI::Dialog::Title.new do
        "Title"
      end
    end
  end
end
```

---

### ❌ Wrong - Forgetting asChild When Composing with Button

```ruby
render UI::Dialog::Trigger.new do
  render UI::Button::Button.new(variant: :outline) do
    "Open Dialog"
  end
end
```

**Why it's wrong:** This creates a button wrapped in another element. The dialog action is on the wrapper, not the button. Better to use asChild.

### ✅ Correct - Use asChild

```ruby
render UI::Dialog::Trigger.new(as_child: true) do |trigger_attrs|
  render UI::Button::Button.new(**trigger_attrs, variant: :outline) do
    "Open Dialog"
  end
end
```

---

### ❌ Wrong - Not Yielding Attributes with asChild

```ruby
render UI::Dialog::Trigger.new(as_child: true) do
  # WRONG: Not using the yielded attributes!
  render UI::Button::Button.new(variant: :outline) do
    "Open Dialog"
  end
end
```

**Why it's wrong:** The block parameter contains the dialog action attributes (`data-action="click->ui--dialog#open"`). Without merging them, the dialog won't open.

### ✅ Correct - Merge Yielded Attributes

```ruby
render UI::Dialog::Trigger.new(as_child: true) do |trigger_attrs|
  render UI::Button::Button.new(**trigger_attrs, variant: :outline) do
    "Open Dialog"
  end
end
```

---

### ❌ Wrong - Wrong Structure (Content Inside Header)

```ruby
render UI::Dialog::Overlay.new do
  render UI::Dialog::Header.new do
    render UI::Dialog::Title.new do
      "Title"
    end
    # Content should NOT be here!
    div(class: "py-4") { "Form content" }
  end
end
```

**Why it's wrong:** Header is for Title and Description only. Content goes in the Content component.

### ✅ Correct - Proper Nesting

```ruby
render UI::Dialog::Overlay.new do
  render UI::Dialog::Content.new do
    render UI::Dialog::Header.new do
      render UI::Dialog::Title.new do
        "Title"
      end
    end

    div(class: "py-4") do
      "Form content goes here"
    end

    render UI::Dialog::Footer.new do
      render UI::Dialog::Close.new do
        "Close"
      end
    end
  end
end
```

---

### ❌ Wrong - Using String Instead of Symbol for Variant

```ruby
render UI::Dialog::Close.new(variant: "outline") do
  "Close"
end
```

**Why it's wrong:** Parameters expect symbols, not strings. This might silently fail or use wrong styling.

### ✅ Correct - Use Symbols

```ruby
render UI::Dialog::Close.new(variant: :outline) do
  "Close"
end
```

---

### ❌ Wrong - Forgetting to Yield Block Content

```ruby
render UI::Dialog::Title.new do
  # EMPTY - no content!
end
```

**Why it's wrong:** Dialog title will be empty or invisible.

### ✅ Correct - Provide Title Content

```ruby
render UI::Dialog::Title.new do
  "Edit Your Profile"
end
```

## Integration with Other Components

### With Form Component

```ruby
render UI::Dialog::Dialog.new do
  render UI::Dialog::Trigger.new(as_child: true) do |attrs|
    render UI::Button::Button.new(**attrs, variant: :outline) do
      "Edit"
    end
  end

  render UI::Dialog::Overlay.new do
    render UI::Dialog::Content.new do
      render UI::Dialog::Header.new do
        render UI::Dialog::Title.new do
          "Edit Item"
        end
      end

      form(method: :patch, action: "/items/1") do
        div(class: "space-y-4 py-4") do
          # Form fields here
        end

        render UI::Dialog::Footer.new do
          render UI::Dialog::Close.new(variant: :outline) do
            "Cancel"
          end
          button(type: :submit, class: "px-4 py-2") do
            "Save"
          end
        end
      end
    end
  end
end
```

### With Select Component

```ruby
render UI::Dialog::Dialog.new do
  render UI::Dialog::Trigger.new do
    "Choose Option"
  end

  render UI::Dialog::Overlay.new do
    render UI::Dialog::Content.new(classes: "sm:max-w-[300px]") do
      render UI::Dialog::Header.new do
        render UI::Dialog::Title.new do
          "Select an option"
        end
      end

      div(class: "py-4") do
        # render UI::Select::Select.new do
        #   # Options here
        # end
      end

      render UI::Dialog::Footer.new do
        render UI::Dialog::Close.new do
          "Done"
        end
      end
    end
  end
end
```

## See Also

- shadcn/ui: https://ui.shadcn.com/docs/components/dialog
- Radix UI: https://www.radix-ui.com/primitives/docs/components/dialog
- Button component: `docs/llm/phlex/button.md`
- Pattern docs: `docs/patterns/as_child.md`
