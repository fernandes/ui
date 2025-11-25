# Sheet - ERB

## Component Path

```erb
<%= render "ui/sheet/sheet" %>
<%= render "ui/sheet/trigger" %>
<%= render "ui/sheet/overlay" %>
<%= render "ui/sheet/content" %>
<%= render "ui/sheet/header" %>
<%= render "ui/sheet/title" %>
<%= render "ui/sheet/description" %>
<%= render "ui/sheet/footer" %>
<%= render "ui/sheet/close" %>
```

## Description

A sheet component that slides in from the edge of the screen. Extends the Dialog component to display content that complements the main content of the screen. Supports four sides (top, right, bottom, left) with slide animations.

**Key difference from Dialog:** Sheet uses slide animations instead of zoom/fade, and positions content at screen edges instead of center.

## Basic Usage

```erb
<%= render "ui/sheet/sheet" do %>
  <%= render "ui/sheet/trigger" do %>
    Open Sheet
  <% end %>

  <%= render "ui/sheet/overlay" do %>
    <%= render "ui/sheet/content" do %>
      <%= render "ui/sheet/header" do %>
        <%= render "ui/sheet/title" do %>
          Sheet Title
        <% end %>
        <%= render "ui/sheet/description" do %>
          Sheet description goes here
        <% end %>
      <% end %>

      <!-- Your content here -->

      <%= render "ui/sheet/footer" do %>
        <%= render "ui/sheet/close" do %>
          Close
        <% end %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

## Parameters

### ui/sheet/sheet

Main container that manages sheet state and behavior. Uses the same `ui--dialog` Stimulus controller as Dialog.

**Optional:**
- `open:` Boolean - Initial open state
  - Default: `false`
- `close_on_escape:` Boolean - Close on Escape key
  - Default: `true`
- `close_on_overlay_click:` Boolean - Close on overlay click
  - Default: `true`
- `classes:` String - Additional Tailwind CSS classes

```erb
<%= render "ui/sheet/sheet", open: false, close_on_escape: true, close_on_overlay_click: true do %>
  <!-- content -->
<% end %>
```

---

### ui/sheet/trigger

Opens the sheet when clicked. Supports asChild composition.

**Optional:**
- `as_child:` Boolean - Enable composition pattern
  - When `true`, yields attributes hash to block instead of rendering button
  - Default: `false`

```erb
<!-- Default (button wrapper) -->
<%= render "ui/sheet/trigger" do %>
  Edit Profile
<% end %>

<!-- With asChild (custom composition) -->
<%= render "ui/sheet/trigger", as_child: true do |attrs| %>
  <%= render "ui/button/button", variant: :outline, attributes: attrs do %>
    Edit Profile
  <% end %>
<% end %>
```

---

### ui/sheet/overlay

Renders the backdrop and container for sheet content.

**Optional:**
- `open:` Boolean - Current open state
  - Default: `false`
- `classes:` String - Additional Tailwind CSS classes

```erb
<%= render "ui/sheet/overlay", open: false do %>
  <%= render "ui/sheet/content" do %>
    <!-- content -->
  <% end %>
<% end %>
```

---

### ui/sheet/content

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

#### Side Variants

| Side | Position | Default Size | Border |
|------|----------|--------------|--------|
| `"right"` | Right edge, full height | `w-3/4 sm:max-w-sm` | Left border |
| `"left"` | Left edge, full height | `w-3/4 sm:max-w-sm` | Right border |
| `"top"` | Top edge, auto height | Full width | Bottom border |
| `"bottom"` | Bottom edge, auto height | Full width | Top border |

```erb
<%= render "ui/sheet/content", side: "left", classes: "sm:max-w-md" do %>
  <!-- Header, body, footer -->
<% end %>
```

---

### ui/sheet/header

Header section container.

**Optional:**
- `classes:` String - Additional Tailwind CSS classes

**Default classes:** `"flex flex-col gap-1.5 p-4"`

```erb
<%= render "ui/sheet/header" do %>
  <%= render "ui/sheet/title" do %>
    Edit Profile
  <% end %>
  <%= render "ui/sheet/description" do %>
    Make changes to your profile here.
  <% end %>
<% end %>
```

---

### ui/sheet/title

Sheet title (renders as `<h2>`).

**Optional:**
- `classes:` String - Additional Tailwind CSS classes

**Default classes:** `"text-lg font-semibold"`

```erb
<%= render "ui/sheet/title" do %>
  Your Sheet Title
