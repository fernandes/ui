# Accessibility audit — Stimulus controllers vs shadcn bases

Audit date: 2026-11-11. Each controller was compared, by reading code, against the three libraries
shadcn/ui now ships on: **Radix**, **Base UI** and **React Aria** (plus the WAI-ARIA APG).

- Reference clones (read-only): `~/src/reference/{shadcn,radix-primitives,base-ui,react-spectrum}`.
- Evidence paths: ours are relative to `app/`; references are under the clones.
- **Severity:** high = a keyboard or screen-reader user is blocked or misled; medium = degraded or
  non-standard; low = polish.
- **Confidence:** ✅ confirmed by tracing the code; ❓ suspected, needs a browser / AT check.
- **Status:** `todo` → `test` (reproduced by a failing test) → `fixed`. Every fix starts with a test that
  reproduces the problem.

Scope notes: RTL / `dir` is not supported anywhere yet (Direction component not planned) and is not
listed per component.

## Suggested order

1. **Quick, isolated, high-impact bugs** (one file each, no design decision):
   - Command: disabled items selectable.
   - Dropdown: Phlex `aria-checked`.
   - Context Menu: checkbox/radio don't toggle.
   - Carousel: arrow keys not wired.
   - Navigation Menu: Tab goes to trigger 0.
   - Responsive Dialog: dead events.
   - Combobox and Date Picker: missing `returnFocus`.
   - Tabs: a panel id that nothing references.
2. **Shared foundations**, which close dozens of findings at once:
   - X1: per-instance ids.
   - X3/X4/X5: focus trap, focus restore, and the focusable selector.
   - X2: Escape stack.
   - X8: listener lifecycle.
3. **Per-component semantics:**
   - Trigger `aria-expanded`/`aria-controls`.
   - Tooltip `aria-describedby`.
   - Sonner live region.
   - Select/Command active descendant.
   - Calendar grid.
   - Toggle Group roving focus.
4. **Redesigns** that change markup or the public API:
   - Input OTP: single input.
   - Slider: form inputs and labels.
   - Navigation Menu viewport.
   - Sidebar: single branch.

---

## Cross-cutting problems

These show up in many components. Fixing them once, in a shared helper or a shared Ruby concern, closes
findings across the board.

| # | Sev | Problem | Where | Fix | Status |
|---|-----|---------|-------|-----|--------|
| X1 | high | **IDs are not unique per instance, or dangle.** Ids are built from the value (`tabs-content-<value>`, `accordion-trigger-<value>`), missing on one side (tabs trigger, dialog title, menu triggers), or regenerated on every call (`SecureRandom.hex` in accordion Phlex/VC). | tabs, accordion, collapsible, dialog, alert dialog, drawer, dropdown, context menu, menubar, navigation menu, popover, select, command, tooltip | One per-instance id generated in the root (Ruby), passed down to the parts; parts derive `-trigger`/`-content`/`-title` from it. | todo |
| X2 | high | **Escape is not layered.** Every overlay adds its own `document` keydown listener; none checks `defaultPrevented` or keeps a stack, so one Escape closes a Select *and* the Dialog it lives in. | `ui/utils/escape-key-manager.js:27-47`, select, dropdown, popover, tooltip, drawer | Module-level stack of open layers; only the top one handles Escape (Radix `dismissable-layer.tsx:154,187`). | todo |
| X3 | high | **Modals don't trap focus or hide the background.** `createFocusTrap` exists but no controller uses it; nothing sets `inert`/`aria-hidden` outside. | dialog, alert dialog, drawer, command dialog (`ui/utils/focus-trap-manager.js:113`) | Activate the trap while open; `inert` on body siblings. Radix `FocusScope trapped` + `hideOthers`. | todo |
| X4 | high | **Focus is not restored on close; it drops to `<body>`.** | dialog, alert dialog, drawer, command dialog, dropdown (non-Escape closes), context menu, menubar, combobox | Save `document.activeElement` on open, refocus it on close before applying `inert`. | todo |
| X5 | high | **First-focusable selector picks `<input type="hidden">`** — every Rails form starts with `authenticity_token`, so focus never enters the dialog. Also ignores `[hidden]`, `inert` and invisible elements. | `ui/utils/focus-trap-manager.js:9-16,46` | Exclude hidden inputs and non-visible elements; fall back to the container (`tabindex=-1`). | todo |
| X6 | medium | **`aria-disabled` missing; disabled items not skipped** in some keyboard paths. | tabs, accordion, dropdown, context menu, menubar, command, toggle group | Render `aria-disabled="true"` with `data-disabled`; skip disabled in every navigation path. | todo |
| X7 | medium | **No typeahead** in menus and select. | dropdown, context menu, menubar, select | Shared first-letter buffer helper in `menu_utils.js`. | todo |
| X8 | medium | **Listeners bound with a fresh `.bind(this)` and never removed** — they pile up on Turbo reconnect, so one arrow press moves N steps. | tabs (`tabs_controller.js:45`), slider (`slider_controller.js:36-44,62-63`), resizable (`resizable_controller.js:44,54`) | Store the bound handler once, or use `data-action`. | todo |
| X9 | medium | **Enter/Space handled in `keydown` on a native `<button>`** — the native click may fire too (double toggle). | switch (`switch_controller.js:52-58`), accordion (`accordion_controller.js:66-70`) | Drop the keydown handling; let the native click do it. ❓ | todo |
| X10 | low | **`hidden` only set on `transitionend`** — when no transition runs, collapsed content stays tabbable. | accordion (`:164-168`), collapsible (`:53-59`), navigation menu (`animationend`) | Fallback when `getAnimations()` is empty. ❓ | todo |

