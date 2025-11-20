# Component Migration Infrastructure

## Overview

This directory contains the complete infrastructure for migrating shadcn/ui components to UI Engine with automated validation and quality assurance.

## Quick Start

### Migrating a New Component

```bash
# Use the slash command (recommended)
/migrate tooltip

# Or manually follow the skill workflow
# See .claude/skills/component-migration.md
```

## Infrastructure Components

### 1. Validation Checklist
**File**: `docs/migration/validation_checklist.md`

Complete checklist ensuring component migrations follow all UI Engine patterns:
- Styling rules (Tailwind only)
- Animation rules (tw-animate-css, no JS)
- Visibility rules (invisible, not hidden)
- State management (data-state pattern)
- CSS variables (both :root and @theme)
- asChild composition support
- Accessibility (ARIA attributes)
- Documentation requirements

### 2. Component Migration Skill
**File**: `.claude/skills/component-migration.md`

End-to-end workflow for migrating components:
1. Research Phase (shadcn/ui + Radix UI)
2. Implementation Phase (Phlex components)
3. Documentation Phase (LLM docs)
4. Showcase Phase (demo page)
5. Validation Phase (code quality)
6. Testing Phase (browser testing)

### 3. Code Validator Agent
**File**: `.claude/agents/code-validator.md`

Automated validation agent that checks:
- ✅ Tailwind-only styling
- ✅ tw-animate-css animations
- ✅ invisible for animated elements
- ✅ data-state pattern
- ✅ CSS variables in both places
- ✅ asChild implementation
- ✅ ARIA attributes

### 4. LLM Documentation Templates
**Files**: 
- `docs/llm/_template_phlex.md`
- `docs/llm/_template_erb.md`

Templates for generating LLM-friendly documentation that prevents common mistakes.

### 5. Slash Command
**File**: `.claude/commands/migrate.md`

Quick command to start component migration with all checks enforced.

## Critical Rules (Enforced)

### ✅ MUST DO

#### API Reference Check
```
1. Visit shadcn/ui component page
2. Find "API Reference" section
3. Check if "asChild" prop is listed
4. If YES → MUST implement asChild support
5. If NO → Skip asChild implementation
```

**Why This Matters:**
- shadcn/ui v4 documents `asChild` in API Reference for components that support it
- Missing `asChild` breaks composition patterns (e.g., Item as link)
- Prevents invalid HTML nesting (e.g., button inside button)

#### Styling
```ruby
# CORRECT: Tailwind only
div(class: "h-[300px] transition-[height] duration-300")
```

#### Animations
```ruby
# CORRECT: CSS animations with data-state
"data-[state=open]:animate-in data-[state=closed]:animate-out \
 data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"
```

#### Visibility
```ruby
# CORRECT: invisible allows animations
"invisible data-[state=open]:visible data-[state=closed]:invisible"
```

#### State Management
```javascript
// CORRECT: JavaScript changes state only
show() {
  this.containerTarget.setAttribute("data-state", "open")
  // CSS handles the animation!
}
```

#### CSS Variables
```css
/* CORRECT: Both :root and @theme */
:root {
  --duration-accordion: 300ms;
}
@theme {
  --duration-accordion: 300ms;
}
```

### ❌ NEVER DO

#### Custom CSS
```ruby
# WRONG: Inline styles
div(style: "height: 300px")
```

#### JavaScript Animations
```javascript
// WRONG: Manual timing
setTimeout(() => element.classList.add("opacity-0"), 200)
```

#### Hidden Class for Animations
```ruby
# WRONG: display: none kills animations
"hidden data-[state=open]:block"
```

#### Missing @theme
```css
/* WRONG: Only in :root - Tailwind won't generate utilities */
:root { --my-var: 10px; }
```

## Migration Workflow

### 1. Research

Visit references:
- shadcn/ui: https://ui.shadcn.com/docs/components/{component}
- Radix UI: https://www.radix-ui.com/primitives/docs/components/{component}

