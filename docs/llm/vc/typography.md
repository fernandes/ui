# Typography Components (ViewComponent)

Typography components for headings, paragraphs, and text formatting following shadcn/ui design patterns.

## Available Components

All typography components are in `app/components/ui/`:

- `UI::H1Component` - Heading 1
- `UI::H2Component` - Heading 2
- `UI::H3Component` - Heading 3
- `UI::H4Component` - Heading 4
- `UI::PComponent` - Paragraph
- `UI::BlockquoteComponent` - Blockquote
- `UI::ListComponent` - Unordered list
- `UI::InlineCodeComponent` - Inline code
- `UI::LeadComponent` - Lead paragraph
- `UI::LargeComponent` - Large text
- `UI::SmallComponent` - Small text
- `UI::MutedComponent` - Muted text

## Parameters

All components accept:
- `classes:` (String, optional) - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

## Basic Usage

```erb
<%# Headings %>
<%= render UI::H1Component.new { "Heading 1" } %>
<%= render UI::H2Component.new { "Heading 2" } %>
<%= render UI::H3Component.new { "Heading 3" } %>
<%= render UI::H4Component.new { "Heading 4" } %>

<%# Paragraph %>
<%= render UI::PComponent.new { "This is a paragraph with automatic spacing." } %>

<%# Blockquote %>
<%= render UI::BlockquoteComponent.new { '"After all," he said, "everyone enjoys a good joke."' } %>

<%# List %>
<%= render UI::ListComponent.new do %>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
<% end %>

<%# Inline Code %>
<%= render UI::InlineCodeComponent.new { "npm install" } %>

<%# Lead %>
<%= render UI::LeadComponent.new { "A modal dialog that interrupts the user with important content." } %>

<%# Large %>
<%= render UI::LargeComponent.new { "Are you absolutely sure?" } %>

<%# Small %>
<%= render UI::SmallComponent.new { "Email address" } %>

<%# Muted %>
<%= render UI::MutedComponent.new { "Enter your email address." } %>
```

## With Custom Classes

```erb
<%= render UI::H1Component.new(classes: "text-center") { "Centered Heading" } %>

<%= render UI::PComponent.new(classes: "text-lg") { "Larger paragraph text" } %>
```

## Common Patterns

### Inline Code in Paragraph

```erb
<%= render UI::PComponent.new do %>
  Install the package using <%= render UI::InlineCodeComponent.new { "npm install" } %> command.
<% end %>
```

### Link in Paragraph

```erb
<%= render UI::PComponent.new do %>
  Visit our <%= link_to "documentation", "/docs", class: "font-medium text-primary underline underline-offset-4" %> for more info.
<% end %>
```

### Multiple Paragraphs

```erb
<div class="space-y-4">
  <%= render UI::PComponent.new { "First paragraph with automatic spacing." } %>
  <%= render UI::PComponent.new { "Second paragraph with automatic spacing." } %>
</div>
```

## Complete Example

```erb
<div class="space-y-6">
  <%= render UI::H1Component.new { "Typography Example" } %>

  <%= render UI::LeadComponent.new do %>
    A demonstration of typography components.
  <% end %>

  <%= render UI::H2Component.new { "Section Title" } %>

  <%= render UI::PComponent.new do %>
    This is a paragraph with <%= render UI::InlineCodeComponent.new { "inline code" } %> and <%= link_to "a link", "#", class: "font-medium text-primary underline underline-offset-4" %>.
  <% end %>

  <%= render UI::BlockquoteComponent.new do %>
    A blockquote with inspirational content.
  <% end %>

  <%= render UI::ListComponent.new do %>
    <li>First item</li>
    <li>Second item</li>
    <li>Third item</li>
  <% end %>

  <%= render UI::SmallComponent.new { "Small helper text" } %>
  <%= render UI::MutedComponent.new { "Muted supplementary text" } %>
</div>
```

## CSS Classes Reference

From shadcn/ui:

- **H1**: `scroll-m-20 text-4xl font-extrabold tracking-tight text-balance`
- **H2**: `scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0`
- **H3**: `scroll-m-20 text-2xl font-semibold tracking-tight`
- **H4**: `scroll-m-20 text-xl font-semibold tracking-tight`
- **P**: `leading-7 [&:not(:first-child)]:mt-6`
- **Blockquote**: `mt-6 border-l-2 pl-6 italic`
- **List**: `my-6 ml-6 list-disc [&>li]:mt-2`
- **InlineCode**: `relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold`
- **Lead**: `text-xl text-muted-foreground`
- **Large**: `text-lg font-semibold`
- **Small**: `text-sm font-medium leading-none`
- **Muted**: `text-sm text-muted-foreground`
