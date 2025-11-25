# Sheet - ViewComponent

## Component Path

```ruby
UI::Sheet::SheetComponent       # Main container
UI::Sheet::TriggerComponent     # Opens the sheet
UI::Sheet::OverlayComponent     # Backdrop and container
UI::Sheet::ContentComponent     # Main content area (with side variants)
UI::Sheet::HeaderComponent      # Header section
UI::Sheet::TitleComponent       # Sheet title (h2)
UI::Sheet::DescriptionComponent # Sheet description (p)
UI::Sheet::FooterComponent      # Footer section for actions
UI::Sheet::CloseComponent       # Close button
```

## Description

A sheet component that slides in from the edge of the screen. Extends the Dialog component to display content that complements the main content of the screen. Supports four sides (top, right, bottom, left) with slide animations.

**Key difference from Dialog:** Sheet uses slide animations instead of zoom/fade, and positions content at screen edges instead of center.

## Basic Usage

```erb
<%= render UI::Sheet::SheetComponent.new do %>
  <%= render UI::Sheet::TriggerComponent.new do %>
    Open Sheet
  <% end %>

  <%= render UI::Sheet::OverlayComponent.new do %>
    <%= render UI::Sheet::ContentComponent.new do %>
      <%= render UI::Sheet::HeaderComponent.new do %>
        <%= render UI::Sheet::TitleComponent.new do %>
          Sheet Title
        <% end %>
        <%= render UI::Sheet::DescriptionComponent.new do %>
          Sheet description goes here
        <% end %>
      <% end %>

      <!-- Your content here -->

      <%= render UI::Sheet::FooterComponent.new do %>
        <%= render UI::Sheet::CloseComponent.new do %>
          Close
        <% end %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

## Parameters

### UI::Sheet::SheetComponent

Main container that manages sheet state and behavior. Uses the same `ui--dialog` Stimulus controller as Dialog.

**Optional:**
- `open:` Boolean - Initial open state
  - Default: `false`
- `close_on_escape:` Boolean - Close on Escape key
  - Default: `true`
- `close_on_overlay_click:` Boolean - Close on overlay click
  - Default: `true`
- `classes:` String - Additional Tailwind CSS classes
- `**attributes` Hash - Additional HTML attributes

```erb
<%= render UI::Sheet::SheetComponent.new(open: false, close_on_escape: true, close_on_overlay_click: true) do %>
  <!-- content -->
<% end %>
```

---

### UI::Sheet::TriggerComponent

Opens the sheet when clicked. Supports asChild composition.

**Optional:**
- `as_child:` Boolean - Enable composition pattern
  - When `true`, yields attributes hash to block instead of rendering button
  - Default: `false`
- `**attributes` Hash - Additional HTML attributes

```erb
<!-- Default (button wrapper) -->
<%= render UI::Sheet::TriggerComponent.new do %>
  Edit Profile
<% end %>

<!-- With asChild (custom composition) -->
<%= render UI::Sheet::TriggerComponent.new(as_child: true) do %>
  <%= render UI::Button::ButtonComponent.new(variant: :outline) do %>
    Edit Profile
  <% end %>
<% end %>
```

**Note:** ViewComponent's `as_child` doesn't require explicit attribute merging - attributes are automatically applied to the first child element.

---

### UI::Sheet::OverlayComponent

Renders the backdrop and container for sheet content.

**Optional:**
- `open:` Boolean - Current open state
  - Default: `false`
- `classes:` String - Additional Tailwind CSS classes
- `**attributes` Hash - Additional HTML attributes

```erb
<%= render UI::Sheet::OverlayComponent.new(open: false) do %>
  <%= render UI::Sheet::ContentComponent.new do %>
    <!-- content -->
  <% end %>
<% end %>
```

---

### UI::Sheet::ContentComponent

Main content area with side positioning and slide animations.

**Optional:**
- `side:` String - Position of the sheet
  - Options: `"top"`, `"right"`, `"bottom"`, `"left"`
  - Default: `"right"`
- `open:` Boolean - Current open state
  - Default: `false`
- `show_close:` Boolean - Show built-in close button (X)
  - Default: `true`
- `classes:` String - Additional Tailwind CSS classes
  - Example: `"sm:max-w-xl"` for wider sheet
- `**attributes` Hash - Additional HTML attributes

#### Side Variants

| Side | Position | Default Size | Border |
|------|----------|--------------|--------|
| `"right"` | Right edge, full height | `w-3/4 sm:max-w-sm` | Left border |
| `"left"` | Left edge, full height | `w-3/4 sm:max-w-sm` | Right border |
| `"top"` | Top edge, auto height | Full width | Bottom border |
| `"bottom"` | Bottom edge, auto height | Full width | Top border |

```erb
<%= render UI::Sheet::ContentComponent.new(side: "left", classes: "sm:max-w-md") do %>
  <!-- Header, body, footer -->
