import { describe, test, expect } from "bun:test"
import { Application, Controller } from "@hotwired/stimulus"

class ProbeController extends Controller {}

// Guards the DOM environment the whole suite relies on. happy-dom < 21 held
// MutationObserver callbacks only through a WeakRef, so a garbage collection
// silently stopped Stimulus from seeing new elements and controllers never
// connected — random failures across the suite, mostly on busy CI runners.
describe("Test environment", () => {
  test("Stimulus still connects controllers after a garbage collection", async () => {
    const application = Application.start()
    application.register("probe", ProbeController)
    await Promise.resolve()

    Bun.gc(true)

    document.body.innerHTML = '<div data-controller="probe"></div>'
    await new Promise(resolve => setTimeout(resolve, 10))

    const element = document.querySelector('[data-controller="probe"]')
    expect(application.getControllerForElementAndIdentifier(element, "probe")).not.toBeNull()

    application.stop()
    document.body.innerHTML = ""
  })
})
