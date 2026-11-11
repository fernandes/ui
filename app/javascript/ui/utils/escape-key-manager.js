/**
 * Escape Key Manager — a stack of dismissable layers
 *
 * Every open overlay (dialog, popover, select, menu, tooltip, ...) registers
 * a layer when it opens and removes it when it closes. One document keydown
 * listener sends Escape to the topmost layer only, so Escape inside a Select
 * that lives in a Dialog closes the Select and leaves the Dialog open
 * (Radix `dismissable-layer.tsx`).
 *
 *   this.escapeLayer = createEscapeLayer(() => this.close())
 *   open()  { this.escapeLayer.activate() }
 *   close() { this.escapeLayer.deactivate() }
 *   disconnect() { this.escapeLayer.deactivate() }
 *
 * Rules:
 * - Only the most recently activated layer receives Escape.
 * - An Escape the page already handled (`event.defaultPrevented`) is ignored,
 *   so an element can keep Escape for itself (e.g. clearing an input) by
 *   calling preventDefault() in its own keydown handler.
 * - The handled event gets preventDefault(), so legacy listeners that check
 *   defaultPrevented don't act on it again.
 * - A layer that should not close on Escape still registers (with a no-op
 *   callback) so Escape doesn't fall through and close the layer beneath it.
 */

const layers = []
let listening = false

function handleKeydown(event) {
  if (event.key !== "Escape" || event.defaultPrevented || event.isComposing) return

  pruneDisconnected()
  const top = layers[layers.length - 1]
  if (!top) return

  event.preventDefault()
  top.onEscape(event)
}

function pruneDisconnected() {
  for (let i = layers.length - 1; i >= 0; i--) {
    const { element } = layers[i]
    if (element && !element.isConnected) layers.splice(i, 1)
  }
}

function startListening() {
  if (listening) return
  document.addEventListener("keydown", handleKeydown)
  listening = true
}

function stopListeningIfIdle() {
  if (!listening || layers.length > 0) return
  document.removeEventListener("keydown", handleKeydown)
  listening = false
}

/**
 * Create a dismissable layer.
 *
 * @param {Function} onEscape - called with the keydown event when this layer
 *   is topmost and Escape is pressed. Pass `() => {}` to swallow Escape.
 * @param {Object} options
 * @param {Element} options.element - the layer's element; the layer is dropped
 *   automatically if this element leaves the DOM without deactivate()
 * @returns {{activate: Function, deactivate: Function, isActive: Function, isTopmost: Function}}
 */
export function createEscapeLayer(onEscape, options = {}) {
  const layer = { onEscape: onEscape || (() => {}), element: options.element || null }

  return {
    /** Push this layer on top of the stack (moves it to the top if already active). */
    activate() {
      const index = layers.indexOf(layer)
      if (index !== -1) layers.splice(index, 1)
      layers.push(layer)
      startListening()
    },

    /** Remove this layer from the stack, wherever it is. Safe to call twice. */
    deactivate() {
      const index = layers.indexOf(layer)
      if (index !== -1) layers.splice(index, 1)
      stopListeningIfIdle()
    },

    isActive() {
      return layers.includes(layer)
    },

    isTopmost() {
      return layers[layers.length - 1] === layer
    }
  }
}

/**
 * Number of active layers (for tests and debugging).
 */
export function getEscapeLayerCount() {
  pruneDisconnected()
  return layers.length
}

/**
 * Drop every layer (test helper, like resetScrollLockState).
 */
export function resetEscapeLayers() {
  layers.length = 0
  stopListeningIfIdle()
}

// ---------------------------------------------------------------------------
// Legacy API — kept for existing callers, now backed by the layer stack.
// ---------------------------------------------------------------------------

/**
 * @deprecated Use createEscapeLayer. attach() pushes a layer, detach() pops it.
 * `stopPropagation`/`preventDefault` options are still honoured.
 */
export function createEscapeKeyHandler(onEscape, options = {}) {
  const {
    enabled = true,
    stopPropagation = false,
    preventDefault = false
  } = options

  let attached = false
  const layer = createEscapeLayer((event) => {
    if (stopPropagation) event.stopPropagation()
    if (preventDefault) event.preventDefault()
    onEscape(event)
  })

  return {
    attach() {
      if (!enabled || attached) return
      layer.activate()
      attached = true
    },

    detach() {
      if (!attached) return
      layer.deactivate()
      attached = false
    },

    isAttached() {
      return attached
    },

    /** Temporarily remove the layer without forgetting it is attached. */
    disable() {
      layer.deactivate()
    },

    /** Restore a disabled layer (goes back on top of the stack). */
    enable() {
      if (attached) layer.activate()
    }
  }
}

/**
 * @deprecated Use createEscapeLayer. Pushes a layer now; returns a cleanup
 * function that pops it.
 */
export function onEscapeKey(onEscape, options = {}) {
  const handler = createEscapeKeyHandler(onEscape, options)
  handler.attach()
  return () => handler.detach()
}

/**
 * @deprecated Not layered: a plain document listener gated by `condition`.
 * It now ignores an Escape a layer already handled (defaultPrevented).
 * Migrate to createEscapeLayer, activated while open.
 */
export function onEscapeKeyWhen(onEscape, condition) {
  const keydownHandler = (event) => {
    if (event.key === "Escape" && !event.defaultPrevented && condition()) {
      onEscape(event)
    }
  }

  document.addEventListener("keydown", keydownHandler)
  return () => document.removeEventListener("keydown", keydownHandler)
}