<% end %>
```

---

### UI::Sheet::HeaderComponent

Header section container.

**Optional:**
- `classes:` String - Additional Tailwind CSS classes
- `**attributes` Hash - Additional HTML attributes

**Default classes:** `"flex flex-col gap-1.5 p-4"`

```erb
<%= render UI::Sheet::HeaderComponent.new do %>
  <%= render UI::Sheet::TitleComponent.new do %>
    Edit Profile
  <% end %>
  <%= render UI::Sheet::DescriptionComponent.new do %>
    Make changes to your profile here.
  <% end %>
<% end %>
```

---

### UI::Sheet::TitleComponent

Sheet title (renders as `<h2>`).

**Optional:**
- `classes:` String - Additional Tailwind CSS classes
- `**attributes` Hash - Additional HTML attributes

**Default classes:** `"text-lg font-semibold"`

```erb
<%= render UI::Sheet::TitleComponent.new do %>
  Your Sheet Title
<% end %>
```

---

### UI::Sheet::DescriptionComponent

Sheet description (renders as `<p>`).

**Optional:**
- `classes:` String - Additional Tailwind CSS classes
- `**attributes` Hash - Additional HTML attributes

**Default classes:** `"text-muted-foreground text-sm"`

```erb
<%= render UI::Sheet::DescriptionComponent.new do %>
  This is a description of what the sheet does.
<% end %>
```

---

### UI::Sheet::FooterComponent

Footer section for action buttons.

**Optional:**
- `classes:` String - Additional Tailwind CSS classes
- `**attributes` Hash - Additional HTML attributes

**Default classes:** `"mt-auto flex flex-col gap-2 p-4"`

```erb
<%= render UI::Sheet::FooterComponent.new do %>
  <%= render UI::Sheet::CloseComponent.new(variant: :outline) do %>
    Cancel
  <% end %>
  <%= render UI::Button::ButtonComponent.new(variant: :default) do %>
    Save
  <% end %>
<% end %>
```

---

### UI::Sheet::CloseComponent

Close button. Supports both default button rendering and asChild composition.

**Optional:**
- `as_child:` Boolean - Enable composition pattern
  - Default: `false`
- `variant:` Symbol - Button variant (when not using asChild)
  - Options: `:default`, `:outline`, `:destructive`, `:secondary`, `:ghost`
  - Default: `:outline`
- `size:` Symbol - Button size (when not using asChild)
  - Options: `:sm`, `:default`, `:lg`
  - Default: `:default`
- `classes:` String - Additional Tailwind CSS classes
- `**attributes` Hash - Additional HTML attributes

```erb
<!-- Default (renders as Button) -->
<%= render UI::Sheet::CloseComponent.new(variant: :default) do %>
  Save Changes
<% end %>

<!-- With asChild -->
<%= render UI::Sheet::CloseComponent.new(as_child: true) do %>
  <%= render UI::Button::ButtonComponent.new(variant: :outline) do %>
    Close
  <% end %>
