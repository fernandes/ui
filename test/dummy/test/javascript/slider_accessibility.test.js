import { describe, test, expect, afterAll } from "bun:test"
import { screen } from "@testing-library/dom"
import { render, settle, cleanup } from "./support/render.js"

// Markup as UI::SliderBehavior / SliderThumbBehavior render it (classes
// dropped). `labels: false` drops the server-rendered names, like markup from
// before they existed, to check the controller fills them in.
function slider({ values = [50], min = 0, max = 100, step = 1, name = "", orientation = "horizontal", inverted = false, disabled = false, labels = true, rootAttrs = "", inputs = true } = {}) {
  const defaultName = (index) => {
    if (!labels) return ""
    if (values.length === 2) return `aria-label="${["Minimum", "Maximum"][index]}"`
    if (values.length > 2) return `aria-label="Value ${index + 1} of ${values.length}"`
    return ""
  }
  const inputName = values.length > 1 ? `${name}[]` : name
  return `
    <div ${rootAttrs} data-orientation="${orientation}" data-slot="slider" role="group"
         data-controller="ui--slider"
         data-ui--slider-min-value="${min}" data-ui--slider-max-value="${max}"
         data-ui--slider-step-value="${step}" data-ui--slider-value-value='${JSON.stringify(values)}'
         data-ui--slider-disabled-value="${disabled}" data-ui--slider-orientation-value="${orientation}"
         data-ui--slider-inverted-value="${inverted}" data-ui--slider-name-value="${name}">
      <div data-slot="slider-track" data-ui--slider-target="track" data-action="click->ui--slider#clickTrack">
        <div data-slot="slider-range" data-ui--slider-target="range"></div>
      </div>
      ${values.map((v, i) => `
        <div aria-valuenow="${v}" aria-valuemin="${min}" aria-valuemax="${max}" aria-orientation="${orientation}"
             ${defaultName(i)} data-slot="slider-thumb" role="slider" tabindex="${disabled ? -1 : 0}"
             data-ui--slider-target="thumb" data-action="pointerdown->ui--slider#startDrag"></div>`).join("")}
      ${name && inputs ? values.map(v => `<input type="hidden" name="${inputName}" value="${v}" data-ui--slider-target="input">`).join("") : ""}
    </div>
  `
}

const thumb = (name) => screen.getByRole("slider", { name })
const thumbs = () => screen.getAllByRole("slider")

describe("Slider listeners", () => {
  test("one key press moves one step, even after the slider reconnects", async () => {
    const { user } = await render(`<div id="host">${slider({ rootAttrs: 'aria-label="Volume"' })}</div>`)
    const host = document.getElementById("host")

    // Turbo-style reconnect: detach and reattach the same element.
    const root = host.firstElementChild
    root.remove()
    await settle()
    host.appendChild(root)
    await settle()

    thumbs()[0].focus()
    await user.keyboard("{ArrowRight}")
    expect(thumbs()[0]).toHaveAttribute("aria-valuenow", "51")
  })
})

describe("Slider accessible names", () => {
  test("range thumbs are Minimum and Maximum", async () => {
    await render(slider({ values: [20, 80] }))

    expect(thumb("Minimum")).toHaveAttribute("aria-valuenow", "20")
    expect(thumb("Maximum")).toHaveAttribute("aria-valuenow", "80")
  })

  test("the controller names thumbs that were rendered without a name", async () => {
    await render(slider({ values: [10, 20, 30], labels: false }))

    expect(thumb("Value 1 of 3")).toBeInTheDocument()
    expect(thumb("Value 3 of 3")).toBeInTheDocument()
  })

  test("a single thumb takes the slider's label", async () => {
    await render(`<span id="vol-label">Volume</span>${slider({ rootAttrs: 'aria-labelledby="vol-label"', labels: false })}`)

    expect(thumb("Volume")).toHaveAttribute("aria-valuenow", "50")
  })

  test("a single thumb takes the slider's aria-label", async () => {
    await render(slider({ rootAttrs: 'aria-label="Brightness"', labels: false }))

    expect(thumb("Brightness")).toBeInTheDocument()
  })
})

describe("Slider form integration", () => {
  test("a single value submits under name and follows the keyboard", async () => {
    const { user } = await render(`<form>${slider({ name: "volume", rootAttrs: 'aria-label="Volume"' })}</form>`)
    const form = document.querySelector("form")

    expect(new FormData(form).getAll("volume")).toEqual(["50"])
    thumb("Volume").focus()
    await user.keyboard("{ArrowRight}")
    expect(new FormData(form).getAll("volume")).toEqual(["51"])
  })

  test("a range submits name[] once per thumb", async () => {
    const { user } = await render(`<form>${slider({ values: [20, 80], name: "price" })}</form>`)
    const form = document.querySelector("form")

    expect(new FormData(form).getAll("price[]")).toEqual(["20", "80"])
    thumb("Maximum").focus()
    await user.keyboard("{End}")
    expect(new FormData(form).getAll("price[]")).toEqual(["20", "100"])
  })

  test("the controller creates the inputs when the markup has none", async () => {
    await render(`<form>${slider({ values: [20, 80], name: "price", inputs: false })}</form>`)

    expect(new FormData(document.querySelector("form")).getAll("price[]")).toEqual(["20", "80"])
  })
})

