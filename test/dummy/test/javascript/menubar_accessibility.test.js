// Menubar accessibility, black-box. Markup is what the ERB partials render
// (classes dropped, except `hidden` and the indicator span).
import { describe, test, expect, afterEach } from "bun:test"
import { screen, fireEvent } from "@testing-library/dom"
import { render, cleanup, settle } from "./support/render.js"

const ITEM_ACTION = "click->ui--menubar#selectItem mouseenter->ui--menubar#trackHoveredItem"
const disabledAttrs = 'data-disabled="" aria-disabled="true"'

const item = (label, { disabled = false } = {}) =>
  `<div data-ui--menubar-target="item" data-action="${ITEM_ACTION}" role="menuitem" tabindex="-1" ${disabled ? disabledAttrs : ""}>${label}</div>`

const checkbox = (label, checked = false) => `
  <div data-ui--menubar-target="item" data-action="${ITEM_ACTION}" data-state="${checked ? "checked" : "unchecked"}"
       role="menuitemcheckbox" aria-checked="${checked}" tabindex="-1"><span class="absolute left-2"></span>${label}</div>`

const sub = (label, inner, { disabled = false, side = "right" } = {}) => `
  <div>
    <div data-ui--menubar-target="item" data-action="mouseenter->ui--menubar#openSubmenu mouseleave->ui--menubar#closeSubmenu"
         data-state="closed" role="menuitem" aria-haspopup="menu" aria-expanded="false" tabindex="-1" ${disabled ? disabledAttrs : ""}>${label}</div>
    <div class="hidden" data-action="mouseenter->ui--menubar#cancelSubmenuClose" data-state="closed" data-side="${side}" data-align="start" role="menu" tabindex="-1">${inner}</div>
  </div>`

const menu = (label, items) => `
  <div data-ui--menubar-target="menu">
    <button data-ui--menubar-target="trigger" data-action="click->ui--menubar#toggle mouseenter->ui--menubar#handleTriggerHover keydown->ui--menubar#handleTriggerKeydown"
            data-state="closed" role="menuitem" aria-haspopup="menu" aria-expanded="false" tabindex="-1">${label}</button>
    <div class="hidden" data-ui--menubar-target="content" data-state="closed" data-side="bottom" data-align="start" role="menu" tabindex="-1">${items}</div>
  </div>`

const menubar = () => `
  <button type="button">Before</button>
  <div data-controller="ui--menubar" role="menubar">
    ${menu("File", item("New Tab") + item("New Window", { disabled: true }) + item("Print") +
      sub("Share", item("Email link") + item("Messages")) + sub("Export", item("PDF"), { disabled: true }))}
    ${menu("View", checkbox("Show bookmarks") + item("Reload") + item("Toggle fullscreen"))}
  </div>
  <button type="button">After</button>`

const trigger = name => screen.getByRole("menuitem", { name })
const menuOf = name => screen.getByRole("menu", { name, hidden: true })

const focusFile = () => {
  trigger("File").focus()
}