<% end %>
```

## Sub-Components

The Sheet component is composed of the following sub-components:

- **SheetComponent** - Main container and state manager
- **TriggerComponent** - Button or element that opens the sheet
- **OverlayComponent** - Backdrop and content wrapper
- **ContentComponent** - Main sheet content area (with side positioning)
- **HeaderComponent** - Header section (contains Title and Description)
- **TitleComponent** - Sheet title (h2 element)
- **DescriptionComponent** - Sheet description (p element)
- **FooterComponent** - Footer section for actions
- **CloseComponent** - Close button (renders as Button)

## Examples

### Complete Edit Form Sheet

```erb
<%= render UI::Sheet::SheetComponent.new do %>
  <%= render UI::Sheet::TriggerComponent.new(as_child: true) do %>
    <%= render UI::Button::ButtonComponent.new(variant: :outline) do %>
      Edit Profile
    <% end %>
  <% end %>

  <%= render UI::Sheet::OverlayComponent.new do %>
    <%= render UI::Sheet::ContentComponent.new do %>
      <%= render UI::Sheet::HeaderComponent.new do %>
        <%= render UI::Sheet::TitleComponent.new do %>
          Edit profile
        <% end %>
        <%= render UI::Sheet::DescriptionComponent.new do %>
          Make changes to your profile here. Click save when you're done.
        <% end %>
      <% end %>

      <div class="grid flex-1 auto-rows-min gap-6 px-4">
        <div class="grid gap-3">
          <label for="vc-name" class="text-sm font-medium">Name</label>
          <input id="vc-name" type="text" value="Pedro Duarte"
                 class="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm" />
        </div>
        <div class="grid gap-3">
          <label for="vc-username" class="text-sm font-medium">Username</label>
          <input id="vc-username" type="text" value="@peduarte"
                 class="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm" />
        </div>
      </div>

      <%= render UI::Sheet::FooterComponent.new do %>
        <%= render UI::Button::ButtonComponent.new(variant: :default) do %>
          Save changes
        <% end %>
        <%= render UI::Sheet::CloseComponent.new(as_child: true) do %>
          <%= render UI::Button::ButtonComponent.new(variant: :outline) do %>
            Close
          <% end %>
        <% end %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### Side Variants

```erb
<div class="flex flex-wrap gap-4">
  <% %w[top right bottom left].each do |side| %>
    <%= render UI::Sheet::SheetComponent.new do %>
      <%= render UI::Sheet::TriggerComponent.new(as_child: true) do %>
        <%= render UI::Button::ButtonComponent.new(variant: :outline) do %>
          <%= side.capitalize %>
        <% end %>
      <% end %>

      <%= render UI::Sheet::OverlayComponent.new do %>
        <%= render UI::Sheet::ContentComponent.new(side: side) do %>
          <%= render UI::Sheet::HeaderComponent.new do %>
            <%= render UI::Sheet::TitleComponent.new do %>
              <%= side.capitalize %> Sheet
            <% end %>
            <%= render UI::Sheet::DescriptionComponent.new do %>
              This sheet slides in from the <%= side %> side.
            <% end %>
          <% end %>

          <div class="p-4 flex-1">
            <p class="text-sm text-muted-foreground">Sheet content goes here.</p>
          </div>

          <%= render UI::Sheet::FooterComponent.new do %>
            <%= render UI::Sheet::CloseComponent.new do %>
              Close
            <% end %>
          <% end %>
        <% end %>
      <% end %>
    <% end %>
  <% end %>
</div>
```

### Custom Width Sheet

```erb
<%= render UI::Sheet::SheetComponent.new do %>
  <%= render UI::Sheet::TriggerComponent.new(as_child: true) do %>
    <%= render UI::Button::ButtonComponent.new(variant: :outline) do %>
      Wide Sheet
    <% end %>
  <% end %>

  <%= render UI::Sheet::OverlayComponent.new do %>
    <%= render UI::Sheet::ContentComponent.new(classes: "sm:max-w-xl") do %>
      <%= render UI::Sheet::HeaderComponent.new do %>
        <%= render UI::Sheet::TitleComponent.new do %>
          Wide Sheet
        <% end %>
        <%= render UI::Sheet::DescriptionComponent.new do %>
          This sheet has a custom width of sm:max-w-xl.
        <% end %>
      <% end %>

      <div class="p-4 flex-1">
        <p class="text-sm text-muted-foreground">More space for content!</p>
      </div>

      <%= render UI::Sheet::FooterComponent.new do %>
        <%= render UI::Sheet::CloseComponent.new do %>
          Close
        <% end %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### Without Built-in Close Button

```erb
<%= render UI::Sheet::SheetComponent.new do %>
  <%= render UI::Sheet::TriggerComponent.new(as_child: true) do %>
    <%= render UI::Button::ButtonComponent.new(variant: :outline) do %>
      No X Button
    <% end %>
  <% end %>

  <%= render UI::Sheet::OverlayComponent.new do %>
    <%= render UI::Sheet::ContentComponent.new(show_close: false) do %>
      <%= render UI::Sheet::HeaderComponent.new do %>
        <%= render UI::Sheet::TitleComponent.new do %>
          Custom Close
        <% end %>
        <%= render UI::Sheet::DescriptionComponent.new do %>
          This sheet doesn't have the default X button. Use the footer button to close.
        <% end %>
      <% end %>

      <div class="p-4 flex-1">
        <p class="text-sm text-muted-foreground">You can still close by clicking the overlay or pressing Escape.</p>
      </div>

      <%= render UI::Sheet::FooterComponent.new do %>
        <%= render UI::Sheet::CloseComponent.new(variant: :default) do %>
          Close Sheet
        <% end %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