<% end %>
```

---

### ui/sheet/description

Sheet description (renders as `<p>`).

**Optional:**
- `classes:` String - Additional Tailwind CSS classes

**Default classes:** `"text-muted-foreground text-sm"`

```erb
<%= render "ui/sheet/description" do %>
  This is a description of what the sheet does.
<% end %>
```

---

### ui/sheet/footer

Footer section for action buttons.

**Optional:**
- `classes:` String - Additional Tailwind CSS classes

**Default classes:** `"mt-auto flex flex-col gap-2 p-4"`

```erb
<%= render "ui/sheet/footer" do %>
  <%= render "ui/sheet/close", variant: :outline do %>
    Cancel
  <% end %>
  <%= render "ui/button/button", variant: :default do %>
    Save
  <% end %>
<% end %>
```

---

### ui/sheet/close

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

```erb
<!-- Default (renders as Button) -->
<%= render "ui/sheet/close", variant: :default do %>
  Save Changes
<% end %>

<!-- With asChild -->
<%= render "ui/sheet/close", as_child: true do |attrs| %>
  <%= render "ui/button/button", variant: :outline, attributes: attrs do %>
    Close
  <% end %>
<% end %>
```

## Sub-Components

The Sheet component is composed of the following sub-components:

- **sheet** - Main container and state manager
- **trigger** - Button or element that opens the sheet
- **overlay** - Backdrop and content wrapper
- **content** - Main sheet content area (with side positioning)
- **header** - Header section (contains Title and Description)
- **title** - Sheet title (h2 element)
- **description** - Sheet description (p element)
- **footer** - Footer section for actions
- **close** - Close button (renders as Button)

## Examples

### Complete Edit Form Sheet

```erb
<%= render "ui/sheet/sheet" do %>
  <%= render "ui/sheet/trigger", as_child: true do |attrs| %>
    <%= render "ui/button/button", variant: :outline, attributes: attrs do %>
      Edit Profile
    <% end %>
  <% end %>

  <%= render "ui/sheet/overlay" do %>
    <%= render "ui/sheet/content" do %>
      <%= render "ui/sheet/header" do %>
        <%= render "ui/sheet/title" do %>
          Edit profile
        <% end %>
        <%= render "ui/sheet/description" do %>
          Make changes to your profile here. Click save when you're done.
        <% end %>
      <% end %>

      <div class="grid flex-1 auto-rows-min gap-6 px-4">
        <div class="grid gap-3">
          <label for="name" class="text-sm font-medium">Name</label>
          <input id="name" type="text" value="Pedro Duarte"
                 class="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm" />
        </div>
        <div class="grid gap-3">
          <label for="username" class="text-sm font-medium">Username</label>
          <input id="username" type="text" value="@peduarte"
                 class="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm" />
        </div>
      </div>

      <%= render "ui/sheet/footer" do %>
        <%= render "ui/button/button", variant: :default do %>
          Save changes
        <% end %>
        <%= render "ui/sheet/close", as_child: true do |attrs| %>
          <%= render "ui/button/button", variant: :outline, attributes: attrs do %>
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
    <%= render "ui/sheet/sheet" do %>
      <%= render "ui/sheet/trigger", as_child: true do |attrs| %>
        <%= render "ui/button/button", variant: :outline, attributes: attrs do %>
          <%= side.capitalize %>
        <% end %>
      <% end %>

      <%= render "ui/sheet/overlay" do %>
        <%= render "ui/sheet/content", side: side do %>
          <%= render "ui/sheet/header" do %>
            <%= render "ui/sheet/title" do %>
              <%= side.capitalize %> Sheet
            <% end %>
            <%= render "ui/sheet/description" do %>
              This sheet slides in from the <%= side %> side of the screen.
            <% end %>
          <% end %>

          <div class="p-4 flex-1">
            <p class="text-sm text-muted-foreground">Sheet content goes here.</p>
          </div>

          <%= render "ui/sheet/footer" do %>
            <%= render "ui/sheet/close" do %>
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
<%= render "ui/sheet/sheet" do %>
  <%= render "ui/sheet/trigger", as_child: true do |attrs| %>
    <%= render "ui/button/button", variant: :outline, attributes: attrs do %>
      Wide Sheet
    <% end %>
  <% end %>

  <%= render "ui/sheet/overlay" do %>
    <%= render "ui/sheet/content", classes: "sm:max-w-xl" do %>
      <%= render "ui/sheet/header" do %>
        <%= render "ui/sheet/title" do %>
          Wide Sheet
        <% end %>
        <%= render "ui/sheet/description" do %>
          This sheet has a custom width of sm:max-w-xl.
        <% end %>
      <% end %>

      <div class="p-4 flex-1">
        <p class="text-sm text-muted-foreground">More space for content!</p>
      </div>

      <%= render "ui/sheet/footer" do %>
        <%= render "ui/sheet/close" do %>
          Close
        <% end %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### Without Built-in Close Button

