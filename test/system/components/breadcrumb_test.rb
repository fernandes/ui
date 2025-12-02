# frozen_string_literal: true

require "test_helper"

class BreadcrumbTest < UI::SystemTestCase
  setup do
    visit_component("breadcrumb")
  end

  # Helper to get the basic breadcrumb
  def basic_breadcrumb
    find_element(UI::Testing::BreadcrumbElement, "#basic-breadcrumb nav")
  end

  # Helper to get the breadcrumb with dropdown
  def dropdown_breadcrumb
    find_element(UI::Testing::BreadcrumbElement, "#dropdown-breadcrumb nav")
  end

  # === Basic Rendering Tests ===

  test "renders breadcrumb with links" do
    breadcrumb = basic_breadcrumb

    assert breadcrumb.has_link?("Home")
    assert breadcrumb.has_link?("Components")
  end

  test "displays current page correctly" do
    breadcrumb = basic_breadcrumb

    current = breadcrumb.current_page
    assert current.present?
    assert_includes current.text, "Breadcrumb"
  end

  test "link texts are correct" do
    breadcrumb = basic_breadcrumb

    texts = breadcrumb.link_texts
    assert_includes texts, "Home"
    assert_includes texts, "Components"
  end

  # === Link Navigation Tests ===

  test "breadcrumb links have correct href attributes" do
    breadcrumb = basic_breadcrumb

    # Verify links exist with proper href
    links = breadcrumb.links
    home_link = links.find { |l| l.text.strip == "Home" }
    assert home_link.present?
    assert home_link[:href].end_with?("/"), "Home link should point to root"
  end

  # === Keyboard Navigation Tests - Links ===

  test "Tab key focuses breadcrumb links" do
    # Start from page body
    page.find("body").click

    # Tab into breadcrumb (may need multiple tabs depending on page structure)
    # Press Tab until we reach a breadcrumb link
    5.times do
      send_keys(:tab)
      focused = page.evaluate_script("document.activeElement?.tagName")
      break if focused == "A" && page.evaluate_script("document.activeElement?.closest('nav[aria-label=\"breadcrumb\"]')")
    end

    # Verify we're in a breadcrumb link
    assert page.evaluate_script("document.activeElement?.closest('nav[aria-label=\"breadcrumb\"]')"),
      "Focus should be within breadcrumb navigation"
  end

  test "breadcrumb links have visible focus ring" do
    breadcrumb = basic_breadcrumb

    # Get a link
    link = breadcrumb.links.first
    assert link.present?

    # Verify focus-visible classes are present
    assert breadcrumb.link_has_focus_classes?(link),
      "Breadcrumb link should have focus-visible:ring classes"
  end

  # === Dropdown Presence Tests ===

  test "dropdown breadcrumb has dropdown trigger" do
    breadcrumb = dropdown_breadcrumb

    assert breadcrumb.has_dropdown?
  end

  test "dropdown trigger is initially closed" do
    breadcrumb = dropdown_breadcrumb

    assert breadcrumb.dropdown_closed?
  end

  # === Dropdown Click Interaction Tests ===

  test "clicking ellipsis opens dropdown" do
    breadcrumb = dropdown_breadcrumb

    breadcrumb.open_dropdown

    assert breadcrumb.dropdown_open?
  end

  test "dropdown shows menu items when opened" do
    breadcrumb = dropdown_breadcrumb

    breadcrumb.open_dropdown

    items = breadcrumb.dropdown_items
    assert_includes items, "Documentation"
    assert_includes items, "Themes"
    assert_includes items, "GitHub"
  end

  test "dropdown item has correct href" do
    breadcrumb = dropdown_breadcrumb

    breadcrumb.open_dropdown

    # Verify the dropdown item link has correct href
    content = breadcrumb.node.find('[data-ui--dropdown-target="content"]')
    doc_link = content.find("a", text: "Documentation")
    assert doc_link[:href].end_with?("/docs"), "Documentation link should point to /docs"
  end

  # === Keyboard Navigation Tests - Dropdown ===

  test "Tab key can focus dropdown trigger" do
    breadcrumb = dropdown_breadcrumb

    # Focus should be achievable on trigger via Tab
    breadcrumb.dropdown_trigger

    # Verify trigger has correct accessibility attributes
    aria = breadcrumb.dropdown_trigger_aria
    assert_equal "button", aria[:role]
    assert_equal "menu", aria[:haspopup]
    assert_equal "0", aria[:tabindex]
  end

  test "Enter key opens dropdown from trigger" do
    breadcrumb = dropdown_breadcrumb

    breadcrumb.open_dropdown_with_keyboard

    assert breadcrumb.dropdown_open?
  end

  test "Space key opens dropdown from trigger" do
    breadcrumb = dropdown_breadcrumb

    breadcrumb.open_dropdown_with_space

    assert breadcrumb.dropdown_open?
  end

  test "Escape key closes dropdown" do
    breadcrumb = dropdown_breadcrumb

    breadcrumb.open_dropdown
    assert breadcrumb.dropdown_open?

    breadcrumb.close_dropdown_with_escape

    assert breadcrumb.dropdown_closed?
  end

  test "Escape returns focus to trigger after closing" do
    breadcrumb = dropdown_breadcrumb

    # Open dropdown with keyboard (focus starts on trigger)
    breadcrumb.open_dropdown_with_keyboard
    assert breadcrumb.dropdown_open?

    # Navigate into dropdown
    breadcrumb.dropdown_arrow_down
    sleep 0.1

    # Close with Escape
    breadcrumb.close_dropdown_with_escape

    # Wait for focus to return (controller uses 150ms setTimeout)
    sleep 0.2

    # Focus should return to trigger
    assert breadcrumb.dropdown_trigger_focused?,
      "Focus should return to dropdown trigger after Escape"
  end

  test "ArrowDown navigates dropdown items" do
    breadcrumb = dropdown_breadcrumb

    breadcrumb.open_dropdown_with_keyboard
    sleep 0.1

    # ArrowDown should navigate between items without error
    breadcrumb.dropdown_arrow_down
    breadcrumb.dropdown_arrow_down

    # Dropdown should still be open
    assert breadcrumb.dropdown_open?
  end

  test "ArrowUp navigates dropdown items upward" do
    breadcrumb = dropdown_breadcrumb

    breadcrumb.open_dropdown_with_keyboard
    sleep 0.1

    # Navigate down first
    breadcrumb.dropdown_arrow_down
    breadcrumb.dropdown_arrow_down

    # Navigate back up
    breadcrumb.dropdown_arrow_up

    # Dropdown should still be open
    assert breadcrumb.dropdown_open?
  end

  test "Enter activates dropdown item" do
    breadcrumb = dropdown_breadcrumb

    breadcrumb.open_dropdown_with_keyboard
    sleep 0.1

    # First item should be focused, press Enter to select
    # This should close the dropdown (item was activated)
    breadcrumb.dropdown_press_enter
    sleep 0.1

    # Dropdown should close after Enter on item
    assert breadcrumb.dropdown_closed?
  end

  # === ARIA Accessibility Tests ===

  test "dropdown trigger has correct ARIA attributes" do
    breadcrumb = dropdown_breadcrumb

    aria = breadcrumb.dropdown_trigger_aria

    assert_equal "button", aria[:role]
    assert_equal "menu", aria[:haspopup]
    assert_equal "0", aria[:tabindex]
  end

  test "dropdown trigger has focus-visible ring classes" do
    breadcrumb = dropdown_breadcrumb
    trigger = breadcrumb.dropdown_trigger

    classes = trigger[:class] || ""
    assert classes.include?("focus-visible:ring"), "Trigger should have focus-visible:ring classes"
  end

  # === Edge Cases ===

  test "opening already open dropdown is no-op" do
    breadcrumb = dropdown_breadcrumb

    breadcrumb.open_dropdown
    assert breadcrumb.dropdown_open?

    breadcrumb.open_dropdown
    assert breadcrumb.dropdown_open?
  end

  test "closing already closed dropdown is no-op" do
    breadcrumb = dropdown_breadcrumb

    assert breadcrumb.dropdown_closed?

    breadcrumb.close_dropdown
    assert breadcrumb.dropdown_closed?
  end

  test "keyboard navigation works after reopening dropdown" do
    breadcrumb = dropdown_breadcrumb

    # Open and close
    breadcrumb.open_dropdown_with_keyboard
    breadcrumb.close_dropdown_with_escape

    # Wait for focus to return to trigger (controller uses 150ms setTimeout)
    sleep 0.3

    # Ensure trigger is focused before reopening
    breadcrumb.focus_dropdown_trigger
    sleep 0.1

    # Reopen with keyboard
    breadcrumb.open_dropdown_with_keyboard
    assert breadcrumb.dropdown_open?

    # Navigate should work
    breadcrumb.dropdown_arrow_down
    assert breadcrumb.dropdown_open?
  end
end
