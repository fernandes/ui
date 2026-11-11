/**
 * Id Manager
 *
 * Per-instance ids and id-reference attributes (aria-labelledby,
 * aria-describedby, aria-controls, ...), wired on the client in connect()
 * the way Radix wires `useId()`. One implementation serves ERB, Phlex and
 * ViewComponent: Ruby renders no generated ids, an id the author passed is
 * kept, and every other element gets a unique one here.
 *
 *   const contentId = ensureId(this.contentTarget, "dialog-content")
 *   setIdRefs(this.contentTarget, "aria-labelledby", this.titleTarget)
 *   setIdRefs(trigger, "aria-controls", this.contentTarget)
 */

let counter = 0

// Attribute values this module wrote, per element. Lets setIdRefs tell its
// own value (safe to replace) from one the author rendered (kept).
const written = new WeakMap()

/**
 * Return the element's id, generating a unique one when it has none.
 * An author-provided id is never changed.
 *
 * @param {Element} element
 * @param {string} prefix - readable prefix, e.g. "dialog-title"
 * @returns {string|null} the id (null when element is missing)
 */
export function ensureId(element, prefix = "ui") {
  if (!element) return null
  if (element.id) return element.id

  let id
  do {
    counter += 1
    id = `ui-${prefix}-${counter}`
  } while (document.getElementById(id))

  element.id = id
  return id
}

/**
 * Point an id-reference attribute at one or more elements, giving each an
 * id first. Missing targets are skipped; with no targets the attribute is
 * removed. A value the author rendered is kept unless `overwrite: true`.
 *
 * @param {Element} element - element that carries the attribute
 * @param {string} attribute - e.g. "aria-labelledby"
 * @param {Element|Element[]|null} targets - referenced element(s)
 * @param {Object} options
 * @param {string} options.prefix - id prefix for targets without an id
 * @param {boolean} options.overwrite - replace an author-provided value
 * @returns {string|null} the attribute value now set (null when removed)
 */
export function setIdRefs(element, attribute, targets, options = {}) {
  if (!element) return null
  const { prefix = "ui", overwrite = false } = options

  const current = element.getAttribute(attribute)
  const ours = written.get(element)?.[attribute]
  if (current && current !== ours && !overwrite) return current

  const ids = toArray(targets).map(target => ensureId(target, prefix))
  if (ids.length === 0) {
    element.removeAttribute(attribute)
    remember(element, attribute, null)
    return null
  }

  const value = ids.join(" ")
  element.setAttribute(attribute, value)
  remember(element, attribute, value)
  return value
}

/**
 * Add one element's id to a space-separated id-reference attribute,
 * keeping whatever is already there (e.g. a tooltip adding itself to a
 * button's aria-describedby).
 *
 * @returns {string} the id that was added
 */
export function addIdRef(element, attribute, target, prefix = "ui") {
  if (!element || !target) return null
  const id = ensureId(target, prefix)
  const tokens = tokenList(element, attribute)
  if (!tokens.includes(id)) tokens.push(id)
  element.setAttribute(attribute, tokens.join(" "))
  return id
}

/**
 * Remove one element's id from an id-reference attribute; removes the
 * attribute when nothing is left.
 */
export function removeIdRef(element, attribute, target) {
  if (!element || !target || !target.id) return
  const tokens = tokenList(element, attribute).filter(token => token !== target.id)
  if (tokens.length) {
    element.setAttribute(attribute, tokens.join(" "))
  } else {
    element.removeAttribute(attribute)
  }
}

function tokenList(element, attribute) {
  return (element.getAttribute(attribute) || "").split(/\s+/).filter(Boolean)
}

function toArray(targets) {
  if (!targets) return []
  const list = Array.isArray(targets) || targets instanceof NodeList ? Array.from(targets) : [targets]
  return list.filter(Boolean)
}

function remember(element, attribute, value) {
  const record = written.get(element) || {}
  record[attribute] = value
  written.set(element, record)
}
