// Navigation Menu accessibility, black-box. Markup is what the ERB partials
// render (classes and the chevron svg dropped). Tab order across real layout
// (hidden panels, viewport) is covered by the Playwright system test.
import { describe, test, expect, afterEach } from "bun:test"
import { screen } from "@testing-library/dom"
import { render, cleanup, settle } from "./support/render.js"

const item = (label, links) => `
  <li data-slot="navigation-menu-item" data-ui--navigation-menu-target="item">
    <button data-slot="navigation-menu-trigger" data-state="closed" data-ui--navigation-menu-target="trigger"
            data-action="click->ui--navigation-menu#toggle mouseenter->ui--navigation-menu#handleTriggerHover mouseleave->ui--navigation-menu#handleTriggerLeave"
            type="button" aria-expanded="false">${label}</button>
    <div data-slot="navigation-menu-content" data-state="closed" data-ui--navigation-menu-target="content"
         data-action="mouseleave->ui--navigation-menu#handleContentLeave">
      ${links.map(text => `<a data-slot="navigation-menu-link" href="#${text.toLowerCase()}">${text}</a>`).join("")}
    </div>
  </li>`

const navMarkup = ({ viewport = true } = {}) => `
  <nav data-controller="ui--navigation-menu" data-ui--navigation-menu-viewport-value="${viewport}"
       data-ui--navigation-menu-delay-duration-value="200" data-ui--navigation-menu-skip-delay-duration-value="300" aria-label="Main">
    <ul data-slot="navigation-menu-list">
      ${item("Learn", ["Guides", "Tutorials"])}
      ${item("Build", ["Starters", "Examples"])}
      <li data-slot="navigation-menu-item" data-ui--navigation-menu-target="item">
        <a data-slot="navigation-menu-link" href="#pricing">Pricing</a>
      </li>
    </ul>
    ${viewport ? `<div data-slot="navigation-menu-viewport-wrapper"><div data-slot="navigation-menu-viewport" data-state="closed" data-ui--navigation-menu-target="viewport"></div></div>` : ""}
  </nav>
  <button type="button">After</button>`

const trigger = name => screen.getByRole("button", { name })
const link = name => screen.getByRole("link", { name, hidden: true })
const contentOf = name => document.getElementById(trigger(name).getAttribute("aria-controls"))

describe("Navigation Menu accessibility", () => {
  afterEach(() => cleanup())

  describe("relationships", () => {
    test("each trigger controls its content, which is labelled by the trigger", async () => {
      await render(navMarkup())

      const learn = trigger("Learn")
      const content = contentOf("Learn")
      expect(content).toBeTruthy()
      expect(content).toContainElement(link("Guides"))
      expect(content).toHaveAttribute("aria-labelledby", learn.id)
      expect(contentOf("Build")).toContainElement(link("Starters"))
    })

    test("no trigger is taken out of the Tab order", async () => {
      await render(navMarkup())

      for (const name of ["Learn", "Build"]) {
        expect(trigger(name)).not.toHaveAttribute("tabindex")
      }
    })
  })

  describe("viewport mode", () => {
    test("opening moves the real content into the viewport, without copies", async () => {
      const { user } = await render(navMarkup())

      await user.click(trigger("Learn"))

      const viewport = document.querySelector("[data-ui--navigation-menu-target='viewport']")
      expect(viewport).toContainElement(link("Guides"))
      expect(screen.getAllByRole("link", { name: "Guides", hidden: true })).toHaveLength(1)
      expect(viewport).toHaveAttribute("data-state", "open")
    })

    test("closing puts the content back in its item and hides it", async () => {
      const { user } = await render(navMarkup())

      await user.click(trigger("Learn"))
      await user.click(trigger("Learn"))
      await settle(20)

      const content = contentOf("Learn")
      expect(content).toHaveAttribute("data-state", "closed")
      expect(trigger("Learn").closest("li")).toContainElement(content)
    })

    test("re-opening right after closing keeps the panel open (no stale exit)", async () => {
      const { user } = await render(navMarkup())

      await user.click(trigger("Learn"))
      await user.click(trigger("Learn"))
      await user.click(trigger("Learn"))
      await settle(30)

      expect(contentOf("Learn")).toHaveAttribute("data-state", "open")
    })

    test("Tab from an open trigger enters its content; Tab from the last link moves past the trigger", async () => {
      const { user } = await render(navMarkup())

      await user.click(trigger("Learn"))
      await user.keyboard("{Tab}")
      expect(link("Guides")).toHaveFocus()

      await user.keyboard("{Tab}")
      expect(link("Tutorials")).toHaveFocus()
    })
  })

  describe("keyboard", () => {
    test("Escape in the content closes it and returns focus to its own trigger", async () => {
      const { user } = await render(navMarkup({ viewport: false }))

      await user.click(trigger("Build"))
      await user.keyboard("{ArrowDown}")
      expect(link("Starters")).toHaveFocus()

      await user.keyboard("{Escape}")
      await settle(20)

      expect(trigger("Build")).toHaveFocus()
      expect(trigger("Build")).toHaveAttribute("aria-expanded", "false")
      expect(contentOf("Build")).toHaveAttribute("data-state", "closed")
    })

    test("ArrowDown/ArrowUp move between the links of an open panel", async () => {
      const { user } = await render(navMarkup({ viewport: false }))

      trigger("Learn").focus()
      await user.keyboard("{ArrowDown}")
      expect(link("Guides")).toHaveFocus()

      await user.keyboard("{ArrowDown}")
      expect(link("Tutorials")).toHaveFocus()

      await user.keyboard("{ArrowUp}")
      expect(link("Guides")).toHaveFocus()
    })

    test("ArrowRight reaches plain top-level links too", async () => {
      const { user } = await render(navMarkup())

      trigger("Build").focus()
      await user.keyboard("{ArrowRight}")
      expect(screen.getByRole("link", { name: "Pricing" })).toHaveFocus()

      await user.keyboard("{ArrowRight}")
      expect(trigger("Learn")).toHaveFocus()
    })
  })

  describe("closing", () => {
    test("focus leaving the open item closes it", async () => {
      const { user } = await render(navMarkup({ viewport: false }))

      await user.click(trigger("Learn"))
      await user.click(screen.getByRole("button", { name: "After" }))
      await settle(20)

      expect(trigger("Learn")).toHaveAttribute("aria-expanded", "false")
    })

    test("following a link inside a panel closes the menu", async () => {
      const { user } = await render(navMarkup({ viewport: false }))

      await user.click(trigger("Learn"))
      await user.click(link("Guides"))
      await settle(20)

      expect(trigger("Learn")).toHaveAttribute("aria-expanded", "false")
      expect(contentOf("Learn")).toHaveAttribute("data-state", "closed")
    })
  })
})
