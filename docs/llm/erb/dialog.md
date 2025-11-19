# Dialog - ERB

## Component Path

```erb
<%= render UI::Dialog::Dialog.new %>
<%= render UI::Dialog::Trigger.new %>
<%= render UI::Dialog::Overlay.new %>
<%= render UI::Dialog::Content.new %>
<%= render UI::Dialog::Header.new %>
<%= render UI::Dialog::Title.new %>
<%= render UI::Dialog::Description.new %>
<%= render UI::Dialog::Footer.new %>
<%= render UI::Dialog::Close.new %>
```

## Description

A window overlaid on either the primary window or another dialog window, rendering the content underneath inert. Supports keyboard navigation (Escape to close), focus management, and prevents background scrolling.

## Basic Usage

```erb
<%= render UI::Dialog::Dialog.new do %>
  <%= render UI::Dialog::Trigger.new do %>
    Open Dialog
  <% end %>

  <%= render UI::Dialog::Overlay.new do %>
    <%= render UI::Dialog::Content.new do %>
      <%= render UI::Dialog::Header.new do %>
        <%= render UI::Dialog::Title.new do %>
          Dialog Title
        <% end %>
        <%= render UI::Dialog::Description.new do %>
          Dialog description goes here
        <% end %>
      <% end %>

      <!-- Your content here -->

      <%= render UI::Dialog::Footer.new do %>
        <%= render UI::Dialog::Close.new do %>
          Close
        <% end %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

## Parameters

### UI::Dialog::Dialog

Main container that manages dialog state and behavior.

**Optional:**
- `open:` Symbol - Initial open state (`:true` or `:false`)
  - Default: `false`
- `close_on_escape:` Symbol - Close on Escape key
  - Default: `true`
- `close_on_overlay_click:` Symbol - Close on overlay click
  - Default: `true`
- `classes:` String - Additional Tailwind CSS classes

```erb
<%= render UI::Dialog::Dialog.new(open: false, close_on_escape: true, close_on_overlay_click: true) do %>
  <!-- content -->
<% end %>
```

---

### UI::Dialog::Trigger

Opens the dialog when clicked. Supports asChild composition.

**Optional:**
- `as_child:` Symbol - Enable composition pattern
  - When `:true`, yields attributes hash to block instead of rendering button
  - Default: `false`

```erb
<!-- Default (button wrapper) -->
<%= render UI::Dialog::Trigger.new do %>
  Edit Profile
<% end %>

<!-- With asChild (custom composition) -->
<%= render UI::Dialog::Trigger.new(as_child: true) do |trigger_attrs| %>
  <%= render UI::Button::Button.new(**trigger_attrs, variant: :outline) do %>
    Edit Profile
  <% end %>
<% end %>
```

---

### UI::Dialog::Overlay

Renders the backdrop and container for dialog content.

**Optional:**
- `open:` Symbol - Current open state
  - Default: `false`
- `classes:` String - Additional Tailwind CSS classes

```erb
<%= render UI::Dialog::Overlay.new(open: false) do %>
  <%= render UI::Dialog::Content.new do %>
    <!-- content -->
  <% end %>
<% end %>
```

---

### UI::Dialog::Content

Main content area for header, body, and footer.

**Optional:**
- `classes:` String - Additional Tailwind CSS classes
  - Example: `"sm:max-w-[425px]"` for custom width

```erb
<%= render UI::Dialog::Content.new(classes: "sm:max-w-[425px]") do %>
  <!-- Header, body, footer -->
<% end %>
```

---

### UI::Dialog::Header

Header section container.

**Optional:**
- `classes:` String - Additional Tailwind CSS classes

```erb
<%= render UI::Dialog::Header.new do %>
  <%= render UI::Dialog::Title.new do %>
    Edit Profile
  <% end %>
  <%= render UI::Dialog::Description.new do %>
    Make changes to your profile here.
  <% end %>
