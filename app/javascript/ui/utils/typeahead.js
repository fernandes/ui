/**
 * Typeahead (X7), shared by menus (dropdown, context menu, menubar) and Select.
 * After Radix `useTypeaheadSearch` / `getNextMatch` (menu.tsx, select.tsx).
 */

/**
 * The text typeahead matches against: `data-text-value` when the author set
 * one, else the item's text without its shortcut hint.
 * @param {HTMLElement} item
 * @returns {string}
 */
export function getItemTextValue(item) {
  if (item.dataset.textValue) return item.dataset.textValue
  let text = ''
  item.childNodes.forEach(node => {
    if (node.nodeType === 3) text += node.textContent
    else if (node.nodeType === 1 && !node.matches('[data-slot="shortcut"], .ml-auto, svg, [aria-hidden="true"]')) text += node.textContent
  })
  return text.replace(/\s+/g, ' ').trim()
}

/**
 * First-letter typeahead for menus (Radix `menu.tsx` handleTypeaheadSearch).
 *
 *   this.typeahead = createTypeahead()
 *   // in keydown, before handling other keys:
 *   const match = this.typeahead.handleKey(event, items, document.activeElement)
 *   if (match) focus(match)
 *
 * - Printable keys without Ctrl/Meta/Alt build a search string that resets
 *   after `timeout` ms of no typing.
 * - Space is only part of the search while one is in progress (otherwise it
 *   activates the item).
 * - Repeating one letter cycles through the items starting with it; the
 *   search always looks forward from the current item and wraps.
 *
 * @param {{timeout?: number}} options
 */
export function createTypeahead({ timeout = 1000 } = {}) {
  let search = ''
  let timer = null

  const reset = () => {
    search = ''
    clearTimeout(timer)
    timer = null
  }

  return {
    /** Whether this keydown is a typeahead keystroke. */
    isTypeaheadKey(event) {
      if (event.ctrlKey || event.metaKey || event.altKey) return false
      if (!event.key || event.key.length !== 1) return false
      if (event.key === ' ' && search === '') return false
      return true
    },

    /**
     * Feed a keydown. Returns the item to focus, or null. Calls
     * preventDefault() when the key was consumed as typeahead.
     * @param {KeyboardEvent} event
     * @param {HTMLElement[]} items - enabled items of the current menu
     * @param {HTMLElement|null} current - the item that has focus now
     */
    handleKey(event, items, current = null) {
      if (!this.isTypeaheadKey(event)) return null
      event.preventDefault()

      search += event.key
      clearTimeout(timer)
      timer = setTimeout(reset, timeout)

      return findTypeaheadMatch(items, search, current)
    },

    /** Whether a search is in progress (Space then belongs to it). */
    isSearching() {
      return search !== ''
    },

    reset
  }
}

/**
 * Next item whose text starts with `search`, looking forward from `current`.
 * @param {HTMLElement[]} items
 * @param {string} search
 * @param {HTMLElement|null} current
 * @returns {HTMLElement|null}
 */
export function findTypeaheadMatch(items, search, current = null) {
  if (!items.length || !search) return null

  const isRepeated = search.length > 1 && Array.from(search).every(char => char === search[0])
  const normalized = (isRepeated ? search[0] : search).toLowerCase()
  const currentIndex = current ? items.indexOf(current) : -1

  // Look forward from the current item, wrapping around. A one-letter search
  // skips the current item so repeated presses move on; a longer one may stay.
  const ordered = items.map((_, i) => items[(Math.max(currentIndex, 0) + i) % items.length])
  const candidates = normalized.length === 1 ? ordered.filter(item => item !== current) : ordered
  const match = candidates.find(item => getItemTextValue(item).toLowerCase().startsWith(normalized))

  return match && match !== current ? match : null
}
