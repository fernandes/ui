# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

Accessibility pass over every interactive component, checked against the Radix, Base UI and React Aria
bases shadcn ships on (see `docs/audit/aria.md`).

### Breaking

- [Input OTP] Rebuilt as one labelled `<input autocomplete="one-time-code">` with slots drawn from its value. Forms now receive `name=CODE` instead of `name[0]..name[n]`, and `id:` lands on the input (so `<label for>` works) instead of the container
- [Tabs, Accordion] Ids are generated per instance in JS; the value-based ids (`tabs-content-<value>`, `accordion-trigger-<value>`, ...) are no longer rendered. An `id` you pass is kept
- [Dropdown Menu] The default trigger renders a `<button>`, or a plain wrapper when its content is already a button or link (was a focusable `div role=button`)
- [Hover Card] The default trigger is an `<a>` (pass `href:`); `tag: :span` still works
- [Accordion] `collapsible:` now works and defaults to `true` (same behaviour as before); `collapsible: false` keeps one item open
- [Drawer] Title renders as `<h2>`
- [Carousel] Previous/Next use `aria-disabled` instead of `disabled` at the ends, so they keep focus
- [Tooltip] Closes 100 ms after the pointer leaves the trigger, so the pointer can reach the tooltip

### Added

- [Utils] Shared helpers: per-instance ids (`ensureId`/`setIdRefs`), an Escape layer stack (`createEscapeLayer`), `inertOthers`, `createModalSession` and a shared typeahead. Documented in `docs/audit/foundations.md`
- [Alert Dialog] `as_child:` on the trigger
- [Dropdown Menu, Context Menu] `disabled:` on items (and Dropdown sub triggers)
- [Accordion] `disabled:` on items
- [Collapsible] Phlex/VC Trigger and Content accept `open:`
- [Toggle Group] `disabled:` and `loop:`
- [Checkbox] `indeterminate:` ("mixed")
- [Switch] `required:`
- [Input OTP] `value:`, `autofocus:`, `required:`, `invalid:`, `inputmode:`
- [Popover] `auto_focus:` (default true) and a `close` action
- [Carousel] `autoplayToggle` target and `toggleAutoplay` action for a pause/play button
- [Command Dialog] `title:` / `description:` for its visually hidden heading
- [Sonner] `label:` for the notifications region (default "Notifications")
- [Responsive Dialog] ERB `trigger:` local and a ViewComponent `trigger` slot

### Fixed

Modals

- [Dialog, Sheet, Alert Dialog, Drawer, Command Dialog] Focus moves inside on open (skipping hidden form fields such as the authenticity token), Tab is trapped, the page behind is inert, and closing returns focus to the trigger
- [Dialog, Sheet, Alert Dialog, Drawer] Content is labelled by its title and described by its description; the trigger exposes `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls`
- [Dialog, Drawer, Popover, Select, Dropdown Menu, Tooltip, Hover Card, Navigation Menu] Escape closes only the topmost layer, so a Select inside a Dialog no longer closes both
- [Alert Dialog] Focus starts on Cancel
- [Drawer] ERB content keeps the caller's `id`, `aria-*` and `data-*`; reopening during the close animation no longer closes it; a drawer releases only its own scroll lock
- [Responsive Dialog] Open state syncs with the Dialog/Drawer (it relied on events nobody listened to); crossing the breakpoint while open hands over to the visible variant; the body is rendered once; `open: true` opens only the visible one; the ERB partial compiles again
- [Command Dialog] Named by a visually hidden title; moving focus inside no longer closes it; the input is focused without a timer; the ERB partial renders again
- [Sidebar] The mobile sheet is a real modal; content is rendered once instead of twice; a collapsed offcanvas sidebar is inert; the trigger exposes `aria-expanded`/`aria-controls`; the sheet no longer opens twice per toggle

Menus

- [Dropdown Menu, Context Menu, Menubar] Typeahead; disabled items get `aria-disabled` and are skipped; selecting, Escape and Tab return focus where it was; sub triggers announce their submenu (`aria-haspopup`, `aria-expanded`, `aria-controls`)
- [Dropdown Menu] Phlex renders `aria-checked="true"`/`"false"` on checkbox and radio items; ArrowDown/ArrowUp on the trigger open the menu; clicking an item closes it; text fields inside submenus keep their keys; a menu restored from the Turbo cache resets to closed
- [Context Menu] Checkbox and radio items toggle; menu keys no longer act page-wide; it closes when focus leaves, on Tab, on an outside click or when another context menu opens
- [Menubar] Opening a menu moves focus into it; screen-reader (virtual) clicks open menus; flipped submenus close correctly; keyboard toggling of checkbox/radio items fires a click

