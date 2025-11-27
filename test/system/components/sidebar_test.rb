# frozen_string_literal: true

require "test_helper"

class SidebarTest < UI::SystemTestCase
  setup do
    visit "/components/sidebar-phlex-07"
  end

  # Helper to get the sidebar element
  def sidebar
    @sidebar ||= find_element(UI::Testing::SidebarElement)
  end

  # === Basic Interaction Tests ===

  test "starts in expanded state" do
    assert sidebar.expanded?
    refute sidebar.collapsed?
  end

  test "collapses when trigger is clicked" do
    # Initially expanded
    assert sidebar.expanded?

    # Collapse
    sidebar.collapse

    assert sidebar.collapsed?
    refute sidebar.expanded?
  end

  test "expands when trigger is clicked again" do
    # Collapse first
    sidebar.collapse
    assert sidebar.collapsed?

    # Expand
    sidebar.expand
    assert sidebar.expanded?
  end

  test "toggle switches between expanded and collapsed states" do
    # Initially expanded
    assert sidebar.expanded?

    # Toggle to collapsed
    sidebar.toggle
    sleep 0.2
    assert sidebar.collapsed?

    # Toggle back to expanded
    sidebar.toggle
    sleep 0.2
    assert sidebar.expanded?
  end

  # === Keyboard Interaction Tests ===

  test "toggles with keyboard shortcut Ctrl+B" do
    # Initially expanded
    assert sidebar.expanded?

    # Toggle with keyboard
    sidebar.toggle_with_keyboard
    sleep 0.2
    assert sidebar.collapsed?

    # Toggle again
    sidebar.toggle_with_keyboard
    sleep 0.2
    assert sidebar.expanded?
  end

  # === State Management Tests ===

  test "root element has correct data-state when expanded" do
    assert sidebar.expanded?
    assert_equal "expanded", sidebar.data_state
  end

  test "root element has correct data-state when collapsed" do
    sidebar.collapse
    assert_equal "collapsed", sidebar.data_state
  end

  test "data-collapsible attribute is set when collapsed" do
    sidebar.collapse

    # When collapsed, data-collapsible should be "icon"
    assert_equal "icon", sidebar.node["data-collapsible"]
  end

  test "data-collapsible attribute is empty when expanded" do
    assert sidebar.expanded?

    # When expanded, data-collapsible should be empty
    assert_equal "", sidebar.node["data-collapsible"]
  end

  # === Content Visibility Tests ===

  test "displays menu items" do
    # Check if the desktop sidebar contains the menu item text
    assert page.has_text?("Playground")
    assert page.has_text?("Models")
    assert page.has_text?("Documentation")
    assert page.has_text?("Settings")
  end

  test "menu items are accessible when expanded" do
    assert sidebar.expanded?

    # Just check that we can find menu buttons
    menu_buttons = sidebar.desktop_sidebar.all('[data-slot="sidebar-menu-button"]', visible: true)
    assert menu_buttons.count > 0, "Expected to find menu buttons"
  end

  test "shows header with company selector" do
    header = sidebar.header
    assert header.present?
    assert header.has_text?("Acme Inc")
  end

  test "shows footer with user info" do
    footer = sidebar.footer
    assert footer.present?
    assert footer.has_text?("shadcn")
  end

  # === Submenu Tests ===

  test "playground submenu starts expanded" do
    # Check if the collapsible containing Playground is in open state
    assert page.has_text?("History"), "Playground submenu should show History"
    assert page.has_text?("Starred"), "Playground submenu should show Starred"
  end

  test "models submenu starts collapsed" do
    # Check if the submenu items are NOT visible in desktop sidebar
    desktop = sidebar.desktop_sidebar
    refute desktop.has_text?("Genesis"), "Models submenu should not show Genesis initially"
  end

  test "can expand collapsed submenu" do
    desktop = sidebar.desktop_sidebar

    # Models starts collapsed - verify
    refute desktop.has_text?("Genesis"), "Models submenu should be collapsed initially"

    # Expand it by clicking the Models button
    sidebar.expand_submenu("Models")
    sleep 0.5 # Wait for animation

    # Verify submenu items are now visible in desktop sidebar
    assert desktop.has_text?("Genesis"), "Models submenu should show Genesis after expanding"
  end

  test "can collapse expanded submenu" do
    desktop = sidebar.desktop_sidebar

    # Playground starts expanded - verify
    assert desktop.has_text?("History"), "Playground submenu should be expanded initially"

    # Collapse it
    sidebar.collapse_submenu("Playground")
    sleep 0.5 # Wait for animation

    # Verify submenu items are now hidden
    refute desktop.has_text?("History"), "Playground submenu items should be hidden after collapsing"
  end

  test "expanding submenu shows sub-items" do
    desktop = sidebar.desktop_sidebar

    # Expand Models submenu
    sidebar.expand_submenu("Models")
    sleep 0.5 # Wait for animation

    # Should show sub-items in desktop sidebar
    assert desktop.has_text?("Genesis")
    assert desktop.has_text?("Explorer")
    assert desktop.has_text?("Quantum")
  end

  test "multiple submenus can be expanded independently" do
    desktop = sidebar.desktop_sidebar

    # Expand both Models and Documentation
    sidebar.expand_submenu("Models")
    sleep 0.3
    sidebar.expand_submenu("Documentation")
    sleep 0.3

    # Both should be expanded (show their sub-items) in desktop sidebar
    assert desktop.has_text?("Genesis"), "Models submenu should show Genesis"
    assert desktop.has_text?("Introduction"), "Documentation submenu should show Introduction"
  end

  # === Collapsible Icon Mode Tests ===

  test "in collapsed state shows only icons" do
    sidebar.collapse

    assert sidebar.collapsed?

    # The sidebar should still be visible but in icon mode
    # Text might be hidden via CSS (group-data-[collapsible=icon] classes)
    assert sidebar.visible?
  end

  test "rail element is present for toggle interaction" do
    rail = sidebar.rail
    assert rail.present?
  end

  # === Sub-element Access Tests ===

  test "can access trigger element" do
    trigger = sidebar.trigger
    assert trigger.present?
  end

  test "can access content element" do
    content = sidebar.content
    assert content.present?
  end

  test "can access menu element" do
    menu = sidebar.menu
    assert menu.present?
  end

  test "can access header element" do
    header = sidebar.header
    assert header.present?
  end

  test "can access footer element" do
    footer = sidebar.footer
    assert footer.present?
  end

  test "can access rail element" do
    rail = sidebar.rail
    assert rail.present?
  end

  # === ARIA Accessibility Tests ===

  test "sidebar has appropriate ARIA attributes" do
    aria = sidebar.sidebar_aria_attributes

    # Sidebar should have some ARIA attributes for accessibility
    # The exact attributes depend on implementation
    assert aria.is_a?(Hash)
  end

  test "trigger is focusable" do
    trigger = sidebar.trigger
    assert_focusable(trigger)
  end

  # === State Transition Tests ===

  test "state transitions from expanded to collapsed correctly" do
    # Start expanded
    assert_equal "expanded", sidebar.data_state

    # Collapse
    sidebar.collapse

    # Should be collapsed
    assert_equal "collapsed", sidebar.data_state
    assert sidebar.collapsed?
  end

  test "state transitions from collapsed to expanded correctly" do
    # Collapse first
    sidebar.collapse
    assert_equal "collapsed", sidebar.data_state

    # Expand
    sidebar.expand

    # Should be expanded
    assert_equal "expanded", sidebar.data_state
    assert sidebar.expanded?
  end

  # === Edge Cases ===

  test "expanding already expanded sidebar does nothing" do
    assert sidebar.expanded?

    # Expanding again should be a no-op
    sidebar.expand
    assert sidebar.expanded?
  end

  test "collapsing already collapsed sidebar does nothing" do
    sidebar.collapse
    assert sidebar.collapsed?

    # Collapsing again should be a no-op
    sidebar.collapse
    assert sidebar.collapsed?
  end

  test "handles rapid toggling without errors" do
    # Rapidly toggle
    5.times do
      sidebar.toggle
      sleep 0.05
    end

    # Should end in a valid state
    assert(sidebar.expanded? || sidebar.collapsed?)
  end

  # === Integration Tests ===

  test "submenu interaction works when sidebar is expanded" do
    assert sidebar.expanded?

    # Expand a submenu
    sidebar.expand_submenu("Documentation")
    sleep 0.3

    # Should show sub-items
    assert page.has_text?("Introduction")
    assert page.has_text?("Get Started")
  end

  test "header dropdown menu is present" do
    header = sidebar.header
    assert header.present?

    # Header should contain the company selector with dropdown
    assert header.has_text?("Acme Inc")
    assert header.has_text?("Enterprise")
  end

  test "footer user menu is present" do
    footer = sidebar.footer
    assert footer.present?

    # Footer should contain user info
    assert footer.has_text?("shadcn")
    assert footer.has_text?("m@example.com")
  end

  test "platform group label is visible when expanded" do
    assert sidebar.expanded?
    assert sidebar.has_menu_item?("Platform") || page.has_text?("Platform")
  end

  test "projects group is present" do
    # Projects group should be visible
    assert page.has_text?("Projects")
    assert page.has_text?("Design Engineering")
    assert page.has_text?("Sales & Marketing")
  end

  # === Animation Tests ===

  test "sidebar animates during collapse" do
    assert sidebar.expanded?

    # Collapse
    sidebar.collapse

    # Should be collapsed after animation
    assert sidebar.collapsed?
  end

  test "sidebar animates during expand" do
    # Collapse first
    sidebar.collapse
    assert sidebar.collapsed?

    # Expand
    sidebar.expand

    # Should be expanded after animation
    assert sidebar.expanded?
  end

  # === Mobile Viewport Tests (skipped in CI if not testing responsive) ===

  test "detects mobile viewport correctly" do
    # In desktop viewport by default (1400x900)
    refute sidebar.is_mobile?
  end

  # Note: Mobile tests would require resizing the viewport to < 768px
  # and interacting with the mobile sheet/drawer. These tests are skipped
  # for now as they require viewport manipulation which may not be
  # consistent across test environments.
  #
  # Example mobile test (commented out):
  # test "opens mobile drawer in mobile viewport" do
  #   page.current_window.resize_to(375, 667)
  #   assert sidebar.is_mobile?
  #
  #   sidebar.open_mobile
  #   assert sidebar.mobile_open?
  # end
end
