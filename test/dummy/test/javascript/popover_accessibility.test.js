// Popover accessibility, black-box. Markup is what the ERB partials render
// (classes dropped): a trigger wrapper around the author's button, or an
// as_child trigger that is the button itself. Tab order and real visibility
// are covered by the Playwright system test.
import { describe, test, expect, afterEach } from "bun:test"
import { screen } from "@testing-library/dom"
import { render, cleanup, settle } from "./support/render.js"

const popoverMarkup = ({ trigger = "click", asChild = false, autoFocus = null, extra = "" } = {}) => {
  const triggerMarkup = asChild
    ? `<button type="button" aria-haspopup="dialog" aria-expanded="false" data-ui--popover-target="trigger">Dimensions</button>`
    : `<div data-ui--popover-target="trigger"><button type="button">Dimensions</button></div>`
  const autoFocusAttr = autoFocus === null ? "" : `data-ui--popover-auto-focus-value="${autoFocus}"`

  return `
  <div data-controller="ui--popover" data-ui--popover-placement-value="bottom" data-ui--popover-offset-value="4"
       data-ui--popover-trigger-value="${trigger}" data-ui--popover-hover-delay-value="0" ${autoFocusAttr}>
    ${triggerMarkup}
    <div role="dialog" tabindex="-1" data-ui--popover-target="content" data-state="closed">
      <p>Set the dimensions for the layer.</p>
      <input aria-label="Width" type="text">
      <button type="button">Save</button>
    </div>
  </div>
  ${extra}`
}

const triggerButton = () => screen.getByRole("button", { name: "Dimensions" })
const popover = () => screen.getByRole("dialog", { hidden: true })

describe("Popover accessibility", () => {
  afterEach(() => cleanup())

  describe("trigger and content relationship", () => {
    test("the button inside the trigger announces a dialog and controls the content", async () => {
      await render(popoverMarkup())
      const button = triggerButton()

      expect(button).toHaveAttribute("aria-haspopup", "dialog")
      expect(button).toHaveAttribute("aria-expanded", "false")
      expect(popover().id).toBeTruthy()
      expect(button).toHaveAttribute("aria-controls", popover().id)
    })

    test("aria-expanded follows open and close", async () => {
      const { user } = await render(popoverMarkup())

      await user.click(triggerButton())
      expect(triggerButton()).toHaveAttribute("aria-expanded", "true")

      await user.keyboard("{Escape}")
      expect(triggerButton()).toHaveAttribute("aria-expanded", "false")
    })

    test("an as_child trigger carries the aria itself", async () => {
      const { user } = await render(popoverMarkup({ asChild: true }))

      expect(triggerButton()).toHaveAttribute("aria-controls", popover().id)
      await user.click(triggerButton())
      expect(triggerButton()).toHaveAttribute("aria-expanded", "true")
    })

    test("an author's aria-haspopup is kept (combobox)", async () => {
      await render(popoverMarkup().replace(`<button type="button">Dimensions`, `<button type="button" aria-haspopup="listbox">Dimensions`))

      expect(triggerButton()).toHaveAttribute("aria-haspopup", "listbox")
    })

    test("two popovers get distinct content ids", async () => {
      await render(popoverMarkup() + popoverMarkup())

      const [a, b] = screen.getAllByRole("dialog", { hidden: true })
      expect(a.id).toBeTruthy()
      expect(a.id).not.toBe(b.id)
    })
  })

  describe("focus", () => {
    test("opening from the trigger moves focus into the content", async () => {
      const { user } = await render(popoverMarkup())

      await user.click(triggerButton())
      await settle(20)

      expect(screen.getByRole("textbox", { name: "Width" })).toHaveFocus()
    })

    test("auto focus can be turned off", async () => {
      const { user } = await render(popoverMarkup({ autoFocus: false }))

      await user.click(triggerButton())
      await settle(20)

      expect(triggerButton()).toHaveFocus()
    })

    test("Escape closes and returns focus to the trigger button", async () => {
      const { user } = await render(popoverMarkup())

      await user.click(triggerButton())
      await settle(20)
      await user.keyboard("{Escape}")
      await settle(20)

      expect(popover()).toHaveAttribute("data-state", "closed")
      expect(triggerButton()).toHaveFocus()
    })

    test("closing from inside the content returns focus to the trigger button", async () => {
      const { user } = await render(popoverMarkup().replace(
        `<button type="button">Save</button>`,
        `<button type="button" data-action="click->ui--popover#close">Save</button>`
      ))

      await user.click(triggerButton())
      await settle(20)
      await user.click(screen.getByRole("button", { name: "Save" }))
      await settle(20)

      expect(popover()).toHaveAttribute("data-state", "closed")
      expect(triggerButton()).toHaveFocus()
    })
  })

  describe("Escape layers", () => {
    test("Escape closes only the topmost open overlay", async () => {
      const nested = popoverMarkup().replace(
        `<button type="button">Save</button>`,
        `<button type="button">Save</button>` + popoverMarkup().replaceAll("Dimensions", "Inner").replace("<p>Set the dimensions for the layer.</p>", "")
      )
      const { user } = await render(nested)

      await user.click(triggerButton())
      await settle(20)
      await user.click(screen.getByRole("button", { name: "Inner" }))
      await settle(20)

      const [outer, inner] = screen.getAllByRole("dialog", { hidden: true })
      await user.keyboard("{Escape}")

      expect(inner).toHaveAttribute("data-state", "closed")
      expect(outer).toHaveAttribute("data-state", "open")
    })
  })

  describe("hover trigger", () => {
    test("can be opened from the keyboard", async () => {
      const { user } = await render(popoverMarkup({ trigger: "hover" }))

      await user.tab()
      expect(triggerButton()).toHaveFocus()
      await user.keyboard("{Enter}")
      await settle(20)

      expect(popover()).toHaveAttribute("data-state", "open")
      expect(triggerButton()).toHaveAttribute("aria-expanded", "true")

      await user.keyboard("{Escape}")
      expect(popover()).toHaveAttribute("data-state", "closed")
    })
  })

  describe("events", () => {
    test("clicking outside a closed popover doesn't fire popover:hide", async () => {
      const { user } = await render(popoverMarkup({ extra: `<button type="button">Elsewhere</button>` }))
      const hides = []
      document.addEventListener("popover:hide", e => hides.push(e))

      await user.click(screen.getByRole("button", { name: "Elsewhere" }))
      await user.click(screen.getByRole("button", { name: "Elsewhere" }))

      expect(hides).toHaveLength(0)
    })

    test("clicking outside an open popover fires popover:hide once", async () => {
      const { user } = await render(popoverMarkup({ autoFocus: false, extra: `<button type="button">Elsewhere</button>` }))
      const hides = []
      document.addEventListener("popover:hide", e => hides.push(e))

      await user.click(triggerButton())
      await user.click(screen.getByRole("button", { name: "Elsewhere" }))
      await settle(20)

      expect(hides).toHaveLength(1)
    })
  })
})
