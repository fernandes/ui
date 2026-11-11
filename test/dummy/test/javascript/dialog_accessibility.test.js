// Dialog accessibility, black-box. Markup is what the ERB partials render
// (classes dropped); the form carries the authenticity token every Rails form
// has. Tab order and real inertness are covered by the Playwright system test.
import { describe, test, expect, afterEach } from "bun:test"
import { screen } from "@testing-library/dom"
import { render, cleanup } from "./support/render.js"

const dialogMarkup = ({ titleId = "", nested = "", closeOnEscape = true } = {}) => {
  const suffix = nested ? " (outer)" : ""
  return `
  <div data-controller="ui--dialog" data-ui--dialog-open-value="false" data-ui--dialog-close-on-escape-value="${closeOnEscape}" data-ui--dialog-close-on-overlay-click-value="true">
    <button type="button" aria-haspopup="dialog" aria-expanded="false" data-action="click->ui--dialog#open" data-ui--dialog-target="trigger">Edit profile${suffix}</button>
    <div data-state="closed" data-ui--dialog-target="container">
      <div data-state="closed" data-ui--dialog-target="overlay" data-action="click->ui--dialog#closeOnOverlayClick"></div>
      <div role="dialog" aria-modal="true" data-state="closed" data-ui--dialog-target="content" inert="inert">
        <h2 data-ui--dialog-target="title" ${titleId ? `id="${titleId}"` : ""}>Edit profile${suffix}</h2>
        <p data-ui--dialog-target="description">Make changes here.</p>
        <form action="/x" accept-charset="UTF-8" method="post">
          <input type="hidden" name="authenticity_token" value="token" autocomplete="off">
          <input aria-label="Name" type="text" name="name">
        </form>
        ${nested}
        <button type="button" data-action="click->ui--dialog#close">Cancel</button>
      </div>
    </div>
  </div>`
}

const innerDialogMarkup = `
  <div data-controller="ui--dialog" data-ui--dialog-open-value="false">
    <button type="button" aria-haspopup="dialog" aria-expanded="false" data-action="click->ui--dialog#open" data-ui--dialog-target="trigger">Confirm</button>
    <div data-state="closed" data-ui--dialog-target="container">
      <div data-state="closed" data-ui--dialog-target="overlay" data-action="click->ui--dialog#closeOnOverlayClick"></div>
      <div role="dialog" aria-modal="true" data-state="closed" data-ui--dialog-target="content" inert="inert">
        <h2 data-ui--dialog-target="title">Are you sure?</h2>
        <button type="button" data-action="click->ui--dialog#close">Keep editing</button>
      </div>
    </div>
  </div>`

