// Command Dialog accessibility, black-box. Markup is what the Phlex component
// renders (classes and the icon dropped). Tab order and real inertness are
// covered by the Playwright system test.
import { describe, test, expect, afterEach } from "bun:test"
import { screen } from "@testing-library/dom"
import { render, cleanup, settle } from "./support/render.js"

const markup = ({ autofocus = true } = {}) => `
  <button type="button">Before</button>
  <div data-controller="ui--command-dialog" data-ui--command-dialog-shortcut-value="meta+j" data-action="keydown.meta+j@document->ui--command-dialog#toggle">
    <div data-controller="ui--dialog" data-ui--dialog-open-value="false" data-ui--dialog-close-on-escape-value="true" data-ui--dialog-close-on-overlay-click-value="true">
      <div data-state="closed" data-ui--dialog-target="container">
        <div data-state="closed" data-ui--dialog-target="overlay" data-action="click->ui--dialog#closeOnOverlayClick"></div>
        <div role="dialog" aria-modal="true" data-state="closed" data-ui--dialog-target="content" inert>
          <div>
            <h2 data-ui--dialog-target="title">Command Palette</h2>
            <p data-ui--dialog-target="description">Search for a command to run...</p>
          </div>
          <div data-controller="ui--command" data-slot="command" data-ui--command-loop-value="true" data-ui--command-autofocus-value="${autofocus}">
            <div>
              <input data-slot="command-input" data-ui--command-target="input" data-action="input->ui--command#filter keydown->ui--command#handleKeydown" type="text" placeholder="Type a command..." aria-label="Search commands" role="combobox" aria-expanded="true" aria-autocomplete="list">
            </div>
            <div data-slot="command-list" data-ui--command-target="list" role="listbox" tabindex="-1">
              <div data-slot="command-item" data-ui--command-target="item" data-action="click->ui--command#select" data-value="calendar" role="option" aria-selected="false">Calendar</div>
            </div>
            <a href="#settings">Settings</a>
          </div>
        </div>
      </div>
    </div>
  </div>`

const open = async user => {
  await user.click(screen.getByRole("button", { name: "Before" }))
  await user.keyboard("{Meta>}j{/Meta}")
  await settle()
}

describe("Command Dialog accessibility", () => {
  afterEach(() => cleanup())

  test("the palette is named and described (sr-only title/description, like shadcn)", async () => {
    await render(markup())

    const dialog = screen.getByRole("dialog", { hidden: true })
    expect(dialog).toHaveAccessibleName("Command Palette")
    expect(dialog).toHaveAccessibleDescription("Search for a command to run...")
  })

  test("the shortcut opens it with focus in the search input", async () => {
    const { user } = await render(markup())

    await open(user)

    expect(screen.getByRole("combobox", { name: "Search commands" })).toHaveFocus()
  })

  test("closing returns focus to where it was before opening", async () => {
    const { user } = await render(markup())

    await open(user)
    await user.keyboard("{Escape}")

    expect(screen.getByRole("button", { name: "Before" })).toHaveFocus()
  })

  test("toggling with the shortcut closes it and restores focus too", async () => {
    const { user } = await render(markup())

    await open(user)
    await user.keyboard("{Meta>}j{/Meta}")

    expect(screen.getByRole("dialog", { hidden: true })).toHaveAttribute("data-state", "closed")
    expect(screen.getByRole("button", { name: "Before" })).toHaveFocus()
  })

  test("moving focus to another element inside the palette doesn't close it", async () => {
    const { user } = await render(markup())

    await open(user)
    screen.getByRole("link", { name: "Settings", hidden: true }).focus()
    // Focus briefly leaving (e.g. Tab past the end before the trap wraps it)
    document.body.focus()
    await settle()

    expect(screen.getByRole("dialog", { hidden: true })).toHaveAttribute("data-state", "open")
  })

  test("the page behind is inert while it is open", async () => {
    const { user } = await render(markup())

    await open(user)
    expect(screen.getByRole("button", { name: "Before", hidden: true }).closest("[inert]")).not.toBeNull()
  })

  test("closing clears the search", async () => {
    const { user } = await render(markup())

    await open(user)
    await user.type(screen.getByRole("combobox"), "cal")
    await user.keyboard("{Escape}")

    expect(screen.getByRole("combobox", { hidden: true })).toHaveValue("")
  })
})
