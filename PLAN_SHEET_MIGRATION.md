# Sheet Component Migration Plan

## Overview

Sheet is a panel that slides in from the edge of the screen. According to shadcn/ui, **Sheet extends the Dialog component** to display content that complements the main content of the screen.

### Key Insight: Sheet = Dialog + Side Positioning + Slide Animations

In shadcn/ui, Sheet uses the exact same Radix UI Dialog primitives (`@radix-ui/react-dialog`). The only differences are:
1. **Positioning**: Edge of screen (top/right/bottom/left) vs center
2. **Animations**: Slide in/out vs zoom in/out
3. **Header/Footer Classes**: Slightly different layout

**Strategy**: Reuse the existing `ui--dialog` Stimulus controller and create Sheet-specific behavior modules and components.

---

## Component Comparison

| Sheet Component | Dialog Equivalent | Differences |
|-----------------|-------------------|-------------|
| Sheet | Dialog | Same (uses ui--dialog controller) |
| SheetTrigger | DialogTrigger | Same (asChild support) |
| SheetOverlay | DialogOverlay | Same CSS classes |
| SheetContent | DialogContent | **Different**: side variants, slide animations |
| SheetHeader | DialogHeader | **Different**: `flex flex-col gap-1.5 p-4` |
| SheetFooter | DialogFooter | **Different**: `mt-auto flex flex-col gap-2 p-4` |
| SheetTitle | DialogTitle | Same |
| SheetDescription | DialogDescription | Same |
| SheetClose | DialogClose | Same + built-in X button in Content |

---

## SheetContent Side Variants (CSS Classes)

### Base Classes (all sides)
```
bg-background fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out
data-[state=open]:animate-in data-[state=closed]:animate-out
data-[state=closed]:duration-300 data-[state=open]:duration-500
```

### Side: right (default)
```
data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right
inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm
```

### Side: left
```
data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left
inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm
```

### Side: top
```
data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top
inset-x-0 top-0 h-auto border-b
```

### Side: bottom
```
data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom
inset-x-0 bottom-0 h-auto border-t
```

---

## Implementation Plan

### Phase 1: Behavior Modules (app/models/ui/sheet/)

1. **sheet_behavior.rb** - Root container (delegates to ui--dialog controller)
2. **sheet_content_behavior.rb** - Content with side variants and slide animations
3. **sheet_overlay_behavior.rb** - Can reuse DialogOverlayBehavior or create identical
4. **sheet_header_behavior.rb** - Different classes than Dialog
5. **sheet_footer_behavior.rb** - Different classes than Dialog
6. **sheet_trigger_behavior.rb** - Same as Dialog (asChild support)
7. **sheet_close_behavior.rb** - Same as Dialog

### Phase 2: Phlex Components (app/components/ui/sheet/)

| File | Notes |
|------|-------|
| sheet.rb | Root, uses ui--dialog controller |
| trigger.rb | asChild support, reuse AsChildBehavior |
| overlay.rb | Container + backdrop |
| content.rb | **Key**: side prop (top/right/bottom/left), includes built-in close button |
| header.rb | `flex flex-col gap-1.5 p-4` |
| footer.rb | `mt-auto flex flex-col gap-2 p-4` |
| title.rb | Same as Dialog: `text-foreground font-semibold` |
| description.rb | Same as Dialog: `text-muted-foreground text-sm` |
| close.rb | Button that closes sheet |

### Phase 3: ERB Partials (app/views/ui/sheet/)

| File | Notes |
|------|-------|
| _sheet.html.erb | Root container |
| _trigger.html.erb | asChild support |
| _overlay.html.erb | Container + backdrop |
| _content.html.erb | side prop, built-in close button |
| _header.html.erb | Header layout |
| _footer.html.erb | Footer layout |
| _title.html.erb | Title styling |
| _description.html.erb | Description styling |
| _close.html.erb | Close button |

### Phase 4: ViewComponents (app/components/ui/sheet/)

| File | Notes |
|------|-------|
| sheet_component.rb | Root |
| trigger_component.rb | asChild |
| overlay_component.rb | Container + backdrop |
| content_component.rb | side prop |
| header_component.rb | Header |
| footer_component.rb | Footer |
| title_component.rb | Title |
| description_component.rb | Description |
| close_component.rb | Close button |

### Phase 5: Documentation & Showcase