Overlays

- [Popover] Trigger announces the dialog and content is `role="dialog"`; opening from the trigger moves focus inside; clicking plain text inside no longer closes it; hover popovers open from the keyboard; `popover:show`/`popover:hide` fire only on a real state change
- [Tooltip] Content is `role="tooltip"` and describes its trigger (`aria-describedby`, keeping an existing one); hoverable (WCAG 1.4.13); doesn't open on the focus caused by a mouse click
- [Hover Card] Escape closes it; links inside are out of the Tab order, so tabbing past the trigger closes it
- [Navigation Menu] Every trigger is a Tab stop; Tab out of a panel goes to the next item instead of the first trigger; viewport mode moves the real content instead of cloning it (no duplicated links or ids) and hides closed panels; triggers control their content; `<nav>` defaults to `aria-label="Main"`; arrow keys reach top-level links and links in a panel
- [Navigation Menu] Phlex and ViewComponent no longer raise NameError in viewport mode

Lists and pickers

- [Command] Disabled items are no longer reachable or selectable; the highlighted item is announced (`aria-activedescendant` on the input); the list and groups are named; "no results" is announced; hover highlights; works inside a Drawer
- [Select] Focus moves onto the highlighted option, so screen readers announce it; ArrowUp/ArrowDown open it; typeahead open or closed; Tab closes it; groups are named; the ERB trigger accepts `id:`, so `<label for>` works
- [Combobox] Focus returns to the trigger after selecting; the trigger exposes `role="combobox"` and `aria-expanded`; the wrapper renders instead of raising NameError (all three renderers)
- [Date Picker] Opening focuses the selected day (or today); selecting returns focus to the trigger; the ERB calendar gets the initial selection and keeps arrow keys; the ERB hidden field renders with `name:`; picking a date updates the Phlex date picker; ViewComponent and Phlex input parts no longer raise NameError
- [Calendar] Days are named by the full date; selection and disabled state live on the gridcell; today has `aria-current="date"`; each grid is named by its month; disabled dates stay focusable so arrows move across them; one tab stop; arrows in the month/year selects aren't hijacked; selects are labelled and month names follow `locale`; multi-month renders one previous and one next button; the month animation respects `prefers-reduced-motion`
- [Calendar] Dates given as `yyyy-MM-dd` are parsed as local time (they slipped a day west of UTC)

Form controls

