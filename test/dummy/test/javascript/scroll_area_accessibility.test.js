// Scroll Area accessibility, black-box. Markup is what the ERB partial
// renders (classes dropped). Overflow-dependent tab stops need layout and are
// covered by the Playwright system test.
import { describe, test, expect, afterEach } from "bun:test"
import { screen } from "@testing-library/dom"
import { render, cleanup, settle } from "./support/render.js"

const scrollArea = (inner = '<a href="#">Inner link</a>') => `
  <div dir="ltr" style="position: relative;" data-slot="scroll-area" data-controller="ui--scroll-area"
       data-ui--scroll-area-type-value="hover" data-ui--scroll-area-scroll-hide-delay-value="600">
    <div tabindex="0" data-slot="scroll-area-viewport" data-ui-scroll-area-viewport="true" data-ui--scroll-area-target="viewport">
      <div style="min-width: 100%; display: table;">${inner}</div>
    </div>
    <div aria-hidden="true" data-slot="scroll-area-scrollbar" data-orientation="vertical" data-ui--scroll-area-target="scrollbar">
      <div data-slot="scroll-area-thumb" data-ui--scroll-area-target="thumb" data-action="pointerdown->ui--scroll-area#startDrag"></div>
    </div>
    <div aria-hidden="true" data-slot="scroll-area-corner"></div>
  </div>
  <button type="button">Outside</button>`

const scrollbar = () => document.querySelector("[data-slot='scroll-area-scrollbar']")

describe("Scroll Area accessibility", () => {
  afterEach(() => cleanup())

  test("focusing something inside the viewport shows the scrollbars", async () => {
    await render(scrollArea())

    screen.getByRole("link", { name: "Inner link" }).focus()

    expect(scrollbar()).toHaveAttribute("data-state", "visible")
  })

  test("moving focus between descendants keeps the scrollbars visible", async () => {
    await render(scrollArea('<a href="#">Inner link</a><a href="#">Second</a>'))

    screen.getByRole("link", { name: "Inner link" }).focus()
    screen.getByRole("link", { name: "Second" }).focus()
    await settle(700)

    expect(scrollbar()).toHaveAttribute("data-state", "visible")
  })

  test("leaving the viewport hides the scrollbars after the delay", async () => {
    await render(scrollArea())

    screen.getByRole("link", { name: "Inner link" }).focus()
    screen.getByRole("button", { name: "Outside" }).focus()
    await settle(700)

    expect(scrollbar()).toHaveAttribute("data-state", "hidden")
  })

  test("a viewport with nothing to scroll is not a tab stop", async () => {
    await render(scrollArea())

    // happy-dom has no layout: scrollHeight equals clientHeight (0)
    expect(document.querySelector("[data-slot='scroll-area-viewport']")).toHaveAttribute("tabindex", "-1")
  })
})
