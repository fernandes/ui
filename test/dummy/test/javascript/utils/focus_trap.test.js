import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import userEvent from "@testing-library/user-event"
import { screen } from "@testing-library/dom"
import {
  isTabbable,
  getTabbableElements,
  focusInitial,
  focusFirstElement,
  createFocusTrap
} from "../../../../../app/javascript/ui/utils/focus-trap-manager.js"

describe("focus trap manager", () => {
  let user
  let traps

  beforeEach(() => {
    user = userEvent.setup({ document })
    traps = []
  })

  afterEach(() => {
    traps.forEach(trap => trap.deactivate())
    document.body.innerHTML = ""
  })

  function trap(container) {
    const created = createFocusTrap(container)
    traps.push(created)
    return created
  }

  describe("tabbable detection", () => {
    test("skips the authenticity token and everything Tab can't reach", () => {
      document.body.innerHTML = `
        <form>
          <input type="hidden" name="authenticity_token" value="x">
          <button disabled>Disabled</button>
          <button tabindex="-1">Programmatic</button>
          <div hidden><button>In hidden</button></div>
          <div inert><button>In inert</button></div>
          <div style="display: none"><button>Not rendered</button></div>
          <button style="visibility: hidden">Invisible</button>
          <fieldset disabled><input aria-label="In disabled fieldset"></fieldset>
          <a>No href</a>
          <input aria-label="Name">
          <a href="#">Link</a>
          <div tabindex="0">Focusable div</div>
          <button>Save</button>
        </form>`

      const names = getTabbableElements(document.querySelector("form"))
        .map(el => el.getAttribute("aria-label") || el.textContent.trim())

      expect(names).toEqual(["Name", "Link", "Focusable div", "Save"])
    })

    test("isTabbable on single elements", () => {
      document.body.innerHTML = `<input type="hidden"><input type="text"><span>plain</span>`
      const [hidden, text] = document.querySelectorAll("input")

      expect(isTabbable(hidden)).toBe(false)
      expect(isTabbable(text)).toBe(true)
      expect(isTabbable(document.querySelector("span"))).toBe(false)
    })
  })

  describe("focusInitial", () => {
    test("lands on the first field, not the hidden authenticity token", () => {
      document.body.innerHTML = `
        <div role="dialog">
          <form>
            <input type="hidden" name="authenticity_token" value="x">
            <input aria-label="Name">
          </form>
        </div>`

      focusInitial(screen.getByRole("dialog"))

      expect(screen.getByRole("textbox", { name: "Name" })).toHaveFocus()
    })

    test("prefers the preferred element, then [autofocus]", () => {
      document.body.innerHTML = `
        <div role="dialog">
          <button>First</button>
          <button autofocus>Autofocus</button>
          <button>Cancel</button>
        </div>`
      const dialog = screen.getByRole("dialog")

      focusInitial(dialog, { preferredElement: () => screen.getByRole("button", { name: "Cancel" }) })
      expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus()

      focusInitial(dialog)
      expect(screen.getByRole("button", { name: "Autofocus" })).toHaveFocus()
    })

    test("ignores a preferred element outside the container", () => {
      document.body.innerHTML = `<button>Outside</button><div role="dialog"><button>Inside</button></div>`

      focusInitial(screen.getByRole("dialog"), { preferredElement: screen.getByRole("button", { name: "Outside" }) })

      expect(screen.getByRole("button", { name: "Inside" })).toHaveFocus()
    })

    test("falls back to the container itself when nothing inside is tabbable", () => {
      document.body.innerHTML = `<div role="dialog"><p>Only text</p></div>`
      const dialog = screen.getByRole("dialog")

      expect(focusInitial(dialog)).toBe(dialog)
      expect(dialog).toHaveFocus()
      expect(dialog).toHaveAttribute("tabindex", "-1")
    })

    test("focusFirstElement (legacy) uses the same rules", () => {
      document.body.innerHTML = `<div role="dialog"><input type="hidden"><button>Ok</button></div>`

      focusFirstElement(screen.getByRole("dialog"))

      expect(screen.getByRole("button", { name: "Ok" })).toHaveFocus()
    })
  })

  describe("createFocusTrap", () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <button>Before</button>
        <div role="dialog" aria-label="Outer">
          <input type="hidden" name="authenticity_token">
          <button>First</button>
          <button>Last</button>
          <div role="dialog" aria-label="Inner">
            <button>Inner one</button>
            <button>Inner two</button>
          </div>
        </div>
        <button>After</button>`
    })

    test("Tab from the last element wraps to the first", async () => {
      const outer = screen.getByRole("dialog", { name: "Outer" })
      outer.querySelector("[aria-label=Inner]").remove()
      trap(outer).activate()

      screen.getByRole("button", { name: "Last" }).focus()
      await user.tab()

      expect(screen.getByRole("button", { name: "First" })).toHaveFocus()
    })

    test("Shift+Tab from the first element wraps to the last", async () => {
      const outer = screen.getByRole("dialog", { name: "Outer" })
      outer.querySelector("[aria-label=Inner]").remove()
      trap(outer).activate()

      screen.getByRole("button", { name: "First" }).focus()
      await user.tab({ shift: true })

      expect(screen.getByRole("button", { name: "Last" })).toHaveFocus()
    })

    test("Shift+Tab from the focused container goes to the last element", async () => {
      const outer = screen.getByRole("dialog", { name: "Outer" })
      outer.querySelector("[aria-label=Inner]").remove()
      outer.setAttribute("tabindex", "-1")
      trap(outer).activate()

      outer.focus()
      await user.tab({ shift: true })

      expect(screen.getByRole("button", { name: "Last" })).toHaveFocus()
    })

    test("with nothing tabbable, focus stays on the container", async () => {
      document.body.innerHTML = `<button>Before</button><div role="dialog" tabindex="-1"><p>Text</p></div>`
      const dialog = screen.getByRole("dialog")
      trap(dialog).activate()

      dialog.focus()
      await user.tab()

      expect(dialog).toHaveFocus()
    })

    test("only the topmost trap acts, and the outer one resumes when it ends", async () => {
      const outer = trap(screen.getByRole("dialog", { name: "Outer" }))
      const inner = trap(screen.getByRole("dialog", { name: "Inner" }))
      outer.activate()
      inner.activate()

      screen.getByRole("button", { name: "Inner two" }).focus()
      await user.tab()
      expect(screen.getByRole("button", { name: "Inner one" })).toHaveFocus()

      inner.deactivate()
      screen.getByRole("button", { name: "Inner two" }).focus()
      await user.tab()
      expect(screen.getByRole("button", { name: "First" })).toHaveFocus()
    })

    test("after deactivate Tab leaves the container normally", async () => {
      const outer = screen.getByRole("dialog", { name: "Outer" })
      outer.querySelector("[aria-label=Inner]").remove()
      const t = trap(outer)
      t.activate()
      t.deactivate()
      expect(t.isActive()).toBe(false)

      screen.getByRole("button", { name: "Last" }).focus()
      await user.tab()

      expect(screen.getByRole("button", { name: "After" })).toHaveFocus()
    })
  })
})
