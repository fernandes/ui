// Command accessibility, black-box. Markup is what UI::Command* renders
// (classes dropped): a disabled item carries `data-disabled=""` (empty!) and
// `aria-disabled="true"`, items have no ids and the group heading is a part the
// controller links, not a server-generated id.
import { describe, test, expect, afterEach } from "bun:test"
import { screen } from "@testing-library/dom"
import { render, cleanup } from "./support/render.js"

const item = (value, label, { disabled = false } = {}) => `
  <div data-slot="command-item" data-ui--command-target="item" data-action="click->ui--command#select pointermove->ui--command#highlight" data-value="${value}" role="option" aria-selected="false"${disabled ? ' data-disabled="" aria-disabled="true"' : ""}>${label}</div>`

const commandMarkup = ({ items } = {}) => `
  <div data-controller="ui--command" data-slot="command" data-ui--command-loop-value="true" data-ui--command-autofocus-value="false">
    <div>
      <input data-slot="command-input" data-ui--command-target="input" data-action="input->ui--command#filter keydown->ui--command#handleKeydown" type="text" placeholder="Search..." autocomplete="off" role="combobox" aria-expanded="true" aria-autocomplete="list">
    </div>
    <div data-slot="command-list" data-ui--command-target="list" role="listbox" tabindex="-1">
      <div data-slot="command-empty" data-ui--command-target="empty" class="hidden" role="status" aria-live="polite">No results found.</div>
      <div data-slot="command-group" data-ui--command-target="group" role="group">
        <div data-slot="command-group-heading">Suggestions</div>
        ${items || [
          item("calendar", "Calendar"),
          item("emoji", "Search Emoji", { disabled: true }),
          item("calculator", "Calculator")
        ].join("")}
      </div>
    </div>
  </div>`

const selections = () => {
  const values = []
  document.addEventListener("command:select", (event) => values.push(event.detail.value))
  return values
}

describe("Command accessibility", () => {
  afterEach(() => cleanup())

  describe("disabled items", () => {
    test("arrow keys skip a disabled item", async () => {
      const { user } = await render(commandMarkup())
      const input = screen.getByRole("combobox")

      await user.click(input)
      await user.keyboard("{ArrowDown}{ArrowDown}")

      const calculator = screen.getByRole("option", { name: "Calculator" })
      expect(calculator).toHaveAttribute("aria-selected", "true")
      expect(screen.getByRole("option", { name: "Search Emoji" })).toHaveAttribute("aria-selected", "false")
    })

    test("Enter never selects a disabled item", async () => {
      const { user } = await render(commandMarkup())
      const values = selections()
      const input = screen.getByRole("combobox")

      await user.click(input)
      await user.type(input, "emoji")
      await user.keyboard("{Enter}")

      expect(values).toEqual([])
    })

    test("clicking a disabled item does nothing", async () => {
      const { user } = await render(commandMarkup())
      const values = selections()
      const emoji = screen.getByRole("option", { name: "Search Emoji" })

      // pointer-events-none in CSS, but a script or AT can still click it
      await user.click(emoji, { pointerEventsCheck: 0 })

      expect(values).toEqual([])
    })

    test("disabled items are exposed as disabled", async () => {
      await render(commandMarkup())

      expect(screen.getByRole("option", { name: "Search Emoji" })).toHaveAttribute("aria-disabled", "true")
    })
  })

  describe("active descendant", () => {
    test("the input points at the highlighted option", async () => {
      const { user } = await render(commandMarkup())
      const input = screen.getByRole("combobox")

      await user.click(input)
      await user.keyboard("{ArrowDown}")

      const calendar = screen.getByRole("option", { name: "Calendar" })
      expect(calendar.id).not.toBe("")
      expect(input).toHaveAttribute("aria-activedescendant", calendar.id)
      expect(input).toHaveFocus()

      await user.keyboard("{ArrowDown}")
      const calculator = screen.getByRole("option", { name: "Calculator" })
      expect(input).toHaveAttribute("aria-activedescendant", calculator.id)
    })

    test("the list does not carry aria-activedescendant", async () => {
      const { user } = await render(commandMarkup())

      await user.click(screen.getByRole("combobox"))
      await user.keyboard("{ArrowDown}")

      expect(screen.getByRole("listbox")).not.toHaveAttribute("aria-activedescendant")
    })

    test("no highlighted option means no active descendant", async () => {
      const { user } = await render(commandMarkup())
      const input = screen.getByRole("combobox")

      await user.type(input, "zzz")

      expect(input).not.toHaveAttribute("aria-activedescendant")
    })

    test("item ids are unique across two commands", async () => {
      await render(commandMarkup() + commandMarkup())

      const ids = screen.getAllByRole("option").map((option) => option.id)
      expect(ids.every(Boolean)).toBe(true)
      expect(new Set(ids).size).toBe(ids.length)
    })

    test("an id the author rendered on an item is kept", async () => {
      await render(commandMarkup({ items: item("calendar", "Calendar").replace('role="option"', 'id="my-item" role="option"') }))

      expect(screen.getByRole("option", { name: "Calendar" })).toHaveAttribute("id", "my-item")
    })
  })

  describe("relationships", () => {
    test("the input controls the list", async () => {
      await render(commandMarkup())

      const list = screen.getByRole("listbox")
      expect(list.id).not.toBe("")
      expect(screen.getByRole("combobox")).toHaveAttribute("aria-controls", list.id)
    })

    test("the list has an accessible name", async () => {
      await render(commandMarkup())

      expect(screen.getByRole("listbox")).toHaveAccessibleName("Suggestions")
    })

    test("a group is named by its heading", async () => {
      await render(commandMarkup())

      expect(screen.getByRole("group")).toHaveAccessibleName("Suggestions")
    })
  })

  describe("empty state", () => {
    test("is a polite live region shown when nothing matches", async () => {
      const { user } = await render(commandMarkup())

      await user.type(screen.getByRole("combobox"), "zzz")

      const status = screen.getByRole("status")
      expect(status).toHaveTextContent("No results found.")
      expect(status).not.toHaveClass("hidden")
    })
  })

  describe("inside a drawer", () => {
    // The Drawer announces itself with drawer:open / drawer:close on its root
    test("opening the drawer highlights the first option, closing resets the search", async () => {
      const { user } = await render(`<div data-testid="drawer">${commandMarkup()}</div>`)
      const drawer = screen.getByTestId("drawer")
      const input = screen.getByRole("combobox")

      drawer.dispatchEvent(new CustomEvent("drawer:open", { bubbles: true }))
      expect(screen.getByRole("option", { name: "Calendar" })).toHaveAttribute("aria-selected", "true")

      await user.type(input, "calc")
      drawer.dispatchEvent(new CustomEvent("drawer:close", { bubbles: true }))
      expect(input).toHaveValue("")
    })
  })

  describe("pointer", () => {
    test("hovering an option highlights it", async () => {
      const { user } = await render(commandMarkup())
      const calculator = screen.getByRole("option", { name: "Calculator" })

      await user.hover(calculator)

      expect(calculator).toHaveAttribute("aria-selected", "true")
      expect(screen.getByRole("combobox")).toHaveAttribute("aria-activedescendant", calculator.id)
    })

    test("hovering a disabled option does not highlight it", async () => {
      const { user } = await render(commandMarkup())
      const emoji = screen.getByRole("option", { name: "Search Emoji" })

      await user.hover(emoji, { pointerEventsCheck: 0 })

      expect(emoji).toHaveAttribute("aria-selected", "false")
    })
  })
})
