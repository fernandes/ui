// Select accessibility, black-box. Markup is what UI::Select* renders (classes
// and the check icon's path dropped): options have no ids, the listbox has no
// id, the group label is not linked. The controller wires all of that.
//
// Design: like Radix Select, DOM focus moves onto the highlighted option
// (tabindex=-1), so screen readers announce it without relying on
// aria-activedescendant support on a button.
import { describe, test, expect, afterEach } from "bun:test"
import { screen } from "@testing-library/dom"
import { render, cleanup, settle } from "./support/render.js"
import { createEscapeLayer } from "../../../../app/javascript/ui/utils/escape-key-manager.js"

const option = (value, label, { disabled = false } = {}) => `
  <div role="option" aria-selected="false" data-ui--select-target="item" data-action="click->ui--select#selectItem mouseenter->ui--select#handleItemMouseEnter mouseleave->ui--select#handleItemMouseLeave" data-value="${value}" data-slot="select-item"${disabled ? ' data-disabled="true" aria-disabled="true" data-state="disabled"' : ""}>
    <span class="flex-1">${label}</span>
    <svg data-ui--select-target="itemCheck" class="opacity-0"></svg>
  </div>`

const selectMarkup = ({ value = "", triggerKeys = true } = {}) => `
  <label for="fruit">Fruit</label>
  <div data-controller="ui--select" data-ui--select-open-value="false"${value ? ` data-ui--select-value-value="${value}"` : ""}>
    <button type="button" role="combobox" aria-expanded="false" aria-haspopup="listbox" id="fruit" data-ui--select-target="trigger" data-action="click->ui--select#toggle${triggerKeys ? " keydown->ui--select#handleTriggerKeydown" : ""}" data-slot="select-trigger">
      <span data-ui--select-target="valueDisplay">Select a fruit</span>
    </button>
    <div data-ui--select-target="content" data-state="closed" data-slot="select-content" role="listbox">
      <div data-ui--select-target="viewport">
        <div role="group" data-slot="select-group">
          <div data-slot="select-label">Fruits</div>
          ${option("apple", "Apple")}
          ${option("banana", "Banana")}
          ${option("blueberry", "Blueberry", { disabled: true })}
          ${option("cherry", "Cherry")}
          ${option("coconut", "Coconut")}
        </div>
      </div>
    </div>
  </div>
  <button type="button">After</button>`

const trigger = () => screen.getByRole("combobox", { name: /Fruit/ })

async function openWithKeyboard(user, key = "{ArrowDown}") {
  trigger().focus()
  await user.keyboard(key)
  await settle()
}