1. **LLM Docs**:
   - docs/llm/phlex/sheet.md
   - docs/llm/erb/sheet.md
   - docs/llm/vc/sheet.md

2. **Showcase Page**: test/dummy/app/views/components/sheet.html.erb
   - Basic Example (right side)
   - All Sides (top, right, bottom, left)
   - With Form Fields
   - Custom Width

3. **Routes**: Add to test/dummy/config/routes.rb
4. **Index Link**: Add to components index page

---

## Key Implementation Details

### 1. Reuse ui--dialog Stimulus Controller

No need for a new controller. Sheet uses the same open/close behavior as Dialog:
- `data-controller="ui--dialog"`
- `data-action="click->ui--dialog#open"`
- `data-action="click->ui--dialog#close"`

### 2. SheetContent Built-in Close Button

shadcn Sheet includes a close button inside SheetContent. Position:
```ruby
# absolute top-4 right-4 rounded-xs opacity-70 hover:opacity-100
```

Should include X icon using lucide_icon.

### 3. Side Prop Default

Default side is `right` (most common use case).

### 4. Animation Classes

Uses tw-animate-css classes:
- `animate-in` / `animate-out`
- `slide-in-from-right` / `slide-out-to-right`
- `slide-in-from-left` / `slide-out-to-left`
- `slide-in-from-top` / `slide-out-to-top`
- `slide-in-from-bottom` / `slide-out-to-bottom`

### 5. Visibility Pattern

Use `invisible` (not `hidden`) for animated elements:
```ruby
data-[state=closed]:invisible data-[state=open]:visible
```

---

## Files to Create

```
app/models/ui/sheet/
├── sheet_behavior.rb
├── sheet_content_behavior.rb
├── sheet_overlay_behavior.rb
├── sheet_header_behavior.rb
├── sheet_footer_behavior.rb
├── sheet_trigger_behavior.rb
└── sheet_close_behavior.rb

app/components/ui/sheet/
├── sheet.rb
├── trigger.rb
├── overlay.rb
├── content.rb
├── header.rb
├── footer.rb
├── title.rb
├── description.rb
├── close.rb
├── sheet_component.rb
├── trigger_component.rb
├── overlay_component.rb
├── content_component.rb
├── header_component.rb
├── footer_component.rb
├── title_component.rb
├── description_component.rb
└── close_component.rb

app/views/ui/sheet/
├── _sheet.html.erb
├── _trigger.html.erb
├── _overlay.html.erb
├── _content.html.erb
├── _header.html.erb
├── _footer.html.erb
├── _title.html.erb
├── _description.html.erb
└── _close.html.erb

docs/llm/
├── phlex/sheet.md
├── erb/sheet.md
└── vc/sheet.md

test/dummy/app/views/components/
└── sheet.html.erb
```

---

## Estimated Effort

| Phase | Files | Complexity |
|-------|-------|------------|
| Behavior Modules | 7 | Low (reuse patterns from Dialog/Drawer) |
| Phlex Components | 9 | Low-Medium |
| ERB Partials | 9 | Low |
| ViewComponents | 9 | Low-Medium |
| Documentation | 3 | Low |
| Showcase | 1 | Low |
| **Total** | **38** | **Medium** |

---

## Validation Checklist

- [ ] All components use Tailwind utility classes only
- [ ] Animations use tw-animate-css (slide-in-from-*, slide-out-to-*)
- [ ] Uses `invisible` not `hidden` for animated elements
- [ ] Uses `data-state` for state management
- [ ] asChild pattern implemented in Trigger
- [ ] ARIA attributes: role="dialog", aria-modal="true"
- [ ] No custom CSS or inline styles
- [ ] All three implementations (Phlex, ERB, ViewComponent) complete
- [ ] LLM documentation generated
- [ ] Showcase page with multiple examples
- [ ] Visual comparison with shadcn matches


> aqui esta a implementação da sheet no shad (que deu 429 a request)

```
"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" &&
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" &&
            "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" &&
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden
disabled:pointer-events-none">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
```

e aqui as demos:

```
import { Button } from "@/registry/new-york-v4/ui/button"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/new-york-v4/ui/sheet"

export default function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-name">Name</Label>
            <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-username">Username</Label>
            <Input id="sheet-demo-username" defaultValue="@peduarte" />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
