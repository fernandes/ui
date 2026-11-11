import { describe, test, expect } from "bun:test"
import { screen } from "@testing-library/dom"
import { render, settle } from "./support/render.js"

// Markup as UI::SwitchBehavior renders it (classes dropped).
function switchHtml({ id = "airplane", checked = false, disabled = false, name = null, value = "1", label = "Airplane mode", extra = "" } = {}) {
  const state = checked ? "checked" : "unchecked"
  return `
    <button role="switch" type="button" tabindex="${disabled ? -1 : 0}" aria-checked="${checked}"
            data-state="${state}" data-slot="switch" id="${id}"
            data-controller="ui--switch" data-ui--switch-checked-value="${checked}"
            data-ui--switch-value-value="${value}"
            data-action="click->ui--switch#toggle keydown->ui--switch#handleKeydown"
            ${disabled ? 'disabled aria-disabled="true"' : ""} ${extra}>
      <span data-ui--switch-target="thumb" data-slot="switch-thumb" data-state="${state}"></span>
      ${name ? `<input type="hidden" name="${name}" value="${checked ? value : "0"}">` : ""}
    </button>
    <label for="${id}">${label}</label>
  `
}

function submitted(form) {
  return Object.fromEntries(new FormData(form).entries())
}

describe("Switch", () => {
  test("click toggles aria-checked and data-state", async () => {
    const { user } = await render(switchHtml())
    const sw = screen.getByRole("switch", { name: "Airplane mode" })

    expect(sw).not.toBeChecked()
    await user.click(sw)
    expect(sw).toBeChecked()
    expect(sw).toHaveAttribute("data-state", "checked")

    await user.click(screen.getByText("Airplane mode"))
    expect(sw).not.toBeChecked()
    expect(sw).toHaveAttribute("data-state", "unchecked")
  })

  test("Space and Enter toggle exactly once", async () => {
    const { user } = await render(switchHtml())
    const sw = screen.getByRole("switch", { name: "Airplane mode" })

    sw.focus()
    await user.keyboard(" ")
    expect(sw).toBeChecked()
    await user.keyboard("{Enter}")
    expect(sw).not.toBeChecked()
  })

  test("a disabled switch does not toggle", async () => {
    const { user } = await render(switchHtml({ disabled: true }))
    const sw = screen.getByRole("switch", { name: "Airplane mode" })

    await user.click(sw)
    expect(sw).not.toBeChecked()
    expect(sw).toBeDisabled()
  })

  test("dispatches a bubbling change event", async () => {
    const { user } = await render(`<div id="host">${switchHtml()}</div>`)
    let changes = 0
    document.getElementById("host").addEventListener("change", () => changes++)

    await user.click(screen.getByRole("switch", { name: "Airplane mode" }))
    expect(changes).toBe(1)
  })

  test("keeps a custom value across toggles", async () => {
    const { user } = await render(`<form>${switchHtml({ name: "plan", value: "pro", checked: true })}</form>`)
    const form = document.querySelector("form")
    const sw = screen.getByRole("switch", { name: "Airplane mode" })

    expect(submitted(form)).toEqual({ plan: "pro" })
    await user.click(sw)
    expect(submitted(form)).toEqual({ plan: "0" })
    await user.click(sw)
    expect(submitted(form)).toEqual({ plan: "pro" })
  })

  test("form reset restores the rendered state", async () => {
    const { user } = await render(`
      <form>
        ${switchHtml({ name: "wifi", checked: true })}
        <button type="reset">Reset</button>
      </form>
    `)
    const form = document.querySelector("form")
    const sw = screen.getByRole("switch", { name: "Airplane mode" })

    await user.click(sw)
    expect(sw).not.toBeChecked()

    await user.click(screen.getByRole("button", { name: "Reset" }))
    await settle(5)

    expect(sw).toBeChecked()
    expect(sw).toHaveAttribute("data-state", "checked")
    expect(submitted(form)).toEqual({ wifi: "1" })
  })
})
