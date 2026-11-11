# Accessibility foundations (X1–X5, X8)

Shared helpers in `app/javascript/ui/utils/` that close the cross-cutting findings of
[`aria.md`](./aria.md). Use them instead of re-implementing; if one is missing something,
extend it minimally and keep it backward compatible.

| Finding | Helper | File |
|---|---|---|
| X1 per-instance ids | `ensureId`, `setIdRefs`, `addIdRef`, `removeIdRef` | `id-manager.js` |
| X2 Escape stack | `createEscapeLayer` | `escape-key-manager.js` |
| X3 trap + inert background | `createFocusTrap`, `inertOthers` | `focus-trap-manager.js`, `inert-manager.js` |
| X4 focus restore | `createModalSession` | `modal-session.js` |
| X5 tabbable selector | `isTabbable`, `getTabbableElements`, `focusInitial` | `focus-trap-manager.js` |
| all of the above for modals | `createModalSession` | `modal-session.js` |

Import from the file directly (`../utils/modal-session.js`), like the existing controllers do.
Everything is also re-exported from `utils/index.js`.

Reference adopter: `controllers/dialog_controller.js` (also drives Sheet), with tests in
`test/dummy/test/javascript/dialog_accessibility.test.js`, `test/components/dialog_test.rb`
and `test/system/components/dialog_test.rb`.

---

## X1 — ids, wired in JS (`id-manager.js`)

Decision: ids and id-reference attributes are wired **client-side in `connect()`** (like Radix
`useId`), so ERB, Phlex and ViewComponent share one implementation. Ruby:

- stops emitting ids derived from values (`tabs-content-<value>`) or random ones
  (`SecureRandom.hex`) — they collide or dangle;
- marks the parts as Stimulus targets (`data-ui--<c>-target="title"`) so JS can find them;
- still honours an `id` the caller passes (accept `**attributes` / `attributes:` and pass it through).

```js
import { ensureId, setIdRefs, addIdRef, removeIdRef } from "../utils/id-manager.js"

ensureId(el, "tabs-panel")                 // → el.id, or a new unique "ui-tabs-panel-7"
setIdRefs(panel, "aria-labelledby", tab)   // gives tab an id if needed, sets the attribute
setIdRefs(trigger, "aria-controls", [a, b])// several ids, in order; null/[] removes the attribute
addIdRef(button, "aria-describedby", tooltip, "tooltip")   // append to an existing list
removeIdRef(button, "aria-describedby", tooltip)           // and take it out again
```

- `ensureId(el, prefix = "ui")` keeps an existing id; otherwise generates `ui-<prefix>-<n>`,
  skipping any id already in the document. Stable: calling it again returns the same id.
- `setIdRefs(el, attr, targets, { prefix, overwrite = false })` **keeps a value the author
  rendered** (e.g. `aria-labelledby` passed in `attributes:`); it only replaces a value it set
  itself, unless `overwrite: true`. Missing targets are skipped.
- `addIdRef` / `removeIdRef` edit a space-separated list without touching other tokens — use
  them for attributes shared with the author or other components (tooltip `aria-describedby`).
- Static ARIA that doesn't need an id (`aria-haspopup`, initial `aria-expanded="false"`) should
  still be rendered by Ruby, so the markup is right before JS runs; JS keeps it in sync.

## X2 — Escape layer stack (`escape-key-manager.js`)

One document `keydown` listener; open layers push onto a stack; **only the topmost layer gets
Escape** (Radix `dismissable-layer.tsx`). An Escape that something already handled
(`event.defaultPrevented`) is ignored; the one a layer handles is `preventDefault()`-ed.

```js
import { createEscapeLayer } from "../utils/escape-key-manager.js"

this.escapeLayer = createEscapeLayer(() => this.close(), { element: this.contentTarget })
show()       { /* ... */ this.escapeLayer.activate() }
hide()       { this.escapeLayer.deactivate() /* ... */ }
disconnect() { this.escapeLayer.deactivate() }
```

- `activate()` pushes (or moves to the top), `deactivate()` removes from anywhere; both idempotent.
  `isActive()`, `isTopmost()`; `getEscapeLayerCount()` for tests.
