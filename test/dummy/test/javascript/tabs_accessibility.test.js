// Tabs accessibility, black-box. Markup is what the ERB partials render
// (classes dropped): no ids, the controller wires them on connect.
import { describe, test, expect, afterEach } from "bun:test"
import { screen, within } from "@testing-library/dom"
import { render, cleanup, settle } from "./support/render.js"

const trigger = (value, label, { active = false, disabled = false } = {}) => `
  <button type="button" role="tab" aria-selected="${active}" data-state="${active ? "active" : "inactive"}"
          data-orientation="horizontal" data-slot="tabs-trigger" tabindex="${active ? 0 : -1}"
          ${disabled ? 'disabled="disabled" data-disabled=""' : ""}
          data-ui--tabs-target="trigger" data-value="${value}"
          data-action="click->ui--tabs#selectTab keydown->ui--tabs#handleKeyDown">${label}</button>`

const panel = (value, text, { active = false } = {}) => `
  <div role="tabpanel" data-state="${active ? "active" : "inactive"}" data-orientation="horizontal"
       data-slot="tabs-content" tabindex="0" ${active ? "" : 'hidden="hidden"'}
       data-ui--tabs-target="content" data-value="${value}">${text}</div>`

const tabsMarkup = ({ label = "tabs", disabledPassword = false, defaultValue = "account", panelId = "" } = {}) => `
  <div aria-label="${label}" data-orientation="horizontal" data-slot="tabs" data-controller="ui--tabs"
       data-ui--tabs-default-value-value="${defaultValue}" data-ui--tabs-orientation-value="horizontal"
       data-ui--tabs-activation-mode-value="automatic">
    <div data-orientation="horizontal" data-slot="tabs-list" role="tablist" aria-orientation="horizontal">
      ${trigger("account", "Account", { active: defaultValue === "account" })}
      ${trigger("password", "Password", { disabled: disabledPassword })}
      ${trigger("billing", "Billing")}
    </div>
    ${panel("account", "Account panel", { active: defaultValue === "account" }).replace('role="tabpanel"', `role="tabpanel" ${panelId ? `id="${panelId}"` : ""}`)}
    ${panel("password", "Password panel")}
    ${panel("billing", "Billing panel")}
  </div>`

describe("Tabs accessibility", () => {
  afterEach(() => cleanup())

  test("the active panel is named by its tab", async () => {
    await render(tabsMarkup())

    expect(screen.getByRole("tabpanel")).toHaveAccessibleName("Account")
  })

  test("each tab controls its own panel", async () => {
    await render(tabsMarkup())

    const tab = screen.getByRole("tab", { name: "Billing" })
    const panel = document.getElementById(tab.getAttribute("aria-controls"))
    expect(panel).toHaveTextContent("Billing panel")
  })

  test("two tab sets with the same values don't share ids", async () => {
    await render(tabsMarkup({ label: "first" }) + tabsMarkup({ label: "second" }))

    const [first, second] = document.querySelectorAll("[data-controller='ui--tabs']")
    const firstPanel = within(first).getByRole("tabpanel")
    const secondPanel = within(second).getByRole("tabpanel")

    expect(firstPanel.id).not.toBe(secondPanel.id)
    expect(firstPanel).toHaveAccessibleName("Account")
    expect(secondPanel).toHaveAccessibleName("Account")
    expect(document.getElementById(firstPanel.getAttribute("aria-labelledby"))).toBe(within(first).getByRole("tab", { name: "Account" }))

    const ids = Array.from(document.querySelectorAll("[id]")).map(el => el.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test("an id the author gave the panel is kept", async () => {
    await render(tabsMarkup({ panelId: "my-panel" }))

    const panel = screen.getByRole("tabpanel")
    expect(panel.id).toBe("my-panel")
    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute("aria-controls", "my-panel")
  })

  test("arrow keys skip a disabled tab", async () => {
    const { user } = await render(tabsMarkup({ disabledPassword: true }))

    await user.click(screen.getByRole("tab", { name: "Account" }))
    await user.keyboard("{ArrowRight}")

    const billing = screen.getByRole("tab", { name: "Billing" })
    expect(billing).toHaveFocus()
    expect(billing).toHaveAttribute("aria-selected", "true")
    expect(screen.getByRole("tabpanel")).toHaveAccessibleName("Billing")

    await user.keyboard("{ArrowLeft}")
    expect(screen.getByRole("tab", { name: "Account" })).toHaveFocus()
  })

  test("Home and End skip disabled tabs at the edges", async () => {
    const markup = tabsMarkup().replace(
      'data-value="account"\n          data-action',
      'disabled="disabled" data-value="account"\n          data-action'
    )
    const { user } = await render(markup.replace('data-ui--tabs-default-value-value="account"', 'data-ui--tabs-default-value-value="billing"'))

    screen.getByRole("tab", { name: "Billing" }).focus()
    await user.keyboard("{Home}")

    expect(screen.getByRole("tab", { name: "Password" })).toHaveFocus()
  })

  test("with no default value the first enabled tab is the tab stop", async () => {
    await render(tabsMarkup({ defaultValue: "" }))

    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute("tabindex", "0")
  })

  test("an arrow press moves one tab after the tabs reconnect", async () => {
    const { user } = await render(tabsMarkup())

    const root = document.querySelector("[data-controller='ui--tabs']")
    root.remove()
    await settle()
    document.body.appendChild(root)
    await settle()

    await user.click(screen.getByRole("tab", { name: "Account" }))
    await user.keyboard("{ArrowRight}")

    expect(screen.getByRole("tab", { name: "Password" })).toHaveFocus()
    expect(screen.getByRole("tab", { name: "Password" })).toHaveAttribute("aria-selected", "true")
  })
})