describe("Select accessibility", () => {
  afterEach(() => cleanup())

  describe("relationships", () => {
    test("trigger controls the listbox", async () => {
      await render(selectMarkup())

      const listbox = screen.getByRole("listbox", { hidden: true })
      expect(listbox.id).not.toBe("")
      expect(trigger()).toHaveAttribute("aria-controls", listbox.id)
    })

    test("a <label for> names the trigger", async () => {
      await render(selectMarkup())

      expect(trigger()).toHaveAccessibleName("Fruit")
    })

    test("a group is named by its label", async () => {
      await render(selectMarkup())

      expect(screen.getByRole("group", { hidden: true })).toHaveAccessibleName("Fruits")
    })

    test("option ids are unique across two selects", async () => {
      await render(selectMarkup() + selectMarkup().replace('id="fruit"', 'id="fruit-2"'))

      const ids = screen.getAllByRole("option", { hidden: true }).map((o) => o.id)
      expect(ids.every(Boolean)).toBe(true)
      expect(new Set(ids).size).toBe(ids.length)
    })
  })

  describe("highlighted option is exposed", () => {
    test("opening moves focus to the first option", async () => {
      const { user } = await render(selectMarkup())

      await user.click(trigger())
      await settle()

      expect(screen.getByRole("option", { name: "Apple" })).toHaveFocus()
    })

    test("opening focuses the selected option", async () => {
      const { user } = await render(selectMarkup({ value: "cherry" }))

      await user.click(trigger())
      await settle()

      expect(screen.getByRole("option", { name: "Cherry" })).toHaveFocus()
    })

    test("arrow keys move focus between options and skip disabled ones", async () => {
      const { user } = await render(selectMarkup())

      await user.click(trigger())
      await settle()
      await user.keyboard("{ArrowDown}")
      expect(screen.getByRole("option", { name: "Banana" })).toHaveFocus()

      await user.keyboard("{ArrowDown}")
      expect(screen.getByRole("option", { name: "Cherry" })).toHaveFocus()
    })

    test("Enter selects the focused option and returns focus to the trigger", async () => {
      const { user } = await render(selectMarkup())

      await user.click(trigger())
      await settle()
      await user.keyboard("{ArrowDown}{Enter}")

      expect(trigger()).toHaveFocus()
      expect(trigger()).toHaveAttribute("aria-expanded", "false")
      expect(trigger()).toHaveTextContent("Banana")
    })
  })

  describe("closed trigger keys", () => {
    test("ArrowDown opens the listbox", async () => {
      const { user } = await render(selectMarkup())

      await openWithKeyboard(user, "{ArrowDown}")

      expect(trigger()).toHaveAttribute("aria-expanded", "true")
      expect(screen.getByRole("option", { name: "Apple" })).toHaveFocus()
    })

    test("ArrowUp opens the listbox", async () => {
      const { user } = await render(selectMarkup())

      await openWithKeyboard(user, "{ArrowUp}")

      expect(trigger()).toHaveAttribute("aria-expanded", "true")
    })

    test("typing on the closed trigger selects the matching option", async () => {
      const { user } = await render(selectMarkup())

      trigger().focus()
      await user.keyboard("c")

      expect(trigger()).toHaveTextContent("Cherry")
      expect(trigger()).toHaveAttribute("aria-expanded", "false")
    })
  })

  describe("typeahead while open", () => {
    test("typing a letter focuses the next matching option", async () => {
      const { user } = await render(selectMarkup())

      await openWithKeyboard(user)
      await user.keyboard("c")

      expect(screen.getByRole("option", { name: "Cherry" })).toHaveFocus()
    })

    test("typeahead skips disabled options", async () => {
      const { user } = await render(selectMarkup())

      await openWithKeyboard(user)
      await user.keyboard("bl")

      // Blueberry is disabled; focus stays where it was
      expect(screen.getByRole("option", { name: "Blueberry" })).not.toHaveFocus()
    })

    test("repeating a letter cycles through matches", async () => {
      const { user } = await render(selectMarkup())

      await openWithKeyboard(user)
      await user.keyboard("c")
      expect(screen.getByRole("option", { name: "Cherry" })).toHaveFocus()

      await user.keyboard("c")
      expect(screen.getByRole("option", { name: "Coconut" })).toHaveFocus()

      await user.keyboard("c")
      expect(screen.getByRole("option", { name: "Cherry" })).toHaveFocus()
    })
  })

  describe("closing", () => {
    test("Tab closes the listbox", async () => {
      const { user } = await render(selectMarkup())

      await openWithKeyboard(user)
      await user.tab()

      expect(trigger()).toHaveAttribute("aria-expanded", "false")
      expect(screen.getByRole("listbox", { hidden: true })).toHaveAttribute("data-state", "closed")
    })

    test("Escape closes only the select, not a layer beneath it", async () => {
      const { user } = await render(selectMarkup())
      let outerClosed = false
      // The layer of a dialog the select lives in
      createEscapeLayer(() => { outerClosed = true }).activate()

      await openWithKeyboard(user)
      await user.keyboard("{Escape}")

      expect(trigger()).toHaveAttribute("aria-expanded", "false")
      expect(trigger()).toHaveFocus()
      expect(outerClosed).toBe(false)
    })
  })
})
