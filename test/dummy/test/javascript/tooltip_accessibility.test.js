// Tooltip accessibility, black-box. Markup is what the ERB partials render
// (classes dropped). The controller portals the content to <body>, so the
// tooltip is found by role anywhere in the document.
import { describe, test, expect, afterEach } from "bun:test"
import { screen } from "@testing-library/dom"
import { render, cleanup, settle } from "./support/render.js"

const tooltipMarkup = ({ label = "Add", text = "Add to library", describedBy = "" } = {}) => `
  <div data-controller="ui--tooltip" class="contents">
    <button data-ui--tooltip-target="trigger" ${describedBy ? `aria-describedby="${describedBy}"` : ""}
            data-action="mouseenter->ui--tooltip#show mouseleave->ui--tooltip#hide focus->ui--tooltip#show blur->ui--tooltip#hide">${label}</button>
    <div role="tooltip" data-ui--tooltip-target="content" data-state="closed" data-side="top" data-align="center" data-ui--tooltip-side-offset-value="4">${text}</div>
  </div>`

const tooltip = (text = "Add to library") =>
  screen.getAllByRole("tooltip", { hidden: true }).find(el => el.textContent.trim() === text)

describe("Tooltip accessibility", () => {
  afterEach(() => cleanup())

  describe("exposure to assistive technology", () => {
    test("the trigger is described by the tooltip text", async () => {
      await render(tooltipMarkup())

      const button = screen.getByRole("button", { name: "Add" })
      expect(tooltip().id).toBeTruthy()
      expect(button).toHaveAttribute("aria-describedby", tooltip().id)
      expect(button).toHaveAccessibleDescription("Add to library")
    })

    test("an author's aria-describedby is kept alongside the tooltip", async () => {
      await render(`<p id="hint">Opens the library</p>` + tooltipMarkup({ describedBy: "hint" }))

      const button = screen.getByRole("button", { name: "Add" })
      expect(button.getAttribute("aria-describedby").split(" ")).toEqual(["hint", tooltip().id])
    })

    test("two tooltips get distinct ids", async () => {
      await render(tooltipMarkup() + tooltipMarkup({ label: "Remove", text: "Remove from library" }))

      expect(tooltip().id).not.toBe(tooltip("Remove from library").id)
      expect(screen.getByRole("button", { name: "Remove" })).toHaveAccessibleDescription("Remove from library")
    })
  })

  describe("keyboard", () => {
    test("focus opens it and Escape closes it", async () => {
      const { user } = await render(tooltipMarkup())

      await user.tab()
      await settle(10)
      expect(tooltip()).toHaveAttribute("data-state", "open")

      await user.keyboard("{Escape}")
      expect(tooltip()).toHaveAttribute("data-state", "closed")
      expect(screen.getByRole("button", { name: "Add" })).toHaveFocus()
    })

    test("a mouse click that focuses the trigger doesn't open it", async () => {
      const { user } = await render(tooltipMarkup())
      const button = screen.getByRole("button", { name: "Add" })

      // Pointer down/up without hovering first (touch, or a click after the
      // tooltip was dismissed)
      await user.pointer([{ keys: "[MouseLeft]", target: button }])
      await settle(10)

      expect(button).toHaveFocus()
      expect(tooltip()).toHaveAttribute("data-state", "closed")
    })
  })

  describe("hoverable content (WCAG 1.4.13)", () => {
    test("moving the pointer from the trigger onto the tooltip keeps it open", async () => {
      const { user } = await render(tooltipMarkup())
      const button = screen.getByRole("button", { name: "Add" })

      await user.hover(button)
      await settle(10)
      expect(tooltip()).toHaveAttribute("data-state", "open")

      await user.unhover(button)
      await user.hover(tooltip())
      await settle(200)

      expect(tooltip()).toHaveAttribute("data-state", "open")
    })

    test("leaving both the trigger and the tooltip closes it", async () => {
      const { user } = await render(tooltipMarkup())
      const button = screen.getByRole("button", { name: "Add" })

      await user.hover(button)
      await settle(10)
      await user.unhover(button)
      await user.hover(tooltip())
      await user.unhover(tooltip())
      await settle(200)

      expect(tooltip()).toHaveAttribute("data-state", "closed")
    })

    test("leaving the trigger without entering the tooltip closes it", async () => {
      const { user } = await render(tooltipMarkup())
      const button = screen.getByRole("button", { name: "Add" })

      await user.hover(button)
      await settle(10)
      await user.unhover(button)
      await settle(200)

      expect(tooltip()).toHaveAttribute("data-state", "closed")
    })
  })
})
