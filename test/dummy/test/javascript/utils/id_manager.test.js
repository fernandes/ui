import { describe, test, expect, beforeEach } from "bun:test"
import { ensureId, setIdRefs, addIdRef, removeIdRef } from "../../../../../app/javascript/ui/utils/id-manager.js"

describe("id manager", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
  })

  describe("ensureId", () => {
    test("keeps an id the author rendered", () => {
      document.body.innerHTML = `<h2 id="my-title">Title</h2>`
      const title = document.querySelector("h2")

      expect(ensureId(title, "dialog-title")).toBe("my-title")
      expect(title).toHaveAttribute("id", "my-title")
    })

    test("gives each element its own id", () => {
      document.body.innerHTML = `<h2>One</h2><h2>Two</h2>`
      const [one, two] = document.querySelectorAll("h2")

      const a = ensureId(one, "dialog-title")
      const b = ensureId(two, "dialog-title")

      expect(a).toMatch(/^ui-dialog-title-\d+$/)
      expect(a).not.toBe(b)
      expect(one.id).toBe(a)
    })

    test("is stable: calling it again returns the same id", () => {
      document.body.innerHTML = `<h2>One</h2>`
      const title = document.querySelector("h2")

      expect(ensureId(title)).toBe(ensureId(title))
    })

    test("never reuses an id already in the page", () => {
      const probe = document.createElement("div")
      document.body.append(probe)
      const taken = ensureId(probe, "x")
      const next = taken.replace(/\d+$/, n => String(Number(n) + 1))
      document.body.insertAdjacentHTML("beforeend", `<p id="${next}"></p><span></span>`)

      expect(ensureId(document.querySelector("span"), "x")).not.toBe(next)
    })

    test("returns null for a missing element", () => {
      expect(ensureId(null)).toBeNull()
    })
  })

  describe("setIdRefs", () => {
    test("names a dialog by its title", () => {
      document.body.innerHTML = `<div role="dialog"><h2>Edit profile</h2></div>`
      const dialog = document.querySelector("[role=dialog]")

      setIdRefs(dialog, "aria-labelledby", dialog.querySelector("h2"))

      expect(dialog).toHaveAccessibleName("Edit profile")
    })

    test("references several elements in order", () => {
      document.body.innerHTML = `<button>X</button><p id="a">A</p><p>B</p>`
      const [a, b] = document.querySelectorAll("p")
      const button = document.querySelector("button")

      setIdRefs(button, "aria-describedby", [a, b])

      expect(button.getAttribute("aria-describedby")).toBe(`a ${b.id}`)
      expect(button).toHaveAccessibleDescription("A B")
    })

    test("removes the attribute when there is nothing to reference", () => {
      document.body.innerHTML = `<div role="dialog"></div>`
      const dialog = document.querySelector("div")
      setIdRefs(dialog, "aria-describedby", document.createElement("p"))

      setIdRefs(dialog, "aria-describedby", null)

      expect(dialog).not.toHaveAttribute("aria-describedby")
    })

    test("keeps a value the author rendered", () => {
      document.body.innerHTML = `<div role="dialog" aria-labelledby="custom"><h2>T</h2></div><span id="custom">Custom</span>`
      const dialog = document.querySelector("div")

      setIdRefs(dialog, "aria-labelledby", dialog.querySelector("h2"))

      expect(dialog).toHaveAttribute("aria-labelledby", "custom")
      expect(dialog).toHaveAccessibleName("Custom")
    })

    test("replaces its own earlier value", () => {
      document.body.innerHTML = `<button></button><p>One</p><p>Two</p>`
      const [one, two] = document.querySelectorAll("p")
      const button = document.querySelector("button")

      setIdRefs(button, "aria-controls", one)
      setIdRefs(button, "aria-controls", two)

      expect(button).toHaveAttribute("aria-controls", two.id)
    })

    test("overwrite: true replaces an author value", () => {
      document.body.innerHTML = `<button aria-controls="old"></button><p>One</p>`
      const button = document.querySelector("button")

      setIdRefs(button, "aria-controls", document.querySelector("p"), { overwrite: true })

      expect(button.getAttribute("aria-controls")).not.toBe("old")
    })
  })

  describe("addIdRef / removeIdRef", () => {
    test("adds to and removes from an existing token list", () => {
      document.body.innerHTML = `<button aria-describedby="hint">Save</button><p id="hint">Hint</p><div role="tooltip">Tip</div>`
      const button = document.querySelector("button")
      const tooltip = document.querySelector("[role=tooltip]")

      const id = addIdRef(button, "aria-describedby", tooltip, "tooltip")
      addIdRef(button, "aria-describedby", tooltip, "tooltip")
      expect(button.getAttribute("aria-describedby")).toBe(`hint ${id}`)

      removeIdRef(button, "aria-describedby", tooltip)
      expect(button).toHaveAttribute("aria-describedby", "hint")

      removeIdRef(button, "aria-describedby", document.getElementById("hint"))
      expect(button).not.toHaveAttribute("aria-describedby")
    })
  })
})
