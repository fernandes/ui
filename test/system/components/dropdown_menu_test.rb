# frozen_string_literal: true

require "test_helper"

class DropdownMenuTest < UI::SystemTestCase
  setup do
    visit_component("dropdown_menu")
  end

  # Helper to get the basic dropdown menu
  def basic_menu
    all_elements = all('[data-controller="ui--dropdown"]')
    UI::TestingDropdownMenuElement.new(all_elements[0])
  end

  # === Basic Interaction Tests ===

  test "opens and closes dropdown menu" do
    menu = basic_menu

    # Initially closed
    assert menu.closed?

    # Open
    menu.open
    assert menu.open?

    # Close
    menu.close
    assert menu.closed?
  end

  test "shows menu items when opened" do
    menu = basic_menu

    menu.open

    # Should have content visible
    assert menu.content.visible?
  end

  test "closes when clicking outside" do
    menu = basic_menu

    menu.open
    assert menu.open?

    # Click outside the dropdown
    page.find("h1").click

    assert menu.closed?
  end

  # === Keyboard Navigation Tests ===

  test "closes with Escape key" do
    menu = basic_menu

    menu.open
    assert menu.open?

    menu.press_escape

    assert menu.closed?
  end

  test "navigates items with arrow down key" do
    menu = basic_menu

    menu.open

    # Press arrow down to navigate - should not cause error
    menu.press_arrow_down
    menu.press_arrow_down

    # Menu should still be open after navigation
    assert menu.open?
  end

  # === Content Tests ===

  test "content has correct role" do
    menu = basic_menu

    menu.open

    assert_equal "menu", menu.content_role
  end

  # === State Queries Tests ===

  test "correctly reports open state" do
    menu = basic_menu

    assert menu.closed?
    assert_not menu.open?

    menu.open

    assert menu.open?
    assert_not menu.closed?
  end

  # === Multiple Menus Tests ===

  test "multiple menus operate independently" do
    all_menus = all('[data-controller="ui--dropdown"]')
    menu1 = UI::TestingDropdownMenuElement.new(all_menus[0])
    menu2 = UI::TestingDropdownMenuElement.new(all_menus[1]) if all_menus.length > 1

    skip "Need at least 2 menus" unless menu2

    menu1.open
    assert menu1.open?
    assert menu2.closed?

    menu1.close
    menu2.open
    assert menu1.closed?
    assert menu2.open?
  end
end
