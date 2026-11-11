// Combobox accessibility, black-box. Markup is what the showcase renders: a
// Popover carrying the combobox controller, a Button trigger (as_child) and a
// Command list inside the popover content (classes and icons dropped).
import { describe, test, expect, afterEach } from "bun:test"
import { screen } from "@testing-library/dom"
import { render, cleanup, settle } from "./support/render.js"

const item = (value, label) => `
  <div data-slot="command-item" data-ui--command-target="item" data-action="click->ui--command#select pointermove->ui--command#highlight" data-value="${value}" data-ui--combobox-target="item" role="option" aria-selected="false"><span>${label}</span><svg class="ml-auto h-4 w-4 opacity-0"></svg></div>`

const comboboxMarkup = `
  <div data-controller="ui--popover ui--combobox" data-ui--combobox-value-value="">
    <button type="button" data-ui--popover-target="trigger">
      <span data-ui--combobox-target="text">Select framework...</span>
    </button>
    <div data-ui--popover-target="content" data-state="closed">
      <div data-controller="ui--command" data-slot="command" data-ui--command-loop-value="true" data-ui--command-autofocus-value="false">
        <div><input data-slot="command-input" data-ui--command-target="input" data-action="input->ui--command#filter keydown->ui--command#handleKeydown" type="text" placeholder="Search framework..." autocomplete="off" role="combobox" aria-expanded="true" aria-autocomplete="list"></div>
        <div data-slot="command-list" data-ui--command-target="list" role="listbox" tabindex="-1">
          <div data-slot="command-empty" data-ui--command-target="empty" class="hidden" role="status" aria-live="polite">No framework found.</div>
          <div data-slot="command-group" data-ui--command-target="group" role="group">
            ${item("next", "Next.js")}
            ${item("remix", "Remix")}
          </div>
        </div>
      </div>
    </div>
  </div>
  <button type="button">Elsewhere</button>`

const trigger = () => document.querySelector('[data-ui--popover-target="trigger"]')
const content = () => document.querySelector('[data-ui--popover-target="content"]')

async function open(user) {
  await user.click(trigger())
  await settle(20)
}

describe("Combobox accessibility", () => {
  afterEach(() => cleanup())

  describe("trigger semantics", () => {
    test("the trigger is a collapsed combobox that controls the list", async () => {
      await render(comboboxMarkup)

      const button = trigger()
      expect(button).toHaveAttribute("role", "combobox")
      expect(button).toHaveAttribute("aria-expanded", "false")
      expect(button).toHaveAttribute("aria-controls", screen.getByRole("listbox", { hidden: true }).id)
    })

    test("aria-expanded follows the popover", async () => {
      const { user } = await render(comboboxMarkup)

      await open(user)
      expect(trigger()).toHaveAttribute("aria-expanded", "true")

      await user.keyboard("{Escape}")
      await settle(150)
      expect(trigger()).toHaveAttribute("aria-expanded", "false")
    })
  })

  describe("selecting", () => {
    test("opening focuses the search input", async () => {
      const { user } = await render(comboboxMarkup)

      await open(user)

      expect(screen.getByPlaceholderText("Search framework...")).toHaveFocus()
    })

    test("Enter on an item selects it and returns focus to the trigger", async () => {
      const { user } = await render(comboboxMarkup)

      await open(user)
      // Opening highlights the first item
      await user.keyboard("{ArrowDown}{Enter}")
      await settle(150)

      expect(content()).toHaveAttribute("data-state", "closed")
      expect(trigger()).toHaveTextContent("Remix")
      expect(trigger()).toHaveFocus()
    })

    test("clicking an item returns focus to the trigger", async () => {
      const { user } = await render(comboboxMarkup)

      await open(user)
      await user.click(screen.getByRole("option", { name: "Next.js" }))
      await settle(150)

      expect(trigger()).toHaveTextContent("Next.js")
      expect(trigger()).toHaveFocus()
    })
  })
})
