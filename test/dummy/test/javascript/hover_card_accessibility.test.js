// Hover Card accessibility, black-box. Markup is what the ERB partials render
// (classes dropped), with a link inside the card and a button after it.
import { describe, test, expect, afterEach } from "bun:test"
import { screen } from "@testing-library/dom"
import { render, cleanup, settle } from "./support/render.js"

const hoverCardMarkup = `
  <div data-controller="ui--hover-card" data-ui--hover-card-open-delay-value="0" data-ui--hover-card-close-delay-value="0">
    <a href="https://github.com/vercel" data-ui--hover-card-target="trigger" data-action="mouseenter->ui--hover-card#show mouseleave->ui--hover-card#hide">@nextjs</a>
    <div data-ui--hover-card-target="content" class="invisible" data-align="center" data-side-offset="4"
         data-action="mouseenter->ui--hover-card#keepOpen mouseleave->ui--hover-card#scheduleHide">
      <p>The React Framework</p>
      <a href="/profile">Profile</a>
    </div>
  </div>
  <button type="button">After</button>`

const card = () => screen.getByText("The React Framework").closest("[data-ui--hover-card-target='content']")

describe("Hover Card accessibility", () => {
  afterEach(() => cleanup())

  test("Escape closes a card opened by keyboard focus (WCAG 1.4.13)", async () => {
    const { user } = await render(hoverCardMarkup)

    await user.tab()
    await settle(10)
    expect(card()).toHaveAttribute("data-state", "open")

    await user.keyboard("{Escape}")
    await settle(10)

    expect(card()).toHaveAttribute("data-state", "closed")
    expect(screen.getByRole("link", { name: "@nextjs" })).toHaveFocus()
  })

  test("Escape closes a card opened by hover", async () => {
    const { user } = await render(hoverCardMarkup)

    await user.hover(screen.getByRole("link", { name: "@nextjs" }))
    await settle(10)
    expect(card()).toHaveAttribute("data-state", "open")

    await user.keyboard("{Escape}")
    await settle(10)
    expect(card()).toHaveAttribute("data-state", "closed")
  })

  test("Tab from the trigger skips the card's links and the card closes", async () => {
    const { user } = await render(hoverCardMarkup)

    await user.tab()
    await settle(10)
    expect(card()).toHaveAttribute("data-state", "open")

    await user.tab()
    await settle(10)

    expect(screen.getByRole("button", { name: "After" })).toHaveFocus()
    expect(card()).toHaveAttribute("data-state", "closed")
  })

  test("focus that does land in the card closes it once it leaves", async () => {
    const { user } = await render(hoverCardMarkup)
    const trigger = screen.getByRole("link", { name: "@nextjs" })

    await user.hover(trigger)
    await settle(10)
    await user.click(screen.getByRole("link", { name: "Profile" }))
    await settle(10)
    await user.unhover(card())
    await user.click(screen.getByRole("button", { name: "After" }))
    await settle(10)

    expect(card()).toHaveAttribute("data-state", "closed")
  })
})