describe("Dialog accessibility", () => {
  afterEach(() => cleanup())

  test("the dialog is named by its title and described by its description", async () => {
    await render(dialogMarkup())

    const dialog = screen.getByRole("dialog", { hidden: true })
    expect(dialog).toHaveAccessibleName("Edit profile")
    expect(dialog).toHaveAccessibleDescription("Make changes here.")
  })

  test("an author-provided title id is kept and used", async () => {
    await render(dialogMarkup({ titleId: "profile-title" }))

    expect(screen.getByRole("dialog", { hidden: true })).toHaveAttribute("aria-labelledby", "profile-title")
  })

  test("two dialogs on a page get distinct ids", async () => {
    await render(dialogMarkup() + dialogMarkup())

    const [a, b] = screen.getAllByRole("dialog", { hidden: true })
    expect(a.id).toBeTruthy()
    expect(a.id).not.toBe(b.id)
    expect(a.getAttribute("aria-labelledby")).not.toBe(b.getAttribute("aria-labelledby"))
  })

  test("the trigger controls the dialog and reports expanded state", async () => {
    const { user } = await render(dialogMarkup())
    const trigger = screen.getByRole("button", { name: "Edit profile" })
    const dialog = screen.getByRole("dialog", { hidden: true })

    expect(trigger).toHaveAttribute("aria-haspopup", "dialog")
    expect(trigger).toHaveAttribute("aria-controls", dialog.id)
    expect(trigger).toHaveAttribute("aria-expanded", "false")

    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")

    await user.click(screen.getByRole("button", { name: "Cancel" }))
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  test("a trigger without the target (hand-written markup) is wired too", async () => {
    await render(dialogMarkup().replace(' data-ui--dialog-target="trigger"', "").replace(' aria-haspopup="dialog" aria-expanded="false"', ""))

    const trigger = screen.getByRole("button", { name: "Edit profile" })
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog")
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(trigger).toHaveAttribute("aria-controls", screen.getByRole("dialog", { hidden: true }).id)
  })

  test("opening focuses the first field, not the hidden authenticity token", async () => {
    const { user } = await render(dialogMarkup())

    await user.click(screen.getByRole("button", { name: "Edit profile" }))

    expect(screen.getByRole("textbox", { name: "Name" })).toHaveFocus()
  })

  test("closing returns focus to the trigger", async () => {
    const { user } = await render(dialogMarkup())
    const trigger = screen.getByRole("button", { name: "Edit profile" })

    await user.click(trigger)
    await user.click(screen.getByRole("button", { name: "Cancel" }))

    expect(trigger).toHaveFocus()
  })

  test("Escape closes the dialog and returns focus to the trigger", async () => {
    const { user } = await render(dialogMarkup())
    const trigger = screen.getByRole("button", { name: "Edit profile" })

    await user.click(trigger)
    await user.keyboard("{Escape}")

    expect(screen.getByRole("dialog", { hidden: true })).toHaveAttribute("data-state", "closed")
    expect(trigger).toHaveFocus()
  })

  test("while open the page behind is inert; closing brings it back", async () => {
    const { user } = await render(`<a href="/">Home</a>${dialogMarkup()}`)

    await user.click(screen.getByRole("button", { name: "Edit profile" }))
    expect(screen.getByRole("link", { name: "Home", hidden: true }).inert).toBe(true)
    expect(screen.getByRole("button", { name: "Edit profile", hidden: true }).inert).toBe(true)

    await user.keyboard("{Escape}")
    expect(screen.getByRole("link", { name: "Home" }).inert).toBe(false)
  })

  test("Tab from the last element wraps to the first inside the dialog", async () => {
    const { user } = await render(dialogMarkup())

    await user.click(screen.getByRole("button", { name: "Edit profile" }))
    screen.getByRole("button", { name: "Cancel" }).focus()
    await user.tab()

    expect(screen.getByRole("textbox", { name: "Name" })).toHaveFocus()
  })

  test("Escape in a nested dialog closes only the inner one", async () => {
    const { user } = await render(dialogMarkup({ nested: innerDialogMarkup }))

    await user.click(screen.getByRole("button", { name: "Edit profile (outer)" }))
    const confirm = screen.getByRole("button", { name: "Confirm" })
    await user.click(confirm)
    expect(screen.getByRole("button", { name: "Keep editing" })).toHaveFocus()

    await user.keyboard("{Escape}")

    expect(screen.getByRole("dialog", { name: "Are you sure?", hidden: true })).toHaveAttribute("data-state", "closed")
    expect(screen.getByRole("dialog", { name: "Edit profile (outer)", hidden: true })).toHaveAttribute("data-state", "open")
    expect(confirm).toHaveFocus()

    await user.keyboard("{Escape}")
    expect(screen.getByRole("dialog", { name: "Edit profile (outer)", hidden: true })).toHaveAttribute("data-state", "closed")
    expect(screen.getByRole("button", { name: "Edit profile (outer)" })).toHaveFocus()
  })

  test("close_on_escape: false keeps the dialog open, and Escape doesn't reach a dialog below", async () => {
    const { user } = await render(dialogMarkup({ closeOnEscape: false }))

    await user.click(screen.getByRole("button", { name: "Edit profile" }))
    await user.keyboard("{Escape}")

    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "open")
  })
})
