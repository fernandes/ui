// Dropdown Menu accessibility, black-box. Markup is what the ERB partials
// render (classes dropped, except `hidden`, which the controller toggles).
import { describe, test, expect, afterEach } from "bun:test"
import { screen, fireEvent } from "@testing-library/dom"
import { render, cleanup, settle } from "./support/render.js"
import { createEscapeLayer } from "../../../../app/javascript/ui/utils/escape-key-manager.js"

const item = (label, { disabled = false } = {}) => `
  <div data-ui--dropdown-target="item" data-action="click->ui--dropdown#select mouseenter->ui--dropdown#trackHoveredItem"
       role="menuitem" tabindex="-1" ${disabled ? 'data-disabled="true" aria-disabled="true"' : ""}>${label}</div>`

const checkbox = (label, checked = false) => `
  <div data-ui--dropdown-target="item" data-action="mouseenter->ui--dropdown#trackHoveredItem click->ui--dropdown#toggleCheckbox"
       data-state="${checked ? "checked" : "unchecked"}" role="menuitemcheckbox" aria-checked="${checked}" tabindex="-1">
    <span class="absolute left-2"></span>${label}
  </div>`

const sub = (label, inner, { disabled = false } = {}) => `
  <div>
    <div data-ui--dropdown-target="item" data-action="mouseenter->ui--dropdown#openSubmenu mouseleave->ui--dropdown#closeSubmenu"
         data-state="closed" role="menuitem" aria-haspopup="menu" aria-expanded="false" tabindex="-1"
         ${disabled ? 'data-disabled="true" aria-disabled="true"' : ""}>${label}</div>
    <div data-state="closed" data-side="right" data-align="start" role="menu" tabindex="-1" class="hidden">${inner}</div>
  </div>`

const trigger = (inner = "Open") => `
  <button data-ui--dropdown-target="trigger" data-action="click->ui--dropdown#toggle keydown->ui--dropdown#handleTriggerKeydown"
          aria-haspopup="menu" aria-expanded="false" type="button">${inner}</button>`

const wrapperTrigger = `
  <div data-ui--dropdown-target="trigger" data-action="click->ui--dropdown#toggle keydown->ui--dropdown#handleTriggerKeydown">
    <button type="button">Options</button>
  </div>`

const dropdown = (items, { triggerHtml = trigger(), state = "closed", openValue = "" } = {}) => `
  <button type="button">Before</button>
  <div data-controller="ui--dropdown" data-ui--dropdown-placement-value="bottom-start" ${openValue}>
    ${triggerHtml}
    <div data-ui--dropdown-target="content" data-state="${state}" role="menu" tabindex="-1" class="${state === "open" ? "" : "hidden"}">
      ${items}
    </div>
  </div>
  <button type="button">After</button>`

const basicItems = item("Profile") + item("Billing", { disabled: true }) + item("Settings") + item("Keyboard shortcuts") + item("Team")

const openWithKeyboard = async (user, name = "Open") => {
  screen.getByRole("button", { name }).focus()
  await user.keyboard("{Enter}")
}

