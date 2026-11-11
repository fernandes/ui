import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { inertOthers, getInertLayerCount } from "../../../../../app/javascript/ui/utils/inert-manager.js"

describe("inertOthers", () => {
  let releases

  beforeEach(() => {
    releases = []
    document.body.innerHTML = `
      <header id="header">Header</header>
      <main id="main">
        <button id="trigger">Open</button>
        <div id="modal-a">
          <p id="a-text">A</p>
          <div id="modal-b"><p>B</p></div>
        </div>
        <div id="modal-c"><p>C</p></div>
        <aside id="already" inert>Already inert</aside>
      </main>
      <section id="toasts" aria-live="polite"></section>
      <script id="script"></script>`
  })

  afterEach(() => {
    releases.forEach(release => release())
  })

  const $ = id => document.getElementById(id)
  function isolate(id) {
    const release = inertOthers($(id))
    releases.push(release)
    return release
  }

  test("makes the siblings along the path inert, not the path itself", () => {
    isolate("modal-a")

    expect($("header").inert).toBe(true)
    expect($("trigger").inert).toBe(true)
    expect($("modal-c").inert).toBe(true)
    expect($("main").inert).toBe(false)
    expect($("modal-a").inert).toBe(false)
    expect($("a-text").inert).toBe(false)
  })

  test("leaves live regions and scripts alone", () => {
    isolate("modal-a")

    expect($("toasts").inert).toBe(false)
    expect($("script").inert).toBe(false)
  })

  test("release restores the page, keeping elements that were inert before", () => {
    const release = isolate("modal-a")
    release()
    release()

    expect($("header").inert).toBe(false)
    expect($("trigger").inert).toBe(false)
    expect($("header")).not.toHaveAttribute("data-ui-inert")
    expect($("already").inert).toBe(true)
    expect(getInertLayerCount()).toBe(0)
  })

  test("a nested modal isolates itself and hands back on release", () => {
    isolate("modal-a")
    const releaseB = isolate("modal-b")

    expect($("a-text").inert).toBe(true)
    expect($("header").inert).toBe(true)

    releaseB()

    expect($("a-text").inert).toBe(false)
    expect($("header").inert).toBe(true)
    expect($("modal-c").inert).toBe(true)
  })

  test("a second modal outside the first is reachable while it is on top", () => {
    isolate("modal-a")
    const releaseC = isolate("modal-c")

    expect($("modal-c").inert).toBe(false)
    expect($("modal-a").inert).toBe(true)

    releaseC()

    expect($("modal-c").inert).toBe(true)
    expect($("modal-a").inert).toBe(false)
  })

  test("releasing the outer modal first keeps the inner one isolated", () => {
    const releaseA = isolate("modal-a")
    isolate("modal-b")

    releaseA()

    expect($("a-text").inert).toBe(true)
    expect($("header").inert).toBe(true)
  })

  test("Turbo's before-cache snapshot gets a live page", () => {
    isolate("modal-a")

    document.dispatchEvent(new Event("turbo:before-cache"))

    expect($("header").inert).toBe(false)
    expect($("trigger").inert).toBe(false)
  })
})