---

## Per component

### Tabs
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | high | Panel `aria-labelledby="tabs-trigger-<v>"` points to an id no trigger has → panel has no name ✅ | `behaviors/ui/tabs_content_behavior.rb:29`, trigger behavior has no `id` | X1 | todo |
| 2 | high | Ids collide across two tab sets with the same values ✅ | `tabs_trigger_behavior.rb:38`, `tabs_content_behavior.rb:8` | X1 | todo |
| 3 | medium | Arrow navigation includes disabled tabs; focus gets stuck ✅ | `tabs_controller.js:96-145`; Radix `tabs.tsx:173` (`focusable={!disabled}`), React Aria `TabsKeyboardDelegate.ts:49-101` | Skip disabled | todo |
| 4 | medium | keydown listeners never removed → double moves after Turbo reconnect ✅ | `tabs_controller.js:43-47` | X8 | todo |

Divergence: activation on focus (automatic) like Radix/React Aria; Base UI defaults to manual. Loop like all three.

### Dialog
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | high | No focus trap / background not hidden ✅ | X3 | X3 | todo |
| 2 | high | Focus not restored on close ✅ | `dialog_controller.js:96-123` | X4 | todo |
| 3 | high | Initial focus lands on the hidden authenticity token ✅ | X5 | X5 | todo |
| 4 | high | No `aria-labelledby`/`aria-describedby`; title/description have no id ✅ | `dialog_content_behavior.rb:33-45`, `views/ui/dialog/_title.html.erb:12`; Radix `dialog.tsx:492-499` | X1 | todo |
| 5 | medium | Trigger has no `aria-haspopup="dialog"`/`aria-expanded`/`aria-controls` ✅ | `views/ui/dialog/_trigger.html.erb:11-13`; Radix `dialog.tsx:150-152` | Render + sync | todo |
| 6 | medium | Escape not layered ✅ | X2 | X2 | todo |

Divergences: we set `aria-modal` (React Aria omits it for a Safari bug); mobile skips text inputs for initial focus.

### Alert Dialog
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | high | Same as Dialog 1–3 (trap, restore, hidden input) ✅ | X3–X5 | X3–X5 | todo |
| 2 | high | No `aria-labelledby`/`aria-describedby` — the alert message is never announced ✅ | `alert_dialog_content_behavior.rb:34-40` | X1 | todo |
| 3 | medium | Trigger is a `<div>` wrapper; the real button gets no ARIA state ✅ | `alert_dialog_trigger_behavior.rb:19-23` | `as_child` + ARIA | todo |
| 4 | low | Initial focus is the first focusable, not Cancel ✅ | `alert_dialog_controller.js:52`; Radix `alert-dialog.tsx:113-115` | `cancel` target as `preferredElement` | todo |

### Responsive Dialog
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | high | Dispatches `dialog:open`/`drawer:open` events that nobody listens to → state sync does nothing; crossing the breakpoint while open leaves the dialog inside a `display:none` wrapper with scroll locked ✅ | `responsive_dialog_controller.js:96-122` | Call child controllers directly; listen to their open/close events | todo |
| 2 | medium | Shared content rendered twice → duplicated ids ✅ | `views/ui/_responsive_dialog.html.erb:34,41` | Render once and move, or suffix ids | todo |
| 3 | low | `open: true` opens both variants ✅ | `_responsive_dialog.html.erb:33,40` | — | todo |

