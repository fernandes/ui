import { describe, test, expect, afterEach } from "bun:test"
import { screen, within } from "@testing-library/dom"
import { render, settle, cleanup } from "./support/render.js"

// Markup as UI::SidebarProvider + UI::Sidebar + UI::SidebarTrigger render it
// (classes dropped)
function sidebar({ open = true, collapsible = "icon" } = {}) {
  return `
    <div data-slot="sidebar-provider" data-controller="ui--sidebar" data-state="expanded" data-side="left"
         data-ui--sidebar-open-value="${open}" data-ui--sidebar-collapsible-value="${collapsible}"
         data-ui--sidebar-side-value="left" data-ui--sidebar-cookie-name-value="sidebar_state">
      <div data-ui--sidebar-target="mobileSheet" data-controller="ui--dialog" data-ui--dialog-open-value="false"
           data-ui--dialog-close-on-escape-value="true" data-ui--dialog-close-on-overlay-click-value="true">
        <div data-state="closed" data-ui--dialog-target="container" data-initial="">
          <div data-state="closed" data-ui--dialog-target="overlay" data-action="click->ui--dialog#closeOnOverlayClick" data-initial=""></div>
          <div role="dialog" aria-modal="true" data-state="closed" data-ui--dialog-target="content"
               data-ui--sidebar-target="mobileContent" data-initial="" inert>
            <div><h2 data-ui--dialog-target="title">Sidebar</h2><p data-ui--dialog-target="description">Navigation sidebar</p></div>
          </div>
        </div>
      </div>
      <aside data-slot="sidebar" data-variant="sidebar" data-side="left" data-collapsible="${collapsible}" data-ui--sidebar-target="sidebar">
        <div data-ui--sidebar-target="content"><div data-slot="sidebar-content"><a href="/home">Home</a></div></div>
      </aside>
      <main>
        <button data-slot="sidebar-trigger" data-action="click->ui--sidebar#toggle" data-ui--sidebar-target="trigger" type="button"><span>Toggle Sidebar</span></button>
        <a href="/page">Page link</a>
      </main>
    </div>`
}

function setWidth(width) {
  Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: width })
}

const trigger = () => screen.getByRole("button", { name: "Toggle Sidebar" })

afterEach(() => {
  cleanup()
  setWidth(1024)
  document.cookie = "sidebar_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
})

describe("Sidebar: mobile sheet is a modal", () => {
  test("on phones the content lives in the sheet and opening it moves focus inside", async () => {
    setWidth(500)
    const { user } = await render(sidebar())

    await user.click(trigger())
    await settle(20)

    const dialog = screen.getByRole("dialog", { name: "Sidebar" })
    expect(dialog).not.toHaveAttribute("inert")
    expect(within(dialog).getByRole("link", { name: "Home" })).toBeInTheDocument()
    expect(dialog.contains(document.activeElement)).toBe(true)
    expect(document.querySelector("main")).toHaveAttribute("inert")
    expect(document.querySelectorAll("a[href='/home']").length).toBe(1)
  })

  // Escape is covered by the system test; here the overlay click (other test
  // files leave stale Escape layers behind in the shared document)
  test("closing the sheet returns focus to the trigger", async () => {
    setWidth(500)
    const { user } = await render(sidebar())

    await user.click(trigger())
    await settle(20)
    await user.click(document.querySelector("[data-ui--dialog-target='overlay']"))
    await settle(20)

    expect(screen.getByRole("dialog", { hidden: true })).toHaveAttribute("data-state", "closed")
    expect(trigger()).toHaveFocus()
    expect(trigger()).toHaveAttribute("aria-expanded", "false")
  })

  test("the sheet opens once per toggle", async () => {
    setWidth(500)
    const { user } = await render(sidebar())
    let opens = 0
    document.addEventListener("dialog:open", () => opens++)

    await user.click(trigger())
    await settle(20)

    expect(opens).toBe(1)
  })

  test("growing past the breakpoint moves the content back to the aside", async () => {
    setWidth(500)
    await render(sidebar())
    expect(within(screen.getByRole("dialog", { hidden: true })).queryByRole("link", { name: "Home", hidden: true })).not.toBeNull()

    setWidth(1024)
    window.dispatchEvent(new Event("resize"))

    expect(document.querySelector("aside a[href='/home']")).not.toBeNull()
  })
})

describe("Sidebar: trigger state", () => {
  test("the trigger exposes aria-expanded and controls the sidebar", async () => {
    const { user } = await render(sidebar())
    const aside = document.querySelector("aside")

    expect(trigger()).toHaveAttribute("aria-expanded", "true")
    expect(trigger().getAttribute("aria-controls")).toBe(aside.id)

    await user.click(trigger())
    expect(trigger()).toHaveAttribute("aria-expanded", "false")
  })

  test("on phones the trigger controls the sheet", async () => {
    setWidth(500)
    const { user } = await render(sidebar())

    expect(trigger()).toHaveAttribute("aria-expanded", "false")
    expect(trigger().getAttribute("aria-controls")).toBe(screen.getByRole("dialog", { hidden: true }).id)

    await user.click(trigger())
    await settle(20)
    expect(trigger()).toHaveAttribute("aria-expanded", "true")
  })
})

describe("Sidebar: collapsed offcanvas", () => {
  test("a collapsed offcanvas sidebar is inert", async () => {
    const { user } = await render(sidebar({ collapsible: "offcanvas" }))
    const aside = document.querySelector("aside")
    expect(aside).not.toHaveAttribute("inert")

    await user.click(trigger())
    expect(aside).toHaveAttribute("inert")

    await user.click(trigger())
    expect(aside).not.toHaveAttribute("inert")
  })

  test("a collapsed icon sidebar stays interactive", async () => {
    const { user } = await render(sidebar({ collapsible: "icon" }))

    await user.click(trigger())

    expect(document.querySelector("aside")).not.toHaveAttribute("inert")
  })
})