- `element` (optional): the layer is dropped automatically if that element leaves the DOM.
- A layer that must **not** close on Escape (`close_on_escape: false`) still activates with a
  no-op callback, so Escape doesn't fall through and close the dialog beneath it.
- To keep Escape inside a widget (e.g. clear a combobox input first), call
  `event.preventDefault()` in that element's own keydown handler; the stack then ignores it.
- **Activate when the layer opens, not in `connect()`.** Activation order is stacking order.
- Legacy API, now backed by the stack: `createEscapeKeyHandler(...).attach()/detach()` and
  `onEscapeKey()` push/pop a layer (so Alert Dialog and Drawer are already layered).
  `onEscapeKeyWhen()` (tooltip) is still a plain listener — it now ignores an Escape a layer
  handled, but it isn't layered; migrate it to `createEscapeLayer`.

## X3/X4/X5 — modal focus

### `createModalSession` (`modal-session.js`) — use this for every modal

Remembers the focused element, makes the background inert, locks scroll, traps Tab, pushes an
Escape layer and moves focus in; `deactivate()` undoes it in reverse and restores focus.

```js
import { createModalSession } from "../utils/modal-session.js"

this.session = createModalSession({
  content: this.contentTarget,             // role="dialog"; focus is trapped here
  isolate: this.containerTarget,           // stays interactive (overlay + content)
  initialFocus: () => this.hasCancelTarget ? this.cancelTarget : null,
  returnFocus: () => this.triggerTarget,   // fallback when the saved element is gone / <body>
  onEscape: () => { if (this.closeOnEscapeValue) this.close() }
})
show()       { /* data-state=open, content.inert = false */ this.session.activate() }
hide()       { this.session.deactivate(); /* data-state=closed, content.inert = true */ }
disconnect() { this.session.deactivate({ restoreFocus: false }) }
```

Options (all optional except `content`): `isolate` (default `content` — pass the wrapper that
also holds the overlay, or overlay clicks die with `inert`), `initialFocus`, `returnFocus`,
`onEscape` (omit for no Escape layer; `() => {}` to block Escape), `trapFocus`,
`inertBackground`, `lockScroll`, `autoFocus` (all default `true`), `mobileAware` (default
`true`: on phones initial focus skips text inputs so the keyboard stays closed).

Order matters:
- `activate()` **after** the content is open and not inert. If the content fades in with a CSS
  `visibility` transition, the session retries focus on the next animation frames.
- `deactivate()` **before** making the content inert again: it releases the background first,
  then restores focus, so focus never drops to `<body>`.
- Restore order: the element focused at `activate()`; if it is gone, `<body>`, inert or inside
  the content, `returnFocus`. Pass the trigger as `returnFocus` (Safari doesn't focus buttons on
  click, so the saved element is often `<body>`).
- Nested modals work: traps, inert sets and Escape layers all stack; closing the inner one hands
  back to the outer one.

### Building blocks (when a session is too much)

```js
import { getTabbableElements, isTabbable, focusInitial, createFocusTrap } from "../utils/focus-trap-manager.js"
import { inertOthers } from "../utils/inert-manager.js"

getTabbableElements(menu)           // what Tab visits, in DOM order
focusInitial(content, { preferredElement: this.inputTarget })
const trap = createFocusTrap(content); trap.activate() /* ... */ trap.deactivate()
const release = inertOthers(this.containerTarget) /* ... */ release()
```

- **X5** `isTabbable` / `getTabbableElements` exclude: `input[type=hidden]` (Rails'
  `authenticity_token`), `:disabled` and `fieldset[disabled]` contents, `tabindex < 0`, anything
  inside `[hidden]` or `[inert]`, and non-rendered elements (`display:none`,
  `visibility:hidden`, via `checkVisibility`). `getFocusableElements` is now an alias.
- `focusInitial(container, { preferredElement, mobileAware = true, preventScroll })` order:
  preferred element (element or function, must be inside) → `[autofocus]` → first tabbable →
  the container itself (given `tabindex="-1"`). `focusFirstElement` is the legacy alias.
