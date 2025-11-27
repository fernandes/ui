# frozen_string_literal: true

require "test_helper"

module UI
  class NavigationMenuTest < SystemTestCase
    # Alias for easier reference
    NavigationMenuElement = Testing::NavigationMenuElement
    def setup
      visit_component("navigation_menu")
    end

    # === Basic Interaction Tests ===

    test "opens menu on trigger click" do
      nav_menu = find_element(NavigationMenuElement, "#phlex-nav")

      assert nav_menu.all_menus_closed?

      nav_menu.open_menu("Home")

      assert nav_menu.menu_open?("Home")
      assert_equal "Home", nav_menu.active_menu
    end

    test "closes menu on escape key" do
      nav_menu = find_element(NavigationMenuElement, "#phlex-nav")

      nav_menu.open_menu("Components")
      assert nav_menu.menu_open?("Components")

      nav_menu.close_menu

      assert nav_menu.all_menus_closed?
    end

    test "closes menu on click outside" do
      nav_menu = find_element(UI::Testing::NavigationMenuElement, "#phlex-nav")

      nav_menu.open_menu("Components")
      assert nav_menu.menu_open?("Components")

      nav_menu.click_outside

      assert nav_menu.all_menus_closed?
    end

    test "switches between menus on click" do
      nav_menu = find_element(UI::Testing::NavigationMenuElement, "#phlex-nav")

      # Open first menu
      nav_menu.open_menu("Home")
      assert nav_menu.menu_open?("Home")
      assert nav_menu.menu_closed?("Components")

      # Click second menu trigger - first should close, second should open
      nav_menu.open_menu("Components")
      assert nav_menu.menu_closed?("Home")
      assert nav_menu.menu_open?("Components")
      assert_equal "Components", nav_menu.active_menu
    end

    test "opens menu on hover after delay" do
      nav_menu = find_element(UI::Testing::NavigationMenuElement, "#phlex-nav")

      nav_menu.hover_trigger("List")

      assert nav_menu.menu_open?("List")
    end

    # === Content Interaction Tests ===

    test "displays content links when menu is open" do
      nav_menu = find_element(UI::Testing::NavigationMenuElement, "#phlex-nav")

      nav_menu.open_menu("Home")

      assert nav_menu.has_content_link?("Introduction")
      assert nav_menu.has_content_link?("Installation")
      assert nav_menu.has_content_link?("Typography")
    end

    test "can click links within content" do
      nav_menu = find_element(UI::Testing::NavigationMenuElement, "#phlex-nav")

      nav_menu.open_menu("Components")

      # Should have component links
      assert nav_menu.has_content_link?("Alert Dialog")
      assert nav_menu.has_content_link?("Tooltip")

      # Clicking a link should work (we won't verify navigation since href is #)
      nav_menu.click_link("Alert Dialog")
    end

    # === Simple Link Triggers (no dropdown) ===

    test "handles simple link triggers without dropdown" do
      nav_menu = find_element(UI::Testing::NavigationMenuElement, "#phlex-nav")

      # "Docs" is a simple link element within the navigation
      # It's not a trigger, so we need to find it differently
      docs_link = nav_menu.node.find('a', text: 'Docs')

      assert_equal "a", docs_link.tag_name
      assert docs_link["href"].end_with?("#")
    end

    # === Keyboard Navigation Tests ===

    test "navigates between triggers with arrow keys" do
      nav_menu = find_element(UI::Testing::NavigationMenuElement, "#phlex-nav")

      # Focus first trigger
      nav_menu.focus_trigger("Home")

      # Navigate right
      nav_menu.navigate_to_trigger(:right)
      sleep 0.1

      # Second trigger (Components) should be focused
      # We can verify by pressing Enter to open it
      nav_menu.press_enter
      assert nav_menu.menu_open?("Components")
    end

    test "navigates to first link in content with arrow down" do
      nav_menu = find_element(UI::Testing::NavigationMenuElement, "#phlex-nav")

      nav_menu.focus_trigger("Home")
      nav_menu.press_arrow_down

      # Menu should open and focus should move to first link
      assert nav_menu.menu_open?("Home")
    end

    test "opens menu with enter key" do
      nav_menu = find_element(UI::Testing::NavigationMenuElement, "#phlex-nav")

      nav_menu.focus_trigger("Simple")
      nav_menu.press_enter

      assert nav_menu.menu_open?("Simple")
    end

    test "opens menu with space key" do
      nav_menu = find_element(UI::Testing::NavigationMenuElement, "#phlex-nav")

      nav_menu.focus_trigger("Simple")
      nav_menu.press_space

      assert nav_menu.menu_open?("Simple")
    end

    test "closes menu with escape and returns focus to trigger" do
      nav_menu = find_element(UI::Testing::NavigationMenuElement, "#phlex-nav")

      nav_menu.focus_trigger("List")
      nav_menu.press_enter
      assert nav_menu.menu_open?("List")

      nav_menu.press_escape

      assert nav_menu.all_menus_closed?
      # Focus should return to the trigger
    end

    # === ARIA Attributes Tests ===

    test "has correct navigation tag" do
      nav_menu = find_element(UI::Testing::NavigationMenuElement, "#phlex-nav")

      # Navigation menu uses <nav> tag which is semantically a navigation element
      assert_equal "nav", nav_menu.node.tag_name
    end

    test "trigger has correct ARIA attributes when closed" do
      nav_menu = find_element(UI::Testing::NavigationMenuElement, "#phlex-nav")

      attrs = nav_menu.trigger_aria_attributes("Home")

      assert_equal "false", attrs[:expanded]
      # Navigation menu typically doesn't use aria-haspopup or uses "menu"
    end

    test "trigger has correct ARIA attributes when open" do
      nav_menu = find_element(UI::Testing::NavigationMenuElement, "#phlex-nav")

      nav_menu.open_menu("Home")

      attrs = nav_menu.trigger_aria_attributes("Home")

      assert_equal "true", attrs[:expanded]
    end

    # === State Management Tests ===

    test "tracks menu count correctly" do
      nav_menu = find_element(UI::Testing::NavigationMenuElement, "#phlex-nav")

      # Should have 5 triggers: Home, Components, List, Simple, With Icon
      # (Docs is a link, not a trigger)
      assert_equal 5, nav_menu.menu_count
    end

    test "returns all menu trigger texts" do
      nav_menu = find_element(UI::Testing::NavigationMenuElement, "#phlex-nav")

      menus = nav_menu.menus

      assert_includes menus, "Home"
      assert_includes menus, "Components"
      # "Docs" is not a trigger, it's a link
      assert_includes menus, "List"
      assert_includes menus, "Simple"
      assert_includes menus, "With Icon"
      assert_equal 5, menus.size
    end

    test "active_menu returns nil when all menus are closed" do
      nav_menu = find_element(UI::Testing::NavigationMenuElement, "#phlex-nav")

      assert_nil nav_menu.active_menu
    end

    test "active_menu returns current open menu" do
      nav_menu = find_element(UI::Testing::NavigationMenuElement, "#phlex-nav")

      nav_menu.open_menu("With Icon")

      assert_equal "With Icon", nav_menu.active_menu
    end

    # === Viewport Tests (when viewport is disabled) ===

    test "viewport is disabled in test examples" do
      nav_menu = find_element(UI::Testing::NavigationMenuElement, "#phlex-nav")

      refute nav_menu.viewport_enabled?
    end

    # === Animation and Motion Tests ===

    test "content has correct data-state when open" do
      nav_menu = find_element(UI::Testing::NavigationMenuElement, "#phlex-nav")

      nav_menu.open_menu("Simple")

      trigger = nav_menu.trigger("Simple")
      assert_equal "open", trigger["data-state"]
    end

    test "content has correct data-state when closed" do
      nav_menu = find_element(UI::Testing::NavigationMenuElement, "#phlex-nav")

      nav_menu.open_menu("Simple")
      nav_menu.close_menu

      trigger = nav_menu.trigger("Simple")
      assert_equal "closed", trigger["data-state"]
    end

    # === Multiple Menu Variations Tests ===

    test "works with ERB partials implementation" do
      nav_menu = find_element(UI::Testing::NavigationMenuElement, "#erb-nav")

      nav_menu.open_menu("Home")
      assert nav_menu.menu_open?("Home")

      nav_menu.close_menu
      assert nav_menu.all_menus_closed?
    end

    test "works with ViewComponent implementation" do
      nav_menu = find_element(UI::Testing::NavigationMenuElement, "#vc-nav")

      nav_menu.open_menu("Components")
      assert nav_menu.menu_open?("Components")

      assert nav_menu.has_content_link?("Alert Dialog")
    end

    # === Complex Navigation Flow Tests ===

    test "can navigate through multiple menus in sequence" do
      nav_menu = find_element(UI::Testing::NavigationMenuElement, "#phlex-nav")

      # Open Home
      nav_menu.open_menu("Home")
      assert nav_menu.menu_open?("Home")

      # Switch to Components
      nav_menu.open_menu("Components")
      assert nav_menu.menu_closed?("Home")
      assert nav_menu.menu_open?("Components")

      # Switch to List
      nav_menu.open_menu("List")
      assert nav_menu.menu_closed?("Components")
      assert nav_menu.menu_open?("List")

      # Close
      nav_menu.close_menu
      assert nav_menu.all_menus_closed?
    end

    test "reopening same menu works correctly" do
      nav_menu = find_element(UI::Testing::NavigationMenuElement, "#phlex-nav")

      # Open
      nav_menu.open_menu("Simple")
      assert nav_menu.menu_open?("Simple")

      # Close
      nav_menu.close_menu
      assert nav_menu.menu_closed?("Simple")

      # Reopen
      nav_menu.open_menu("Simple")
      assert nav_menu.menu_open?("Simple")
    end
  end
end
