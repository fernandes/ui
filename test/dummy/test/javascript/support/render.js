// Black-box rendering helper for controller tests.
//
// Mounts markup, starts Stimulus with every controller the engine registers
// (the same set a host app gets), and hands back a user-event instance. Tests
// then find elements by role and accessible name and drive them like a user:
//
//   const { user } = await render(html)
//   await user.click(screen.getByRole("tab", { name: "Password" }))
//   expect(screen.getByRole("tabpanel", { name: "Password" })).toBeVisible()
//
// Don't reach into the controller instance or its values: assert what a user
// or a screen reader would see (role, name, aria-*, focus, visibility).
import { Application } from "@hotwired/stimulus"
import userEvent from "@testing-library/user-event"
import { registerControllers } from "../../../../../app/javascript/ui/index.js"

let application = null

export async function render(html) {
  cleanup()
  document.body.innerHTML = html
  application = Application.start()
  registerControllers(application)
  await settle()
  return { user: userEvent.setup({ document }), container: document.body }
}

export function cleanup() {
  if (application) {
    application.stop()
    application = null
  }
  document.body.innerHTML = ""
}

// Lets Stimulus connect and any microtasks / zero-delay timers queued by
// connect() or by an interaction run. Call it after actions that defer work.
export function settle(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