```erb
<%= render "ui/sheet/sheet" do %>
  <%= render "ui/sheet/trigger", as_child: true do |attrs| %>
    <%= render "ui/button/button", variant: :outline, attributes: attrs do %>
      No X Button
    <% end %>
  <% end %>

  <%= render "ui/sheet/overlay" do %>
    <%= render "ui/sheet/content", show_close: false do %>
      <%= render "ui/sheet/header" do %>
        <%= render "ui/sheet/title" do %>
          Custom Close
        <% end %>
        <%= render "ui/sheet/description" do %>
          This sheet doesn't have the default X button. Use the footer button to close.
        <% end %>
      <% end %>

      <div class="p-4 flex-1">
        <p class="text-sm text-muted-foreground">You can still close by clicking the overlay or pressing Escape.</p>
      </div>

      <%= render "ui/sheet/footer" do %>
        <%= render "ui/sheet/close", variant: :default do %>
          Close Sheet
        <% end %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

## Common Mistakes

### ❌ Wrong - Missing Overlay

```erb
<%= render "ui/sheet/sheet" do %>
  <%= render "ui/sheet/trigger" do %>
    Open
  <% end %>

  <!-- MISSING OVERLAY! -->
  <%= render "ui/sheet/content" do %>
    <%= render "ui/sheet/title" do %>
      Title
    <% end %>
  <% end %>
<% end %>
```

**Why it's wrong:** The Overlay component renders the backdrop. Without it, the content appears floating without visual separation.

### ✅ Correct - Include Overlay

```erb
<%= render "ui/sheet/sheet" do %>
  <%= render "ui/sheet/trigger" do %>
    Open
  <% end %>

  <%= render "ui/sheet/overlay" do %>
    <%= render "ui/sheet/content" do %>
      <%= render "ui/sheet/title" do %>
        Title
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

---

### ❌ Wrong - String Instead of Symbol for Variant

```erb
<%= render "ui/sheet/close", variant: "outline" do %>
  Close
<% end %>
```

**Why it's wrong:** Parameters expect symbols (`:outline`), not strings (`"outline"`). This will use incorrect styling.

### ✅ Correct - Use Symbol

```erb
<%= render "ui/sheet/close", variant: :outline do %>
  Close
<% end %>
```

---

### ❌ Wrong - Missing <%= for Output

```erb
<% render "ui/sheet/sheet" do %>
  <!-- This won't render! -->
<% end %>
```

**Why it's wrong:** `<% %>` executes Ruby but doesn't output. Use `<%= %>` to render components.

### ✅ Correct - Use <%= to Output

```erb
<%= render "ui/sheet/sheet" do %>
  <!-- This will render -->
<% end %>
```

---

### ❌ Wrong - Not Using Yielded Attributes with asChild

```erb
<%= render "ui/sheet/trigger", as_child: true do |attrs| %>
  <!-- WRONG: Not using the yielded attributes! -->
  <%= render "ui/button/button", variant: :outline do %>
    Open Sheet
  <% end %>
<% end %>
```

**Why it's wrong:** The block parameter contains the sheet action attributes. Without merging them, the sheet won't open.

### ✅ Correct - Merge Yielded Attributes

```erb
<%= render "ui/sheet/trigger", as_child: true do |attrs| %>
  <%= render "ui/button/button", variant: :outline, attributes: attrs do %>
    Open Sheet
  <% end %>
<% end %>
```

---

### ❌ Wrong - Content Inside Header

```erb
<%= render "ui/sheet/header" do %>
  <%= render "ui/sheet/title" do %>
    Title
  <% end %>
  <!-- Content should NOT be here! -->
  <div class="py-4">Form content</div>
<% end %>
```

**Why it's wrong:** Header is for Title and Description only. Form content belongs in the Content component.

### ✅ Correct - Proper Nesting

```erb
<%= render "ui/sheet/header" do %>
  <%= render "ui/sheet/title" do %>
    Title
  <% end %>
<% end %>

<div class="py-4">
  Form content goes here
</div>

<%= render "ui/sheet/footer" do %>
  <%= render "ui/sheet/close" do %>
    Close
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
- ViewComponent docs: `docs/llm/vc/sheet.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/sheet
- Dialog component: `docs/llm/erb/dialog.md`
- Button component: `docs/llm/erb/button.md`
