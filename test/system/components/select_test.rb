# frozen_string_literal: true

require "test_helper"

class SelectTest < UI::SystemTestCase
  setup do
    visit_component("select")
  end

  # Helper to get the basic fruits select by ID
  def fruits_select
    find_element(UI::Testing::SelectElement, "#fruits-select")
  end

  # Helper to get the timezone select by ID
  def timezone_select
    find_element(UI::Testing::SelectElement, "#timezone-select")
  end

  # Helper to get the frameworks select by ID
  def frameworks_select
    find_element(UI::Testing::SelectElement, "#frameworks-select")
  end

  # === Basic Interaction Tests ===

  test "selects an option by clicking" do
    select = fruits_select

    select.select("Banana")

    assert_equal "Banana", select.selected
    assert_equal "banana", select.selected_value
  end

  test "opens and closes dropdown" do
    select = fruits_select

    # Initially closed
    assert select.closed?

    # Open
    select.open
    assert select.open?

    # Close
    select.close
    assert select.closed?
  end

  test "shows all available options when opened" do
    select = fruits_select

    select.open

    assert select.has_option?("Apple")
    assert select.has_option?("Banana")
    assert select.has_option?("Orange")
    assert select.has_option?("Grape")
    assert select.has_option?("Mango")
  end

  test "closes after selecting an option" do
    select = fruits_select

    select.open
    assert select.open?

    select.select("Orange")

    assert select.closed?
    assert_equal "Orange", select.selected
  end

  # === Keyboard Navigation Tests ===

  test "opens with Enter key" do
    select = fruits_select

    # Focus trigger without opening (Tab to it or use native focus)
    select.trigger.native.focus
    select.press_enter

    assert select.open?
  end

  test "opens with Space key" do
    select = fruits_select

    # Focus trigger without opening
    select.trigger.native.focus
    select.press_space

    assert select.open?
  end

  test "closes with Escape key" do
    select = fruits_select

    select.open
    assert select.open?

    select.press_escape

    assert select.closed?
  end

  test "navigates options with arrow keys" do
    select = fruits_select

    select.open

    # Navigate down
    select.navigate_down
    select.navigate_down

    # Highlighted option should change
    assert select.highlighted_option.present?
  end

  test "selects highlighted option with Enter" do
    select = fruits_select

    select.open
    select.navigate_down # Move to second option
    select.press_enter

    # Should have selected and closed
    assert select.closed?
  end

  test "navigates to first option with Home key" do
    select = fruits_select

    select.open
    select.navigate_down
    select.navigate_down
    select.navigate_down
    select.navigate_to_first

    assert_equal "Apple", select.highlighted_option
  end

  test "navigates to last option with End key" do
    select = fruits_select

    select.open
    select.navigate_to_last

    assert_equal "Mango", select.highlighted_option
  end

  # === ARIA Accessibility Tests ===

  test "trigger has correct ARIA attributes when closed" do
    select = fruits_select

    aria = select.trigger_aria_attributes

    assert_equal "combobox", aria[:role]
    assert_equal "listbox", aria[:haspopup]
    assert_equal "false", aria[:expanded]
  end

  test "trigger has correct ARIA attributes when open" do
    select = fruits_select

    select.open
    aria = select.trigger_aria_attributes

    assert_equal "true", aria[:expanded]
  end

  test "content has listbox role" do
    select = fruits_select

    select.open

    assert_equal "listbox", select.content_role
  end

  test "trigger is focusable" do
    select = fruits_select

    assert_focusable(select.trigger)
  end

  # === Scrollable Select Tests ===

  test "scrollable select shows scroll buttons when needed" do
    select = timezone_select

    select.open

    # With 30+ items, scroll down should be visible
    assert select.scroll_down_visible?
  end

  # === Disabled Items Tests ===

  test "disabled items cannot be selected" do
    select = frameworks_select

    select.open

    # Verify Angular (Coming Soon) is disabled
    assert select.option_disabled?("Angular (Coming Soon)")
  end

  # === State Persistence Tests ===

  test "maintains selection after closing and reopening" do
    select = fruits_select

    select.select("Grape")
    assert_equal "Grape", select.selected

    select.open
    select.close

    assert_equal "Grape", select.selected
  end
end