- `createFocusTrap(container)` only handles keys: Tab on the last wraps to the first, Shift+Tab
  on the first (or on the container) wraps to the last, nothing tabbable keeps focus on the
  container. Focus outside the container (a popover portaled to `<body>`) is left alone. Traps
  stack; only the topmost acts. It no longer auto-focuses or restores — use the session.
- `inertOthers(keep)` sets `inert` on every sibling along the path from `keep` to `<body>`
  (Radix `hideOthers`). Skips `script/style/template/...` and live regions (`[aria-live]`, so
  toasts keep announcing). Elements appended later (portals) stay interactive. Calls stack; the
  latest decides. It clears itself on `turbo:before-cache` so a snapshot never has a dead page.

### Testing modal focus

The stacks are module-level. `test/dummy/test/javascript/setup.js` resets them after every test
(`resetEscapeLayers()`, `resetFocusTraps()`, `resetInert()`, next to `resetScrollLockState()`),
so a test that leaves an overlay open doesn't leak into the next one.

happy-dom has no layout or UA stylesheet: it can't tell you real Tab order, and `inert` doesn't
block anything there. Assert `inert`, `aria-*` and focus moves in bun; **prove the trap, the
inert background and hidden-input skipping in a Playwright system test** (see
`test/system/components/dialog_test.rb`, "Modal focus"). Focus checks in bun need the content to
be focusable without CSS, which it is.

## X8 — bind listeners once

Handlers bound with a fresh `.bind(this)` in `connect()` and never removed pile up on every
Turbo reconnect (one arrow press moves N steps). Prefer, in order:

1. `data-action` in the markup (Stimulus adds and removes it for you):
   `data-action="keydown->ui--tabs#handleKeydown"`.
2. A handler bound once and removed with the same reference:
   ```js
   connect()    { this.onKeydown = this.onKeydown.bind(this); this.element.addEventListener("keydown", this.onKeydown) }
   disconnect() { this.element.removeEventListener("keydown", this.onKeydown) }
   ```
   or an arrow-function class field (`onKeydown = (event) => { ... }`).
3. For many listeners, an `AbortController`: `this.abort = new AbortController()` in `connect()`,
   pass `{ signal: this.abort.signal }`, call `this.abort.abort()` in `disconnect()`.

## Recipe: adopting the foundations in a controller

```js
import { ensureId, setIdRefs } from "../utils/id-manager.js"
import { createEscapeLayer } from "../utils/escape-key-manager.js"   // non-modal overlays
import { createModalSession } from "../utils/modal-session.js"       // modals

connect() {
  // 1. ids + relationships (idempotent: safe on every Turbo reconnect)
  ensureId(this.contentTarget, "popover-content")
  setIdRefs(this.triggerTarget, "aria-controls", this.contentTarget)
  this.triggerTarget.setAttribute("aria-expanded", String(this.openValue))

  // 2. create (don't activate) layers/sessions here
  this.escapeLayer = createEscapeLayer(() => this.close(), { element: this.contentTarget })

  if (this.openValue) this.show()
}

show()  { /* state */ this.triggerTarget.setAttribute("aria-expanded", "true");  this.escapeLayer.activate() }
hide()  { this.escapeLayer.deactivate(); this.triggerTarget.setAttribute("aria-expanded", "false") /* state */ }

disconnect() {
  // 3. undo everything that outlives the element: layers, sessions, document listeners
  this.escapeLayer?.deactivate()
  this.session?.deactivate({ restoreFocus: false })
}
```

Turbo reconnect safety:
- `connect()` must be idempotent: `ensureId` keeps the id already on the element, `setIdRefs`
  keeps an existing value, layers/sessions are created fresh (the old ones were deactivated in
  `disconnect()`).
- Never activate a layer, trap or session in `connect()` unless the component is open
  (`openValue`); activate on open.
- `disconnect()` deactivates with `restoreFocus: false` (the page is going away).
- A cached snapshot may restore an open component with `data-state="open"`: `connect()` should
  derive state from the value/attributes and call `show()` (which activates) or reset to closed.
