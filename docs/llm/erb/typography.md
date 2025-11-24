# Typography Components (ERB)

Typography components for headings, paragraphs, and text formatting following shadcn/ui design patterns.

## Available Components

All typography components are ERB partials in `app/views/ui/`:

- `_h1.html.erb` - Heading 1
- `_h2.html.erb` - Heading 2
- `_h3.html.erb` - Heading 3
- `_h4.html.erb` - Heading 4
- `_p.html.erb` - Paragraph
- `_blockquote.html.erb` - Blockquote
- `_list.html.erb` - Unordered list
- `_inline_code.html.erb` - Inline code
- `_lead.html.erb` - Lead paragraph
- `_large.html.erb` - Large text
- `_small.html.erb` - Small text
- `_muted.html.erb` - Muted text

## Parameters

All components accept:
- `classes` (String, optional) - Additional CSS classes
- `attributes` (Hash, optional) - Additional HTML attributes
- `content` (String, optional) - Text content (alternative to block)

## Basic Usage

```erb
<%# Headings %>
<%= render "ui/h1" do %>
  Heading 1
<% end %>

<%= render "ui/h2" do %>
  Heading 2
<% end %>

<%= render "ui/h3" do %>
  Heading 3
<% end %>

<%= render "ui/h4" do %>
  Heading 4
<% end %>

<%# Paragraph %>
<%= render "ui/p" do %>
  This is a paragraph with automatic spacing.
<% end %>

<%# Blockquote %>
<%= render "ui/blockquote" do %>
  "After all," he said, "everyone enjoys a good joke."
<% end %>

<%# List %>
<%= render "ui/list" do %>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
<% end %>

<%# Inline Code %>
<%= render "ui/inline_code" do %>
  npm install
<% end %>

<%# Lead %>
<%= render "ui/lead" do %>
  A modal dialog that interrupts the user with important content.
<% end %>

<%# Large %>
<%= render "ui/large" do %>
  Are you absolutely sure?
<% end %>

<%# Small %>
<%= render "ui/small" do %>
  Email address
<% end %>

<%# Muted %>
<%= render "ui/muted" do %>
  Enter your email address.
<% end %>
```

## With Custom Classes

```erb
<%= render "ui/h1", classes: "text-center" do %>
  Centered Heading
<% end %>

<%= render "ui/p", classes: "text-lg" do %>
  Larger paragraph text
<% end %>
```

## Common Patterns

### Inline Code in Paragraph

```erb
<%= render "ui/p" do %>
  Install the package using <%= render "ui/inline_code" do %>npm install<% end %> command.
<% end %>
```

### Link in Paragraph

```erb
<%= render "ui/p" do %>
  Visit our <%= link_to "documentation", "/docs", class: "font-medium text-primary underline underline-offset-4" %> for more info.
<% end %>
```

### Multiple Paragraphs

```erb
<div class="space-y-4">
  <%= render "ui/p" do %>
    First paragraph with automatic spacing.
  <% end %>

  <%= render "ui/p" do %>
    Second paragraph with automatic spacing.
  <% end %>
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
