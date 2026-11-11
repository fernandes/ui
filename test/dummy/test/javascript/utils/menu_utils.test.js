// Shared menu helpers: typeahead, structural submenu lookup, disabled items.
import { describe, test, expect, afterEach } from "bun:test"
import {
  createTypeahead,
  findTypeaheadMatch,
  getMenuItems,
  isSubmenu,
  getSubmenuTrigger,
  initSubmenuTriggers,
  openSubmenu,
  closeAllSubmenus,
  toggleCheckbox,
  selectRadio
} from "../../../../../app/javascript/ui/utils/menu_utils.js"

const markup = `
  <div role="menu" id="root">
    <div role="menuitem">Apple</div>
    <div role="menuitem" data-disabled aria-disabled="true">Apricot</div>
    <div role="menuitem">Banana <span class="ml-auto">⌘B</span></div>
    <div role="menuitem">Blueberry</div>
    <div role="group">
      <div role="menuitemradio" aria-checked="true" data-state="checked"><span class="absolute left-2"></span>Cherry</div>
      <div role="menuitemradio" aria-checked="false" data-state="unchecked"><span class="absolute left-2"></span>Coconut</div>
    </div>
    <div role="menuitemcheckbox" aria-checked="false" data-state="unchecked"><span class="absolute left-2"></span>Dates</div>
    <div>
      <div role="menuitem">More</div>
      <div role="menu" data-side="left" data-state="closed" class="hidden">
        <div role="menuitemcheckbox" aria-checked="false">Elderberry</div>
      </div>
    </div>
  </div>`

const key = (k, extra = {}) => new KeyboardEvent("keydown", { key: k, cancelable: true, ...extra })
const text = el => el.textContent.trim()

describe("menu_utils", () => {
  afterEach(() => { document.body.innerHTML = "" })

  test("getMenuItems lists the menu's own enabled items, wherever nested, not its submenu's", () => {
    document.body.innerHTML = markup
    const items = getMenuItems(document.getElementById("root")).map(text)
    expect(items).toEqual(["Apple", "Banana ⌘B", "Blueberry", "Cherry", "Coconut", "Dates", "More"])
  })

  test("submenus are found structurally, whatever data-side says", () => {
    document.body.innerHTML = markup
    const submenu = document.querySelector('[data-side="left"]')
    expect(isSubmenu(submenu)).toBe(true)
    expect(isSubmenu(document.getElementById("root"))).toBe(false)
    expect(text(getSubmenuTrigger(submenu))).toBe("More")

    submenu.setAttribute("data-side", "right")
    openSubmenu(getSubmenuTrigger(submenu), submenu, { position: false })
    submenu.setAttribute("data-side", "left")
    closeAllSubmenus(document.body)
    expect(submenu).toHaveAttribute("data-state", "closed")
  })

  test("sub triggers get aria-haspopup, aria-expanded and aria-controls", () => {
    document.body.innerHTML = markup
    initSubmenuTriggers(document.body, "test")
    const submenu = document.querySelector('[data-side="left"]')
    const trigger = getSubmenuTrigger(submenu)

    expect(trigger).toHaveAttribute("aria-haspopup", "menu")
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(trigger).toHaveAttribute("aria-controls", submenu.id)

    openSubmenu(trigger, submenu, { position: false })
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    closeAllSubmenus(document.body)
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  test("typeahead moves to the next item starting with the typed letters", () => {
    document.body.innerHTML = markup
    const items = getMenuItems(document.getElementById("root"))
    const typeahead = createTypeahead()

    let match = typeahead.handleKey(key("b"), items, items[0])
    expect(text(match)).toBe("Banana ⌘B")
    match = typeahead.handleKey(key("l"), items, match)
    expect(text(match)).toBe("Blueberry")
    typeahead.reset()
  })

  test("repeating a letter cycles through items starting with it and wraps", () => {
    document.body.innerHTML = markup
    const items = getMenuItems(document.getElementById("root"))
    expect(text(findTypeaheadMatch(items, "b", items[1]))).toBe("Blueberry")
    expect(text(findTypeaheadMatch(items, "bb", items[2]))).toBe("Banana ⌘B")
  })

  test("disabled items are not typeahead targets", () => {
    document.body.innerHTML = markup
    const items = getMenuItems(document.getElementById("root"))
    expect(text(findTypeaheadMatch(items, "apr", items[0]) || document.createElement("i"))).toBe("")
  })

  test("Space only counts while a search is in progress; modifiers never do", () => {
    const typeahead = createTypeahead()
    expect(typeahead.isTypeaheadKey(key(" "))).toBe(false)
    expect(typeahead.isTypeaheadKey(key("a", { ctrlKey: true }))).toBe(false)
    expect(typeahead.isTypeaheadKey(key("ArrowDown"))).toBe(false)
    typeahead.handleKey(key("a"), [], null)
    expect(typeahead.isTypeaheadKey(key(" "))).toBe(true)
    typeahead.reset()
  })

  test("checkbox and radio helpers keep aria-checked as 'true'/'false' and skip disabled items", () => {
    document.body.innerHTML = markup
    const dates = [...document.querySelectorAll('[role="menuitemcheckbox"]')][0]
    toggleCheckbox(dates)
    expect(dates).toHaveAttribute("aria-checked", "true")
    toggleCheckbox(dates)
    expect(dates).toHaveAttribute("aria-checked", "false")

    const [cherry, coconut] = document.querySelectorAll('[role="menuitemradio"]')
    selectRadio(coconut)
    expect(coconut).toHaveAttribute("aria-checked", "true")
    expect(cherry).toHaveAttribute("aria-checked", "false")

    cherry.setAttribute("aria-disabled", "true")
    selectRadio(cherry)
    expect(cherry).toHaveAttribute("aria-checked", "false")
  })
})
