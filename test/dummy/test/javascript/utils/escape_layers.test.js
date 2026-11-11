import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import userEvent from "@testing-library/user-event"
import {
  createEscapeLayer,
  createEscapeKeyHandler,
  onEscapeKey,
  getEscapeLayerCount
} from "../../../../../app/javascript/ui/utils/escape-key-manager.js"

describe("escape layer stack", () => {
  let user
  let layers

  beforeEach(() => {
    document.body.innerHTML = `<div id="dialog"><input aria-label="Name"><div id="select"></div></div>`
    user = userEvent.setup({ document })
    layers = []
  })

  afterEach(() => {
    layers.forEach(layer => layer.deactivate?.() ?? layer.detach?.())
  })

  function layer(onEscape, options) {
    const created = createEscapeLayer(onEscape, options)
    layers.push(created)
    return created
  }

  test("Escape closes only the topmost layer", async () => {
    const closed = []
    const dialog = layer(() => closed.push("dialog"))
    const select = layer(() => closed.push("select"))
    dialog.activate()
    select.activate()

    await user.keyboard("{Escape}")
    expect(closed).toEqual(["select"])

    select.deactivate()
    await user.keyboard("{Escape}")
    expect(closed).toEqual(["select", "dialog"])
  })

  test("a layer removed from the middle doesn't break the order", async () => {
    const closed = []
    const a = layer(() => closed.push("a"))
    const b = layer(() => closed.push("b"))
    const c = layer(() => closed.push("c"))
    a.activate(); b.activate(); c.activate()

    b.deactivate()
    await user.keyboard("{Escape}")
    c.deactivate()
    await user.keyboard("{Escape}")

    expect(closed).toEqual(["c", "a"])
  })

  test("re-activating a layer moves it to the top", async () => {
    const closed = []
    const a = layer(() => closed.push("a"))
    const b = layer(() => closed.push("b"))
    a.activate(); b.activate(); a.activate()

    await user.keyboard("{Escape}")

    expect(closed).toEqual(["a"])
    expect(a.isTopmost()).toBe(true)
  })

  test("a no-op layer swallows Escape so the layer beneath stays open", async () => {
    const closed = []
    layer(() => closed.push("dialog")).activate()
    layer(() => {}).activate()

    await user.keyboard("{Escape}")

    expect(closed).toEqual([])
  })

  test("an Escape the page already handled is ignored", async () => {
    const closed = []
    layer(() => closed.push("dialog")).activate()
    const input = document.querySelector("input")
    input.addEventListener("keydown", event => event.preventDefault())

    await user.click(input)
    await user.keyboard("{Escape}")

    expect(closed).toEqual([])
  })

  test("the handled Escape is marked defaultPrevented for other listeners", async () => {
    layer(() => {}).activate()
    let seen = null
    const listener = event => { seen = event.defaultPrevented }
    document.addEventListener("keydown", listener)

    await user.keyboard("{Escape}")
    document.removeEventListener("keydown", listener)

    expect(seen).toBe(true)
  })

  test("other keys are ignored", async () => {
    const closed = []
    layer(() => closed.push("dialog")).activate()

    await user.keyboard("{Enter}a")

    expect(closed).toEqual([])
  })

  test("a layer whose element left the DOM is dropped", async () => {
    const closed = []
    const select = document.getElementById("select")
    layer(() => closed.push("dialog")).activate()
    layer(() => closed.push("select"), { element: select }).activate()

    select.remove()
    await user.keyboard("{Escape}")

    expect(closed).toEqual(["dialog"])
  })

  test("the document listener goes away when no layer is active", () => {
    const a = layer(() => {})
    a.activate()
    expect(getEscapeLayerCount()).toBe(1)
    a.deactivate()
    a.deactivate()
    expect(getEscapeLayerCount()).toBe(0)
    expect(a.isActive()).toBe(false)
  })

  describe("legacy API", () => {
    test("createEscapeKeyHandler attach/detach is layered", async () => {
      const closed = []
      const outer = createEscapeKeyHandler(() => closed.push("outer"))
      const inner = createEscapeKeyHandler(() => closed.push("inner"))
      layers.push(outer, inner)
      outer.attach()
      inner.attach()

      await user.keyboard("{Escape}")
      inner.detach()
      await user.keyboard("{Escape}")

      expect(closed).toEqual(["inner", "outer"])
    })

    test("enabled: false never attaches", async () => {
      const closed = []
      const handler = createEscapeKeyHandler(() => closed.push("x"), { enabled: false })
      handler.attach()

      await user.keyboard("{Escape}")

      expect(closed).toEqual([])
      expect(handler.isAttached()).toBe(false)
    })

    test("onEscapeKey returns a cleanup that pops the layer", async () => {
      const closed = []
      const cleanup = onEscapeKey(() => closed.push("drawer"))

      await user.keyboard("{Escape}")
      cleanup()
      await user.keyboard("{Escape}")

      expect(closed).toEqual(["drawer"])
    })
  })
})
