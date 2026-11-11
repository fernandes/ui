import { describe, test, expect } from "bun:test"
import { screen } from "@testing-library/dom"
import { render, settle } from "./support/render.js"

// Markup as UI::CheckboxBehavior renders it (classes and icons dropped).
function checkbox({ id = "terms", label = "Accept terms", checked = false, indeterminate = false } = {}) {
  const state = indeterminate ? "indeterminate" : (checked ? "checked" : "unchecked")
  return `
    <input type="checkbox" name="${id}" id="${id}" ${checked ? "checked" : ""}
           data-controller="ui--checkbox" data-state="${state}"
           ${indeterminate ? 'data-indeterminate="true"' : ""} />
    <label for="${id}">${label}</label>
  `
}

describe("Checkbox", () => {
  test("toggles with a click and mirrors the state on data-state", async () => {
    const { user } = await render(checkbox())
    const box = screen.getByRole("checkbox", { name: "Accept terms" })

    expect(box).not.toBeChecked()
    expect(box).toHaveAttribute("data-state", "unchecked")

    await user.click(box)
    expect(box).toBeChecked()
    expect(box).toHaveAttribute("data-state", "checked")

    await user.click(screen.getByText("Accept terms"))
    expect(box).not.toBeChecked()
    expect(box).toHaveAttribute("data-state", "unchecked")
  })

  test("toggles with Space", async () => {
    const { user } = await render(checkbox())
    const box = screen.getByRole("checkbox", { name: "Accept terms" })

    box.focus()
    await user.keyboard(" ")
    expect(box).toBeChecked()
    expect(box).toHaveAttribute("data-state", "checked")
  })

  test("does not put aria-checked on the native checkbox", async () => {
    const { user } = await render(checkbox({ checked: true }))
    const box = screen.getByRole("checkbox", { name: "Accept terms" })

    expect(box).not.toHaveAttribute("aria-checked")
    await user.click(box)
    expect(box).not.toHaveAttribute("aria-checked")
  })

  test("indeterminate renders as mixed until the user clicks it", async () => {
    const { user } = await render(checkbox({ indeterminate: true }))
    const box = screen.getByRole("checkbox", { name: "Accept terms" })

    expect(box).toBePartiallyChecked()
    expect(box).toHaveAttribute("data-state", "indeterminate")

    await user.click(box)
    expect(box).not.toBePartiallyChecked()
    expect(box).toBeChecked()
    expect(box).toHaveAttribute("data-state", "checked")
  })

  test("form reset re-syncs data-state and restores the indeterminate state", async () => {
    const { user } = await render(`
      <form>
        ${checkbox({ id: "news", label: "Newsletter", checked: true })}
        ${checkbox({ id: "all", label: "Select all", indeterminate: true })}
        <button type="reset">Reset</button>
      </form>
    `)
    const news = screen.getByRole("checkbox", { name: "Newsletter" })
    const all = screen.getByRole("checkbox", { name: "Select all" })

    await user.click(news)
    await user.click(all)
    expect(news).toHaveAttribute("data-state", "unchecked")
    expect(all).toHaveAttribute("data-state", "checked")

    await user.click(screen.getByRole("button", { name: "Reset" }))
    await settle(5)

    expect(news).toBeChecked()
    expect(news).toHaveAttribute("data-state", "checked")
    expect(all).toBePartiallyChecked()
    expect(all).toHaveAttribute("data-state", "indeterminate")
  })
})