<% end %>
```

---

### UI::Dialog::Title

Dialog title (renders as `<h2>`).

**Optional:**
- `classes:` String - Additional Tailwind CSS classes

**Default classes:** `"text-lg font-semibold"`

```erb
<%= render UI::Dialog::Title.new do %>
  Your Dialog Title
<% end %>
```

---

### UI::Dialog::Description

Dialog description (renders as `<p>`).

**Optional:**
- `classes:` String - Additional Tailwind CSS classes

**Default classes:** `"text-muted-foreground text-sm"`

```erb
<%= render UI::Dialog::Description.new do %>
  This is a description of what the dialog does.
<% end %>
```

---

### UI::Dialog::Footer

Footer section for action buttons.

**Optional:**
- `classes:` String - Additional Tailwind CSS classes

```erb
<%= render UI::Dialog::Footer.new do %>
  <%= render UI::Dialog::Close.new(variant: :outline) do %>
    Cancel
  <% end %>
  <%= render UI::Dialog::Close.new(variant: :default) do %>
    Save
  <% end %>
<% end %>
```

---

### UI::Dialog::Close

Close button (renders as Button component).

**Optional:**
- `variant:` Symbol - Button variant
  - Options: `:default`, `:outline`, `:destructive`, `:secondary`, `:ghost`
  - Default: `:outline`
- `size:` Symbol - Button size
  - Options: `:sm`, `:default`, `:lg`
  - Default: `:default`
- `classes:` String - Additional Tailwind CSS classes

```erb
<%= render UI::Dialog::Close.new(variant: :default, size: :lg) do %>
  Save Changes
<% end %>
```

## Sub-Components

The Dialog component is composed of the following sub-components:

- **Dialog** - Main container and state manager
- **Trigger** - Button or element that opens the dialog
- **Overlay** - Backdrop and content wrapper
- **Content** - Main dialog content area
- **Header** - Header section (contains Title and Description)
- **Title** - Dialog title (h2 element)
- **Description** - Dialog description (p element)
- **Footer** - Footer section for actions
- **Close** - Close button (renders as Button)

## Examples

### Complete Edit Form Dialog

```erb
<%= render UI::Dialog::Dialog.new(open: false) do %>
  <%= render UI::Dialog::Trigger.new do %>
    Edit Profile
  <% end %>

  <%= render UI::Dialog::Overlay.new(open: false) do %>
    <%= render UI::Dialog::Content.new(classes: "sm:max-w-[425px]") do %>
      <%= render UI::Dialog::Header.new do %>
        <%= render UI::Dialog::Title.new do %>
          Edit profile
        <% end %>
        <%= render UI::Dialog::Description.new do %>
          Make changes to your profile here. Click save when you're done.
        <% end %>
      <% end %>

      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <label for="name" class="text-right text-sm font-medium">Name</label>
          <input id="name" type="text" value="Pedro Duarte"
                 class="col-span-3 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <label for="username" class="text-right text-sm font-medium">Username</label>
          <input id="username" type="text" value="@peduarte"
                 class="col-span-3 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm" />
        </div>
      </div>

      <%= render UI::Dialog::Footer.new do %>
        <%= render UI::Dialog::Close.new do %>
          Save changes
        <% end %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### Dialog with asChild Composition

Use `as_child: true` to merge dialog action directly into Button without a wrapper:

