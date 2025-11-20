# UI Engine - Claude Instructions

## Project Configuration

- **Package Manager**: Use `bun` instead of `npm` or `yarn` for all JavaScript dependencies
- **Tailwind Version**: Tailwind CSS 4 (configuration via CSS, not JS config files)
- **Asset Pipeline**: Multi-version support (Propshaft for Rails 8, Sprockets for Rails 6/7)
- **Live Reload**: Hotwire Spark for instant feedback during development
- **Required CSS Dependency**: `tw-animate-css` for component animations (alert dialog, etc.)

## Important: Asset Architecture

**The engine DOES NOT contain Tailwind configuration.** It only provides:
- CSS variables in `app/assets/stylesheets/ui/application.css`
- JavaScript modules in `app/javascript/ui/`
- Views and components

**Each application (including dummy app) configures its own Tailwind CSS:**
- The host app creates `app/assets/stylesheets/application.tailwind.css`
- The host app installs and imports `tw-animate-css`: `@import "tw-animate-css"`
- The host app imports engine variables: `@import "ui/application.css"`
- The host app configures `@source` paths to scan engine files for Tailwind classes
- The host app compiles its own CSS to `app/assets/builds/application.css`

**Required CSS Setup:**
```css
@import "tailwindcss";
@import "tw-animate-css";  /* Required for animations */
@import "ui/application.css";  /* Engine variables */

@source "../path/to/engine/app";
@source "../../app";

@theme {
  /* Your theme customizations */
}
```

## JavaScript Integration: Two Approaches

This engine supports **two different approaches** for JavaScript integration:

### 1. Importmaps (Default - Rails 8)
**Best for**: Simple apps, Rails 8 default, zero-build JavaScript

- **How it works**: Engine JavaScript is loaded via importmap pins
- **Layout**: Uses `<%= javascript_importmap_tags %>`
- **No build step required** for JavaScript
- **Engine initializer**: Automatically draws engine's importmap config
- **Test route**: `http://localhost:4000/ui/`

### 2. Bundlers (jsbundling-rails + Bun)
**Best for**: Complex apps, tree-shaking, npm ecosystem integration

- **How it works**: Engine installed as npm package `@ui/engine`, bundled with Bun
- **Layout**: Uses `<%= javascript_include_tag "bundled", type: "module" %>`
- **Build step**: `bun build` compiles JavaScript to `app/assets/builds/bundled.js`
- **Installation**: `bun link @ui/engine` (development) or `bun add @ui/engine` (production)
- **Test route**: `http://localhost:4000/bundled`

Both approaches work simultaneously in the dummy app for testing!

## CRITICAL: Stimulus Controller Registration

**ALWAYS register new Stimulus controllers in `app/javascript/ui/index.js`** when creating a new component with JavaScript behavior.

### Steps to Register a Controller:

1. **Import the controller** at the top of `app/javascript/ui/index.js`:
   ```javascript
   import AvatarController from "./controllers/avatar_controller.js";
   ```

2. **Add to registerControllers function** (maintain alphabetical order):
   ```javascript
   export function registerControllers(application) {
     return registerControllersInto(application, {
       "ui--accordion": AccordionController,
       "ui--alert-dialog": AlertDialogController,
       "ui--avatar": AvatarController,  // Add here
       "ui--dialog": DialogController,
       // ... other controllers
     });
   }
   ```

3. **Export the controller** at the bottom:
   ```javascript
   export { HelloController, AccordionController, AvatarController, DialogController };
   ```

4. **Rebuild JavaScript**:
   ```bash
   bun run build:js
   ```

**⚠️ WARNING**: If you forget this step, the Stimulus controller will NOT load and components with JavaScript behavior (like Avatar image loading, Dialog animations, etc.) will NOT work correctly!

## Development Commands

```bash
# Dummy app commands (from test/dummy directory)
cd test/dummy

# Install dependencies
bun install

# Link engine locally for bundler testing
cd .. && bun link && cd test/dummy && bun link @ui/engine

# Build CSS (one-time)
bun run build:css

# Build bundled JS (one-time)
bun run build:js

# Watch mode for CSS
bun run build:css:watch

# Watch mode for bundled JS
bun run build:js:watch

# Run dummy app with Rails + CSS + JS watch (all processes)
bin/dev
```

