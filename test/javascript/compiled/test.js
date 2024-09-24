(function () {
  'use strict';

  // The hello is just a test
  //
  //   UI.hello.message()
  //
  //   Example:
  //
  //   import * as UI from '@fernandes/ui'
  //
  //   UI.hello.message()
  //

  var hello = {
    message() {
      return "Hello from UI"
    },
  };

  const {module, test} = QUnit;

  module("UI", (hooks) => {
    hooks.before(() => {
      window.onbeforeunload = () => '';
    });
    module("Hello", () => {
      test("check message", assert => {
        assert.equal(hello.message(), "Hello from UI");
      });
    });
  });

})();
