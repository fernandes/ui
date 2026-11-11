// Context Menu accessibility, black-box. Markup is what the ERB partials
// render (classes dropped, except `hidden`, which the controller toggles).
import { describe, test, expect, afterEach } from "bun:test"
import { screen, fireEvent } from "@testing-library/dom"
import { render, cleanup, settle } from "./support/render.js"
import { createEscapeLayer } from "../../../../app/javascript/ui/utils/escape-key-manager.js"

const ACTION = "click->ui--context-menu#select mouseenter->ui--context-menu#trackHoveredItem"
const disabledAttrs = 'data-disabled="true" aria-disabled="true"'

const item = (label, { disabled = false } = {}) =>
  `<div data-ui--context-menu-target="item" data-action="${ACTION}" role="menuitem" tabindex="-1" ${disabled ? disabledAttrs : ""}>${label}</div>`

const checkbox = (label, checked = false) => `
  <div data-ui--context-menu-target="item" data-action="${ACTION}" data-state="${checked ? "checked" : "unchecked"}"
       role="menuitemcheckbox" aria-checked="${checked}" tabindex="-1">
    <span class="pointer-events-none absolute left-2"></span>${label}
  </div>`

const radio = (label, checked = false) => `
  <div data-ui--context-menu-target="item" data-action="${ACTION}" data-state="${checked ? "checked" : "unchecked"}"
       role="menuitemradio" aria-checked="${checked}" tabindex="-1">
    <span class="pointer-events-none absolute left-2"></span>${label}
  </div>`

const contextMenu = (label, items) => `
  <div data-controller="ui--context-menu">
    <div data-action="contextmenu->ui--context-menu#open" data-ui--context-menu-target="trigger">
      ${label} area <button type="button">${label} target</button>
    </div>
    <div data-ui--context-menu-target="content" data-state="closed" role="menu" tabindex="-1" aria-label="${label} actions" class="hidden">
      ${items}
    </div>
  </div>`

const pageItems = item("Back") + item("Forward", { disabled: true }) + item("Reload") + item("Save as") +
  checkbox("Show bookmarks", true) + checkbox("Show full URLs") +
  `<div role="group">${radio("Pedro", true)}${radio("Colm")}</div>`

const openOn = async (user, label = "Page") => {
  await user.pointer({ keys: "[MouseRight]", target: screen.getByText(`${label} area`, { exact: false }) })
}

// The keyboard's context-menu key: a contextmenu event at 0,0 on the focused element
const openWithKeyboard = (label = "Page") => {
  const target = screen.getByRole("button", { name: `${label} target` })
  target.focus()
  fireEvent.contextMenu(target, { clientX: 0, clientY: 0 })
  return target
}

const menuFor = (label = "Page") => screen.getByRole("menu", { name: `${label} actions`, hidden: true })

