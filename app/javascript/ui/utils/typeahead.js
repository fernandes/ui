/**
 * Typeahead (X7)
 *
 * First-letter search for listboxes and menus, after Radix
 * `useTypeaheadSearch` / `getNextMatch` (select.tsx, menu.tsx):
 * - keys typed within `timeout` ms build a search string;
 * - typing the same letter repeatedly cycles through items starting with it;
 * - the search starts after the current item and wraps;
 * - the caller passes only the items that may be matched (skip disabled).
 *
 *   this.typeahead = createTypeahead()
 *   if (isTypeaheadKey(event)) {
 *     const match = this.typeahead.search(event.key, enabledItems, currentItem)
 *     if (match) match.focus()
 *   }
 */

export function isTypeaheadKey(event) {
  return event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey
}

export function createTypeahead({ timeout = 1000, getText = defaultText } = {}) {
  let buffer = ""
  let timer = null

  const reset = () => {
    buffer = ""
    clearTimeout(timer)
    timer = null
  }

  return {
    // true while a search string is being typed (Space then belongs to it)
    get isTyping() {
      return buffer !== ""
    },

    reset,

    search(key, items, current = null) {
      buffer += key
      clearTimeout(timer)
      timer = setTimeout(reset, timeout)
      return getNextMatch(items, buffer, current, getText)
    }
  }
}

export function getNextMatch(items, search, current = null, getText = defaultText) {
  const isRepeated = search.length > 1 && Array.from(search).every((char) => char === search[0])
  const normalized = (isRepeated ? search[0] : search).toLowerCase()

  const currentIndex = current ? items.indexOf(current) : -1
  // Wrap around so the search starts at the current item
  let candidates = items.map((_, i) => items[(Math.max(currentIndex, 0) + i) % items.length])
  // A single letter must move off the current item
  if (normalized.length === 1 && current) candidates = candidates.filter((item) => item !== current)

  const match = candidates.find((item) => getText(item).toLowerCase().startsWith(normalized))
  return match && match !== current ? match : null
}

function defaultText(item) {
  return (item.dataset.textValue || item.textContent || "").trim()
}
