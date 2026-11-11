// Accordion accessibility, black-box. Markup is what the ERB partials render
// (classes and the caret svg dropped): no ids, the controller wires them.
import { describe, test, expect, afterEach } from "bun:test"
import { screen, within } from "@testing-library/dom"
import { render, cleanup } from "./support/render.js"

const item = (value, label, { open = false, disabled = false, triggerDisabled = disabled, contentId = "" } = {}) => `
  <div data-state="${open ? "open" : "closed"}" data-orientation="vertical" data-ui--accordion-target="item" data-value="${value}" ${disabled ? 'data-disabled=""' : ""}>
    <h3 data-orientation="vertical" data-state="${open ? "open" : "closed"}">
      <button type="button" aria-expanded="${open}" ${triggerDisabled ? 'disabled="disabled" data-disabled=""' : ""} data-state="${open ? "open" : "closed"}" data-orientation="vertical" data-ui--accordion-target="trigger" data-action="click->ui--accordion#toggle">${label}</button>
    </h3>
    <div role="region" ${contentId ? `id="${contentId}"` : ""} data-state="${open ? "open" : "closed"}" data-orientation="vertical" data-ui--accordion-target="content" ${open ? "" : 'hidden="hidden"'}>
      <div>${label} content <a href="#">${label} link</a></div>
    </div>
  </div>`

const accordion = (items, { type = "single", collapsible = true, label = "faq" } = {}) => `
  <div aria-label="${label}" data-orientation="vertical" data-controller="ui--accordion" data-ui--accordion-type-value="${type}" data-ui--accordion-collapsible-value="${collapsible}">
    ${items.join("")}
  </div>`

describe("Accordion accessibility", () => {
  afterEach(() => cleanup())

  test("each region is named by its trigger and each trigger controls its region", async () => {
    await render(accordion([item("a", "First", { open: true }), item("b", "Second")]))

    const region = screen.getByRole("region")
    expect(region).toHaveAccessibleName("First")
    const trigger = screen.getByRole("button", { name: "Second" })
    expect(document.getElementById(trigger.getAttribute("aria-controls"))).toHaveTextContent("Second content")
  })

  test("two accordions with the same values don't share ids", async () => {
    await render(
      accordion([item("a", "First", { open: true })], { label: "one" }) +
      accordion([item("a", "First", { open: true })], { label: "two" })
    )

    const ids = Array.from(document.querySelectorAll("[id]")).map(el => el.id)
    expect(ids.length).toBe(4)
    expect(new Set(ids).size).toBe(4)
    for (const region of screen.getAllByRole("region")) {
      expect(region).toHaveAccessibleName("First")
    }
  })

  test("an id the author gave the region is kept", async () => {
    await render(accordion([item("a", "First", { open: true, contentId: "my-region" })]))

    expect(screen.getByRole("region").id).toBe("my-region")
    expect(screen.getByRole("button", { name: "First" })).toHaveAttribute("aria-controls", "my-region")
  })

  test("arrow keys skip a disabled item", async () => {
    const { user } = await render(accordion([
      item("a", "First"), item("b", "Second", { disabled: true }), item("c", "Third")
    ]))

    screen.getByRole("button", { name: "First" }).focus()
    await user.keyboard("{ArrowDown}")
    expect(screen.getByRole("button", { name: "Third" })).toHaveFocus()

    await user.keyboard("{ArrowUp}")
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus()
  })

  test("a disabled item whose trigger was rendered without disabled (Phlex/VC) is still disabled", async () => {
    await render(accordion([item("a", "First"), item("b", "Second", { disabled: true, triggerDisabled: false })]))

    expect(screen.getByRole("button", { name: "Second" })).toBeDisabled()
  })

  test("single and not collapsible: the open item stays open and says so", async () => {
    const { user } = await render(accordion([item("a", "First", { open: true }), item("b", "Second")], { collapsible: false }))

    const first = screen.getByRole("button", { name: "First" })
    expect(first).toHaveAttribute("aria-disabled", "true")

    await user.click(first)
    expect(first).toHaveAttribute("aria-expanded", "true")

    const second = screen.getByRole("button", { name: "Second" })
    await user.click(second)
    expect(second).toHaveAttribute("aria-expanded", "true")
    expect(second).toHaveAttribute("aria-disabled", "true")
    expect(first).toHaveAttribute("aria-expanded", "false")
    expect(first).not.toHaveAttribute("aria-disabled")
  })

  test("single and collapsible (default): the open item can be closed", async () => {
    const { user } = await render(accordion([item("a", "First", { open: true })]))

    const first = screen.getByRole("button", { name: "First" })
    expect(first).not.toHaveAttribute("aria-disabled")
    await user.click(first)
    expect(first).toHaveAttribute("aria-expanded", "false")
  })

  test("Enter toggles the item once", async () => {
    const { user } = await render(accordion([item("a", "First")]))

    screen.getByRole("button", { name: "First" }).focus()
    await user.keyboard("{Enter}")

    expect(screen.getByRole("button", { name: "First" })).toHaveAttribute("aria-expanded", "true")
    expect(within(screen.getByRole("region")).getByText(/First content/)).toBeTruthy()
  })
})
