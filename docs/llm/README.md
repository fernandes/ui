# LLM Documentation

This directory contains LLM-optimized documentation for UI Engine components.

## Purpose

This documentation is specifically designed to help Large Language Models (LLMs) like Claude understand and correctly use UI Engine components. It prevents common errors and provides clear, copy-paste-ready examples.

## Structure

```
docs/llm/
├── README.md         # This file
├── phlex.md          # Phlex overview and common patterns
├── erb.md            # ERB overview and common patterns
├── vc.md             # ViewComponent overview and common patterns
├── phlex/            # Phlex-specific component docs
│   ├── button.md
│   ├── accordion.md
│   └── alert_dialog.md
├── erb/              # ERB-specific component docs
│   ├── button.md
│   ├── accordion.md
│   └── alert_dialog.md
└── vc/               # ViewComponent-specific component docs
    ├── button.md
    ├── accordion.md
    └── alert_dialog.md
```

## Usage

### For LLMs

When asked to use a UI Engine component:

1. **First**, read the overview file for the format being used:
   - Phlex: `docs/llm/phlex.md`
   - ERB: `docs/llm/erb.md`
   - ViewComponent: `docs/llm/vc.md`

2. **Then**, read the specific component documentation:
   - Example: `docs/llm/phlex/button.md`

3. **Finally**, use the exact syntax from the examples

### For Developers

When migrating a new component:

1. Create documentation files in all three formats:
   - `docs/llm/phlex/{component}.md`
   - `docs/llm/erb/{component}.md`
   - `docs/llm/vc/{component}.md`

2. Follow the template structure from existing files
3. Include error prevention section with common mistakes

## Documentation Template

Each component doc should include:

```markdown
# Component Name - Format

Brief description

## Basic Usage
[Simple example]

## Component Path
- Class/Path information
- File location
- Behavior module

## Parameters
[Table of parameters]

## Variants/Sizes
[List of options]

## Examples
[Multiple real-world examples]

## Important Notes
[Format-specific gotchas]

## Error Prevention
[Common mistakes with ❌ and ✅]
```

## Why This Exists

LLMs can make systematic errors when working with component libraries:

### Common Errors Prevented

1. **Wrong Instantiation**:
   - ❌ `UI::Button.new` (module, not a class)
   - ✅ `UI::Button::Button.new` (correct)

2. **Missing Component Suffix**:
   - ❌ `UI::Button::Button.new` (Phlex in ViewComponent context)
   - ✅ `UI::Button::ButtonComponent.new` (correct for ViewComponent)

3. **Wrong Syntax for Format**:
   - ❌ `render UI::Button.new` (Phlex syntax in ERB)
   - ✅ `render "ui/button"` (correct for ERB)

4. **Missing Required Parameters**:
   - ❌ Accordion Trigger without `item_value` in Phlex
   - ✅ Trigger with explicit `item_value` parameter

## Maintenance

- **Add new components**: Create docs when migrating from shadcn/Radix
- **Update existing**: When component API changes
- **Keep examples current**: Test examples in dummy app
- **Sync with code**: Docs should match actual implementation

## Benefits

- ✅ Reduces LLM errors significantly
- ✅ Provides copy-paste-ready examples
- ✅ Documents format-specific differences
- ✅ Accelerates development with LLM assistance
- ✅ Serves as quick reference for humans too
