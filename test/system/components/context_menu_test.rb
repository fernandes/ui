# frozen_string_literal: true

require "test_helper"

module UI
  class ContextMenuTest < UI::SystemTestCase
    def setup
      visit_component(:context_menu)
    end

    # === Basic Interaction Tests ===

    test "opens context menu via right-click" do
      menu = find_element(UI::Testing::ContextMenuElement, "#phlex-basic [data-controller='ui--context-menu']")

      assert menu.closed?, "Menu should start closed"

      menu.open_via_right_click

      assert menu.open?, "Menu should be open after right-click"
      assert_element_visible menu.content
    end

    test "closes context menu with escape key" do
      menu = find_element(UI::Testing::ContextMenuElement, "#phlex-basic [data-controller='ui--context-menu']")

      menu.open_via_right_click
      assert menu.open?

      menu.press_escape

      assert menu.closed?, "Menu should close with Escape key"
    end

    test "closes context menu when clicking outside" do
      menu = find_element(UI::Testing::ContextMenuElement, "#phlex-basic [data-controller='ui--context-menu']")

      menu.open_via_right_click
      assert menu.open?

      # Click outside the menu
      find("body").click

      assert menu.closed?, "Menu should close when clicking outside"
    end

    test "can click menu items" do
      menu = find_element(UI::Testing::ContextMenuElement, "#phlex-basic [data-controller='ui--context-menu']")

      menu.open_via_right_click
      menu.select_item("Back")

      # Context menus stay open after clicking items (unlike dropdowns)
      # User can close with escape
      menu.close
      assert menu.closed?
    end

    # === Item Tests ===

    test "lists all menu items" do
      menu = find_element(UI::Testing::ContextMenuElement, "#phlex-basic [data-controller='ui--context-menu']")

      menu.open_via_right_click

      items = menu.items
      assert items.any? { |item| item.include?("Back") }, "Should have Back item"
      assert items.any? { |item| item.include?("Reload") }, "Should have Reload item"
    end

    test "checks if menu has specific items" do
      menu = find_element(UI::Testing::ContextMenuElement, "#phlex-basic [data-controller='ui--context-menu']")

      menu.open_via_right_click

      assert menu.has_item?("Back"), "Should have Back item"
      assert menu.has_item?("Forward"), "Should have Forward item"
      assert menu.has_item?("Reload"), "Should have Reload item"
      refute menu.has_item?("NonExistent"), "Should not have NonExistent item"
    end

    test "counts menu items correctly" do
      menu = find_element(UI::Testing::ContextMenuElement, "#erb-basic [data-controller='ui--context-menu']")

      menu.open_via_right_click

      assert_equal 3, menu.item_count, "Should have 3 items (Edit, Duplicate, Delete)"
    end

    # === Disabled Items Tests ===

    test "renders disabled items with correct styling" do
      menu = find_element(UI::Testing::ContextMenuElement, "#phlex-basic [data-controller='ui--context-menu']")

      menu.open_via_right_click

      # Find the Forward item
      forward_item = menu.item("Forward")
      assert forward_item, "Should find Forward item"

      # Check if it has data-disabled attribute (may be empty string or "true")
      # Rails renders data: { disabled: true } as data-disabled without value
      disabled_value = forward_item["data-disabled"]
      assert disabled_value == "" || disabled_value == "true", "Forward should have data-disabled attribute"

      # Check opacity-50 class for visual disabled state
      assert forward_item["class"].include?("data-[disabled]:opacity-50"), "Should have disabled styling classes"
    end

    # === Checkbox Items Tests ===

    test "renders checkbox items with correct initial state" do
      menu = find_element(UI::Testing::ContextMenuElement, "#phlex-basic [data-controller='ui--context-menu']")

      menu.open_via_right_click

      # Initial state: Show Bookmarks Bar is checked
      assert menu.checkbox_checked?("Show Bookmarks Bar"), "Show Bookmarks Bar should be checked initially"

      # Show Full URLs starts unchecked
      refute menu.checkbox_checked?("Show Full URLs"), "Show Full URLs should be unchecked initially"
    end

    test "checkbox items can be clicked" do
      menu = find_element(UI::Testing::ContextMenuElement, "#phlex-basic [data-controller='ui--context-menu']")

      menu.open_via_right_click

      # Click checkbox items (note: state doesn't persist without backend/JS implementation)
      menu.toggle_checkbox("Show Bookmarks Bar")
      menu.toggle_checkbox("Show Full URLs")

      # Menu stays open
      assert menu.open?, "Menu should remain open after clicking checkbox items"
    end

    # === Radio Items Tests ===

    test "renders radio items with correct initial state" do
      menu = find_element(UI::Testing::ContextMenuElement, "#phlex-basic [data-controller='ui--context-menu']")

      menu.open_via_right_click

      # Pedro Duarte is initially selected
      assert menu.radio_selected?("Pedro Duarte"), "Pedro Duarte should be selected initially"
      refute menu.radio_selected?("Colm Tuite"), "Colm Tuite should not be selected initially"
    end

    test "radio items can be clicked" do
      menu = find_element(UI::Testing::ContextMenuElement, "#phlex-basic [data-controller='ui--context-menu']")

      menu.open_via_right_click

      # Click radio items (note: state doesn't persist without backend/JS implementation)
      menu.select_radio("Colm Tuite")

      # Menu stays open
      assert menu.open?, "Menu should remain open after clicking radio items"
    end

    # === Separator Tests ===

    test "counts separators correctly" do
      menu = find_element(UI::Testing::ContextMenuElement, "#phlex-basic [data-controller='ui--context-menu']")

      menu.open_via_right_click

      assert_equal 3, menu.separator_count, "Should have 3 separators in the basic menu"
    end

    # === Shortcut Display Tests ===

    test "displays shortcuts for items" do
      menu = find_element(UI::Testing::ContextMenuElement, "#phlex-basic [data-controller='ui--context-menu']")

      menu.open_via_right_click

      # Check that shortcuts are displayed
      shortcut = menu.item_shortcut("Back")
      assert_equal "⌘[", shortcut, "Back should show ⌘[ shortcut"

      shortcut = menu.item_shortcut("Reload")
      assert_equal "⌘R", shortcut, "Reload should show ⌘R shortcut"
    end

    # === Keyboard Navigation Tests ===

    test "navigates items with arrow keys" do
      menu = find_element(UI::Testing::ContextMenuElement, "#erb-basic [data-controller='ui--context-menu']")

      menu.open_via_right_click
      sleep 0.2 # Wait for initial focus

      # First item should be focused initially
      assert_equal "Edit", menu.focused_item_text, "Edit should be focused initially"

      # Navigate down
      menu.navigate_down
      sleep 0.1
      assert_equal "Duplicate", menu.focused_item_text, "Duplicate should be focused after arrow down"

      # Navigate down again
      menu.navigate_down
      sleep 0.1
      assert_equal "Delete", menu.focused_item_text, "Delete should be focused after second arrow down"

      # Navigate up
      menu.navigate_up
      sleep 0.1
      assert_equal "Duplicate", menu.focused_item_text, "Duplicate should be focused after arrow up"
    end

    test "activates item with enter key" do
      menu = find_element(UI::Testing::ContextMenuElement, "#erb-basic [data-controller='ui--context-menu']")

      menu.open_via_right_click
      sleep 0.2

      # Navigate to second item and activate with Enter
      menu.navigate_down
      sleep 0.1
      menu.press_enter

      assert menu.closed?, "Menu should close after Enter key activation"
    end

    test "wraps around when navigating past last item" do
      menu = find_element(UI::Testing::ContextMenuElement, "#erb-basic [data-controller='ui--context-menu']")

      menu.open_via_right_click
      sleep 0.2

      # Navigate to last item
      menu.navigate_down # Edit -> Duplicate
      menu.navigate_down # Duplicate -> Delete
      sleep 0.1
      assert_equal "Delete", menu.focused_item_text

      # Navigate past last item should wrap to first
      menu.navigate_down
      sleep 0.1
      assert_equal "Edit", menu.focused_item_text, "Should wrap around to first item"
    end

    test "wraps around when navigating before first item" do
      menu = find_element(UI::Testing::ContextMenuElement, "#erb-basic [data-controller='ui--context-menu']")

      menu.open_via_right_click
      sleep 0.2

      # First item should be focused
      assert_equal "Edit", menu.focused_item_text

      # Navigate up from first item should wrap to last
      menu.navigate_up
      sleep 0.1
      assert_equal "Delete", menu.focused_item_text, "Should wrap around to last item"
    end

    # === ARIA Attributes Tests ===

    test "trigger renders correctly" do
      menu = find_element(UI::Testing::ContextMenuElement, "#phlex-basic [data-controller='ui--context-menu']")

      # Trigger should exist and have the correct data target
      assert menu.trigger, "Trigger should exist"
      assert_equal "trigger", menu.trigger["data-ui--context-menu-target"]
    end

    test "content has correct role" do
      menu = find_element(UI::Testing::ContextMenuElement, "#phlex-basic [data-controller='ui--context-menu']")

      menu.open_via_right_click

      assert_equal "menu", menu.content_role, "Content should have role='menu'"
    end

    # === Icons Test ===

    test "renders menu items with icons" do
      menu = find_element(UI::Testing::ContextMenuElement, "#phlex-icons [data-controller='ui--context-menu']")

      menu.open_via_right_click

      assert menu.has_item?("Copy"), "Should have Copy item with icon"
      assert menu.has_item?("Cut"), "Should have Cut item with icon"
      assert menu.has_item?("Paste"), "Should have Paste item with icon"
      assert menu.has_item?("Delete"), "Should have Delete item with icon"
    end

    # === Destructive Variant Test ===

    test "renders destructive variant items" do
      menu = find_element(UI::Testing::ContextMenuElement, "#phlex-icons [data-controller='ui--context-menu']")

      menu.open_via_right_click

      # Find the Delete item - it should have destructive styling
      delete_item = menu.item("Delete")
      assert delete_item, "Should find Delete item"
      # The destructive variant adds text-destructive class
      assert delete_item["class"].include?("text-destructive"), "Delete should have destructive styling"
    end

    # === ViewComponent Tests ===

    test "works with ViewComponent implementation" do
      menu = find_element(UI::Testing::ContextMenuElement, "#vc-basic [data-controller='ui--context-menu']")

      menu.open_via_right_click
      assert menu.open?

      assert menu.has_item?("New Tab")
      assert menu.has_item?("New Window")
      assert menu.has_item?("Settings")

      menu.select_item("Settings")
      assert menu.open?, "Menu should remain open after clicking item"

      menu.close
      assert menu.closed?
    end

    test "ViewComponent complete example has all features" do
      menu = find_element(UI::Testing::ContextMenuElement, "#vc-complete [data-controller='ui--context-menu']")

      menu.open_via_right_click

      # Check items exist
      assert menu.has_item?("Profile")
      assert menu.has_item?("Team")
      assert menu.has_item?("Delete Account")

      # Check separator exists
      assert menu.separator_count >= 2, "Should have at least 2 separators"

      # Check destructive item
      delete_item = menu.item("Delete Account")
      assert delete_item["class"].include?("text-destructive"), "Delete Account should have destructive styling"
    end
  end
end
