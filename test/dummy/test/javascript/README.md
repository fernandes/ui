# Controller tests

Bun + happy-dom + Testing Library. Tests are black-box: they drive a component the way a
user does and assert what a user or a screen reader perceives. They don't read controller
internals (`controller.fooValue`, `hasXTarget`, private fields).

## Writing a test

```js
import { describe, test, expect } from "bun:test"
import { screen } from "@testing-library/dom"
import { render } from "./support/render.js"

test("arrow right selects the next tab", async () => {
  const { user } = await render(html)

  await user.click(screen.getByRole("tab", { name: "Account" }))
  await user.keyboard("{ArrowRight}")

  const password = screen.getByRole("tab", { name: "Password" })
  expect(password).toHaveFocus()
  expect(password).toHaveAttribute("aria-selected", "true")
  expect(screen.getByRole("tabpanel", { name: "Password" })).toBeVisible()
})
```

- `render(html)` mounts the markup, starts Stimulus with every controller the engine registers
  and returns `{ user }` (a `userEvent.setup()` instance). It cleans up the previous render.
- `settle(ms)` waits for deferred work (microtasks, `setTimeout`, `requestAnimationFrame`).
- Interact with `user.click`, `user.keyboard("{ArrowDown}")`, `user.type`, `user.hover`.
  Don't call controller methods or dispatch synthetic events unless no user gesture exists.
- Query with `getByRole(role, { name })`, `getByLabelText`, `getByText`. If an element can't
  be found by role and name, that is usually the accessibility bug.
- Assert with jest-dom: `toHaveAccessibleName`, `toHaveAccessibleDescription`, `toHaveFocus`,
  `toBeVisible`, `toHaveAttribute("aria-expanded", "true")`, `toBeDisabled`.

## Markup in fixtures

Copy the markup the Ruby side actually renders (ERB / Phlex / ViewComponent share
`app/behaviors/ui/*_behavior.rb`), not an idealised version: render it with
`mise exec -- bin/rails runner` from `test/dummy` or read the behavior. Classes can be
dropped. A fixture that hand-adds an `id` the component never renders hides the bug.

## What happy-dom can't tell you

- **Tab order.** happy-dom has no browser stylesheet, so `[hidden]` and `display: none`
  elements are still tabbable and `user.tab()` walks into them. Test focus traps, Tab
  sequences and "hidden content is not tabbable" in the Playwright system tests
  (`test/system/components/*_test.rb`).
- **Layout, animations, real screen-reader output.** Same: system tests, or flag as ❓.

## Which layer

| Concern | Layer |
|---|---|
| Keyboard handling, aria-* updates, focus moves, open/close state | bun (here) |
| Rendered markup: ids, `aria-labelledby`, roles, in all three renderers | Minitest, `test/components/*_test.rb` |
| Tab order, focus trap, visibility, Escape across layers in a real page | Playwright, `test/system/components/*_test.rb` |
