(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define([ "exports" ], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, 
  factory(global.UI = {}));
})(this, (function(exports) {
  "use strict";
  var hello = {
    message() {
      return "Hello from UI";
    }
  };
  exports.hello = hello;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
}));
