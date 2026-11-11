// Alert Dialog accessibility, black-box. Markup is what the Phlex components
// render (classes dropped). Tab order and real inertness are covered by the
// Playwright system test.
import { describe, test, expect, afterEach } from "bun:test"
import { screen } from "@testing-library/dom"
import { render, cleanup, settle } from "./support/render.js"

const content = ({ titleId = "" } = {}) => `
  <div data-state="closed" data-ui--alert-dialog-target="container">
    <div data-ui--alert-dialog-target="overlay" data-action="click->ui--alert-dialog#preventOverlayClose"></div>
    <div role="alertdialog" aria-modal="true" data-ui--alert-dialog-target="content">
      <div>
        <h2 data-ui--alert-dialog-target="title" ${titleId ? `id="${titleId}"` : ""}>Are you sure?</h2>
        <p data-ui--alert-dialog-target="description">This cannot be undone.</p>
      </div>
      <form action="/x" method="post">
        <input type="hidden" name="authenticity_token" value="token" autocomplete="off">
      </form>
      <div>
        <button type="button" data-action="click->ui--alert-dialog#close">Continue</button>
        <button type="button" data-action="click->ui--alert-dialog#close" data-ui--alert-dialog-target="cancel">Cancel</button>
      </div>
    </div>
  </div>`

// Default trigger: a wrapper div around the caller's button
const wrapperMarkup = (opts = {}) => `
  <div data-controller="ui--alert-dialog" data-ui--alert-dialog-close-on-escape-value>
    <div data-action="click->ui--alert-dialog#open" data-ui--alert-dialog-target="trigger"><button type="button">Delete</button></div>
    ${content(opts)}
  </div>`

// as_child trigger: the caller's button carries the action and ARIA itself
const asChildMarkup = `
  <div data-controller="ui--alert-dialog" data-ui--alert-dialog-close-on-escape-value>
    <button type="button" aria-haspopup="dialog" aria-expanded="false" data-action="click->ui--alert-dialog#open" data-ui--alert-dialog-target="trigger">Delete</button>
    ${content()}
  </div>`

describe("Alert Dialog accessibility", () => {
  afterEach(() => cleanup())

  test("the alert dialog is named by its title and described by its message", async () => {
    await render(wrapperMarkup())

    const dialog = screen.getByRole("alertdialog", { hidden: true })
    expect(dialog).toHaveAccessibleName("Are you sure?")
    expect(dialog).toHaveAccessibleDescription("This cannot be undone.")
  })

  test("an author-provided title id is kept", async () => {
    await render(wrapperMarkup({ titleId: "confirm-title" }))

    expect(screen.getByRole("alertdialog", { hidden: true })).toHaveAttribute("aria-labelledby", "confirm-title")
  })

  test("two alert dialogs get distinct ids", async () => {
    await render(wrapperMarkup() + wrapperMarkup())

    const [a, b] = screen.getAllByRole("alertdialog", { hidden: true })
    expect(a.id).toBeTruthy()
    expect(a.id).not.toBe(b.id)
    expect(a.getAttribute("aria-labelledby")).not.toBe(b.getAttribute("aria-labelledby"))
  })

  test("closed content is inert", async () => {
    await render(wrapperMarkup())

    expect(screen.getByRole("alertdialog", { hidden: true }).inert).toBe(true)
  })

  test("the button inside a wrapper trigger gets the dialog ARIA", async () => {
    const { user } = await render(wrapperMarkup())
    const button = screen.getByRole("button", { name: "Delete" })
    const dialog = screen.getByRole("alertdialog", { hidden: true })

    expect(button).toHaveAttribute("aria-haspopup", "dialog")
    expect(button).toHaveAttribute("aria-controls", dialog.id)
    expect(button).toHaveAttribute("aria-expanded", "false")

    await user.click(button)
    expect(button).toHaveAttribute("aria-expanded", "true")

    await user.click(screen.getByRole("button", { name: "Cancel" }))
    expect(button).toHaveAttribute("aria-expanded", "false")
  })

  test("an as_child trigger gets aria-controls and expanded state", async () => {
    const { user } = await render(asChildMarkup)
    const button = screen.getByRole("button", { name: "Delete" })

    expect(button).toHaveAttribute("aria-controls", screen.getByRole("alertdialog", { hidden: true }).id)
    await user.click(button)
    expect(button).toHaveAttribute("aria-expanded", "true")
  })

  test("opening focuses Cancel, not the first button or the hidden token", async () => {
    const { user } = await render(wrapperMarkup())

    await user.click(screen.getByRole("button", { name: "Delete" }))
    await settle()

    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus()
  })

  test("the page behind becomes inert while open and is restored on close", async () => {
    const { user } = await render(`<a href="#">Outside</a>` + wrapperMarkup())
    const outside = screen.getByRole("link", { name: "Outside" })

    await user.click(screen.getByRole("button", { name: "Delete" }))
    expect(outside.closest("[inert]")).not.toBeNull()

    await user.click(screen.getByRole("button", { name: "Cancel" }))
    expect(outside.closest("[inert]")).toBeNull()
  })

  test("closing returns focus to the trigger button", async () => {
    const { user } = await render(wrapperMarkup())
    const trigger = screen.getByRole("button", { name: "Delete" })

    await user.click(trigger)
    await settle()
    await user.click(screen.getByRole("button", { name: "Continue" }))

    expect(trigger).toHaveFocus()
  })

  test("Escape closes it and returns focus", async () => {
    const { user } = await render(wrapperMarkup())
    const trigger = screen.getByRole("button", { name: "Delete" })

    await user.click(trigger)
    await settle()
    await user.keyboard("{Escape}")

    expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(trigger).toHaveFocus()
  })

  test("with close_on_escape false, Escape neither closes it nor reaches a dialog below", async () => {
    const markup = wrapperMarkup().replace("data-ui--alert-dialog-close-on-escape-value", 'data-ui--alert-dialog-close-on-escape-value="false"')
    const { user } = await render(markup)
    const trigger = screen.getByRole("button", { name: "Delete" })

    await user.click(trigger)

    // A legacy listener below the layer stack only acts on unhandled Escapes
    let escapesBelow = 0
    const below = e => { if (e.key === "Escape" && !e.defaultPrevented) escapesBelow++ }
    document.addEventListener("keydown", below)
    await user.keyboard("{Escape}")

    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(escapesBelow).toBe(0)
    document.removeEventListener("keydown", below)
  })
})
