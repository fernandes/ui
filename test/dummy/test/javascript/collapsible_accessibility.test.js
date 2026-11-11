// Collapsible accessibility, black-box. Markup is what Phlex / ViewComponent
// render (the children don't know the root's open / disabled state), so the
// controller has to bring trigger and content in line on connect.
import { describe, test, expect, afterEach } from "bun:test"
import { screen } from "@testing-library/dom"
import { render, cleanup } from "./support/render.js"

const collapsible = ({ open = false, disabled = false, contentId = "", asChild = false } = {}) => `
  <div data-controller="ui--collapsible" data-slot="collapsible" data-state="${open ? "open" : "closed"}"
       data-ui--collapsible-open-value="${open}" data-ui--collapsible-disabled-value="${disabled}">
    ${asChild
      ? `<a href="#" role="button" data-slot="collapsible-trigger" data-ui--collapsible-target="trigger" data-action="click->ui--collapsible#toggle">Toggle</a>`
      : `<button type="button" data-slot="collapsible-trigger" data-ui--collapsible-target="trigger" data-action="click->ui--collapsible#toggle">Toggle</button>`}
    <div data-slot="collapsible-content" data-state="closed" data-ui--collapsible-target="content" hidden="hidden" ${contentId ? `id="${contentId}"` : ""}>
      Body <a href="#">Inner link</a>
    </div>
  </div>`

describe("Collapsible accessibility", () => {
  afterEach(() => cleanup())

  test("the trigger controls the content", async () => {
    await render(collapsible())

    const trigger = screen.getByRole("button", { name: "Toggle" })
    const content = document.getElementById(trigger.getAttribute("aria-controls"))
    expect(content).toHaveTextContent("Body")
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  test("two collapsibles get different content ids", async () => {
    await render(collapsible() + collapsible())

    const [a, b] = screen.getAllByRole("button", { name: "Toggle" }).map(t => t.getAttribute("aria-controls"))
    expect(a).toBeTruthy()
    expect(a).not.toBe(b)
  })

  test("an id the author gave the content is kept", async () => {
    await render(collapsible({ contentId: "details" }))

    expect(screen.getByRole("button", { name: "Toggle" })).toHaveAttribute("aria-controls", "details")
  })

  test("disabled disables the trigger", async () => {
    const { user } = await render(collapsible({ disabled: true }))

    const trigger = screen.getByRole("button", { name: "Toggle" })
    expect(trigger).toBeDisabled()

    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  test("disabled as_child trigger that isn't a button is aria-disabled", async () => {
    await render(collapsible({ disabled: true, asChild: true }))

    expect(screen.getByRole("button", { name: "Toggle" })).toHaveAttribute("aria-disabled", "true")
  })

  test("open on load shows the content", async () => {
    await render(collapsible({ open: true }))

    expect(screen.getByRole("button", { name: "Toggle" })).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText(/Body/)).toBeVisible()
  })

  test("closing hides the content even when no transition runs", async () => {
    const { user } = await render(collapsible({ open: true }))

    await user.click(screen.getByRole("button", { name: "Toggle" }))

    expect(screen.getByText(/Body/).closest("[data-slot='collapsible-content']")).toHaveAttribute("hidden")
  })
})