```erb
<%= render UI::Dialog::Dialog.new(open: false) do %>
  <%= render UI::Dialog::Trigger.new(as_child: true) do |trigger_attrs| %>
    <%= render UI::Button::Button.new(**trigger_attrs, variant: :outline) do %>
      Open with asChild
    <% end %>
  <% end %>

  <%= render UI::Dialog::Overlay.new(open: false) do %>
    <%= render UI::Dialog::Content.new do %>
      <%= render UI::Dialog::Header.new do %>
        <%= render UI::Dialog::Title.new do %>
          asChild Composition
        <% end %>
        <%= render UI::Dialog::Description.new do %>
          This dialog was opened using asChild composition. The trigger button has no wrapper element!
        <% end %>
      <% end %>

      <%= render UI::Dialog::Footer.new do %>
        <%= render UI::Dialog::Close.new do %>
          Got it!
        <% end %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### Confirmation Dialog (No Overlay Click)

Dialog that only closes via buttons or Escape key:

```erb
<%= render UI::Dialog::Dialog.new(open: false, close_on_overlay_click: false) do %>
  <%= render UI::Button::Button.new(variant: :destructive, data: { action: "click->ui--dialog#open" }) do %>
    Delete Account
  <% end %>

  <%= render UI::Dialog::Overlay.new(open: false) do %>
    <%= render UI::Dialog::Content.new do %>
      <%= render UI::Dialog::Header.new do %>
        <%= render UI::Dialog::Title.new do %>
          Are you sure?
        <% end %>
        <%= render UI::Dialog::Description.new do %>
          This action cannot be undone. You must explicitly confirm or cancel.
        <% end %>
      <% end %>

      <%= render UI::Dialog::Footer.new do %>
        <%= render UI::Dialog::Close.new(variant: :outline) do %>
          Cancel
        <% end %>
        <%= render UI::Dialog::Close.new(variant: :destructive) do %>
          Delete
        <% end %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### Custom Width Dialog

Use `classes:` parameter on Content to customize width:

```erb
<%= render UI::Dialog::Dialog.new(open: false) do %>
  <%= render UI::Dialog::Trigger.new(as_child: true) do |trigger_attrs| %>
    <%= render UI::Button::Button.new(**trigger_attrs, variant: :outline) do %>
      View Details
    <% end %>
  <% end %>

  <%= render UI::Dialog::Overlay.new(open: false) do %>
    <%= render UI::Dialog::Content.new(classes: "sm:max-w-[725px]") do %>
      <%= render UI::Dialog::Header.new do %>
        <%= render UI::Dialog::Title.new do %>
          Share this document
        <% end %>
        <%= render UI::Dialog::Description.new do %>
          Anyone with the link can view this document.
        <% end %>
      <% end %>

      <div class="space-y-4 py-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Link</label>
          <div class="flex items-center gap-2">
            <input type="text" value="https://ui.shadcn.com/docs/installation" readonly
                   class="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm" />
            <%= render UI::Button::Button.new(variant: :outline, size: :sm) do %>
              Copy
            <% end %>
          </div>
        </div>
      </div>

      <%= render UI::Dialog::Footer.new do %>
        <%= render UI::Dialog::Close.new do %>
          Close
        <% end %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### Multiple Close Buttons with Different Variants

```erb
<%= render UI::Dialog::Footer.new do %>
  <%= render UI::Dialog::Close.new(variant: :outline) do %>
    Cancel
  <% end %>
  <%= render UI::Dialog::Close.new(variant: :default) do %>
    Save
  <% end %>
  <%= render UI::Dialog::Close.new(variant: :destructive) do %>
    Delete
  <% end %>
<% end %>
```

### Dialog with Custom Header Styling

```erb
<%= render UI::Dialog::Header.new(classes: "border-b pb-4") do %>
  <%= render UI::Dialog::Title.new(classes: "text-xl text-destructive") do %>
    Warning
  <% end %>
  <%= render UI::Dialog::Description.new do %>
    This is a destructive action
  <% end %>
<% end %>
```

## Common Mistakes

### ❌ Wrong - Missing Overlay

```erb
<%= render UI::Dialog::Dialog.new do %>
  <%= render UI::Dialog::Trigger.new do %>
    Open
  <% end %>

  <!-- MISSING OVERLAY! -->
  <%= render UI::Dialog::Content.new do %>
    <%= render UI::Dialog::Title.new do %>
      Title
    <% end %>
  <% end %>
