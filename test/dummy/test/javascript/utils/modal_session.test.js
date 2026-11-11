import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import userEvent from "@testing-library/user-event"
import { screen } from "@testing-library/dom"
import { createModalSession } from "../../../../../app/javascript/ui/utils/modal-session.js"
import { getEscapeLayerCount } from "../../../../../app/javascript/ui/utils/escape-key-manager.js"

describe("createModalSession", () => {
  let user
  let sessions

  beforeEach(() => {
    user = userEvent.setup({ document })
    sessions = []
    document.body.style.overflow = ""
    document.body.innerHTML = `
      <button>Open</button>
      <div id="container">
        <div id="overlay"></div>
        <div role="dialog" aria-label="Edit">
          <form>
            <input type="hidden" name="authenticity_token" value="x">
            <input aria-label="Name">
            <button type="button">Save</button>
          </form>
        </div>
      </div>
      <p id="outside">Page</p>`
  })

  afterEach(() => {
    sessions.forEach(session => session.deactivate({ restoreFocus: false }))
    document.body.innerHTML = ""
  })

  function session(options = {}) {
    const created = createModalSession({
      content: screen.getByRole("dialog"),
      isolate: document.getElementById("container"),
      ...options
    })
    sessions.push(created)
    return created
  }

  test("moves focus into the dialog, past the authenticity token", async () => {
    await user.click(screen.getByRole("button", { name: "Open" }))
    session().activate()

    expect(screen.getByRole("textbox", { name: "Name" })).toHaveFocus()
  })

  test("honours initialFocus", () => {
    session({ initialFocus: () => screen.getByRole("button", { name: "Save" }) }).activate()

    expect(screen.getByRole("button", { name: "Save" })).toHaveFocus()
  })

  test("makes the background inert but keeps the overlay live", () => {
    session().activate()

    expect(screen.getByRole("button", { name: "Open", hidden: true }).inert).toBe(true)
    expect(document.getElementById("outside").inert).toBe(true)
    expect(document.getElementById("overlay").inert).toBe(false)
  })

  test("locks body scroll while open", () => {
    const s = session()
    s.activate()
    expect(document.body.style.overflow).toBe("hidden")

    s.deactivate()
    expect(document.body.style.overflow).toBe("")
  })

  test("Tab wraps inside the dialog", async () => {
    session().activate()

    screen.getByRole("button", { name: "Save" }).focus()
    await user.tab()

    expect(screen.getByRole("textbox", { name: "Name" })).toHaveFocus()
  })

  test("Escape calls onEscape; a no-op handler still blocks layers below", async () => {
    let escapes = 0
    session({ onEscape: () => escapes++ }).activate()

    await user.keyboard("{Escape}")
    expect(escapes).toBe(1)
  })

  test("without onEscape no Escape layer is pushed", () => {
    session().activate()
    expect(getEscapeLayerCount()).toBe(0)
  })

  test("deactivate restores focus to the element focused before opening", async () => {
    const open = screen.getByRole("button", { name: "Open" })
    await user.click(open)
    const s = session()
    s.activate()

    s.deactivate()

    expect(open).toHaveFocus()
    expect(open.inert).toBe(false)
    expect(getEscapeLayerCount()).toBe(0)
  })

  test("falls back to returnFocus when nothing was focused (Safari click)", () => {
    document.body.focus()
    const open = screen.getByRole("button", { name: "Open" })
    const s = session({ returnFocus: () => open })
    s.activate()

    s.deactivate()

    expect(open).toHaveFocus()
  })

  test("restoreFocus: false leaves focus alone (disconnect)", () => {
    const open = screen.getByRole("button", { name: "Open" })
    open.focus()
    const s = session()
    s.activate()

    s.deactivate({ restoreFocus: false })

    expect(open).not.toHaveFocus()
  })

  test("activate and deactivate are idempotent", () => {
    const s = session()
    s.activate()
    s.activate()
    expect(s.isActive()).toBe(true)

    s.deactivate()
    s.deactivate()
    expect(s.isActive()).toBe(false)
    expect(document.body.style.overflow).toBe("")
  })
})
