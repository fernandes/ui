import { describe, test, expect } from "bun:test"
import { screen } from "@testing-library/dom"
import { render } from "./support/render.js"

// Markup as UI::ToggleGroupBehavior / UI::ToggleGroupItemBehavior render it
// (classes dropped).
function group({ type = "single", value = null, orientation = null, loop = null, disabled = [], groupDisabled = false, items = ["Bold", "Italic", "Underline"] } = {}) {
  const single = type === "single"
  const selected = value === null ? [] : [].concat(value)
  const json = value === null ? (single ? "null" : "[]") : JSON.stringify(value)
  const buttons = items.map(label => {
    const v = label.toLowerCase()
    const on = selected.includes(v)
    const off = groupDisabled || disabled.includes(v)
    return `<button type="button" role="${single ? "radio" : "button"}" ${off ? "disabled data-disabled=\"\"" : ""}
      ${single ? `aria-checked="${on}"` : `aria-pressed="${on}"`}
      data-ui--toggle-group-target="item" data-action="click->ui--toggle-group#toggle"
      data-value="${v}" data-state="${on ? "on" : "off"}" data-spacing="0">${label}</button>`
  }).join("")
  return `
    <button type="button">Before</button>
    <div role="${single ? "radiogroup" : "group"}" aria-label="Formatting"
         data-controller="ui--toggle-group"
         data-ui--toggle-group-type-value="${type}"
         data-ui--toggle-group-value-value='${json}'
         ${orientation ? `data-orientation="${orientation}"` : ""}
         ${loop === null ? "" : `data-ui--toggle-group-loop-value="${loop}"`}
         ${groupDisabled ? 'data-disabled=""' : ""}
         data-spacing="0" data-variant="default">${buttons}</div>
    <button type="button">After</button>
  `
}

const item = (name, role = "radio") => screen.getByRole(role, { name })

describe("Toggle Group keyboard", () => {
  test("only one item is in the tab order: the first one when nothing is pressed", async () => {
    const { user } = await render(group())

    await user.click(screen.getByRole("button", { name: "Before" }))
    await user.tab()
    expect(item("Bold")).toHaveFocus()
    await user.tab()
    expect(screen.getByRole("button", { name: "After" })).toHaveFocus()

    await user.tab({ shift: true })
    expect(item("Bold")).toHaveFocus()
  })

  test("Tab enters on the pressed item", async () => {
    const { user } = await render(group({ value: "italic" }))

    await user.click(screen.getByRole("button", { name: "Before" }))
    await user.tab()
    expect(item("Italic")).toHaveFocus()
  })

  test("arrow keys move focus without selecting, and loop", async () => {
    const { user } = await render(group())

    item("Bold").focus()
    await user.keyboard("{ArrowRight}")
    expect(item("Italic")).toHaveFocus()
    expect(item("Italic")).toHaveAttribute("aria-checked", "false")

    await user.keyboard("{ArrowDown}")
    expect(item("Underline")).toHaveFocus()
    await user.keyboard("{ArrowRight}")
    expect(item("Bold")).toHaveFocus()
    await user.keyboard("{ArrowLeft}")
    expect(item("Underline")).toHaveFocus()
    await user.keyboard("{ArrowUp}")
    expect(item("Italic")).toHaveFocus()
  })

  test("the focused item becomes the tab stop", async () => {
    const { user } = await render(group())

    item("Bold").focus()
    await user.keyboard("{ArrowRight}")
    await user.tab()
    expect(screen.getByRole("button", { name: "After" })).toHaveFocus()
    await user.tab({ shift: true })
    expect(item("Italic")).toHaveFocus()
  })

  test("Home and End go to the first and last items", async () => {
    const { user } = await render(group())

    item("Italic").focus()
    await user.keyboard("{End}")
    expect(item("Underline")).toHaveFocus()
    await user.keyboard("{Home}")
    expect(item("Bold")).toHaveFocus()
  })

  test("disabled items are skipped", async () => {
    const { user } = await render(group({ disabled: ["italic"] }))

    item("Bold").focus()
    await user.keyboard("{ArrowRight}")
    expect(item("Underline")).toHaveFocus()
    await user.keyboard("{ArrowLeft}")
    expect(item("Bold")).toHaveFocus()
  })

  test("Space and Enter toggle the focused item", async () => {
    const { user } = await render(group({ type: "multiple" }))

    item("Bold", "button").focus()
    await user.keyboard("{ArrowRight}")
    await user.keyboard(" ")
    expect(item("Italic", "button")).toHaveAttribute("aria-pressed", "true")
    await user.keyboard("{Enter}")
    expect(item("Italic", "button")).toHaveAttribute("aria-pressed", "false")
  })

  test("horizontal orientation ignores Up/Down", async () => {
    const { user } = await render(group({ orientation: "horizontal" }))

    item("Bold").focus()
    await user.keyboard("{ArrowDown}")
    expect(item("Bold")).toHaveFocus()
    await user.keyboard("{ArrowRight}")
    expect(item("Italic")).toHaveFocus()
  })

  test("vertical orientation ignores Left/Right", async () => {
    const { user } = await render(group({ orientation: "vertical" }))

    item("Bold").focus()
    await user.keyboard("{ArrowRight}")
    expect(item("Bold")).toHaveFocus()
    await user.keyboard("{ArrowDown}")
    expect(item("Italic")).toHaveFocus()
  })

  test("loop: false stops at the ends", async () => {
    const { user } = await render(group({ loop: false }))

    item("Underline").focus()
    await user.keyboard("{ArrowRight}")
    expect(item("Underline")).toHaveFocus()
    item("Bold").focus()
    await user.keyboard("{ArrowLeft}")
    expect(item("Bold")).toHaveFocus()
  })

  test("pressing an item does not lose the roving tab stop", async () => {
    const { user } = await render(group())

    await user.click(item("Underline"))
    expect(item("Underline")).toHaveAttribute("aria-checked", "true")
    await user.click(screen.getByRole("button", { name: "Before" }))
    await user.tab()
    expect(item("Underline")).toHaveFocus()
  })
})