### Drawer
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | high | Same as Dialog 1–3 ✅ | X3–X5 | X3–X5 | todo |
| 2 | high | ERB content partial drops user attributes (`id`, `aria-label`, `inert`); no accessible name; title is `div role=heading` without id/`aria-level` ✅ | `views/ui/drawer/_content.html.erb:23-29`, `drawer_title_behavior.rb:19-23` | `content_tag` with all attributes + X1 | todo |
| 3 | low | Reopening within 650 ms of a close: a stale timeout marks it closed ✅ | `drawer_controller.js:750-752` | Clear the timer in `show()` | todo |
| 4 | low | Scroll-lock count out of balance (non-modal close / disconnect unlock another modal's lock) ✅ | `drawer_controller.js:76,711,774` | Per-instance `locked` flag | todo |

### Command Dialog
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | high | No accessible name (shadcn adds an sr-only "Command Palette" title + description) ✅ | `views/ui/command/_dialog.html.erb:8-15`; shadcn `bases/radix/ui/command.tsx:36-38` | sr-only title/description | todo |
| 2 | high | Focus not restored on close ✅ | X4 | X4 | todo |
| 3 | medium | Focus leaving the content closes the palette (Tab past the end) ✅ | `command_dialog_controller.js:35-57` | Remove once X3 exists | todo |
| 4 | low | Input focus via a 50 ms `setTimeout` ✅ | `command_dialog_controller.js:81-90` | `preferredElement` | todo |

Divergence: default shortcut is `meta+j` only; shadcn accepts `metaKey || ctrlKey`.

### Dropdown Menu
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | high | Trigger has no `aria-expanded`/`aria-controls`/id; menu has no name ✅ | `dropdown_menu_trigger_behavior.rb:10-15`; Radix `dropdown-menu.tsx:116-119,188` | X1 + sync | todo |
| 2 | high | Sub-triggers have no `aria-haspopup`/`aria-expanded`/`aria-controls` ✅ | `dropdown_menu_sub_trigger_behavior.rb:8-14`, `menu_utils.js:234-269` | Render + sync in `openSubmenu`/`closeSubmenu` | todo |
| 3 | high | **Phlex renders `aria-checked` wrong**: `true` → empty value, `false` → omitted ✅ (rendered) | `dropdown_menu_checkbox_item_behavior.rb:13`, `dropdown_menu_radio_item_behavior.rb:13` | `@checked.to_s` (context menu already does) | todo |
| 4 | high | Focus lost after activating an item with the keyboard ✅ | `dropdown_controller.js:482-483,507-508,326` | X4 | todo |
| 5 | medium | No typeahead ✅ | `dropdown_controller.js:400-518` | X7 | todo |
| 6 | medium | ArrowDown/ArrowUp on the trigger don't open ✅ | `dropdown_menu_trigger_behavior.rb:43`; Radix `dropdown-menu.tsx:137-141` | Add keys | todo |
| 7 | medium | Plain items/sub-triggers can't be disabled; checkbox/radio lack `aria-disabled` ✅ | `dropdown_menu_item_behavior.rb` | X6 | todo |
| 8 | medium | Submenus with checkbox/radio items break keyboard navigation ✅ | `dropdown_controller.js:613-644` | Reuse `getFocusableItems` with all three roles | todo |
| 9 | medium | Document keydown swallows Space/Home/End/←/→ inside a Command input in a submenu ✅ | `dropdown_controller.js:428-517` | Ignore editable targets | todo |
| 10 | medium | Default trigger wraps content in a focusable `div role=button` → nested interactive + two tab stops ✅ | `views/ui/dropdown_menu/_trigger.html.erb:19` | `as_child` by default | todo |
| 11 | low | Mouse click on an item doesn't close ✅ | `dropdown_menu_item_behavior.rb:31` | `click->…#select` | todo |
| 12 | low | Turbo snapshot taken while open restores a desynced menu ❓ | — | Reset to closed in `connect()` | todo |

Divergences: Escape in a submenu closes only the submenu (React Aria/Base UI; Radix closes all). Enter closes on checkbox/radio, Space keeps open (React Aria). Loops (React Aria/Base UI; Radix `loop=false`). Non-modal (Radix/Base UI are modal by default). Always focuses the first item, even on pointer open (libs focus the container on pointer open).

### Context Menu
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | high | Menu stays open after focus leaves it and keeps capturing Arrow/Enter page-wide (Enter clicks the last item) ✅ | `context_menu_controller.js:17-21,96-137,166-169` | Close on focus-out/Tab; ignore keys outside content | todo |
| 2 | high | Opening a second context menu leaves the first controller "open" with its listener live ✅ | `context_menu_controller.js:74-80` | Each controller closes itself | todo |
| 3 | high | Focus not restored on close ✅ | `context_menu_controller.js:55-72` | X4 | todo |
| 4 | high | **Checkbox/radio items never change state** (no toggle logic) ✅ | `context_menu_checkbox_item_behavior.rb:12-13`, controller has no toggle | Reuse `menu_utils.js` `toggleCheckbox`/`selectRadio` | todo |
| 5 | medium | No typeahead ✅ | — | X7 | todo |
| 6 | medium | No disabled support / `aria-disabled` ✅ | — | X6 | todo |
| 7 | low | Menu has no accessible name ✅ | `context_menu_content_behavior.rb:12` | Optional label | todo |
| 8 | low | Click on an item / right-click elsewhere doesn't close ✅ | `context_menu_item_behavior.rb:31` | — | todo |

Gap: no submenus (Radix/Base UI/React Aria support them).

### Menubar
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | high | Opening a menu leaves focus on `<body>`; ←/→ between menus too ✅ | `menubar_controller.js:88-125,542-552`; Radix `menu.tsx:531-559` | Keyboard open → first item; pointer open → content | todo |
| 2 | high | Closing after a selection or Tab loses focus (only Escape restores) ✅ | `menubar_controller.js:207-209,455-458,733-735` | X4 | todo |
| 3 | high | Sub-triggers have no submenu semantics ✅ | `menubar_sub_trigger_behavior.rb:12-13` | Same as dropdown 2 | todo |
| 4 | high | Clicks with `event.detail === 0` ignored → screen-reader virtual clicks can't open menus ❓ | `menubar_controller.js:64` | Drop the check | todo |
| 5 | medium | Submenu logic keys off `data-side="right"`; a flipped submenu breaks ←/Escape and reappears ✅ | `menubar_controller.js:271-311,697`, `menu_utils.js:275` | Find submenus structurally | todo |
| 6 | medium | Triggers/contents not linked by ids; menu has no name ✅ | `menubar_trigger_behavior.rb:12-15` | X1 | todo |
| 7 | medium | No `aria-disabled`; disabled sub-triggers still open on hover ✅ | `menubar_item_behavior.rb:17`, `menubar_controller.js:217` | X6 + guard | todo |
| 8 | medium | Keyboard toggling of checkbox/radio fires no click/event ✅ | `menubar_controller.js:737-740` | Dispatch `click()` | todo |
| 9 | low | No typeahead ✅ | — | X7 | todo |
| 10 | low | Roving tabindex on triggers goes stale after click/hover/Escape ✅ | `menubar_controller.js:535-552` | Update in `openMenu` | todo |
| 11 | low | `loop` value is dead; triggers can't be disabled ✅ | `menubar_behavior.rb` | — | todo |
| 12 | low | Open menu is a DOM descendant of `role=menubar` ❓ | — | Portal it out | todo |

### Navigation Menu
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | high | Roving tabindex makes triggers 2..n unreachable with Tab (it's a nav, not a composite widget) ✅ | `navigation_menu_trigger_behavior.rb:16`, controller `:45-49`; Base UI `NavigationMenuTrigger.tsx:651` | Every trigger a tab stop; arrows as enhancement | todo |
| 2 | high | Tab out of content always focuses trigger 0 ✅ | `navigation_menu_controller.js:161,480-486` | Capture the index before `closeMenu()` | todo |
| 3 | high | Viewport mode (default) never hides closed panels and **clones** content → duplicated links/ids, focus goes to the hidden original ✅/❓ | `navigation_menu_content_behavior.rb:20-28`, controller `:357-364` | Move the real node; hide closed panels in both modes | todo |
| 4 | medium | Triggers/contents not linked by ids ✅ | `navigation_menu_trigger_behavior.rb:15` | X1 | todo |
| 5 | medium | Stale `animationend` listener can hide a re-opened panel ✅/❓ | `navigation_menu_controller.js:137-139` | Remove listener on open; fallback | todo |
| 6 | low | Arrows skip plain top-level links; no arrow nav inside content ✅ | `:493-508` | — | todo |
| 7 | low | `<nav>` has no `aria-label` (Radix defaults to "Main") ✅ | `views/ui/_navigation_menu.html.erb:29` | Default label | todo |
| 8 | low | Doesn't close on focus-out or link select ✅ | `:522-525` | — | todo |

### Popover
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | high | Trigger has no `aria-haspopup`/`aria-expanded`/`aria-controls`; content has no `role="dialog"`/id ✅ | `popover_trigger_behavior.rb:11-14`, `popover_content_behavior.rb:29-33`; Radix `popover.tsx:162-164,496` | Render + sync | todo |
| 2 | high | `trigger: "hover"` mode can't be opened from the keyboard ✅ | `popover_controller.js:147-153` | Also bind click/focus | todo |
| 3 | medium | Focus not moved into content on open ✅ | `popover_controller.js:166-194` | Focus first tabbable (opt-out) | todo |
| 4 | medium | Clicking non-focusable content can close it (focus → body) ❓ | `popover_controller.js:113-118` | `tabindex=-1` on content | todo |
| 5 | low | Outside clicks fire `popover:hide` even when already closed (resets Command/Combobox) ✅ | `popover_controller.js:140-144,211-252` | Guard in `hide()` | todo |

### Hover Card
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | medium | Escape doesn't close (WCAG 1.4.13) ✅ | no keydown handling; Radix `hover-card.tsx:336` | Escape via X2 | todo |
| 2 | medium | Tabbing into the card leaves it open forever ✅ | `hover_card_controller.js:50-57` | `tabindex=-1` on inner tabbables (Radix) or focusout close | todo |
| 3 | low | Default trigger is a `<span tabindex=0>` with no role ✅ | `views/ui/hover_card/_trigger.html.erb` | Default to `<a>` | todo |

### Tooltip
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | high | No `role="tooltip"`, no id, no `aria-describedby` → text never exposed to AT ✅ | `tooltip_content_behavior.rb`, `tooltip_trigger_behavior.rb`; Radix `tooltip.tsx:293-296,599` | Render role/id; sync `aria-describedby` | todo |
| 2 | medium | Not hoverable (WCAG 1.4.13): closes immediately on trigger `mouseleave` ✅ | `tooltip_controller.js:86-102` | Close delay + keep-open on content | todo |
| 3 | low | Opens on focus caused by a mouse click ✅ | `focus->ui--tooltip#show` | Skip focus after pointerdown | todo |

Divergences: 0 ms default delay (Radix 700, Base UI 600, React Aria 1500); no delay group provider.

### Select
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | high | Highlighted option invisible to screen readers (focus stays on trigger, no `aria-activedescendant`, options have no id) ✅ | `select_controller.js:277-288`, `select_item_behavior.rb` | Move focus to options (Radix) or activedescendant | todo |
| 2 | medium | No `aria-controls`; listbox has no id ✅ | `select_trigger_behavior.rb`, `select_content_behavior.rb` | X1 | todo |
| 3 | medium | ERB trigger drops `id:` → `<label for>` points at nothing ✅ | `views/ui/select/_trigger.html.erb`; demo `test/dummy/app/views/components/field.html.erb:73-75` | Pass `id` through | todo |
| 4 | medium | Closed trigger ignores ArrowUp/Down; no typeahead ✅ | `select_controller.js:218-250`; Radix `select.tsx:41,349,430` | Open keys + X7 | todo |
| 5 | medium | Tab while open leaves the listbox open ✅ | `select_controller.js:222-250` | Close on Tab/blur | todo |
| 6 | low | Groups have no accessible name ✅ | `select_group_behavior.rb` | Label id → `aria-labelledby` | todo |

### Combobox
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | high | Focus lost after selecting an item ✅ | `combobox_controller.js:115-117` → `popover_controller.js:221-245` | `hide({ returnFocus: true })` | todo |
| 2 | medium | Trigger has no combobox semantics (`aria-expanded`/`aria-haspopup`) ✅ | `app/helpers/ui/combobox_behavior.rb` | After Popover 1 | todo |
| 3 | low | `ComboboxBehavior` referenced unqualified; `app/behaviors/ui/combobox_behavior.rb` is empty ❓ (possible NameError) | `views/ui/combobox/_wrapper.html.erb`, `components/ui/combobox_wrapper.rb:42` | Verify | todo |

Divergence: shadcn v4 Combobox is now built on Base UI Combobox (input as combobox + activedescendant) in all three bases; ours is the older Popover + Command pattern.

### Command
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | high | `aria-activedescendant` on the list instead of the input, always empty (items have no id) ✅ | `command_controller.js:220-222`; React Aria `useComboBox.ts:534` | Item ids; set on the input | todo |
| 2 | high | **Disabled items navigable and selectable with Enter** — markup renders `data-disabled=""`, JS checks truthiness ✅ (the JS test uses `"true"`, hiding it) | `command_item_behavior.rb`, `command_controller.js:174,182,237`, `test/dummy/test/javascript/command_controller.test.js:404` | `hasAttribute("data-disabled")` + realistic test | todo |
| 3 | medium | Input has no `aria-controls`; list has no id/name ✅ | `command_input_behavior.rb`, `command_list_behavior.rb` | X1 | todo |
| 4 | low | Empty state not announced ✅ | — | `role="status" aria-live="polite"` | todo |
| 5 | low | Hover doesn't move the highlight ✅ | `command_item_behavior.rb` | — | todo |

### Checkbox
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | medium | No indeterminate / "mixed" state ✅ | `checkbox_behavior.rb:23-37` | `indeterminate` option | todo |
| 2 | low | `aria-checked` on a native checkbox; goes stale after form reset ✅ | `checkbox_behavior.rb:35`, `checkbox_controller.js:11-12` | Drop it; re-sync on `reset` | todo |

Divergence: native input (like React Aria) — better than Radix's button + hidden input for us.

### Switch
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | medium | Enter/Space handled twice ❓ | X9 | X9 | todo |
| 2 | medium | Same `id` on the button and its hidden input ✅ | `views/ui/_switch.html.erb:25,42` | No id on the hidden input | todo |
| 3 | medium | Custom `value` lost after the first toggle (hard-coded `"1"`/`"0"`) ✅ | `switch_controller.js:66-69` | Store the on-value | todo |
| 4 | low | No form reset, `aria-required`, `aria-invalid` ✅ | — | — | todo |

### Toggle
No findings.

### Toggle Group
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | high | No roving tabindex or arrow keys, while single mode announces itself as a radio group ✅ | `toggle_group_controller.js` (no keyboard code), `toggle_group_behavior.rb:14` | Roving focus with loop/Home/End, skip disabled | todo |
| 2 | low | Orientation not exposed or used ✅ | `toggle_group_behavior.rb:23` | `aria-orientation` | todo |
| 3 | low | No group-level `disabled` ✅ | — | — | todo |

### Slider
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | high | Thumb keydown listeners never removed → N steps per key after reconnect ✅ | `slider_controller.js:36-44,62-63,94-95` | X8 | todo |
| 2 | high | Thumbs have no accessible name ✅ | `slider_thumb_behavior.rb:17-23`; Radix `slider.tsx:934-942` | Labels; Radix defaults for ranges | todo |
| 3 | high | No form integration (`name` ignored, no input rendered) ✅ | `slider_behavior.rb:17` | Hidden inputs (`name[]` for ranges) | todo |
| 4 | medium | Thumbs swap on crossing; focused thumb's value doesn't change ✅ | `slider_controller.js:212-216` | Clamp to neighbours (React Aria) | todo |
| 5 | medium | `inverted` ignored for keys ✅ | `slider_controller.js:178-186` | Invert arrow sign | todo |
| 6 | low | PageUp/Down not snapped to step; no Shift+Arrow; float drift in `aria-valuenow` ✅ | `slider_controller.js:175` | — | todo |
| 7 | low | ARIA values only after JS runs; disabled not updated by JS ✅ | `slider_controller.js:287-290,322-329` | Render server-side | todo |
| 8 | low | No `aria-valuetext` ✅ | — | — | todo |

### Input OTP
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | high | N unlabelled text inputs instead of one labelled field; `<label for>` targets a div ✅ | `input_otp_slot_behavior.rb:3-17`, `views/ui/_input_otp.html.erb:39`; shadcn uses one real input | One real input, slots drawn from its value | todo |
| 2 | medium | SMS / password-manager autofill likely broken ❓ | `input_otp_controller.js:20-39` | Same as 1 | todo |
| 3 | medium | Steals focus on connect (every page load, every instance) ✅ | `input_otp_controller.js:13-17` | Opt-in `autofocus` | todo |
| 4 | medium | Form submits `name[0]..name[n]`; composed form submits nothing ✅ | `views/ui/_input_otp.html.erb:38` | Single value under `name` | todo |
| 5 | low | Can't overwrite a filled slot ❓; paste rejects spaces/dashes; `inputmode=numeric` hard-coded; no `aria-invalid` ✅ | — | — | todo |

### Accordion
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | high | Ids collide (ERB default `value: ""`, same values across accordions) or dangle (Phlex/VC regenerate `SecureRandom.hex` per call) ✅ | `views/ui/accordion/_item.html.erb`, `accordion_trigger_behavior.rb:19-30` | X1 | todo |
| 2 | medium | Enter/Space handled twice ❓ | X9 | X9 | todo |
| 3 | medium | Collapsed content can stay tabbable ❓ | X10 | X10 | todo |
| 4 | low | `collapsible` value is dead ✅ | `accordion_controller.js:11` | Implement or remove | todo |
| 5 | low | No disabled support ✅ | — | X6 | todo |

### Collapsible
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | medium | `disabled` doesn't disable the trigger (focusable, announced active, does nothing) ✅ | `collapsible_controller.js:17` | Render `disabled` on the trigger | todo |
| 2 | low | No `aria-controls`; content has no id ✅ | `collapsible_trigger_behavior.rb:25-54` | X1 | todo |
| 3 | low | Server render ignores `open` ✅ | `collapsible_content_behavior.rb:14,29` | Render initial state | todo |
| 4 | low | `hidden` depends on `transitionend` ❓ | X10 | X10 | todo |

### Calendar
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | high | Disabled dates trap focus (arrows can't step over them) or drop it to `<body>` after a re-render ✅ | `calendar_controller.js:557,720-753,800-809` | `aria-disabled` + focusable; fall back to the nearest enabled date | todo |
| 2 | high | Day buttons announce only the day number; `aria-selected` on a `<button>` (unsupported); no `gridcell`; no `aria-current` for today ✅ | `calendar_controller.js:558-561`; React Aria `useCalendarCell.ts:135-160,353-368` | Full-date `aria-label`; state on `<td role=gridcell>` | todo |
| 3 | high | Roving tabindex wrong: several tab stops (range/multi), or none when selected/today isn't visible → grid unreachable ✅ | `calendar_controller.js:560` | One `focusedDate` with tabindex 0 | todo |
| 4 | medium | Grid keydown handler hijacks arrows in the month/year selects ✅ (native) / ❓ (UI Select) | `calendar_behavior.rb:55`, `calendar_controller.js:674-680` | Bind on the grid, or require `data-date` target | todo |
| 5 | medium | Grid has no name (should be the visible month) ✅ | `views/ui/_calendar.html.erb:158` | `aria-labelledby` → month label id | todo |
| 6 | medium | Month/year selects unlabelled; month names always English ✅ | `views/ui/_calendar.html.erb:89-107` | Labels + locale | todo |
| 7 | low | Multi-month: duplicate `data-date` (focus goes to the outside-day copy) and 4 identical nav buttons ✅ | `calendar_controller.js:738`, `_calendar.html.erb:71-155` | — | todo |
| 8 | low | "Selected: …" hard-coded English; range errors never announced ✅ | `calendar_controller.js:170,224-246` | — | todo |
| 9 | low | Month animation ignores `prefers-reduced-motion` ✅ | `calendar_controller.js:469-489` | `motion-safe:` | todo |

### Date Picker
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | high | Focus doesn't move into the calendar on open ✅ | `datepicker_controller.js:312-330`; React Aria `useDatePicker.ts:203-204` | Focus selected/today day after `show()` | todo |
| 2 | high | Focus not returned to the trigger after selecting ✅/❓ | `datepicker_controller.js:294,306` | `hide({ returnFocus: true })` | todo |
| 3 | medium | No dialog semantics on trigger/popup | Popover 1 | Popover 1 | todo |
| 4 | medium | Multiple mode may close on every click (focusout during re-render) ❓ | `popover_controller.js:107-124` | — | todo |

### Carousel
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | medium | **Arrow-key navigation is never wired** — `keydown()` exists, no markup binds it ✅ | `carousel_controller.js:172-190`, `carousel_behavior.rb:44-61`; shadcn `carousel.tsx:78-89,122` | Add `keydown->ui--carousel#keydown` | todo |
| 2 | medium | Autoplay: no pause control, doesn't pause on hover, no `aria-live` toggling (WCAG 2.2.2) ✅ | `carousel_controller.js:58-70` | Pause button; `stopOnMouseEnter`; `aria-live` off while playing | todo |
| 3 | low | Slides have no "n of m" label; region unlabelled ✅ (shadcn same) | `carousel_item_behavior.rb:18-23` | — | todo |
| 4 | low | Disabling the focused prev/next button drops focus ✅ (shadcn same) | `carousel_controller.js:140,148` | `aria-disabled` | todo |

### Resizable
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | high | keydown listener leaks and doubles on reconnect ✅ | `resizable_controller.js:44,54` | X8 | todo |
| 2 | medium | `aria-valuenow/min/max` hard-coded 50/0/100 until the first interaction ✅ | `resizable_handle_behavior.rb:68-70`, controller `:37-39` | Init from panel sizes | todo |
| 3 | medium | Separator has no `aria-orientation`/`aria-controls`/label; panels have no ids ✅ | `resizable_handle_behavior.rb` | X1 + orientation | todo |
| 4 | low | Enter does nothing (APG: toggle collapse); perpendicular arrows swallow page scroll ✅ | `resizable_controller.js:324-354` | — | todo |

### Scroll Area
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | low | Viewport always a tab stop, even without overflow ✅ | `scroll_area_viewport_behavior.rb:13`; Base UI `ScrollAreaViewport.tsx:369` | Toggle on overflow | todo |
| 2 | low | Custom scrollbars not `aria-hidden` ✅ | scrollbar behaviors | — | todo |
| 3 | low | Scrollbars don't show on descendant focus (`focus` vs `focusin`) ✅ | `scroll_area_controller.js:59-60` | `focusin` | todo |

### Sonner
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | high | **Toasts are not announced** — no live region, no role ✅ | `views/ui/sonner/_toaster.html.erb:41`, `sonner_controller.js:148-187`; Radix `toast.tsx:618-620`, Base UI `ToastViewport.tsx:240-244` | Polite live region; errors assertive | todo |
| 2 | medium | No landmark/label/hotkey → keyboard users can't reach toast actions before auto-dismiss ✅ | — | `region` "Notifications (F8)" + F8 | todo |
| 3 | medium | Timers pause on hover only, not on focus or window blur ✅ | `sonner_controller.js:54-71` | `focusin`/`focusout` | todo |
| 4 | medium | Focus lost when a focused toast is dismissed ✅ | `sonner_controller.js:302-325` | Move to next toast / restore | todo |
| 5 | low | No Escape to dismiss; action toasts auto-dismiss (WCAG 2.2.1) ✅ | — | — | todo |

### Avatar
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | low | `alt` defaults to `""`; once loaded, the fallback is hidden → standalone avatar has no name ✅ (Radix same) | `views/ui/avatar/_image.html.erb:3` | Document `alt` as required when not decorative | todo |

### Sidebar
| # | Sev | Finding | Evidence | Fix | Status |
|---|-----|---------|----------|-----|--------|
| 1 | high | Mobile sheet isn't a real modal (no trap, no restore) — inherits Dialog 1–2 ✅ | `components/ui/sidebar.rb:54-77` | X3, X4 | todo |
| 2 | medium | Content rendered twice (mobile sheet + desktop aside) → duplicated ids, nested controllers run twice ✅ | `components/ui/sidebar.rb:44-49` | Render one branch | todo |
| 3 | medium | Collapsed offcanvas sidebar stays focusable ❓ | `sidebar_behavior.rb:83` | `inert` when collapsed | todo |
| 4 | low | Trigger exposes no `aria-expanded`/`aria-controls` ✅ | `sidebar_controller.js:182-205` | — | todo |
| 5 | low | Mobile sheet opened/closed twice per toggle ✅ | `sidebar_controller.js:119-122,273-275` | Drop the explicit call | todo |

Divergence: Ctrl/Cmd+B fires inside inputs/editors (same as shadcn); worth ignoring editable targets.

---

## Roadmap — new components

Components from shadcn we don't have yet and decided to build (2026-11-11). shadcn has 64 components
across its three bases (Radix 63, Base UI 64, React Aria 61).

| Component | Notes |
|-----------|-------|
| Radio Group | Keep native `<input type=radio>` (React Aria approach: keyboard and forms for free). Add a wrapper with `role=radiogroup` (or `fieldset`/`legend`), label, `aria-required`/`aria-invalid`/`aria-orientation`, group `disabled`; `aria-hidden` on the indicator svg. |
| Attachment | Chat/AI. File or image with metadata, upload state and actions. |
| Bubble | Chat/AI. Message bubble: variants, alignment, grouping, reactions. |
| Code Block | Chat/AI. Code, terminal output and diffs; header, line numbers, copy button. |
| Marker | Chat/AI. Inline status, system note, or labeled separator in a conversation. |
| Message Scroller | Chat/AI. Scroll behavior for a message list (shadcn ships it in `@shadcn/react`). |
| Questionnaire | Chat/AI. Multi-step questions: single, multiple, freeform, skipped answers. |

Not planned: Message, Trace, Native Select, Direction (RTL), Chart (needs Recharts), Toast (Base UI only; we have Sonner).
