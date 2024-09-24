import * as UI from "../../../../app/javascript/ui/index"
import {helper} from "../test_helpers/index"

const {module, test} = QUnit

module("UI", (hooks) => {
  hooks.before(() => {
    window.onbeforeunload = () => '';
  })
  module("Hello", () => {
    test("check message", assert => {
      assert.equal(UI.hello.message(), "Hello from UI")
    })
  })
})
