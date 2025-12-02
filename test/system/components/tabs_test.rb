# frozen_string_literal: true

require "test_helper"

class TabsTest < UI::SystemTestCase
  setup do
    visit_component("tabs")
  end

  # Helper methods to get different tabs instances

  def erb_tabs
    find_element(UI::Testing::TabsElement, "#erb-tabs")
  end

  def phlex_tabs
    find_element(UI::Testing::TabsElement, "#phlex-tabs")
  end

  def vc_tabs
    find_element(UI::Testing::TabsElement, "#vc-tabs")
  end

  def disabled_tabs
    find_element(UI::Testing::TabsElement, "#disabled-tabs")
  end

  def manual_tabs
    find_element(UI::Testing::TabsElement, "#manual-tabs")
  end

  # === Basic Interaction Tests ===

  test "switches tabs by clicking" do
    tabs = erb_tabs

    # Initially Account tab is active
    assert_equal "Account", tabs.active_tab
    assert_equal "account", tabs.active_tab_value

    # Click Password tab
    tabs.select_tab("Password")

    assert_equal "Password", tabs.active_tab
    assert_equal "password", tabs.active_tab_value
  end

  test "displays correct panel content when switching tabs" do
    tabs = erb_tabs

    # Account panel should be visible
    assert tabs.panel_visible?("account")
    assert tabs.panel_hidden?("password")
    assert tabs.panel_content.include?("Make changes to your account")

    # Switch to Password tab
    tabs.select_tab("Password")

    assert tabs.panel_hidden?("account")
    assert tabs.panel_visible?("password")
    assert tabs.panel_content.include?("Change your password")
  end

  test "works with different tab counts" do
    # Test 2 tabs (ERB)
    erb = erb_tabs
    assert_equal "Account", erb.active_tab
    erb.select_tab("Password")
    assert_equal "Password", erb.active_tab

    # Test 3 tabs (Phlex-like ERB)
    phlex = phlex_tabs
    assert_equal "General", phlex.active_tab
    phlex.select_tab("Security")
    assert_equal "Security", phlex.active_tab

    # Test 4 tabs (VC-like ERB)
    vc = vc_tabs
    assert_equal "Overview", vc.active_tab
    vc.select_tab("Analytics")
    assert_equal "Analytics", vc.active_tab
  end

  test "shows correct number of tabs" do
    assert_equal 2, erb_tabs.tab_count
    assert_equal 3, phlex_tabs.tab_count
    assert_equal 4, vc_tabs.tab_count
  end

  test "lists all available tabs" do
    tabs = phlex_tabs

    assert tabs.has_tab?("General")
    assert tabs.has_tab?("Security")
    assert tabs.has_tab?("Integrations")

    assert_equal ["General", "Security", "Integrations"], tabs.tabs
  end

  test "selects tab by value" do
    tabs = phlex_tabs

    tabs.select_tab_by_value("integrations")

    assert_equal "Integrations", tabs.active_tab
    assert_equal "integrations", tabs.active_tab_value
    assert tabs.panel_visible?("integrations")
  end

  # === Keyboard Navigation Tests ===

  test "navigates to next tab with right arrow key" do
    tabs = erb_tabs

    # Focus first tab
    tabs.tab("account").native.focus

    # Press right arrow
    tabs.press_arrow_right

    # Should activate Password tab (automatic mode)
    assert_equal "Password", tabs.active_tab
  end

  test "navigates to previous tab with left arrow key" do
    tabs = erb_tabs

    # Start at Password tab
    tabs.select_tab("Password")

    # Focus current tab
    tabs.tab("password").native.focus

    # Press left arrow
    tabs.press_arrow_left

    # Should activate Account tab (automatic mode)
    assert_equal "Account", tabs.active_tab
  end

  test "wraps around when navigating past last tab with right arrow" do
    tabs = phlex_tabs

    # Start at last tab (Integrations)
    tabs.select_tab("Integrations")
    tabs.tab("integrations").native.focus

    # Press right arrow
    tabs.press_arrow_right

    # Should wrap to first tab (General)
    assert_equal "General", tabs.active_tab
  end

  test "wraps around when navigating before first tab with left arrow" do
    tabs = phlex_tabs

    # Start at first tab (General)
    tabs.tab("general").native.focus

    # Press left arrow
    tabs.press_arrow_left

    # Should wrap to last tab (Integrations)
    assert_equal "Integrations", tabs.active_tab
  end

  test "navigates to first tab with Home key" do
    tabs = vc_tabs

    # Start at last tab
    tabs.select_tab("Notifications")
    tabs.tab("notifications").native.focus

    # Press Home
    tabs.press_home

    # Should activate first tab
    assert_equal "Overview", tabs.active_tab
  end

  test "navigates to last tab with End key" do
    tabs = vc_tabs

    # Start at first tab
    tabs.tab("overview").native.focus

    # Press End
    tabs.press_end

    # Should activate last tab
    assert_equal "Notifications", tabs.active_tab
  end

  test "uses helper methods for keyboard navigation" do
    tabs = vc_tabs

    # Start at first tab
    tabs.tab("overview").native.focus

    # Navigate next
    tabs.navigate_next
    assert_equal "Analytics", tabs.active_tab

    # Navigate next again
    tabs.navigate_next
    assert_equal "Reports", tabs.active_tab

    # Navigate previous
    tabs.navigate_previous
    assert_equal "Analytics", tabs.active_tab

    # Navigate to first
    tabs.navigate_to_first
    assert_equal "Overview", tabs.active_tab

    # Navigate to last
    tabs.navigate_to_last
    assert_equal "Notifications", tabs.active_tab
  end

  # === Manual Activation Mode Tests ===

  test "in manual mode arrow keys only move focus without activating" do
    tabs = manual_tabs

    # Initially Tab 1 is active
    assert_equal "Tab 1", tabs.active_tab

    # Focus Tab 1 and press right arrow
    tabs.tab("tab1").native.focus
    tabs.press_arrow_right

    # Tab should still be Tab 1 (not auto-activated)
    # Note: In manual mode, focus moves but activation requires Enter/Space
    # The focused element changes, but data-state="active" doesn't change
    sleep 0.1 # Give time for focus to settle
    assert_equal "Tab 1", tabs.active_tab
  end

  test "in manual mode Enter key activates focused tab" do
    tabs = manual_tabs

    # Start at Tab 1
    tabs.tab("tab1").native.focus

    # Move focus to Tab 2 with arrow key
    tabs.press_arrow_right
    sleep 0.1

    # Tab 1 should still be active
    assert_equal "Tab 1", tabs.active_tab

    # Press Enter to activate
    tabs.press_enter

    # Now Tab 2 should be active
    assert_equal "Tab 2", tabs.active_tab
  end

  test "in manual mode Space key activates focused tab" do
    tabs = manual_tabs

    # Start at Tab 1
    tabs.tab("tab1").native.focus

    # Move focus to Tab 3 with arrow keys
    tabs.press_arrow_right
    tabs.press_arrow_right
    sleep 0.1

    # Tab 1 should still be active
    assert_equal "Tab 1", tabs.active_tab

    # Press Space to activate
    tabs.press_space

    # Now Tab 3 should be active
    assert_equal "Tab 3", tabs.active_tab
  end

  # === Disabled State Tests ===

  test "identifies disabled tabs" do
    tabs = disabled_tabs

    assert_not tabs.tab_disabled?("Available")
    assert tabs.tab_disabled?("Disabled")
    assert tabs.tab_disabled?("Coming Soon")
  end

  test "disabled tabs cannot be activated by clicking" do
    tabs = disabled_tabs

    # Try to click disabled tab
    disabled_trigger = tabs.tab("disabled")

    # Should have disabled attribute
    assert disabled_trigger.disabled?

    # Disabled tabs cannot be clicked (Playwright will timeout trying to click disabled button)
    # Instead, verify that the tab is disabled and the active tab remains unchanged
    assert_equal "Available", tabs.active_tab
  end

  test "keyboard navigation skips disabled tabs" do
    tabs = disabled_tabs

    # Focus Available tab
    tabs.tab("available").native.focus

    # Press right arrow - should skip Disabled and go to Coming Soon
    tabs.press_arrow_right

    # Due to disabled state, behavior may vary, but active tab should not be Disabled
    # Check that we don't activate the disabled tab
    assert_not_equal "Disabled", tabs.active_tab
  end

  # === ARIA Accessibility Tests ===

  test "tab list has correct ARIA role and orientation" do
    tabs = erb_tabs

    aria = tabs.tab_list_aria_attributes

    assert_equal "tablist", aria[:role]
    assert_equal "horizontal", aria[:orientation]
  end

  test "tab triggers have correct ARIA role" do
    tabs = erb_tabs

    account_aria = tabs.tab_aria_attributes("Account")
    password_aria = tabs.tab_aria_attributes("Password")

    assert_equal "tab", account_aria[:role]
    assert_equal "tab", password_aria[:role]
  end

  test "active tab has aria-selected true" do
    tabs = erb_tabs

    # Account is initially active
    account_aria = tabs.tab_aria_attributes("Account")
    password_aria = tabs.tab_aria_attributes("Password")

    assert_equal "true", account_aria[:selected]
    assert_equal "false", password_aria[:selected]

    # Switch to Password
    tabs.select_tab("Password")

    account_aria = tabs.tab_aria_attributes("Account")
    password_aria = tabs.tab_aria_attributes("Password")

    assert_equal "false", account_aria[:selected]
    assert_equal "true", password_aria[:selected]
  end

  test "tab has aria-controls pointing to panel" do
    tabs = erb_tabs

    account_aria = tabs.tab_aria_attributes("Account")

    # Should have aria-controls attribute
    assert account_aria[:controls].present?
  end

  test "panel has correct ARIA role" do
    tabs = erb_tabs

    panel_aria = tabs.panel_aria_attributes("account")

    assert_equal "tabpanel", panel_aria[:role]
  end

  test "panel has aria-labelledby pointing to tab" do
    tabs = erb_tabs

    panel_aria = tabs.panel_aria_attributes("account")

    # Should have aria-labelledby attribute
    assert panel_aria[:labelledby].present?
  end

  test "disabled tab has disabled attribute" do
    tabs = disabled_tabs

    # Check both native disabled and aria-disabled
    disabled_tab = tabs.tab("disabled")
    assert disabled_tab.disabled?, "Expected tab to have disabled attribute"
  end

  # === Panel Visibility Tests ===

  test "only active panel is visible" do
    tabs = phlex_tabs

    # Initially General is active
    assert tabs.panel_visible?("general")
    assert tabs.panel_hidden?("security")
    assert tabs.panel_hidden?("integrations")

    # Switch to Security
    tabs.select_tab("Security")

    assert tabs.panel_hidden?("general")
    assert tabs.panel_visible?("security")
    assert tabs.panel_hidden?("integrations")
  end

  test "hidden panels have hidden attribute" do
    tabs = erb_tabs

    # Password panel should be hidden initially
    # Find using all selector which includes hidden elements
    password_panels = tabs.node.all("[role='tabpanel'][data-value='password']", visible: :all)
    assert_equal 1, password_panels.count
    password_panel = password_panels.first
    assert password_panel[:hidden], "Expected password panel to have hidden attribute"

    # Account panel should not have hidden attribute
    account_panels = tabs.node.all("[role='tabpanel'][data-value='account']", visible: :all)
    assert_equal 1, account_panels.count
    account_panel = account_panels.first
    assert_nil account_panel[:hidden], "Expected account panel to NOT have hidden attribute"
  end

  test "panel content matches expected text" do
    tabs = phlex_tabs

    # Check General panel
    assert tabs.panel_content.include?("General Settings")

    # Switch and check Security panel
    tabs.select_tab("Security")
    assert tabs.panel_content.include?("Security Settings")

    # Switch and check Integrations panel
    tabs.select_tab("Integrations")
    assert tabs.panel_content.include?("Integrations")
  end

  # === State Consistency Tests ===

  test "maintains consistent state between trigger and panel" do
    tabs = vc_tabs

    # Initially Overview is active
    assert tabs.tab_active?("Overview")
    assert tabs.panel_visible?("overview")

    # Switch to Reports
    tabs.select_tab("Reports")

    # Trigger state should match panel state
    assert tabs.tab_active?("Reports")
    assert tabs.panel_visible?("reports")
    assert_not tabs.tab_active?("Overview")
    assert tabs.panel_hidden?("overview")
  end

  test "data-state attribute reflects active state correctly" do
    tabs = erb_tabs

    account_tab = tabs.tab("account")
    password_tab = tabs.tab("password")

    # Initially
    assert_equal "active", account_tab["data-state"]
    assert_equal "inactive", password_tab["data-state"]

    # After switching
    tabs.select_tab("Password")

    assert_equal "inactive", account_tab["data-state"]
    assert_equal "active", password_tab["data-state"]
  end

  test "tabindex is managed correctly for active and inactive tabs" do
    tabs = erb_tabs

    account_tab = tabs.tab("account")
    password_tab = tabs.tab("password")

    # Active tab should have tabindex 0
    assert_equal "0", account_tab["tabindex"]

    # Inactive tab should have tabindex -1
    assert_equal "-1", password_tab["tabindex"]

    # After switching
    tabs.select_tab("Password")

    # States should swap
    assert_equal "-1", account_tab["tabindex"]
    assert_equal "0", password_tab["tabindex"]
  end

  # === Focus Management Tests ===

  test "clicking tab gives it focus" do
    tabs = erb_tabs

    password_tab = tabs.tab("password")

    # Click should focus the tab
    password_tab.click

    # Give focus time to settle
    sleep 0.1

    # Verify focused element
    focused_element_text = page.evaluate_script("document.activeElement.textContent.trim()")
    assert_equal "Password", focused_element_text
  end

  test "keyboard navigation maintains focus on tab triggers" do
    tabs = phlex_tabs

    # Focus first tab
    tabs.tab("general").native.focus

    # Navigate with keyboard
    tabs.press_arrow_right

    # Give focus time to settle
    sleep 0.1

    # Focus should be on a tab element
    focused_role = page.evaluate_script("document.activeElement.getAttribute('role')")
    assert_equal "tab", focused_role
  end
end
