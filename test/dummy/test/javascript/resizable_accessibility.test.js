// Resizable accessibility, black-box. Markup is what the ERB partials render
// after the fix (classes dropped): keydown bound with data-action, no
// hard-coded aria-value* — the controller derives them from the panels.
import { describe, test, expect, afterEach } from "bun:test"
import { screen } from "@testing-library/dom"
import { render, cleanup, settle } from "./support/render.js"

const handle = (label = "") => `
  <div data-slot="resizable-handle" tabindex="0" role="separator" ${label ? `aria-label="${label}"` : ""}
       data-ui--resizable-target="handle" data-resize-handle="" data-resize-handle-state="inactive"
       data-action="pointerdown->ui--resizable#startDrag pointerenter->ui--resizable#handleEnter pointerleave->ui--resizable#handleLeave focus->ui--resizable#handleFocus blur->ui--resizable#handleBlur keydown->ui--resizable#handleKeyDown"></div>`

const group = ({ direction = "horizontal", first = 'data-default-size="30" data-min-size="20" data-max-size="70"', panelLabel = "" } = {}) => `
  <div data-panel-group-direction="${direction}" data-slot="resizable-panel-group" data-controller="ui--resizable"
       data-ui--resizable-direction-value="${direction}" data-ui--resizable-keyboard-resize-by-value="10">
    <div data-slot="resizable-panel" data-ui--resizable-target="panel" ${first} ${panelLabel ? `aria-label="${panelLabel}"` : ""}>One</div>
    ${handle(panelLabel ? "" : "Resize")}
    <div data-slot="resizable-panel" data-ui--resizable-target="panel" data-default-size="70">Two</div>
  </div>`

const separator = () => screen.getByRole("separator")

describe("Resizable accessibility", () => {
  afterEach(() => cleanup())

  test("the separator reports the first panel's size and limits on load", async () => {
    await render(group())

    expect(separator()).toHaveAttribute("aria-valuenow", "30")
    expect(separator()).toHaveAttribute("aria-valuemin", "20")
    expect(separator()).toHaveAttribute("aria-valuemax", "70")
  })

  test("a horizontal group has a vertical separator that controls the first panel", async () => {
    await render(group())

    expect(separator()).toHaveAttribute("aria-orientation", "vertical")
    const panel = document.getElementById(separator().getAttribute("aria-controls"))
    expect(panel).toHaveTextContent("One")
  })

  test("a vertical group has a horizontal separator", async () => {
    await render(group({ direction: "vertical" }))

    expect(separator()).toHaveAttribute("aria-orientation", "horizontal")
  })

  test("the separator is named by a labelled panel", async () => {
    await render(group({ panelLabel: "Sidebar" }))

    expect(separator()).toHaveAccessibleName("Sidebar")
  })

  test("one arrow press resizes by one step, also after a reconnect", async () => {
    const { user } = await render(group())

    const root = document.querySelector("[data-controller='ui--resizable']")
    root.remove()
    await settle()
    document.body.appendChild(root)
    await settle()

    separator().focus()
    await user.keyboard("{ArrowRight}")

    expect(separator()).toHaveAttribute("aria-valuenow", "40")
  })

  test("perpendicular arrows are left to the page", async () => {
    await render(group())

    separator().focus()
    const event = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true })
    separator().dispatchEvent(event)

    expect(event.defaultPrevented).toBe(false)
    expect(separator()).toHaveAttribute("aria-valuenow", "30")
  })

  test("Enter collapses the first panel to its minimum and restores it", async () => {
    const { user } = await render(group())

    separator().focus()
    await user.keyboard("{Enter}")
    expect(separator()).toHaveAttribute("aria-valuenow", "20")

    await user.keyboard("{Enter}")
    expect(separator()).toHaveAttribute("aria-valuenow", "30")
  })
})