describe("Slider thumbs don't cross", () => {
  test("a thumb stops at its neighbour and keeps its own value", async () => {
    const { user } = await render(slider({ values: [40, 42] }))
    const minimum = thumb("Minimum")

    minimum.focus()
    await user.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}")

    expect(minimum).toHaveFocus()
    expect(minimum).toHaveAttribute("aria-valuenow", "42")
    expect(thumb("Maximum")).toHaveAttribute("aria-valuenow", "42")

    await user.keyboard("{ArrowLeft}")
    expect(minimum).toHaveAttribute("aria-valuenow", "41")
    expect(thumb("Maximum")).toHaveAttribute("aria-valuenow", "42")
  })

  test("Home on the maximum thumb stops at the minimum thumb", async () => {
    const { user } = await render(slider({ values: [30, 70] }))

    thumb("Maximum").focus()
    await user.keyboard("{Home}")
    expect(thumb("Maximum")).toHaveAttribute("aria-valuenow", "30")
    expect(thumb("Minimum")).toHaveAttribute("aria-valuenow", "30")
  })
})

describe("Slider keys", () => {
  test("inverted horizontal: ArrowRight decreases, ArrowLeft increases", async () => {
    const { user } = await render(slider({ inverted: true, rootAttrs: 'aria-label="Volume"' }))
    const t = thumb("Volume")

    t.focus()
    await user.keyboard("{ArrowRight}")
    expect(t).toHaveAttribute("aria-valuenow", "49")
    await user.keyboard("{ArrowLeft}{ArrowLeft}")
    expect(t).toHaveAttribute("aria-valuenow", "51")
  })

  test("inverted vertical: ArrowUp decreases, ArrowDown increases", async () => {
    const { user } = await render(slider({ inverted: true, orientation: "vertical", rootAttrs: 'aria-label="Volume"' }))
    const t = thumb("Volume")

    t.focus()
    await user.keyboard("{ArrowUp}")
    expect(t).toHaveAttribute("aria-valuenow", "49")
    await user.keyboard("{ArrowDown}{ArrowDown}")
    expect(t).toHaveAttribute("aria-valuenow", "51")
  })

  test("PageUp/PageDown move a large step that stays on the step grid", async () => {
    const { user } = await render(slider({ values: [0], max: 100, step: 3, rootAttrs: 'aria-label="Volume"' }))
    const t = thumb("Volume")

    t.focus()
    await user.keyboard("{PageUp}")
    // 10% of the range (10), snapped to a multiple of the step (9)
    expect(t).toHaveAttribute("aria-valuenow", "9")
    await user.keyboard("{PageDown}")
    expect(t).toHaveAttribute("aria-valuenow", "0")
  })

  test("Shift+Arrow moves a large step too", async () => {
    const { user } = await render(slider({ rootAttrs: 'aria-label="Volume"' }))
    const t = thumb("Volume")

    t.focus()
    await user.keyboard("{Shift>}{ArrowRight}{/Shift}")
    expect(t).toHaveAttribute("aria-valuenow", "60")
  })

  test("decimal steps don't drift", async () => {
    const { user } = await render(slider({ values: [0], max: 1, step: 0.1, rootAttrs: 'aria-label="Opacity"' }))
    const t = thumb("Opacity")

    t.focus()
    await user.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}")
    expect(t).toHaveAttribute("aria-valuenow", "0.3")
  })
})

describe("Slider disabled", () => {
  test("disabling at runtime takes the thumbs out of the tab order", async () => {
    const { user } = await render(`<form>${slider({ name: "volume", rootAttrs: 'aria-label="Volume"' })}</form>`)
    const root = document.querySelector("[data-controller='ui--slider']")

    root.setAttribute("data-ui--slider-disabled-value", "true")
    await settle()

    const t = thumb("Volume")
    expect(t).toHaveAttribute("aria-disabled", "true")
    expect(t).toHaveAttribute("tabindex", "-1")
    expect(new FormData(document.querySelector("form")).getAll("volume")).toEqual([])

    t.focus()
    await user.keyboard("{ArrowRight}")
    expect(t).toHaveAttribute("aria-valuenow", "50")

    root.setAttribute("data-ui--slider-disabled-value", "false")
    await settle()
    expect(t).not.toHaveAttribute("aria-disabled")
    expect(t).toHaveAttribute("tabindex", "0")
  })
})

// Stop the Stimulus app after the last test so it doesn't leak into other files.
afterAll(() => cleanup())
