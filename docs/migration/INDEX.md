# Component Migration - Documentation Index

## Quick Links

### 🚀 Getting Started
- **[Quick Start]** `/migrate {component}` - Use this slash command to start
- **[README]** `docs/migration/README.md` - Complete overview and guide
- **[Session Report]** `docs/migration/SESSION_REPORT.md` - What was created and why

### 📋 Checklists & Workflows
- **[Validation Checklist]** `docs/migration/validation_checklist.md` - Complete validation rules (~400 lines)
- **[Migration Skill]** `.claude/skills/component-migration.md` - 6-phase workflow
- **[Summary]** `docs/migration/SUMMARY.md` - Infrastructure overview

### 🤖 Agents & Automation
- **[Code Validator]** `.claude/agents/code-validator.md` - Automated quality checks
- **[Slash Command]** `.claude/commands/migrate.md` - Quick migration starter

### 📚 Documentation Templates
- **[Phlex Template]** `docs/llm/_template_phlex.md` - Template for Phlex docs
- **[ERB Template]** `docs/llm/_template_erb.md` - Template for ERB docs
- **[Phlex Overview]** `docs/llm/phlex.md` - Phlex framework guide
- **[ERB Overview]** `docs/llm/erb.md` - ERB framework guide
- **[ViewComponent]** `docs/llm/vc.md` - VC status (planned)

### 📖 Component Documentation
- **[Dialog (Phlex)]** `docs/llm/phlex/dialog.md` - Complete Dialog docs
- **[Dialog (ERB)]** `docs/llm/erb/dialog.md` - Dialog ERB syntax
- **[Alert Dialog (Phlex)]** `docs/llm/phlex/alert_dialog.md` - Alert Dialog docs
- **[Alert Dialog (ERB)]** `docs/llm/erb/alert_dialog.md` - Alert Dialog ERB

## By Use Case

### "I want to migrate a new component"
1. Run `/migrate {component}`
2. Follow `.claude/skills/component-migration.md`
3. Use `docs/migration/validation_checklist.md` to track progress
4. Run `.claude/agents/code-validator.md` before finishing

### "I want to understand the rules"
1. Read `docs/migration/README.md` - Complete guide
2. See `CLAUDE.md` - Critical rules summary
3. Check `docs/migration/validation_checklist.md` - Detailed rules

### "I want to create documentation"
1. Use templates in `docs/llm/_template_*.md`
2. See examples: `docs/llm/*/dialog.md` and `docs/llm/*/alert_dialog.md`
3. Follow structure from templates

### "I want to validate my code"
1. Run `.claude/agents/code-validator.md`
2. Check `docs/migration/validation_checklist.md`
3. Fix any failing checks

### "I'm stuck / troubleshooting"
1. Check `docs/migration/README.md` - Troubleshooting section
2. See `docs/migration/validation_checklist.md` - Common mistakes
3. Review examples in `docs/llm/*/dialog.md`

## Critical Rules Reference

### ✅ MUST
| Rule | Example |
|------|---------|
| Tailwind only | `div(class: "h-[300px]")` |
| tw-animate-css | `"animate-in fade-in-0"` |
| invisible | `"invisible data-[state=open]:visible"` |
| data-state | `element.setAttribute("data-state", "open")` |
| CSS vars both | `:root { --x: 1 } @theme { --x: 1 }` |

### ❌ NEVER
| Rule | Wrong Example |
|------|---------------|
| Custom CSS | `div(style: "height: 300px")` ❌ |
| JS animations | `setTimeout(..., 200)` ❌ |
| hidden class | `"hidden data-[state=open]:block"` ❌ |
| Missing @theme | Only in `:root` ❌ |

## File Structure

```
docs/migration/
├── INDEX.md                     ← You are here
├── README.md                    ← Start here
├── SESSION_REPORT.md            ← What was created
├── SUMMARY.md                   ← Infrastructure overview
└── validation_checklist.md      ← Complete checklist

docs/llm/
├── phlex.md                     ← Phlex guide
├── erb.md                       ← ERB guide
├── vc.md                        ← ViewComponent (planned)
├── _template_phlex.md           ← Phlex template
├── _template_erb.md             ← ERB template
├── phlex/
│   ├── dialog.md                ← Dialog docs
│   └── alert_dialog.md          ← Alert Dialog docs
└── erb/
    ├── dialog.md                ← Dialog ERB
    └── alert_dialog.md          ← Alert Dialog ERB

.claude/
├── skills/
│   └── component-migration.md   ← Migration workflow
├── agents/
│   └── code-validator.md        ← Validation agent
└── commands/
    └── migrate.md               ← Slash command
```

## Component Status

### Completed (4)
- ✅ Button
- ✅ Accordion
- ✅ Alert Dialog (docs: `docs/llm/*/alert_dialog.md`)
- ✅ Dialog (docs: `docs/llm/*/dialog.md`)

### Remaining (54)
See `dev/components_list.md`

## Next Steps

1. Choose a component from `dev/components_list.md`
2. Run `/migrate {component}`
3. Follow the 6-phase workflow
4. Run code validator
5. Update component status
6. Repeat!

## Related Documentation

- **[CLAUDE.md]** - Project instructions (updated with migration infrastructure)
- **[asChild Pattern]** `docs/patterns/as_child.md` - Composition pattern guide
- **[Components List]** `dev/components_list.md` - All components to migrate

---

**Quick Start:** `/migrate {component}` → Follow workflow → Run validator → Done! ✅