- [Checkbox] No `aria-checked` on the native input; state re-syncs on form reset
- [Switch] Keeps a custom `value`; no duplicated `id` on the hidden input; restores on form reset
- [Toggle Group] Roving tabindex with arrow keys by orientation, Home/End and looping, skipping disabled items; `aria-orientation`
- [Slider] Keyboard handlers no longer pile up after a Turbo reconnect; thumbs are named ("Minimum"/"Maximum", or the slider's label); ARIA is rendered server-side; values submit as hidden inputs (`name`, or `name[]` for ranges); thumbs clamp at their neighbours instead of swapping; `inverted` applies to keys; PageUp/PageDown snap and Shift+Arrow takes a large step
- [Input OTP] `<label for>` and SMS autofill work; focus is no longer stolen on load; typing over a filled slot replaces it; paste ignores spaces and dashes

Disclosure and layout

- [Tabs] Panels are named by their tab; arrows, Home and End skip disabled tabs; keyboard handling no longer doubles after a Turbo reconnect
- [Accordion, Collapsible] Triggers and regions are linked by per-instance ids; collapsed content is hidden even when no transition runs, so it is never tabbable
- [Collapsible] `disabled` disables the trigger; `open` is rendered by the server
- [Carousel] Arrow keys move between slides; autoplay pauses on hover and turns its live region off while rotating
- [Resizable] Handles report the real panel size and limits, have `aria-orientation` and `aria-controls`, Enter collapses and restores the panel, and the keyboard handler no longer doubles after a Turbo reconnect
- [Scroll Area] The viewport is a Tab stop only when it can scroll; scrollbars are hidden from screen readers and show when anything inside has focus; Phlex and ViewComponent no longer raise NameError

Feedback

- [Sonner] Toasts are announced through a polite live region (errors assertively); F8 focuses the notifications; Escape dismisses the focused toast; timers pause on focus and window blur; focus is kept when a focused toast is dismissed. Render the toaster as a direct child of `<body>` so toasts stay announced while a modal is open
- [Sonner] ViewComponent toaster no longer raises `uninitialized constant UI::ToasterBehavior`
- [Avatar] Document `alt` as required unless the avatar is decorative

### Removed

- [Cleanup] Stale copies of behaviors in `app/helpers/ui/` that `app/behaviors/ui/` already shadowed

### Dev

- [Tests] JS tests use Testing Library (user-event, jest-dom) through a `render()` helper; see `test/dummy/test/javascript/README.md`
- [Tests] happy-dom 21 (20 dropped the MutationObserver callback on GC, so controllers randomly never connected); bun tests run in `America/Sao_Paulo` on CI

## 0.1.10

### Added

- [Button] Support `as_child: true` to hand the button styling to a child element (e.g. a link); `type` is withheld and `disabled` becomes `aria-disabled`

### Changed

- [Performance] Reuse one TailwindMerge merger per thread (`UI::ClassMerger`) instead of building a new one per component. Building a merger costs ~4ms; rendering 200 buttons went from ~1160ms to ~4ms

### Fixed

- [CommandDialog] Merging custom classes no longer raises `NameError` (it referenced a `UI::TailwindMerge` module that did not exist)
- [Popover] Clear `inert` when opening, so open content accepts clicks and focus again
- [Sidebar] Anchor the rail to the sidebar instead of the viewport, removing horizontal overflow on pages with a sidebar
- [Sidebar] Position the menu badge over the menu button instead of below it
- [Sonner] Toaster partial no longer recurses forever because of an ERB output tag inside its doc comment
- [Button, Checkbox] Add `ring-offset-background` and `focus-visible:ring-offset-2` to the focus ring

## 0.1.9

### Fixed

- [Command] Defer input focus to the next microtask on show, so focus lands on the input after the popover becomes visible (some browsers silently ignored it)

## 0.1.8

### Added

- [Dev] `rake app:ui:release` task: bumps `version.rb` and `package.json`, rebuilds the JS bundle and refreshes the lockfiles

### Fixed

- [Command] Forward popover/drawer `show`/`hide` events to a nested Command; the previous listeners sat on a descendant and never fired
- [Command] Clear the search input on close, so the next open doesn't show a stale filter
- [Command] Remove event listeners on disconnect (they were leaking because each call bound a new function)
- [JS] Rebuild the JS bundle (`ui.js` / `ui.esm.js`), which 0.1.7 shipped stale: its JavaScript changes only reach importmap and npm users from this version on

## 0.1.7

### Added

- [Positioner] Expose `--ui-popover-trigger-width` on floating content, so it can match the trigger width with `w-[var(--ui-popover-trigger-width)]`

### Changed

- [Command] Auto-select the first visible item while filtering, so Enter activates the top match
- [CSS] `--popover` falls back to `var(--card)` in the light theme, so customizing `--card` alone keeps popovers consistent (dark theme unchanged)
- [Dependencies] Allow `tailwind_merge` `>= 0.13, < 2.0` (was `~> 0.13`)

### Fixed

- [Popover] Keep `inert` in sync with the open/closed state, so a closed popover's content can't be focused on Safari iOS/iPadOS

## 0.1.6

### Added

- [Slider] Phlex implementation (UI::Slider, UI::SliderTrack, UI::SliderRange, UI::SliderThumb)
- [Docs] Components YAML to gemspec spec files
- [JS] remove console.log for registered controllers

## 0.1.5

### Added

- [Item] Support `as_child` pattern in ERB partial for composition without wrapper elements

### Changed

- [ButtonGroup] Exclude nested button-groups from border/radius rules to prevent double borders

### Fixed

- [ButtonGroup] Exclude popover/tooltip content (`[data-state]`) from border/radius rules
- [ButtonGroup] Preserve right border-radius on elements followed by popover/tooltip content (`:has(+[data-state])`)
- [ButtonGroup] Use `!important` on border-radius rules to override button's shorthand `rounded-[var(--radius)]`
- [Field Separator] Now uses separator internally to render it correctly
- [Field Label] Render as `<label>` instead of `<div>` so clicking anywhere toggles the associated input
- [Field Label] Pass `for_id` parameter to `@for_id` so the `for` attribute is correctly set
- [Button] Use CSS variable `--radius` for customizable border-radius (matches InputGroup behavior)
- [Button] Normalize size parameter to accept both underscore (`:icon_sm`) and hyphen (`"icon-sm"`) formats
- [Button] Remove `!important` from outline variant border to allow ButtonGroup to override with `border-l-0`
- [InputGroupButton] Normalize size parameter to accept both underscore (`:icon_xs`) and hyphen (`"icon-xs"`) formats

## 0.1.4

### Added

- [Tooltip] Support `as_child` pattern for composition without wrapper elements
- [Popover] Support `as_child` pattern for composition without wrapper elements
- [Select] Support `as_child` pattern for seamless integration in flex layouts
- [Calendar] Option to use UI::Select dropdowns instead of native selects

### Changed

- [InputGroup] Use CSS variable `--radius` for customizable border-radius
- [InputGroupButton] Properly merge classes when receiving attributes from asChild parents
- [DropdownMenuTrigger] asChild now only passes functional attributes (data, aria), not classes
- [NavigationMenu] Rename behaviors to avoid naming conflicts (e.g., `ContentBehavior` → `NavigationMenuContentBehavior`)

### Fixed

- [Collapsible] Force reflow to get correct height after removing hidden
- [Dropdown] Focus new item on hover instead of blur to prevent menu from closing
- [Skeleton] Use TailwindMerge for proper class merging
- [Avatar] ERB partial now properly merges custom classes (e.g., `size-16 grayscale`)
- [Table] Fix rendering for Phlex/VC implementations
- [Menubar] Fix checkboxes / radio groups not being selected
- [Sonner] Fix behavior wrong name
- [Avatar] Fix classes not being passed correctly
- [Button] (ERB) process attributes received as child correctly
- [Combobox] Set default offset to 4 on all implementations

## 0.1.3

Didn't happen lol

## 0.1.2

### Changed

- Fix accordion to show open on initial state and animate on closing
- Fix carousel icones to have border and use same icon

### Added

- Components YAML to help on documentation
- Components aspect ratios for aspect ration component
- [Command] Configure autofocus with parameter

## [0.1.1] - 2025-11-28

### Changed

- Consolidated `sonner.css` into `application.css`
- Added new `css_generator.rb` for CSS-only installation

## [0.1.0] - 2025-11-28

### Added

- Initial release of fernandes-ui
- Rails UI component library with ERB, Phlex, and ViewComponent support
- Built with Tailwind CSS 4 and Stimulus.js
- Components include:
  - Accordion
  - Alert
  - Alert Dialog
  - Aspect Ratio
  - Avatar
  - Badge
  - Breadcrumb
  - Button
  - Calendar
  - Card
  - Carousel
  - Checkbox
  - Collapsible
  - Combobox
  - Command
  - Context Menu
  - Date Picker
  - Dialog
  - Drawer
  - Dropdown Menu
  - Field (Form)
  - Hover Card
  - Input
  - Input OTP
  - Kbd (Keyboard)
  - Label
  - Menubar
  - Navigation Menu
  - Pagination
  - Popover
  - Progress
  - Radio Group
  - Resizable
  - Responsive Dialog
  - Scroll Area
  - Select
  - Separator
  - Sheet
  - Sidebar
  - Skeleton
  - Slider
  - Sonner (Toast)
  - Spinner
  - Switch
  - Table
  - Tabs
  - Textarea
  - Toggle
  - Toggle Group
  - Tooltip
- Automatic detection and conditional loading of Phlex (>= 2.0) and ViewComponent (>= 3.0)
- Manual configuration via `UI.configure` block
- JavaScript controllers for interactive components
- CSS variables for theming
- Support for Rails 6.0+
- Support for both Importmaps and jsbundling-rails approaches

[0.1.1]: https://github.com/fernandes/ui/releases/tag/v0.1.1
[0.1.0]: https://github.com/fernandes/ui/releases/tag/v0.1.0