describe("Dropdown Menu accessibility", () => {
  afterEach(() => cleanup())

  test("the trigger controls the menu, the menu is named by the trigger", async () => {
    const { user } = await render(dropdown(basicItems))
    const button = screen.getByRole("button", { name: "Open" })
    const menu = screen.getByRole("menu", { hidden: true })

    expect(button).toHaveAttribute("aria-controls", menu.id)
    expect(menu).toHaveAccessibleName("Open")
    expect(button).toHaveAttribute("aria-expanded", "false")

    await user.click(button)
    expect(button).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByRole("menuitem", { name: "Profile" })).toHaveFocus()
  })

  test("two dropdowns get distinct menu ids", async () => {
    await render(dropdown(basicItems) + dropdown(basicItems))
    const [a, b] = screen.getAllByRole("menu", { hidden: true })
    expect(a.id).toBeTruthy()
    expect(a.id).not.toBe(b.id)
  })

  test("ArrowDown on the trigger opens on the first item, ArrowUp on the last", async () => {
    const { user } = await render(dropdown(basicItems))
    const button = screen.getByRole("button", { name: "Open" })

    button.focus()
    await user.keyboard("{ArrowDown}")
    expect(button).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByRole("menuitem", { name: "Profile" })).toHaveFocus()

    await user.keyboard("{Escape}")
    expect(button).toHaveFocus()
    await user.keyboard("{ArrowUp}")
    expect(screen.getByRole("menuitem", { name: "Team" })).toHaveFocus()
  })

  test("Enter on the native button trigger opens the menu once (no double toggle)", async () => {
    const { user } = await render(dropdown(basicItems))
    await openWithKeyboard(user)
    expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByRole("menu")).toBeVisible()
  })

  test("activating an item with the keyboard closes the menu and returns focus to the trigger", async () => {
    const { user } = await render(dropdown(basicItems))
    await openWithKeyboard(user)

    await user.keyboard("{ArrowDown}{Enter}")

    const button = screen.getByRole("button", { name: "Open" })
    expect(button).toHaveAttribute("aria-expanded", "false")
    expect(button).toHaveFocus()
  })

  test("clicking an item closes the menu and returns focus to the trigger", async () => {
    const { user } = await render(dropdown(basicItems))
    const button = screen.getByRole("button", { name: "Open" })
    await user.click(button)

    await user.click(screen.getByRole("menuitem", { name: "Settings" }))

    expect(button).toHaveAttribute("aria-expanded", "false")
    expect(button).toHaveFocus()
  })

  test("Enter on a checkbox item toggles it, closes and returns focus", async () => {
    const { user } = await render(dropdown(item("Profile") + checkbox("Status bar")))
    await openWithKeyboard(user)

    await user.keyboard("{ArrowDown}{Enter}")

    expect(screen.getByRole("menuitemcheckbox", { name: "Status bar", hidden: true })).toHaveAttribute("aria-checked", "true")
    expect(screen.getByRole("button", { name: "Open" })).toHaveFocus()
  })

  test("Tab closes the menu and puts focus back on the trigger before moving on", async () => {
    const { user } = await render(dropdown(basicItems))
    await openWithKeyboard(user)

    fireEvent.keyDown(document.activeElement, { key: "Tab" })

    const button = screen.getByRole("button", { name: "Open" })
    expect(button).toHaveAttribute("aria-expanded", "false")
    expect(button).toHaveFocus()
  })

  test("disabled items are skipped and announced as disabled", async () => {
    const { user } = await render(dropdown(basicItems))
    await openWithKeyboard(user)

    expect(screen.getByRole("menuitem", { name: "Billing" })).toHaveAttribute("aria-disabled", "true")
    await user.keyboard("{ArrowDown}")
    expect(screen.getByRole("menuitem", { name: "Settings" })).toHaveFocus()
  })

  test("typeahead focuses the next item starting with the typed letters", async () => {
    const { user } = await render(dropdown(basicItems))
    await openWithKeyboard(user)

    await user.keyboard("t")
    expect(screen.getByRole("menuitem", { name: "Team" })).toHaveFocus()

    await settle(1100)
    await user.keyboard("ke")
    expect(screen.getByRole("menuitem", { name: "Keyboard shortcuts" })).toHaveFocus()

    await settle(1100)
    await user.keyboard("b") // only "Billing" starts with b, and it is disabled
    expect(screen.getByRole("menuitem", { name: "Keyboard shortcuts" })).toHaveFocus()
  })

  test("keys typed outside the open menu are left alone", async () => {
    await render(dropdown(basicItems) + `<input aria-label="Search">`)
    screen.getByRole("button", { name: "Open" }).click()
    await settle()

    const input = screen.getByRole("textbox", { name: "Search" })
    input.focus()
    const event = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true })
    input.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
  })

  describe("submenus", () => {
    const withSub = item("New tab") +
      sub("More tools", item("Save page") + checkbox("Developer mode") + checkbox("Reader mode")) +
      sub("Share", item("Email"), { disabled: true })

    test("the sub trigger reports and controls its submenu", async () => {
      const { user } = await render(dropdown(withSub))
      await openWithKeyboard(user)
      const subTrigger = screen.getByRole("menuitem", { name: "More tools" })
      const submenu = screen.getByRole("menu", { name: "More tools", hidden: true })

      expect(subTrigger).toHaveAttribute("aria-haspopup", "menu")
      expect(subTrigger).toHaveAttribute("aria-controls", submenu.id)
      expect(subTrigger).toHaveAttribute("aria-expanded", "false")

      await user.keyboard("{ArrowDown}{ArrowRight}")
      expect(subTrigger).toHaveAttribute("aria-expanded", "true")
      expect(screen.getByRole("menuitem", { name: "Save page" })).toHaveFocus()

      await user.keyboard("{ArrowLeft}")
      expect(subTrigger).toHaveAttribute("aria-expanded", "false")
      expect(subTrigger).toHaveFocus()
    })

    test("arrow keys move through checkbox items in a submenu", async () => {
      const { user } = await render(dropdown(withSub))
      await openWithKeyboard(user)

      await user.keyboard("{ArrowDown}{ArrowRight}{ArrowDown}")
      expect(screen.getByRole("menuitemcheckbox", { name: "Developer mode" })).toHaveFocus()
      await user.keyboard("{ArrowDown}")
      expect(screen.getByRole("menuitemcheckbox", { name: "Reader mode" })).toHaveFocus()
      await user.keyboard("{ArrowDown}")
      expect(screen.getByRole("menuitem", { name: "Save page" })).toHaveFocus()
    })

    test("a flipped submenu (data-side=left) still closes with ArrowLeft and Escape", async () => {
      const { user } = await render(dropdown(withSub))
      await openWithKeyboard(user)
      await user.keyboard("{ArrowDown}{ArrowRight}")
      screen.getByRole("menu", { name: "More tools" }).setAttribute("data-side", "left")

      await user.keyboard("{Escape}")
      const subTrigger = screen.getByRole("menuitem", { name: "More tools" })
      expect(subTrigger).toHaveAttribute("aria-expanded", "false")
      expect(subTrigger).toHaveFocus()
      expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute("aria-expanded", "true")
    })

    test("a disabled sub trigger is skipped and doesn't open on hover", async () => {
      const { user } = await render(dropdown(withSub))
      await openWithKeyboard(user)
      await user.keyboard("{End}")
      expect(screen.getByRole("menuitem", { name: "More tools" })).toHaveFocus()

      const share = screen.getByRole("menuitem", { name: "Share" })
      await user.hover(share)
      expect(share).toHaveAttribute("aria-expanded", "false")
    })

    test("a text field in a submenu keeps Space, Home/End and ←/→", async () => {
      const { user } = await render(dropdown(item("New tab") + sub("Labels", `<input aria-label="Filter labels">` + item("Bug"))))
      await openWithKeyboard(user)
      await user.keyboard("{ArrowDown}{ArrowRight}")

      const input = screen.getByRole("textbox", { name: "Filter labels" })
      await user.click(input)
      await user.keyboard("a b{Home}x{End}{ArrowLeft}y")
      expect(input).toHaveValue("xa yb")
      expect(screen.getByRole("menu", { name: "Labels" })).toBeVisible()
    })
  })

  test("Escape closes only the dropdown when it sits on another layer", async () => {
    let outerClosed = false
    const outer = createEscapeLayer(() => { outerClosed = true })
    outer.activate()

    const { user } = await render(dropdown(basicItems))
    await openWithKeyboard(user)
    await user.keyboard("{Escape}")

    expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute("aria-expanded", "false")
    expect(outerClosed).toBe(false)
    outer.deactivate()
  })

  describe("trigger wrapping a button", () => {
    test("the inner button gets the menu-button ARIA and one Enter opens the menu", async () => {
      const { user } = await render(dropdown(basicItems, { triggerHtml: wrapperTrigger }))
      const button = screen.getByRole("button", { name: "Options" })

      expect(button).toHaveAttribute("aria-haspopup", "menu")
      expect(button).toHaveAttribute("aria-controls", screen.getByRole("menu", { hidden: true }).id)

      await openWithKeyboard(user, "Options")
      expect(button).toHaveAttribute("aria-expanded", "true")
      expect(screen.getByRole("menuitem", { name: "Profile" })).toHaveFocus()

      await user.keyboard("{Escape}")
      expect(button).toHaveFocus()
    })
  })

  test("a menu restored open from a Turbo snapshot starts closed and works", async () => {
    const { user } = await render(dropdown(basicItems, { state: "open", openValue: 'data-ui--dropdown-open-value="true"' }))
    const button = screen.getByRole("button", { name: "Open" })

    expect(screen.getByRole("menu", { hidden: true })).toHaveAttribute("data-state", "closed")
    expect(button).toHaveAttribute("aria-expanded", "false")

    await user.click(button)
    expect(screen.getByRole("menuitem", { name: "Profile" })).toHaveFocus()
  })
})
