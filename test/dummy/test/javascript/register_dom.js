// Registers happy-dom globals (document, window, ...). Preloaded before
// setup.js on its own, because ES imports are hoisted: anything setup.js
// imports would otherwise load before `document` exists, and Testing Library's
// `screen` binds to document.body at import time.
import { GlobalRegistrator } from "@happy-dom/global-registrator"

GlobalRegistrator.register()
