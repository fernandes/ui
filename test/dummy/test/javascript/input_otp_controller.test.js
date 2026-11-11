import { describe, test, expect, afterAll } from "bun:test"
import { screen } from "@testing-library/dom"
import { render, settle, cleanup } from "./support/render.js"

// Markup as UI::InputOtpBehavior / InputOtpSlotBehavior render it (classes
// dropped): decorative slots and one real input.
function otp({ length = 6, pattern = "\\d", value = "", name = "code", id = "otp", autofocus = false, groups = [3, 3], inputmode = "numeric" } = {}) {
  let index = 0
  const group = (size) => `<div data-slot="input-otp-group">${
    Array.from({ length: size }, () => {
      const i = index++
      return `<div aria-hidden="true" data-slot="input-otp-slot" data-ui--input-otp-target="slot" data-index="${i}" data-active="false">${value[i] || ""}<div><div></div></div></div>`
    }).join("")
  }</div>`
  const separator = `<div role="separator" aria-hidden="true" data-slot="input-otp-separator"></div>`
  return `
    <label for="${id}">Verification code</label>
    <div data-controller="ui--input-otp" data-slot="input-otp"
         data-ui--input-otp-length-value="${length}" data-ui--input-otp-pattern-value="${pattern}"
         ${autofocus ? 'data-ui--input-otp-autofocus-value="true"' : ""}>
      ${groups.map(group).join(separator)}
      <input type="text" id="${id}" name="${name}" ${value ? `value="${value}"` : ""} maxlength="${length}"
             inputmode="${inputmode}" autocomplete="one-time-code" autocorrect="off" autocapitalize="off" spellcheck="false"
             data-slot="input-otp-input" data-ui--input-otp-target="input"
             data-action="input->ui--input-otp#input keydown->ui--input-otp#keydown paste->ui--input-otp#paste focus->ui--input-otp#focus blur->ui--input-otp#blur click->ui--input-otp#focus">
    </div>
  `
}

const field = () => screen.getByRole("textbox", { name: "Verification code" })
const slots = () => Array.from(document.querySelectorAll("[data-slot='input-otp-slot']"))
const shown = () => slots().map(slot => slot.firstChild?.nodeType === 3 ? slot.firstChild.textContent : "").join("")
const activeIndex = () => slots().findIndex(slot => slot.dataset.active === "true")

describe("Input OTP is one labelled field", () => {
  test("there is exactly one textbox, named by its label, with one-time-code autofill", async () => {
    await render(otp())

    expect(screen.getAllByRole("textbox")).toHaveLength(1)
    expect(field()).toHaveAttribute("autocomplete", "one-time-code")
    expect(field()).toHaveAttribute("maxlength", "6")
  })

  test("it does not steal focus on connect", async () => {
    await render(`<button>Elsewhere</button>${otp()}`)
    expect(field()).not.toHaveFocus()
  })

  test("autofocus is opt-in", async () => {
    await render(otp({ autofocus: true }))
    await settle()
    expect(field()).toHaveFocus()
  })
})

describe("Typing", () => {
  test("typed characters are drawn in the slots and the active slot follows", async () => {
    const { user } = await render(otp())

    await user.click(field())
    expect(activeIndex()).toBe(0)
    await user.keyboard("123")

    expect(field()).toHaveValue("123")
    expect(shown()).toBe("123")
    expect(activeIndex()).toBe(3)
  })

  test("characters that don't match the pattern are dropped", async () => {
    const { user } = await render(otp())

    await user.click(field())
    await user.keyboard("1a2-3")
    expect(field()).toHaveValue("123")
  })

  test("a custom pattern accepts letters and uses a text keyboard", async () => {
    const { user } = await render(otp({ pattern: "[A-Za-z0-9]", inputmode: "text" }))

    await user.click(field())
    await user.keyboard("A1b2")
    expect(field()).toHaveValue("A1b2")
  })

  test("Backspace deletes the last character", async () => {
    const { user } = await render(otp({ value: "123" }))

    await user.click(field())
    await user.keyboard("{Backspace}")
    expect(field()).toHaveValue("12")
    expect(shown()).toBe("12")
  })

  test("ArrowLeft then typing overwrites a filled slot", async () => {
    const { user } = await render(otp({ value: "123456" }))

    await user.click(field())
    expect(activeIndex()).toBe(5)
    await user.keyboard("{ArrowLeft}{ArrowLeft}")
    expect(activeIndex()).toBe(3)
    await user.keyboard("9")

    expect(field()).toHaveValue("123956")
    expect(activeIndex()).toBe(4)
  })

  test("Home and End move between the first and last filled slot", async () => {
    const { user } = await render(otp({ value: "12" }))

    await user.click(field())
    await user.keyboard("{Home}")
    expect(activeIndex()).toBe(0)
    await user.keyboard("{End}")
    expect(activeIndex()).toBe(2)
  })

  test("leaving the field clears the active slot", async () => {
    const { user } = await render(`${otp()}<button>Next</button>`)

    await user.click(field())
    await user.tab()
    expect(activeIndex()).toBe(-1)
  })
})

describe("Paste", () => {
  test("a pasted code with spaces or dashes is cleaned up", async () => {
    const { user } = await render(otp())

    await user.click(field())
    await user.paste("123 - 456")
    expect(field()).toHaveValue("123456")
    expect(shown()).toBe("123456")
  })

  test("a pasted code longer than the field is truncated", async () => {
    const { user } = await render(otp({ length: 4, groups: [4] }))

    await user.click(field())
    await user.paste("987654")
    expect(field()).toHaveValue("9876")
  })
})

describe("Forms and events", () => {
  test("the whole code is submitted under name", async () => {
    const { user } = await render(`<form>${otp({ name: "user[otp]" })}</form>`)

    await user.click(field())
    await user.keyboard("123456")

    const data = new FormData(document.querySelector("form"))
    expect(Array.from(data.keys())).toEqual(["user[otp]"])
    expect(data.get("user[otp]")).toBe("123456")
  })

  test("inputotp:complete fires once with the value when the last slot is filled", async () => {
    const { user } = await render(otp({ length: 4, groups: [4] }))
    const values = []
    document.addEventListener("inputotp:complete", (event) => values.push(event.detail.value))

    await user.click(field())
    await user.keyboard("1234")
    expect(values).toEqual(["1234"])
  })

  test("form reset redraws the slots", async () => {
    const { user } = await render(`<form>${otp({ value: "12" })}<button type="reset">Reset</button></form>`)

    await user.click(field())
    await user.keyboard("34")
    expect(shown()).toBe("1234")

    await user.click(screen.getByRole("button", { name: "Reset" }))
    await settle(5)
    expect(field()).toHaveValue("12")
    expect(shown()).toBe("12")
  })
})

// Stop the Stimulus app after the last test so it doesn't leak into other files.
afterAll(() => cleanup())