Open live example in browser and use DevTools to extract:
- HTML structure
- CSS classes
- ARIA attributes
- Data attributes
- Animation timings

### 2. Implementation

Create Phlex components in `app/components/ui/{component}/`:

```ruby
# Example: UI::Tooltip::Tooltip
module UI
  module Tooltip
    class Tooltip < Phlex::HTML
      include UI::Tooltip::TooltipBehavior
      
      def initialize(open: false, **attributes)
        @open = open
        @attributes = attributes
      end
      
      def view_template(&block)
        div(**tooltip_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
```

### 3. Stimulus Controller

Create controller in `app/javascript/ui/controllers/{component}_controller.js`:

```javascript
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["container", "content"]
  
  show() {
    this.containerTarget.setAttribute("data-state", "open")
  }
  
  hide() {
    this.containerTarget.setAttribute("data-state", "closed")
  }
}
```

### 4. Documentation

Generate LLM docs using the agent or manually from templates:
- `docs/llm/phlex/{component}.md`
- `docs/llm/erb/{component}.md`

### 5. Showcase

Create showcase page in `test/dummy/app/views/components/{component}.html.erb`:

```erb
<div class="container py-8">
  <h1 class="text-4xl font-bold">Component Name</h1>
  
  <!-- Default Example -->
  <div class="space-y-4">
    <h2 class="text-2xl font-semibold">Default</h2>
    <%= render UI::Component::Component.new do %>
      Content
    <% end %>
  </div>
  
  <!-- asChild Example (if supported) -->
  <div class="space-y-4">
    <h2 class="text-2xl font-semibold">With asChild</h2>
    <%= render UI::Component::Trigger.new(as_child: true) do |attrs| %>
      <%= render UI::Button::Button.new(**attrs) do %>
        Custom Trigger
      <% end %>
    <% end %>
  </div>
</div>
```

Add route to `test/dummy/config/routes.rb`:
```ruby
get "/components/{component}", to: "components#{component}"
```

Add link to `/components` index page.

### 6. Validation

Run validator manually or it runs automatically during migration:

```
✅ Passing Checks (15)
❌ Failing Checks (0)
Component ready: ✅
```

### 7. Testing

Manual browser testing:
- Component renders correctly
- Animations smooth (no flicker)
- Open/close multiple times works
- Keyboard navigation works
- Visual comparison with shadcn/ui

## Example Migration

See completed migrations:
- **Button**: `app/components/ui/button/` + `docs/llm/*/button.md`
- **Dialog**: `app/components/ui/dialog/` + `docs/llm/*/dialog.md`
- **Alert Dialog**: `app/components/ui/alert_dialog/` + `docs/llm/*/alert_dialog.md`
- **Accordion**: `app/components/ui/accordion/` + `docs/llm/*/accordion.md`

## Troubleshooting

### Animations not working
- ✅ Check `data-state` is being set correctly
- ✅ Check using `invisible`, not `hidden`
- ✅ Check CSS classes include `animate-in/out`
- ✅ No JavaScript animation timing

### CSS variables not generating utilities
- ✅ Check variable in BOTH `:root` and `@theme`
- ✅ Check variable actually used in component classes
- ✅ Rebuild CSS: `bun run build:css`

### asChild not working
- ✅ Check component includes `UI::Shared::AsChildBehavior`
- ✅ Check yielding attributes when `as_child: true`
- ✅ Check child uses splat operator: `**attrs`

## Component List

See `dev/components_list.md` for all components to migrate.

Current status:
- ✅ Button
- ✅ Accordion
- ✅ Alert Dialog
- ✅ Dialog
- ⏳ 54 components remaining

## See Also

- `CLAUDE.md` - Project instructions and patterns
- `docs/patterns/as_child.md` - asChild composition pattern
- `.claude/skills/component-migration.md` - Complete workflow
- `.claude/agents/code-validator.md` - Validation rules
