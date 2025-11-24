# Typography Components (Phlex)

Typography components for headings, paragraphs, and text formatting following shadcn/ui design patterns.

## Available Components

All typography components are in `app/components/ui/`:

- `UI::H1` - Heading 1
- `UI::H2` - Heading 2
- `UI::H3` - Heading 3
- `UI::H4` - Heading 4
- `UI::P` - Paragraph
- `UI::Blockquote` - Blockquote
- `UI::List` - Unordered list
- `UI::InlineCode` - Inline code
- `UI::Lead` - Lead paragraph
- `UI::Large` - Large text
- `UI::Small` - Small text
- `UI::Muted` - Muted text

## Parameters

All components accept:
- `classes:` (String, optional) - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

## Basic Usage

```ruby
# Headings
render UI::H1.new { "Heading 1" }
render UI::H2.new { "Heading 2" }
render UI::H3.new { "Heading 3" }
render UI::H4.new { "Heading 4" }

# Paragraph
render UI::P.new { "This is a paragraph with automatic spacing." }

# Blockquote
render UI::Blockquote.new { '"After all," he said, "everyone enjoys a good joke."' }

# List
render UI::List.new do
  li { "First item" }
  li { "Second item" }
  li { "Third item" }
end

# Inline Code
render UI::InlineCode.new { "npm install" }

# Lead
render UI::Lead.new { "A modal dialog that interrupts the user with important content." }

# Large
render UI::Large.new { "Are you absolutely sure?" }

# Small
render UI::Small.new { "Email address" }

# Muted
render UI::Muted.new { "Enter your email address." }
```

## With Custom Classes

```ruby
render UI::H1.new(classes: "text-center") { "Centered Heading" }

render UI::P.new(classes: "text-lg") { "Larger paragraph text" }
```

## Common Patterns

### Inline Code in Paragraph

```ruby
render UI::P.new do
  plain "Install the package using "
  render UI::InlineCode.new { "npm install" }
  plain " command."
end
```

### Link in Paragraph

```ruby
render UI::P.new do
  plain "Visit our "
  a(href: "/docs", class: "font-medium text-primary underline underline-offset-4") { "documentation" }
  plain " for more info."
end
```

### Multiple Paragraphs

```ruby
div(class: "space-y-4") do
  render UI::P.new { "First paragraph with automatic spacing." }
  render UI::P.new { "Second paragraph with automatic spacing." }
end
```

## Complete Example

```ruby
class ExampleView < Phlex::HTML
  def view_template
    div(class: "space-y-6") do
      render UI::H1.new { "Typography Example" }

      render UI::Lead.new do
        "A demonstration of typography components."
      end

      render UI::H2.new { "Section Title" }

      render UI::P.new do
        plain "This is a paragraph with "
        render UI::InlineCode.new { "inline code" }
        plain " and "
        a(href: "#", class: "font-medium text-primary underline underline-offset-4") { "a link" }
        plain "."
      end

      render UI::Blockquote.new do
        "A blockquote with inspirational content."
      end

      render UI::List.new do
        li { "First item" }
        li { "Second item" }
        li { "Third item" }
      end

      render UI::Small.new { "Small helper text" }
      render UI::Muted.new { "Muted supplementary text" }
    end
  end
end
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
