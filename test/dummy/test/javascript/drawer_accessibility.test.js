// Drawer accessibility, black-box. Markup is what the ERB partials render
// (classes dropped). Tab order and real inertness are covered by the
// Playwright system test.
import { describe, test, expect, afterEach } from "bun:test"
import { screen } from "@testing-library/dom"
import { render, cleanup, settle } from "./support/render.js"

// The drawer's close animation runs for 650ms before it reports closed
const CLOSE_MS = 700

const drawerMarkup = ({ label = "Move goal", modal = true, titleId = "" } = {}) => `
  <div data-controller="ui--drawer" data-ui--drawer-open-value="false" data-ui--drawer-direction-value="bottom" data-ui--drawer-dismissible-value="true" data-ui--drawer-modal-value="${modal}">
    <button type="button" aria-haspopup="dialog" aria-expanded="false" data-action="click->ui--drawer#open" data-ui--drawer-target="trigger">Open ${label}</button>
    <div data-state="closed" data-ui--drawer-target="container">
      <div data-state="closed" data-vaul-overlay="" data-ui--drawer-target="overlay" data-action="click->ui--drawer#closeOnOverlayClick"></div>
    </div>
    <div role="dialog" aria-modal="true" data-state="closed" data-vaul-drawer="" data-vaul-drawer-direction="bottom" inert="inert" data-ui--drawer-target="content" data-action="pointerdown->ui--drawer#handlePointerDown pointermove->ui--drawer#handlePointerMove pointerup->ui--drawer#handlePointerUp pointercancel->ui--drawer#handlePointerCancel">
      <div>
        <h2 data-ui--drawer-target="title" ${titleId ? `id="${titleId}"` : ""}>${label}</h2>
        <p data-ui--drawer-target="description">Set your daily goal.</p>
      </div>
      <form action="/x" method="post">
        <input type="hidden" name="authenticity_token" value="token" autocomplete="off">
        <button type="submit">Submit ${label}</button>
      </form>
      <button type="button" data-action="click->ui--drawer#close">Cancel ${label}</button>
    </div>
  </div>`

describe("Drawer accessibility", () => {
  afterEach(() => {
    cleanup()
    // setup.js resets the lock count, not the body style it left behind
    document.body.style.overflow = ""
    document.body.removeAttribute("data-scroll-locked")
  })

  test("the drawer is named by its title and described by its description", async () => {
    await render(drawerMarkup())

    const drawer = screen.getByRole("dialog", { hidden: true })
    expect(drawer).toHaveAccessibleName("Move goal")
    expect(drawer).toHaveAccessibleDescription("Set your daily goal.")
  })

  test("an author-provided title id is kept; two drawers get distinct ids", async () => {
    await render(drawerMarkup({ titleId: "goal-title" }) + drawerMarkup({ label: "Other" }))

    const [a, b] = screen.getAllByRole("dialog", { hidden: true })
    expect(a).toHaveAttribute("aria-labelledby", "goal-title")
    expect(a.id).toBeTruthy()
    expect(a.id).not.toBe(b.id)
  })

  test("the trigger controls the drawer and reports expanded state", async () => {
    const { user } = await render(drawerMarkup())
    const trigger = screen.getByRole("button", { name: "Open Move goal" })

    expect(trigger).toHaveAttribute("aria-controls", screen.getByRole("dialog", { hidden: true }).id)

    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")

    await user.click(screen.getByRole("button", { name: "Cancel Move goal" }))
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  test("opening moves focus past the hidden token to the first button", async () => {
    const { user } = await render(drawerMarkup())

    await user.click(screen.getByRole("button", { name: "Open Move goal" }))
    await settle()

    expect(screen.getByRole("button", { name: "Submit Move goal" })).toHaveFocus()
  })

  test("a modal drawer makes the page behind inert until it closes", async () => {
    const { user } = await render(`<a href="#">Outside</a>` + drawerMarkup())
    const outside = screen.getByRole("link", { name: "Outside" })

    await user.click(screen.getByRole("button", { name: "Open Move goal" }))
    expect(outside.closest("[inert]")).not.toBeNull()

    await user.click(screen.getByRole("button", { name: "Cancel Move goal" }))
    expect(outside.closest("[inert]")).toBeNull()
  })

  test("closing returns focus to the trigger", async () => {
    const { user } = await render(drawerMarkup())
    const trigger = screen.getByRole("button", { name: "Open Move goal" })

    await user.click(trigger)
    await settle()
    await user.keyboard("{Escape}")

    expect(trigger).toHaveFocus()
  })

  test("reopening right after a close stays open (no stale close timer)", async () => {
    const { user } = await render(drawerMarkup())
    const trigger = screen.getByRole("button", { name: "Open Move goal" })
    const drawer = screen.getByRole("dialog", { hidden: true })

    await user.click(trigger)
    await user.click(screen.getByRole("button", { name: "Cancel Move goal" }))
    await user.click(trigger)
    await settle(CLOSE_MS)

    expect(drawer).toHaveAttribute("data-state", "open")
    expect(drawer.inert).toBe(false)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
  })

  test("closing a non-modal drawer doesn't release another drawer's scroll lock", async () => {
    const { user } = await render(drawerMarkup() + drawerMarkup({ label: "Notes", modal: false }))

    // The non-modal one opens and closes first, then the modal one opens
    await user.click(screen.getByRole("button", { name: "Open Notes" }))
    await user.click(screen.getByRole("button", { name: "Open Move goal" }))
    expect(document.body.style.overflow).toBe("hidden")

    // Closing the non-modal one (Escape would hit the modal on top; use its button)
    screen.getByRole("button", { name: "Cancel Notes", hidden: true }).click()
    await settle(CLOSE_MS)

    expect(document.body.style.overflow).toBe("hidden")
  })

  test("a closed drawer leaving the page doesn't release another drawer's scroll lock", async () => {
    const { user } = await render(drawerMarkup() + `<div id="other">${drawerMarkup({ label: "Notes" })}</div>`)

    await user.click(screen.getByRole("button", { name: "Open Move goal" }))
    expect(document.body.style.overflow).toBe("hidden")

    document.getElementById("other").remove()
    await settle()

    expect(document.body.style.overflow).toBe("hidden")
  })
})