<% end %>
```

**Why it's wrong:** The Overlay component renders the backdrop. Without it, the content appears floating without visual separation.

### ✅ Correct - Include Overlay

```erb
<%= render UI::Dialog::Dialog.new do %>
  <%= render UI::Dialog::Trigger.new do %>
    Open
  <% end %>

  <%= render UI::Dialog::Overlay.new do %>
    <%= render UI::Dialog::Content.new do %>
      <%= render UI::Dialog::Title.new do %>
        Title
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

---

### ❌ Wrong - String Instead of Symbol for Variant

```erb
<%= render UI::Dialog::Close.new(variant: "outline") do %>
  Close
<% end %>
```

**Why it's wrong:** Parameters expect symbols (`:outline`), not strings (`"outline"`). This will use incorrect styling.

### ✅ Correct - Use Symbol

```erb
<%= render UI::Dialog::Close.new(variant: :outline) do %>
  Close
<% end %>
```

---

### ❌ Wrong - Missing <%= for Output

```erb
<% render UI::Dialog::Dialog.new do %>
  <!-- This won't render! -->
<% end %>
```

**Why it's wrong:** `<% %>` executes Ruby but doesn't output. Use `<%= %>` to render components.

### ✅ Correct - Use <%= to Output

```erb
<%= render UI::Dialog::Dialog.new do %>
  <!-- This will render -->
<% end %>
```

---

### ❌ Wrong - Not Using Yielded Attributes with asChild

```erb
<%= render UI::Dialog::Trigger.new(as_child: true) do |trigger_attrs| %>
  <!-- WRONG: Not using the yielded attributes! -->
  <%= render UI::Button::Button.new(variant: :outline) do %>
    Open Dialog
  <% end %>
<% end %>
```

**Why it's wrong:** The block parameter contains the dialog action attributes. Without merging them, the dialog won't open.

### ✅ Correct - Merge Yielded Attributes

```erb
<%= render UI::Dialog::Trigger.new(as_child: true) do |trigger_attrs| %>
  <%= render UI::Button::Button.new(**trigger_attrs, variant: :outline) do %>
    Open Dialog
  <% end %>
<% end %>
```

---

### ❌ Wrong - Content Inside Header

```erb
<%= render UI::Dialog::Header.new do %>
  <%= render UI::Dialog::Title.new do %>
    Title
  <% end %>
  <!-- Content should NOT be here! -->
  <div class="py-4">Form content</div>
<% end %>
```

**Why it's wrong:** Header is for Title and Description only. Form content belongs in the Content component.

### ✅ Correct - Proper Nesting

```erb
<%= render UI::Dialog::Header.new do %>
  <%= render UI::Dialog::Title.new do %>
    Title
  <% end %>
<% end %>

<div class="py-4">
  Form content goes here
</div>

<%= render UI::Dialog::Footer.new do %>
  <%= render UI::Dialog::Close.new do %>
    Close
  <% end %>
<% end %>
```

---

### ❌ Wrong - Forgetting to Provide Content

```erb
<%= render UI::Dialog::Title.new do %>
  <!-- EMPTY - no title! -->
<% end %>
```

**Why it's wrong:** Dialog title will be invisible or missing.

### ✅ Correct - Provide Content

```erb
<%= render UI::Dialog::Title.new do %>
  Edit Your Profile
<% end %>
```

## Accessibility

- **Keyboard Navigation**:
  - `Escape` key closes the dialog (if `close_on_escape: true`)
  - `Tab` navigates between focusable elements
  - Focus is trapped within the dialog while open
  - Focus returns to trigger when dialog closes

- **ARIA Attributes**:
  - Dialog container has `role="dialog"`
  - Title is associated via `aria-labelledby`
  - Description is associated via `aria-describedby`
  - Overlay has `aria-hidden="true"` to hide from screen readers

- **Visual**:
  - Overlay provides clear visual separation
  - Readable typography for Title and Description
  - High contrast buttons for accessibility

## See Also

- Phlex docs: `docs/llm/phlex/dialog.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/dialog
- Radix UI: https://www.radix-ui.com/primitives/docs/components/dialog
- Button component: `docs/llm/erb/button.md`
