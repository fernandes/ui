# Alert Dialog - ERB

## Component Path

```erb
<%= render UI::AlertDialog::{SubComponent}.new %>
```

## Description

A modal dialog that interrupts the user with important content and expects a response. Use it for critical confirmations, warnings, and alerts that require user action. Alert dialogs are similar to dialogs but typically feature two action buttons (Cancel and Action) instead of a close button, and prevent closing by clicking the overlay by default.

Based on [shadcn/ui Alert Dialog](https://ui.shadcn.com/docs/components/alert-dialog) and [Radix UI Alert Dialog](https://www.radix-ui.com/primitives/docs/components/alert-dialog).

## Basic Usage

```erb
<%= render UI::AlertDialog::AlertDialog.new do %>
  <%= render UI::AlertDialog::Trigger.new do %>
    <%= render UI::Button::Button.new { "Show Alert" } %>
  <% end %>

  <%= render UI::AlertDialog::Overlay.new do %>
    <%= render UI::AlertDialog::Content.new do %>
      <%= render UI::AlertDialog::Header.new do %>
        <%= render UI::AlertDialog::Title.new { "Are you absolutely sure?" } %>
        <%= render UI::AlertDialog::Description.new do %>
          This action cannot be undone.
        <% end %>
      <% end %>

      <%= render UI::AlertDialog::Footer.new do %>
        <%= render UI::AlertDialog::Cancel.new { "Cancel" } %>
        <%= render UI::AlertDialog::Action.new { "Continue" } %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

## Sub-Components

### UI::AlertDialog::AlertDialog

Container that manages the alert dialog state and behavior. Wrap all other components inside this.

**Parameters:**
- `open:` Boolean - Whether the alert dialog is initially open (default: `false`)
- `close_on_escape:` Boolean - Whether pressing Escape closes the dialog (default: `true`)
- `classes:` String - Additional Tailwind CSS classes to merge
- Other HTML attributes via `**attributes`

### UI::AlertDialog::Trigger

Wrapper that opens the alert dialog when clicked. Does not directly render a button—it wraps interactive elements.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge
- Other HTML attributes via `**attributes`

### UI::AlertDialog::Overlay

Backdrop overlay that appears behind the dialog content. Contains both the backdrop element and serves as the container for the Content.

**Parameters:**
- `open:` Boolean - Whether the overlay is initially visible (default: `false`)
- `classes:` String - Additional Tailwind CSS classes to merge
- Other HTML attributes via `**attributes`

### UI::AlertDialog::Content

Main content container for the alert dialog. Contains the header, description, and footer sections with proper ARIA attributes (`role="alertdialog"`).

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge
- Other HTML attributes via `**attributes`

### UI::AlertDialog::Header

Header section that typically contains the Title and Description.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge
- Other HTML attributes via `**attributes`

### UI::AlertDialog::Title

Title text for the alert dialog (renders as `<h2>`). Should briefly describe the action.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge
- Other HTML attributes via `**attributes`

### UI::AlertDialog::Description

Description text for the alert dialog (renders as `<p>`). Provides context about the action and its consequences.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge
- Other HTML attributes via `**attributes`

### UI::AlertDialog::Footer

Footer section that contains the Cancel and Action buttons. Usually positioned at the bottom of the dialog.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge
- Other HTML attributes via `**attributes`

### UI::AlertDialog::Action

Primary action button that confirms the alert dialog action. Wraps the Button component. Closes the dialog when clicked.

**Parameters:**
- `variant:` Symbol - Button variant
  - Options: `:default`, `:destructive`, `:outline`, `:secondary`, `:ghost`, `:link`
  - Default: `:default`
- `size:` Symbol - Button size
  - Options: `:sm`, `:default`, `:lg`
  - Default: `:default`
- `classes:` String - Additional Tailwind CSS classes to merge
- Other HTML attributes via `**attributes`

### UI::AlertDialog::Cancel

Cancel button that dismisses the alert dialog without taking action. Wraps the Button component with default `outline` variant.

**Parameters:**
- `variant:` Symbol - Button variant
  - Options: `:default`, `:destructive`, `:outline`, `:secondary`, `:ghost`, `:link`
  - Default: `:outline`
- `size:` Symbol - Button size
  - Options: `:sm`, `:default`, `:lg`
  - Default: `:default`
- `classes:` String - Additional Tailwind CSS classes to merge
- Other HTML attributes via `**attributes`

## Examples

### Default Confirmation

```erb
<%= render UI::AlertDialog::AlertDialog.new do %>
  <%= render UI::AlertDialog::Trigger.new do %>
    <%= render UI::Button::Button.new { "Show Dialog" } %>
  <% end %>

  <%= render UI::AlertDialog::Overlay.new do %>
    <%= render UI::AlertDialog::Content.new do %>
      <%= render UI::AlertDialog::Header.new do %>
        <%= render UI::AlertDialog::Title.new { "Are you absolutely sure?" } %>
        <%= render UI::AlertDialog::Description.new do %>
          This action cannot be undone. This will permanently delete your account.
        <% end %>
      <% end %>

      <%= render UI::AlertDialog::Footer.new do %>
        <%= render UI::AlertDialog::Cancel.new { "Cancel" } %>
        <%= render UI::AlertDialog::Action.new { "Continue" } %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### Destructive Action (Delete Confirmation)

```erb
<%= render UI::AlertDialog::AlertDialog.new do %>
  <%= render UI::AlertDialog::Trigger.new do %>
    <%= render UI::Button::Button.new(variant: :destructive) { "Delete Account" } %>
  <% end %>

  <%= render UI::AlertDialog::Overlay.new do %>
    <%= render UI::AlertDialog::Content.new do %>
      <%= render UI::AlertDialog::Header.new do %>
        <%= render UI::AlertDialog::Title.new { "Delete Account" } %>
        <%= render UI::AlertDialog::Description.new do %>
          Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.
        <% end %>
      <% end %>

      <%= render UI::AlertDialog::Footer.new do %>
        <%= render UI::AlertDialog::Cancel.new { "Cancel" } %>
        <%= render UI::AlertDialog::Action.new(variant: :destructive) { "Delete" } %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### Save Changes Confirmation

```erb
<%= render UI::AlertDialog::AlertDialog.new do %>
  <%= render UI::AlertDialog::Trigger.new do %>
    <%= render UI::Button::Button.new(variant: :outline) { "Save Changes" } %>
  <% end %>

  <%= render UI::AlertDialog::Overlay.new do %>
    <%= render UI::AlertDialog::Content.new do %>
      <%= render UI::AlertDialog::Header.new do %>
        <%= render UI::AlertDialog::Title.new { "Save changes?" } %>
        <%= render UI::AlertDialog::Description.new do %>
          You have unsaved changes. Do you want to save them before leaving?
        <% end %>
      <% end %>

      <%= render UI::AlertDialog::Footer.new do %>
        <%= render UI::AlertDialog::Cancel.new { "Don't Save" } %>
        <%= render UI::AlertDialog::Action.new { "Save Changes" } %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### With Custom Styling

```erb
<%= render UI::AlertDialog::AlertDialog.new do %>
  <%= render UI::AlertDialog::Trigger.new do %>
    <%= render UI::Button::Button.new { "Open" } %>
  <% end %>

  <%= render UI::AlertDialog::Overlay.new(classes: "bg-black/60") do %>
    <%= render UI::AlertDialog::Content.new(classes: "max-w-lg") do %>
      <%= render UI::AlertDialog::Header.new(classes: "border-b pb-4") do %>
        <%= render UI::AlertDialog::Title.new(classes: "text-2xl") { "Warning" } %>
        <%= render UI::AlertDialog::Description.new(classes: "text-sm text-yellow-600") do %>
          This action has consequences.
        <% end %>
      <% end %>

      <%= render UI::AlertDialog::Footer.new(classes: "gap-2") do %>
        <%= render UI::AlertDialog::Cancel.new { "No Thanks" } %>
        <%= render UI::AlertDialog::Action.new(variant: :destructive) { "Proceed" } %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

## Common Patterns

### Confirmation Pattern

For general confirmations where the user must decide whether to proceed:

```erb
<%= render UI::AlertDialog::AlertDialog.new do %>
  <%= render UI::AlertDialog::Trigger.new do %>
    <%= render UI::Button::Button.new { "Continue" } %>
  <% end %>

  <%= render UI::AlertDialog::Overlay.new do %>
    <%= render UI::AlertDialog::Content.new do %>
      <%= render UI::AlertDialog::Header.new do %>
        <%= render UI::AlertDialog::Title.new { "Confirm Action" } %>
        <%= render UI::AlertDialog::Description.new { "Please confirm before proceeding." } %>
      <% end %>

      <%= render UI::AlertDialog::Footer.new do %>
        <%= render UI::AlertDialog::Cancel.new { "Cancel" } %>
        <%= render UI::AlertDialog::Action.new { "Confirm" } %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### Destructive Action Pattern

For operations that cannot be undone (delete, remove, deactivate):

```erb
<%= render UI::AlertDialog::AlertDialog.new do %>
  <%= render UI::AlertDialog::Trigger.new do %>
    <%= render UI::Button::Button.new(variant: :destructive) { "Delete Item" } %>
  <% end %>

  <%= render UI::AlertDialog::Overlay.new do %>
    <%= render UI::AlertDialog::Content.new do %>
      <%= render UI::AlertDialog::Header.new do %>
        <%= render UI::AlertDialog::Title.new { "Delete Item?" } %>
        <%= render UI::AlertDialog::Description.new do %>
          This will permanently delete the item. This action cannot be undone.
        <% end %>
      <% end %>

      <%= render UI::AlertDialog::Footer.new do %>
        <%= render UI::AlertDialog::Cancel.new { "Keep It" } %>
        <%= render UI::AlertDialog::Action.new(variant: :destructive) { "Delete" } %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### Warning Pattern

For important warnings that require acknowledgment:

```erb
<%= render UI::AlertDialog::AlertDialog.new do %>
  <%= render UI::AlertDialog::Trigger.new do %>
    <%= render UI::Button::Button.new(variant: :outline) { "Proceed" } %>
  <% end %>

  <%= render UI::AlertDialog::Overlay.new do %>
    <%= render UI::AlertDialog::Content.new do %>
      <%= render UI::AlertDialog::Header.new do %>
        <%= render UI::AlertDialog::Title.new { "Warning" } %>
        <%= render UI::AlertDialog::Description.new do %>
          This operation may take several minutes and cannot be interrupted.
        <% end %>
      <% end %>

      <%= render UI::AlertDialog::Footer.new do %>
        <%= render UI::AlertDialog::Cancel.new { "Cancel" } %>
        <%= render UI::AlertDialog::Action.new { "I Understand, Proceed" } %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

## Common Mistakes

### ❌ Wrong - Using String Instead of Symbol

```erb
<%= render UI::AlertDialog::Action.new(variant: "destructive") { "Delete" } %>
```

**Why it's wrong:** Parameters must be symbols, not strings. Using strings will not apply the variant correctly.

### ✅ Correct - Use Symbols

```erb
<%= render UI::AlertDialog::Action.new(variant: :destructive) { "Delete" } %>
```

### ❌ Wrong - Missing <%= for Output

```erb
<% render UI::AlertDialog::AlertDialog.new do %>
  <!-- This won't display! -->
<% end %>
```

**Why it's wrong:** `<% ... %>` executes code but doesn't output. You need `<%= ... %>` to render components.

### ✅ Correct - Use <%= to Output

```erb
<%= render UI::AlertDialog::AlertDialog.new do %>
  <!-- This will display -->
<% end %>
```

### ❌ Wrong - Forgetting Overlay

```erb
<%= render UI::AlertDialog::AlertDialog.new do %>
  <%= render UI::AlertDialog::Content.new do %>
    <!-- Missing Overlay component! -->
    <%= render UI::AlertDialog::Title.new { "Alert" } %>
  <% end %>
<% end %>
```

**Why it's wrong:** The Overlay provides both the backdrop visual and semantic structure. Without it, the dialog lacks proper styling and behavior.

### ✅ Correct - Always Include Overlay

```erb
<%= render UI::AlertDialog::AlertDialog.new do %>
  <%= render UI::AlertDialog::Overlay.new do %>
    <%= render UI::AlertDialog::Content.new do %>
      <%= render UI::AlertDialog::Title.new { "Alert" } %>
    <% end %>
  <% end %>
<% end %>
```

### ❌ Wrong - Not Wrapping Trigger Correctly

```erb
<%= render UI::AlertDialog::Trigger.new { "Open" } %>
```

**Why it's wrong:** Trigger is a container. It needs a button or interactive element inside to be clickable. Plain text is not interactive.

### ✅ Correct - Wrap Interactive Elements

```erb
<!-- Option 1: Wrap a Button -->
<%= render UI::AlertDialog::Trigger.new do %>
  <%= render UI::Button::Button.new { "Open" } %>
<% end %>

<!-- Option 2: Wrap custom interactive content -->
<%= render UI::AlertDialog::Trigger.new do %>
  <%= link_to "Click here", "#", class: "underline" %>
<% end %>
```

### ❌ Wrong - Using Wrong Button Variant for Destructive

```erb
<%= render UI::AlertDialog::Footer.new do %>
  <%= render UI::AlertDialog::Cancel.new { "Cancel" } %>
  <!-- Just rendering Action without destructive variant for delete -->
  <%= render UI::AlertDialog::Action.new { "Delete" } %>
<% end %>
```

**Why it's wrong:** Visual feedback matters. Destructive actions should use `:destructive` variant to warn users.

### ✅ Correct - Use Destructive Variant

```erb
<%= render UI::AlertDialog::Footer.new do %>
  <%= render UI::AlertDialog::Cancel.new { "Cancel" } %>
  <%= render UI::AlertDialog::Action.new(variant: :destructive) { "Delete" } %>
<% end %>
```

### ❌ Wrong - Overly Long Description

```erb
<%= render UI::AlertDialog::Description.new do %>
  This action will delete your account permanently. It cannot be undone. All your data including files, messages, and profile information will be removed. Your username will also be available for others to use. This is irreversible.
<% end %>
```

**Why it's wrong:** Too much text overwhelms the user. Alert dialogs should be concise and focused.

### ✅ Correct - Clear and Concise

```erb
<%= render UI::AlertDialog::Description.new do %>
  This will permanently delete your account and all associated data. This action cannot be undone.
<% end %>
```

## Integration with Other Components

### With Button Component

Action and Cancel buttons wrap `UI::Button::Button`, so all Button variants and sizes are supported:

```erb
<%= render UI::AlertDialog::Action.new(variant: :destructive, size: :lg) { "Delete Everything" } %>
```

### Creating a Custom Trigger with Link

```erb
<%= render UI::AlertDialog::Trigger.new do %>
  <%= link_to "Remove Item", "#", class: "text-blue-600 underline hover:text-blue-800" %>
<% end %>
```

### Using with Rails Form Actions

```erb
<%= form_with(model: @item, local: true) do |form| %>
  <%= render UI::AlertDialog::AlertDialog.new do %>
    <%= render UI::AlertDialog::Trigger.new do %>
      <%= form.submit("Submit", type: :submit, class: "...") %>
    <% end %>

    <%= render UI::AlertDialog::Overlay.new do %>
      <%= render UI::AlertDialog::Content.new do %>
        <%= render UI::AlertDialog::Header.new do %>
          <%= render UI::AlertDialog::Title.new { "Confirm Submission" } %>
          <%= render UI::AlertDialog::Description.new { "Please review your changes." } %>
        <% end %>

        <%= render UI::AlertDialog::Footer.new do %>
          <%= render UI::AlertDialog::Cancel.new { "Cancel" } %>
          <%= render UI::AlertDialog::Action.new { "Confirm & Submit" } %>
        <% end %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

## See Also

- ERB guide: `docs/llm/erb.md`
- Phlex implementation: `docs/llm/phlex/alert_dialog.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/alert-dialog
- Radix UI: https://www.radix-ui.com/primitives/docs/components/alert-dialog