## Common Mistakes

### ❌ Wrong - Missing "Component" Suffix

```erb
<%= render UI::Sheet::Sheet.new do %>  <!-- Wrong! -->
  <!-- content -->
<% end %>
```

**Why it's wrong:** ViewComponents use the `Component` suffix.

### ✅ Correct - Include Component Suffix

```erb
<%= render UI::Sheet::SheetComponent.new do %>
  <!-- content -->
<% end %>
```

---

### ❌ Wrong - Missing Overlay

```erb
<%= render UI::Sheet::SheetComponent.new do %>
  <%= render UI::Sheet::TriggerComponent.new do %>
    Open
  <% end %>

  <!-- MISSING OVERLAY! -->
  <%= render UI::Sheet::ContentComponent.new do %>
    <%= render UI::Sheet::TitleComponent.new do %>
      Title
    <% end %>
  <% end %>
<% end %>
```

**Why it's wrong:** The Overlay component renders the backdrop. Without it, the content appears floating without visual separation.

### ✅ Correct - Include Overlay

```erb
<%= render UI::Sheet::SheetComponent.new do %>
  <%= render UI::Sheet::TriggerComponent.new do %>
    Open
  <% end %>

  <%= render UI::Sheet::OverlayComponent.new do %>
    <%= render UI::Sheet::ContentComponent.new do %>
      <%= render UI::Sheet::TitleComponent.new do %>
        Title
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

---

### ❌ Wrong - String Instead of Symbol for Variant

```erb
<%= render UI::Sheet::CloseComponent.new(variant: "outline") do %>
  Close
<% end %>
```

**Why it's wrong:** Parameters expect symbols (`:outline`), not strings (`"outline"`). This will use incorrect styling.

### ✅ Correct - Use Symbol

```erb
<%= render UI::Sheet::CloseComponent.new(variant: :outline) do %>
  Close
<% end %>
```

---

### ❌ Wrong - Missing <%= for Output

```erb
<% render UI::Sheet::SheetComponent.new do %>
  <!-- This won't render! -->
<% end %>
```

**Why it's wrong:** `<% %>` executes Ruby but doesn't output. Use `<%= %>` to render components.

### ✅ Correct - Use <%= to Output

```erb
<%= render UI::Sheet::SheetComponent.new do %>
  <!-- This will render -->
<% end %>
```

---

### ❌ Wrong - Mixing Phlex and ViewComponent

```erb
<%= render UI::Sheet::SheetComponent.new do %>
  <%= render UI::Sheet::Trigger.new do %>  <!-- Phlex component! -->
    Open
  <% end %>
<% end %>
```

**Why it's wrong:** Don't mix Phlex components (without `Component` suffix) with ViewComponents.

### ✅ Correct - Consistent Component Type

```erb
<%= render UI::Sheet::SheetComponent.new do %>
  <%= render UI::Sheet::TriggerComponent.new do %>
    Open
  <% end %>
<% end %>
```

## Accessibility

- **Keyboard Navigation**:
  - `Escape` key closes the sheet (if `close_on_escape: true`)
  - `Tab` navigates between focusable elements
  - Focus is trapped within the sheet while open
  - Focus returns to trigger when sheet closes

- **ARIA Attributes**:
  - Sheet container has `role="dialog"`
  - Title is associated via `aria-labelledby`
  - Description is associated via `aria-describedby`
  - Overlay has `aria-hidden="true"` to hide from screen readers

- **Visual**:
  - Overlay provides clear visual separation
  - Readable typography for Title and Description
  - High contrast buttons for accessibility

## Sheet vs Dialog

| Feature | Sheet | Dialog |
|---------|-------|--------|
| Position | Screen edge | Center |
| Animation | Slide | Zoom + Fade |
| Use case | Navigation, forms | Confirmations, alerts |
| Header/Footer | Vertical flex | Standard |

## See Also

- Phlex docs: `docs/llm/phlex/sheet.md`
- ERB docs: `docs/llm/erb/sheet.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/sheet
- Dialog component: `docs/llm/vc/dialog.md`
- Button component: `docs/llm/vc/button.md`