describe("Context Menu accessibility", () => {
  afterEach(() => cleanup())

  test("right-click opens the named menu on its first item", async () => {
    const { user } = await render(contextMenu("Page", pageItems))
    await openOn(user)

    expect(menuFor()).toHaveAttribute("data-state", "open")
    expect(screen.getByRole("menuitem", { name: "Back" })).toHaveFocus()
  })

  describe("checkbox and radio items", () => {
    test("clicking a checkbox item toggles it and keeps the menu open", async () => {
      const { user } = await render(contextMenu("Page", pageItems))
      await openOn(user)

      const urls = screen.getByRole("menuitemcheckbox", { name: "Show full URLs" })
      await user.click(urls)
      expect(urls).toHaveAttribute("aria-checked", "true")
      expect(menuFor()).toHaveAttribute("data-state", "open")

      await user.click(urls)
      expect(urls).toHaveAttribute("aria-checked", "false")
    })

    test("Space toggles a checkbox and keeps the menu open; Enter toggles and closes", async () => {
      const { user } = await render(contextMenu("Page", pageItems))
      await openOn(user)

      await user.keyboard("{End}{ArrowUp}{ArrowUp}") // Pedro, then Show full URLs
      const urls = screen.getByRole("menuitemcheckbox", { name: "Show full URLs" })
      expect(urls).toHaveFocus()
      await user.keyboard(" ")
      expect(urls).toHaveAttribute("aria-checked", "true")
      expect(menuFor()).toHaveAttribute("data-state", "open")

      await user.keyboard("{Enter}")
      expect(urls).toHaveAttribute("aria-checked", "false")
      expect(menuFor()).toHaveAttribute("data-state", "closed")
    })

    test("selecting a radio item unchecks the others in its group", async () => {
      const { user } = await render(contextMenu("Page", pageItems))
      await openOn(user)

      await user.click(screen.getByRole("menuitemradio", { name: "Colm" }))
      expect(screen.getByRole("menuitemradio", { name: "Colm" })).toHaveAttribute("aria-checked", "true")
      expect(screen.getByRole("menuitemradio", { name: "Pedro" })).toHaveAttribute("aria-checked", "false")
    })
  })

  describe("closing", () => {
    test("focus leaving the menu closes it and its keys stop working page-wide", async () => {
      const { user } = await render(contextMenu("Page", pageItems) + `<input aria-label="Notes">`)
      let reloads = 0
      await openOn(user)
      screen.getByRole("menuitem", { name: "Save as" }).addEventListener("click", () => reloads++)

      const notes = screen.getByRole("textbox", { name: "Notes" })
      notes.focus()
      await settle()
      expect(menuFor()).toHaveAttribute("data-state", "closed")

      const arrow = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true })
      notes.dispatchEvent(arrow)
      expect(arrow.defaultPrevented).toBe(false)
      await user.keyboard("{Enter}")
      expect(reloads).toBe(0)
    })

    test("opening a second context menu closes the first", async () => {
      const { user } = await render(contextMenu("Page", pageItems) + contextMenu("Image", item("Copy image")))
      await openOn(user, "Page")
      await openOn(user, "Image")

      expect(menuFor("Page")).toHaveAttribute("data-state", "closed")
      expect(menuFor("Image")).toHaveAttribute("data-state", "open")
      expect(screen.getByRole("menuitem", { name: "Copy image" })).toHaveFocus()

      await user.keyboard("{Escape}")
      expect(menuFor("Image")).toHaveAttribute("data-state", "closed")
    })

    test("a left click or a right-click outside the menu closes it", async () => {
      const { user } = await render(contextMenu("Page", pageItems) + `<p>Elsewhere</p>`)
      await openOn(user)
      await user.pointer({ keys: "[MouseRight]", target: screen.getByText("Elsewhere") })
      expect(menuFor()).toHaveAttribute("data-state", "closed")

      await openOn(user)
      await user.click(screen.getByText("Page area", { exact: false }))
      expect(menuFor()).toHaveAttribute("data-state", "closed")
    })

    test("clicking an item closes the menu", async () => {
      const { user } = await render(contextMenu("Page", pageItems))
      await openOn(user)
      await user.click(screen.getByRole("menuitem", { name: "Reload" }))
      expect(menuFor()).toHaveAttribute("data-state", "closed")
    })
  })

  describe("focus restore", () => {
    test("Escape returns focus to the element the menu was opened from", async () => {
      const { user } = await render(contextMenu("Page", pageItems))
      const target = openWithKeyboard()
      expect(screen.getByRole("menuitem", { name: "Back" })).toHaveFocus()

      await user.keyboard("{Escape}")
      expect(menuFor()).toHaveAttribute("data-state", "closed")
      expect(target).toHaveFocus()
    })

    test("selecting an item with the keyboard returns focus too", async () => {
      const { user } = await render(contextMenu("Page", pageItems))
      const target = openWithKeyboard()

      await user.keyboard("{ArrowDown}{Enter}")
      expect(menuFor()).toHaveAttribute("data-state", "closed")
      expect(target).toHaveFocus()
    })

    test("Escape closes only the context menu when it sits on another layer", async () => {
      let outerClosed = false
      const outer = createEscapeLayer(() => { outerClosed = true })
      outer.activate()
      const { user } = await render(contextMenu("Page", pageItems))
      openWithKeyboard()

      await user.keyboard("{Escape}")
      expect(menuFor()).toHaveAttribute("data-state", "closed")
      expect(outerClosed).toBe(false)
      outer.deactivate()
    })
  })

  test("disabled items are skipped and announced", async () => {
    const { user } = await render(contextMenu("Page", pageItems))
    await openOn(user)

    expect(screen.getByRole("menuitem", { name: "Forward" })).toHaveAttribute("aria-disabled", "true")
    await user.keyboard("{ArrowDown}")
    expect(screen.getByRole("menuitem", { name: "Reload" })).toHaveFocus()
  })

  test("typeahead moves to the next matching item", async () => {
    const { user } = await render(contextMenu("Page", pageItems))
    await openOn(user)

    await user.keyboard("s")
    expect(screen.getByRole("menuitem", { name: "Save as" })).toHaveFocus()
    await user.keyboard("s")
    expect(screen.getByRole("menuitemcheckbox", { name: "Show bookmarks" })).toHaveFocus()
  })
})
