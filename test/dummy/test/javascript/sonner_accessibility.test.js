import { describe, test, expect } from "bun:test"
import { screen, within } from "@testing-library/dom"
import { render, settle } from "./support/render.js"

// Markup as UI::SonnerToasterBehavior renders it (classes dropped)
function toaster({ duration = 4000, closeButton = false } = {}) {
  return `
    <button type="button">Save</button>
    <section role="region" tabindex="-1" aria-label="Notifications (F8)" aria-live="polite"
             aria-relevant="additions text" aria-atomic="false" data-sonner-region>
      <ol data-controller="ui--sonner"
          data-ui--sonner-position-value="bottom-right"
          data-ui--sonner-duration-value="${duration}"
          data-ui--sonner-close-button-value="${closeButton}"
          data-ui--sonner-visible-toasts-value="3"></ol>
      <div class="sr-only" data-sonner-alerts></div>
    </section>`
}

function toast(detail) {
  document.dispatchEvent(new CustomEvent("ui:toast", { detail }))
}

const region = () => screen.getByRole("region", { name: "Notifications (F8)" })
const toastItems = () => document.querySelectorAll("[data-sonner-toast]:not([data-removed='true'])")

describe("Sonner: announcements", () => {
  test("a toast is inserted inside the polite live region", async () => {
    await render(toaster())

    toast({ message: "Event created", description: "Sunday at 9:00" })

    const live = region()
    expect(live).toHaveAttribute("aria-live", "polite")
    expect(within(live).getByText("Event created").closest("[data-sonner-toast]")).not.toHaveAttribute("aria-hidden")
  })

  test("an error toast is announced assertively, once", async () => {
    await render(toaster())

    toast({ type: "error", message: "Upload failed", description: "File too large" })

    const alert = screen.getByRole("alert")
    expect(alert).toHaveTextContent("Upload failed")
    expect(alert).toHaveTextContent("File too large")
    // The visible copy stays out of the polite region while nobody is in there
    expect(document.querySelector("[data-sonner-toast][data-type='error']")).toHaveAttribute("aria-hidden", "true")
  })

  test("a bare toaster list (no Ruby wrapper) becomes a live region on connect", async () => {
    await render(`<ol data-controller="ui--sonner"></ol>`)

    const list = document.querySelector("ol")
    expect(list).toHaveAttribute("aria-live", "polite")
    expect(list).toHaveAttribute("aria-label", "Notifications (F8)")
  })
})

describe("Sonner: keyboard", () => {
  test("F8 moves focus to the notifications region", async () => {
    const { user } = await render(toaster())
    toast({ message: "Saved", action: { label: "Undo" } })

    screen.getByRole("button", { name: "Save" }).focus()
    await user.keyboard("{F8}")

    expect(region()).toHaveFocus()
  })

  test("Escape dismisses the focused toast", async () => {
    const { user } = await render(toaster())
    toast({ message: "Saved", action: { label: "Undo" } })

    screen.getByRole("button", { name: "Undo" }).focus()
    await user.keyboard("{Escape}")

    expect(document.querySelector("[data-sonner-toast]")).toHaveAttribute("data-removed", "true")
  })

  test("dismissing a focused toast moves focus to the next toast", async () => {
    const { user } = await render(toaster({ closeButton: true }))
    toast({ message: "First" })
    toast({ message: "Second" })

    const second = screen.getByText("Second").closest("[data-sonner-toast]")
    await user.click(within(second).getByRole("button", { name: "Close toast" }))
    await settle(450)

    const first = screen.getByText("First").closest("[data-sonner-toast]")
    expect(first.contains(document.activeElement)).toBe(true)
  })

  test("dismissing the last focused toast returns focus to where it was", async () => {
    const { user } = await render(toaster({ closeButton: true }))
    toast({ message: "Only" })

    screen.getByRole("button", { name: "Save" }).focus()
    await user.keyboard("{F8}")
    await user.tab()
    expect(screen.getByRole("button", { name: "Close toast" })).toHaveFocus()
    await user.keyboard("{Enter}")
    await settle(450)

    expect(screen.getByRole("button", { name: "Save" })).toHaveFocus()
  })
})

describe("Sonner: timers", () => {
  test("a toast doesn't auto-dismiss while focus is inside it", async () => {
    await render(toaster({ duration: 60 }))
    toast({ message: "Saved", action: { label: "Undo" } })

    screen.getByRole("button", { name: "Undo" }).focus()
    await settle(120)
    expect(toastItems().length).toBe(1)

    screen.getByRole("button", { name: "Save" }).focus()
    await settle(120)
    expect(toastItems().length).toBe(0)
  })

  test("timers pause while the window is blurred", async () => {
    await render(toaster({ duration: 60 }))
    toast({ message: "Saved" })

    window.dispatchEvent(new Event("blur"))
    await settle(120)
    expect(toastItems().length).toBe(1)

    window.dispatchEvent(new Event("focus"))
    await settle(120)
    expect(toastItems().length).toBe(0)
  })

  test("focusing an error toast region reveals it to screen readers", async () => {
    const { user } = await render(toaster())
    toast({ type: "error", message: "Upload failed", action: { label: "Retry" } })

    screen.getByRole("button", { name: "Save" }).focus()
    await user.keyboard("{F8}")

    expect(document.querySelector("[data-sonner-toast]")).not.toHaveAttribute("aria-hidden")
    expect(screen.queryByRole("alert")).toBeNull()
  })
})