### Procfile.dev (test/dummy)
```
web: bin/rails server -p 4000
css: bun run build:css:watch
js: bun run build:js:watch
```

## Asset Structure

### Engine Assets (shipped with gem)
- **CSS Variables**: `app/assets/stylesheets/ui/application.css` - Base CSS variables only
- **JavaScript**: `app/javascript/ui/index.js` - JS entry point
- **Views**: `app/views/ui/` - Engine views (scanned by host app's Tailwind)
- **Components**: `app/components/ui/` - Ruby components (scanned by host app's Tailwind)

### Host App Assets (created by generator or manually)

**For Importmaps approach:**
- **Tailwind Config**: `app/assets/stylesheets/application.tailwind.css` - Tailwind 4 config with `@import`, `@source`, `@theme`
- **Compiled CSS**: `app/assets/builds/application.css` - Generated file (git-ignored)
- **Layout**: Uses `<%= javascript_importmap_tags %>`
- **Importmap Config**: `config/importmap.rb` - Pins for Turbo, Stimulus, etc.

**For Bundlers approach (jsbundling-rails):**
- **Same Tailwind Config** as above
- **JavaScript Entry**: `app/javascript/bundled.js` - Imports `@ui/engine`
- **Bundled Output**: `app/assets/builds/bundled.js` - Generated by Bun (git-ignored)
- **Layout**: Uses `<%= javascript_include_tag "bundled", type: "module" %>`
- **Package.json**: Contains `@ui/engine` dependency and build scripts

## Testing Different Rails Versions

This engine supports:
- **Rails 8 with Propshaft + Importmaps** (default, zero-build JS)
- **Rails 8 with Propshaft + jsbundling-rails** (Bun/esbuild/webpack)
- **Rails 7/6 with Sprockets** (legacy support)

The engine automatically detects the asset pipeline and configures itself accordingly.

## Publishing Engine as NPM Package

The engine's `package.json` is configured for npm publishing:

```json
{
  "name": "@ui/engine",
  "type": "module",
  "main": "app/javascript/ui/index.js",
  "exports": {
    ".": "./app/javascript/ui/index.js",
    "./styles": "./app/assets/stylesheets/ui/application.css"
  }
}
```

**To publish:**
```bash
# Update version in package.json
bun version patch|minor|major

# Publish to npm (update @ui/engine to your npm scope)
npm publish --access public
```

**Host apps can then install:**
```bash
bun add @ui/engine
# or
npm install @ui/engine
```

## Hotwire Spark - Live Reload

The dummy app is configured with **Hotwire Spark** for instant live reload during development.

### Configuration (test/dummy/config/environments/development.rb)

```ruby
# Configure Hotwire Spark for live reload
# Watch engine HTML files (views and components)
config.hotwire.spark.html_paths << Rails.root.join("../../app/views/ui")
config.hotwire.spark.html_paths << Rails.root.join("../../app/components/ui") if Rails.root.join("../../app/components/ui").exist?

# Watch engine CSS files
config.hotwire.spark.css_paths << Rails.root.join("../../app/assets/stylesheets/ui")

# Watch dummy app CSS
config.hotwire.spark.css_paths << Rails.root.join("app/assets/stylesheets")

# Watch engine JavaScript files
config.hotwire.spark.stimulus_paths << Rails.root.join("../../app/javascript/ui")

# Watch dummy app JavaScript
config.hotwire.spark.stimulus_paths << Rails.root.join("app/javascript")
```

### Routes (test/dummy/config/routes.rb)

```ruby
mount Hotwire::Spark::Engine => "/spark" if Rails.env.development?
```

**What gets live reloaded:**
- ✅ Engine views (`.erb`, `.html.erb`)
- ✅ Engine CSS files
- ✅ Engine JavaScript files
- ✅ Dummy app views, CSS, and JavaScript

Simply run `bin/dev` and edit any watched file - changes reload automatically!

## Component Development Best Practices

### CSS and Styling Rules

**ALWAYS use Tailwind utility classes. NEVER write custom CSS or inline styles.**

- ❌ **NEVER**: `style="height: 300px"` or custom CSS in `<style>` tags
- ✅ **ALWAYS**: Use Tailwind classes like `h-[300px]` or arbitrary values `transition-[height]`

#### Global Design System Colors (@layer base)

To ensure all elements use theme colors by default, the engine includes a `@layer base` rule in `app/assets/stylesheets/ui/application.css`:

```css
@layer base {
  * {
    border-color: var(--border);
    outline-color: var(--ring);
  }
  @supports (color:color-mix(in lab, red, red)) {
    * {
      outline-color: color-mix(in oklab, var(--ring) 50%, transparent)
    }
  }
}
```

**Why this is needed:**
- Without this, borders default to browser's default color (usually black/dark gray)
- shadcn/ui uses this pattern - it's NOT generated automatically by Tailwind
- Eliminates need to add `border-border` class to every component
- Ensures consistent theme colors across all elements

**Where it's defined:**
- Engine file: `app/assets/stylesheets/ui/application.css`
- Automatically imported by host apps via `@import "ui/application.css"`

This is a one-time setup in the engine - components don't need to worry about border colors.

### CSS Variables in Tailwind 4

When adding CSS variables that Tailwind needs to use:

1. **Define in `:root`** (for browser access):
   ```css
   :root {
     --duration-accordion: 300ms;
     --ease-accordion: cubic-bezier(0.87, 0, 0.13, 1);
   }
   ```

2. **Define in `@theme`** (for Tailwind class generation):
   ```css
   @theme {
     --duration-accordion: 300ms;
     --ease-accordion: cubic-bezier(0.87, 0, 0.13, 1);
   }
   ```

3. **Use the variable** in component classes to trigger generation:
   ```ruby
   "transition-[height] duration-[var(--duration-accordion)] ease-[var(--ease-accordion)]"
   ```

**Important**: Tailwind 4 only generates utility classes for classes that are **actually used** in scanned files. If a variable exists in `@theme` but isn't used anywhere, no utility class will be generated.

### Testing CSS Variable Generation

After adding new variables, verify they're being generated:

```bash
# Rebuild CSS
bun run build:css

# Check if variable is in :root
grep "your-variable" ./test/dummy/app/assets/builds/application.css

# Check if utility class was generated
grep "your-utility-class" ./test/dummy/app/assets/builds/application.css
```

### Reference Implementation

When implementing components, **always reference shadcn/ui and Radix UI**:

1. **Visual Reference**: https://ui.shadcn.com/docs/components/[component]
2. **Behavior Reference**: https://www.radix-ui.com/primitives/docs/components/[component]
3. **Source Code**: https://github.com/radix-ui/primitives/tree/main/packages/react/[component]/src

**CRITICAL: Check API Reference for asChild**

Before implementing any component, **ALWAYS check the shadcn/ui API Reference section**:

1. Visit https://ui.shadcn.com/docs/components/[component]
2. Find the "API Reference" section
3. Check if `asChild` prop is listed
4. **If `asChild` is listed → Component MUST implement it**
5. **If `asChild` is NOT listed → Skip asChild implementation**

**Why this matters:**
- shadcn/ui v4 documents `asChild` in API Reference for components that support composition
- Missing `asChild` breaks expected usage patterns (e.g., Item as link, Dialog Trigger as Button)
- Prevents invalid HTML nesting (e.g., button inside button)
- The API Reference is the SOURCE OF TRUTH for asChild requirement

**Use browser dev tools** to inspect shadcn examples and extract:
- Exact CSS classes used
- HTML structure and nesting
- ARIA attributes
- Data attributes for state management
- Animation timings and easing functions

### Animation Best Practices

**Animations are a critical part of component implementation.** Follow these patterns from Radix UI:

#### State Management with `data-state`

Use `data-state` attribute to control animations via CSS, not JavaScript timing:

```ruby
# ❌ WRONG: JavaScript controls visibility with setTimeout
def hide
  set_state_to_closed
  setTimeout(200) { add_hidden_class }  # Creates glitches!
end

# ✅ CORRECT: CSS controls everything, JS only changes state
def hide
  containerTarget.setAttribute("data-state", "closed")
  # CSS animations handle the rest via data-[state=closed]:animate-out
end
```

#### Container Visibility Pattern

Use `visibility: hidden` (via `invisible` class), NEVER `display: none` (via `hidden` class):

```ruby
# ❌ WRONG: Using .hidden causes animations to be skipped
"fixed inset-0 z-50 hidden"  # display: none prevents animations

# ✅ CORRECT: Use invisible for smooth animations
"data-[state=closed]:invisible data-[state=open]:visible fixed inset-0 z-50"
```

**Why `invisible` works better**:
- `invisible` = `visibility: hidden` - element remains in layout, animations still run
- `hidden` = `display: none` - element removed from layout, animations are cancelled
- CSS transitions/animations need the element to be in the DOM to animate

#### Animation Class Pattern

Combine state-based animations with opacity and pointer-events:

```ruby
# Overlay example - fade in/out with visibility control
"data-[state=open]:animate-in data-[state=closed]:animate-out \
 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 \
 data-[state=closed]:opacity-0 data-[state=open]:opacity-100 \
 data-[state=open]:pointer-events-auto data-[state=closed]:pointer-events-none \
 fixed inset-0 z-50 bg-black/50"

# Content example - fade + zoom with visibility control
"data-[state=open]:animate-in data-[state=closed]:animate-out \
 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 \
 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 \
 data-[state=closed]:opacity-0 data-[state=open]:opacity-100 \
 data-[state=open]:pointer-events-auto data-[state=closed]:pointer-events-none"
```

#### JavaScript Controller Pattern

Keep controllers simple - manage state only, let CSS handle animations:

```javascript
show() {
  // Just change state - CSS does the animation work
  if (this.hasContainerTarget) {
    this.containerTarget.setAttribute("data-state", "open")
  }
  if (this.hasOverlayTarget) {
    this.overlayTarget.setAttribute("data-state", "open")
  }
  if (this.hasContentTarget) {
    this.contentTarget.setAttribute("data-state", "open")
  }
  // No setTimeout, no animationend listeners needed!
}

hide() {
  // Just change state - CSS handles fade-out, zoom-out, etc.
  if (this.hasContainerTarget) {
    this.containerTarget.setAttribute("data-state", "closed")
  }
  if (this.hasOverlayTarget) {
    this.overlayTarget.setAttribute("data-state", "closed")
  }
  if (this.hasContentTarget) {
    this.contentTarget.setAttribute("data-state", "closed")
  }
  // invisible class prevents interaction during animation
}
```

#### Testing Animations

When testing animations:

1. **Visual Test**: Open and close component multiple times - no flicker/glitches
2. **Dev Tools**: Inspect computed styles during animation
3. **Verify Classes**: Check that `data-state` correctly toggles `open`/`closed`
4. **Browser Test**: Test in actual browser, not just automated tests (animations may not be visible in headless mode)

#### Common Animation Pitfalls

❌ **Using `.hidden` class**:
```ruby
containerTarget.classList.add("hidden")  # Kills animations!
```

❌ **Using `animationend` listeners unnecessarily**:
```javascript
// Complex and error-prone
element.addEventListener("animationend", () => { /* ... */ })
```

❌ **Using `setTimeout` for animation timing**:
```javascript
// Brittle and causes glitches
setTimeout(() => hide(), 200)
```

✅ **Let CSS do the work**:
```ruby
# In behavior module
"data-[state=closed]:invisible"  # Element invisible after animation

# In controller
containerTarget.setAttribute("data-state", "closed")  # That's it!
```

### Component Migration Infrastructure

**Complete migration system with automated validation and quality assurance.**

#### Quick Start

```bash
# Use the slash command
/migrate tooltip
```

#### Full Documentation

- **Overview**: `docs/migration/README.md` - Complete guide with workflow, rules, and troubleshooting
- **Checklist**: `docs/migration/validation_checklist.md` - Detailed validation rules (~400 lines)
- **Skill**: `.claude/skills/component-migration.md` - 6-phase migration workflow
- **Validator**: `.claude/agents/code-validator.md` - Automated code quality checks
- **Summary**: `docs/migration/SUMMARY.md` - Infrastructure overview

#### Critical Rules (Enforced by Validator)

**✅ MUST:**
- Use ONLY Tailwind utility classes
- Use tw-animate-css for animations (`animate-in`, `fade-in-*`, etc.)
- Use `invisible` for animated elements (NOT `hidden`)
- Use `data-state` for state management
- Define CSS variables in BOTH `:root` and `@theme`
- Implement asChild if component has trigger/activator
- Include all ARIA attributes from Radix UI

**❌ NEVER:**
- Custom CSS in `<style>` tags or inline `style=""`
- Animate in JavaScript (setTimeout, manual class toggling)
- Use `hidden` class for animated elements (kills animations)
- Missing CSS variables in `@theme` (Tailwind won't generate utilities)

#### Migration Checklist (Quick Reference)

When migrating a component from shadcn/Radix:

1. ✅ Compare HTML structure with shadcn example
2. ✅ Extract all CSS classes from browser dev tools
3. ✅ Verify animations match (duration, easing, properties)
4. ✅ Check ARIA attributes for accessibility
5. ✅ Test with Playwright to compare visual appearance
6. ✅ Ensure all CSS variables are in both `:root` and `@theme`
7. ✅ Verify Tailwind generates all needed utility classes
8. ✅ **Evaluate asChild composition needs** (see `docs/patterns/as_child.md`):
   - Does the component render a wrapper that might break layouts?
   - Does it need to accept `as_child: true` to yield attributes to a child?
   - Does it need to consume attributes from a parent using asChild?
   - Example: `Dialog::Trigger` provides asChild, `Button` can receive it
9. ✅ **Generate LLM documentation** (see below)
10. ✅ **Run code validator** (`.claude/agents/code-validator.md`)

See `docs/migration/validation_checklist.md` for complete detailed checklist.

### LLM Documentation

After migrating a component, generate documentation for LLMs in `docs/llm/`:

**Structure**:
```
docs/llm/
├── phlex.md          # Overview of Phlex usage
├── erb.md            # Overview of ERB usage
├── vc.md             # Overview of ViewComponent usage
├── phlex/
│   ├── button.md
│   ├── accordion.md
│   └── alert_dialog.md
├── erb/
│   ├── button.md
│   ├── accordion.md
│   └── alert_dialog.md
└── vc/
    ├── button.md
    ├── accordion.md
    └── alert_dialog.md
```

**IMPORTANT: Always consult LLM docs before using components**

When using components in examples, showcases, or migrations:

1. **Check the LLM docs first**: `docs/llm/{format}/{component}.md`
2. **Follow the syntax exactly**: Copy the correct usage pattern
3. **Common errors prevented by docs**:
   - ❌ `UI::Button.new` (module, not component)
   - ✅ `UI::Button::Button.new` (correct Phlex)
   - ✅ `UI::Button::ButtonComponent.new` (correct ViewComponent)
   - ✅ `render "ui/button"` (correct ERB)

**Documentation template includes**:
- Component path and class names
- All parameters with types and defaults
- Variants and sizes
- Common usage examples
- Integration patterns
- Error prevention (common mistakes)
- Format-specific notes (Phlex vs ERB vs ViewComponent)

## Generator Usage

```bash
rails generate ui:install
```

This creates:
- `app/assets/stylesheets/application.tailwind.css`
- `app/assets/builds/.keep`
- `package.json` (if not exists)
- `Procfile.dev` (if not exists)
- Updates `.gitignore`
- Configures importmap (if using importmaps)
- nao precisa dar rebuild no JS, acontece automatico