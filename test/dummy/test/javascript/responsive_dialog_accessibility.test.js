// Responsive Dialog, black-box. Markup is what the Phlex/ERB/VC renderers
// produce (classes dropped): a Drawer (mobile) and a Dialog (desktop), with
// the caller's body rendered once and moved into whichever variant is active.
import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { screen, within } from "@testing-library/dom"
import { render, cleanup, settle } from "./support/render.js"

const CLOSE_MS = 700 // drawer close animation

// A matchMedia whose `matches` the test can flip, firing "change"
let desktop = true
const listeners = new Set()
const originalMatchMedia = window.matchMedia
function installMatchMedia() {
  window.matchMedia = query => ({
    get matches() { return desktop },
    media: query,
    addEventListener: (_type, fn) => listeners.add(fn),
    removeEventListener: (_type, fn) => listeners.delete(fn)
  })
}
function setDesktop(value) {
  desktop = value
  listeners.forEach(fn => fn({ matches: value }))
}

const markup = ({ open = false } = {}) => `
  <a href="#">Outside</a>
  <div data-controller="ui--responsive-dialog" data-ui--responsive-dialog-open-value="${open}" data-ui--responsive-dialog-breakpoint-value="768">
    <div data-ui--responsive-dialog-target="drawer">
      <div data-controller="ui--drawer" data-ui--drawer-open-value="false" data-ui--drawer-direction-value="bottom" data-ui--drawer-dismissible-value="true" data-ui--drawer-modal-value="true">
        <button type="button" aria-haspopup="dialog" aria-expanded="false" data-action="click->ui--drawer#open" data-ui--drawer-target="trigger">Edit profile (mobile)</button>
        <div data-state="closed" data-ui--drawer-target="container">
          <div data-state="closed" data-ui--drawer-target="overlay" data-action="click->ui--drawer#closeOnOverlayClick"></div>
        </div>
        <div role="dialog" aria-modal="true" data-state="closed" data-vaul-drawer="" inert="inert" data-ui--drawer-target="content">
          <div data-ui--responsive-dialog-target="drawerSlot"></div>
        </div>
      </div>
    </div>
    <div data-ui--responsive-dialog-target="dialog">
      <div data-controller="ui--dialog" data-ui--dialog-open-value="false" data-ui--dialog-close-on-escape-value="true" data-ui--dialog-close-on-overlay-click-value="true">
        <button type="button" aria-haspopup="dialog" aria-expanded="false" data-action="click->ui--dialog#open" data-ui--dialog-target="trigger">Edit profile (desktop)</button>
        <div data-state="closed" data-ui--dialog-target="container">
          <div data-state="closed" data-ui--dialog-target="overlay" data-action="click->ui--dialog#closeOnOverlayClick"></div>
          <div role="dialog" aria-modal="true" data-state="closed" inert="inert" data-ui--dialog-target="content">
            <div data-ui--responsive-dialog-target="dialogSlot">
              <div data-ui--responsive-dialog-target="body">
                <h2>Edit profile</h2>
                <p data-ui--responsive-dialog-target="description">Make changes here.</p>
                <input id="name" aria-label="Name">
                <button type="button" data-action="click->ui--responsive-dialog#close">Done</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`

const [drawerContent, dialogContent] = [0, 1].map(i => () => screen.getAllByRole("dialog", { hidden: true })[i])
const outside = () => screen.getByRole("link", { name: "Outside" })

describe("Responsive Dialog", () => {
  beforeEach(() => {
    desktop = true
    listeners.clear()
    installMatchMedia()
  })

  afterEach(() => {
    cleanup()
    window.matchMedia = originalMatchMedia
    document.body.style.overflow = ""
  })

  test("the body lives in the dialog on desktop and moves to the drawer on mobile", async () => {
    desktop = false
    await render(markup())

    expect(within(drawerContent()).getByLabelText("Name")).toBeTruthy()
    expect(within(dialogContent()).queryByLabelText("Name")).toBeNull()
    expect(document.querySelectorAll("#name")).toHaveLength(1)

    setDesktop(true)
    expect(within(dialogContent()).getByLabelText("Name")).toBeTruthy()
    expect(document.querySelectorAll("#name")).toHaveLength(1)
  })

  test("the active variant is named and described by the body's title and description", async () => {
    desktop = false
    await render(markup())

    expect(drawerContent()).toHaveAccessibleName("Edit profile")
    expect(drawerContent()).toHaveAccessibleDescription("Make changes here.")
  })

  test("open: true opens only the visible variant", async () => {
    await render(markup({ open: true }))
    await settle()

    expect(dialogContent()).toHaveAttribute("data-state", "open")
    expect(drawerContent()).toHaveAttribute("data-state", "closed")
    expect(drawerContent().inert).toBe(true)
  })

  test("crossing the breakpoint while open hands over to the other variant", async () => {
    const { user } = await render(markup())

    await user.click(screen.getByRole("button", { name: "Edit profile (desktop)" }))
    await settle()
    expect(dialogContent()).toHaveAttribute("data-state", "open")

    setDesktop(false)
    await settle()

    expect(dialogContent()).toHaveAttribute("data-state", "closed")
    expect(drawerContent()).toHaveAttribute("data-state", "open")
    expect(drawerContent()).toContainElement(document.activeElement)
    expect(outside().closest("[inert]")).not.toBeNull()
    expect(document.body.style.overflow).toBe("hidden")
  })

  test("closing after a handover releases the page and returns focus to the visible trigger", async () => {
    const { user } = await render(markup())

    await user.click(screen.getByRole("button", { name: "Edit profile (desktop)" }))
    setDesktop(false)
    await settle()

    await user.keyboard("{Escape}")
    await settle(CLOSE_MS)

    expect(screen.getByRole("button", { name: "Edit profile (mobile)" })).toHaveFocus()
    expect(outside().closest("[inert]")).toBeNull()
    expect(document.body.style.overflow).toBe("")
  })

  test("a variant closed by the user stays closed when the breakpoint changes", async () => {
    const { user } = await render(markup())

    await user.click(screen.getByRole("button", { name: "Edit profile (desktop)" }))
    await user.keyboard("{Escape}")

    setDesktop(false)
    await settle()

    expect(drawerContent()).toHaveAttribute("data-state", "closed")
    expect(dialogContent()).toHaveAttribute("data-state", "closed")
  })

  test("the responsive open action opens the visible variant (drawer on mobile)", async () => {
    desktop = false
    const { user } = await render(markup().replace(
      '<div data-ui--responsive-dialog-target="drawer">',
      '<button type="button" data-action="click->ui--responsive-dialog#open">Open responsive</button><div data-ui--responsive-dialog-target="drawer">'
    ))

    await user.click(screen.getByRole("button", { name: "Open responsive" }))
    await settle()

    expect(drawerContent()).toHaveAttribute("data-state", "open")
    expect(dialogContent()).toHaveAttribute("data-state", "closed")
    expect(drawerContent()).toContainElement(document.activeElement)
  })

  test("a close action inside the body closes the active variant", async () => {
    const { user } = await render(markup())
    const trigger = screen.getByRole("button", { name: "Edit profile (desktop)" })

    await user.click(trigger)
    await user.click(screen.getByRole("button", { name: "Done" }))

    expect(dialogContent()).toHaveAttribute("data-state", "closed")
    expect(trigger).toHaveFocus()
  })
})