describe("Menubar accessibility", () => {
  afterEach(() => cleanup())

  test("triggers control their menus; menus are named by their trigger", async () => {
    await render(menubar())
    const file = trigger("File")
    expect(file).toHaveAttribute("aria-controls", menuOf("File").id)
    expect(menuOf("File")).toHaveAccessibleName("File")
    expect(menuOf("File").id).not.toBe(menuOf("View").id)
  })

  describe("focus on open", () => {
    test("Enter / ArrowDown on a trigger open its menu on the first item, ArrowUp on the last", async () => {
      const { user } = await render(menubar())
      focusFile()

      await user.keyboard("{Enter}")
      expect(trigger("File")).toHaveAttribute("aria-expanded", "true")
      expect(screen.getByRole("menuitem", { name: "New Tab" })).toHaveFocus()

      await user.keyboard("{Escape}")
      expect(trigger("File")).toHaveFocus()
      await user.keyboard("{ArrowUp}")
      expect(screen.getByRole("menuitem", { name: "Share" })).toHaveFocus()
    })

    test("a pointer click opens the menu with focus on the menu itself", async () => {
      const { user } = await render(menubar())
      await user.click(trigger("File"))

      expect(menuOf("File")).toHaveFocus()
      await user.keyboard("{ArrowDown}")
      expect(screen.getByRole("menuitem", { name: "New Tab" })).toHaveFocus()
    })

    test("a virtual click (screen reader, detail 0) opens the menu on its first item", async () => {
      await render(menubar())
      trigger("File").click()

      expect(trigger("File")).toHaveAttribute("aria-expanded", "true")
      expect(screen.getByRole("menuitem", { name: "New Tab" })).toHaveFocus()
    })

    test("←/→ in a menu open the neighbouring menu on its first item and move the tab stop", async () => {
      const { user } = await render(menubar())
      focusFile()
      await user.keyboard("{Enter}{ArrowRight}")

      expect(trigger("View")).toHaveAttribute("aria-expanded", "true")
      expect(trigger("File")).toHaveAttribute("aria-expanded", "false")
      expect(screen.getByRole("menuitemcheckbox", { name: "Show bookmarks" })).toHaveFocus()
      expect(trigger("View")).toHaveAttribute("tabindex", "0")
      expect(trigger("File")).toHaveAttribute("tabindex", "-1")

      await user.keyboard("{ArrowLeft}")
      expect(screen.getByRole("menuitem", { name: "New Tab" })).toHaveFocus()
    })
  })

  describe("focus restore", () => {
    test("selecting an item with the keyboard closes and focuses the trigger", async () => {
      const { user } = await render(menubar())
      focusFile()
      await user.keyboard("{Enter}{ArrowDown}{Enter}")

      expect(trigger("File")).toHaveAttribute("aria-expanded", "false")
      expect(trigger("File")).toHaveFocus()
    })

    test("clicking an item closes and focuses the trigger", async () => {
      const { user } = await render(menubar())
      await user.click(trigger("View"))
      await user.click(screen.getByRole("menuitem", { name: "Reload" }))

      expect(trigger("View")).toHaveAttribute("aria-expanded", "false")
      expect(trigger("View")).toHaveFocus()
      expect(trigger("View")).toHaveAttribute("tabindex", "0")
    })

    test("Tab closes the menu and puts focus back on its trigger before moving on", async () => {
      const { user } = await render(menubar())
      focusFile()
      await user.keyboard("{Enter}")

      fireEvent.keyDown(document.activeElement, { key: "Tab" })
      expect(trigger("File")).toHaveAttribute("aria-expanded", "false")
      expect(trigger("File")).toHaveFocus()
    })
  })

  describe("submenus", () => {
    test("sub triggers report and control their submenu", async () => {
      const { user } = await render(menubar())
      focusFile()
      await user.keyboard("{Enter}")
      const share = screen.getByRole("menuitem", { name: "Share" })

      expect(share).toHaveAttribute("aria-haspopup", "menu")
      expect(share).toHaveAttribute("aria-controls", menuOf("Share").id)

      await user.keyboard("{End}{ArrowRight}") // End = Share (Export is disabled)
      expect(share).toHaveAttribute("aria-expanded", "true")
      expect(screen.getByRole("menuitem", { name: "Email link" })).toHaveFocus()
    })

    test("a flipped submenu (data-side=left) still closes with ← and Escape", async () => {
      const { user } = await render(menubar())
      focusFile()
      await user.keyboard("{Enter}{End}{ArrowRight}")
      expect(screen.getByRole("menuitem", { name: "Email link" })).toHaveFocus()
      menuOf("Share").setAttribute("data-side", "left")

      await user.keyboard("{ArrowLeft}")
      const share = screen.getByRole("menuitem", { name: "Share" })
      expect(share).toHaveAttribute("aria-expanded", "false")
      expect(share).toHaveFocus()
      expect(trigger("File")).toHaveAttribute("aria-expanded", "true")

      await user.keyboard("{ArrowRight}")
      menuOf("Share").setAttribute("data-side", "left")
      await user.keyboard("{Escape}")
      expect(share).toHaveFocus()
      expect(menuOf("Share")).toHaveAttribute("data-state", "closed")
      expect(trigger("File")).toHaveAttribute("aria-expanded", "true")
    })

    test("a disabled sub trigger is announced, skipped and doesn't open on hover", async () => {
      const { user } = await render(menubar())
      await user.click(trigger("File"))
      const exportItem = screen.getByRole("menuitem", { name: "Export" })

      expect(exportItem).toHaveAttribute("aria-disabled", "true")
      await user.hover(exportItem)
      expect(exportItem).toHaveAttribute("aria-expanded", "false")
      expect(menuOf("Export")).toHaveAttribute("data-state", "closed")
    })
  })

  test("disabled items are skipped", async () => {
    const { user } = await render(menubar())
    focusFile()
    await user.keyboard("{Enter}{ArrowDown}")
    expect(screen.getByRole("menuitem", { name: "Print" })).toHaveFocus()
  })

  test("toggling a checkbox with the keyboard fires a click on it", async () => {
    const { user } = await render(menubar())
    let clicks = 0
    screen.getByRole("menuitemcheckbox", { name: "Show bookmarks", hidden: true }).addEventListener("click", () => clicks++)

    trigger("View").focus()
    await user.keyboard("{Enter} ")

    const bookmarks = screen.getByRole("menuitemcheckbox", { name: "Show bookmarks" })
    expect(bookmarks).toHaveAttribute("aria-checked", "true")
    expect(clicks).toBe(1)
  })

  test("typeahead moves to the next matching item", async () => {
    const { user } = await render(menubar())
    trigger("View").focus()
    await user.keyboard("{Enter}t")
    expect(screen.getByRole("menuitem", { name: "Toggle fullscreen" })).toHaveFocus()
    await settle(1100)
    await user.keyboard("r")
    expect(screen.getByRole("menuitem", { name: "Reload" })).toHaveFocus()
  })

  test("keys typed outside the menubar are left alone while a menu is open", async () => {
    const { user } = await render(menubar() + `<input aria-label="Notes">`)
    await user.click(trigger("File"))

    const notes = screen.getByRole("textbox", { name: "Notes" })
    const arrow = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true })
    notes.dispatchEvent(arrow)
    expect(arrow.defaultPrevented).toBe(false)
  })
})
