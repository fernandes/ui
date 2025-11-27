# frozen_string_literal: true

require "test_helper"

class ToggleGroupTest < UI::SystemTestCase
  setup do
    visit_component("toggle_group")
  end

  # Helper methods to get different toggle group instances

  def single_default_group
    find_element(UI::Testing::ToggleGroupElement, "#single-default")
  end

  def single_outline_group
    find_element(UI::Testing::ToggleGroupElement, "#single-outline")
  end

  def multiple_group
    find_element(UI::Testing::ToggleGroupElement, "#multiple-group")
  end

  def size_sm_group
    find_element(UI::Testing::ToggleGroupElement, "#size-sm")
  end

  def size_default_group
    find_element(UI::Testing::ToggleGroupElement, "#size-default")
  end

  def size_lg_group
    find_element(UI::Testing::ToggleGroupElement, "#size-lg")
  end

  def spacing_group
    find_element(UI::Testing::ToggleGroupElement, "#spacing-group")
  end

  def interactive_single_group
    find_element(UI::Testing::ToggleGroupElement, "#interactive-single")
  end

  def interactive_multiple_group
    find_element(UI::Testing::ToggleGroupElement, "#interactive-multiple")
  end

  # === Single Selection Tests ===

  test "single selection mode allows only one item to be selected" do
    group = single_default_group

    # Select first item
    group.select_item("left")
    assert group.selected?("left")
    assert_not group.selected?("center")
    assert_not group.selected?("right")

    # Select second item - first should be deselected
    group.select_item("center")
    assert_not group.selected?("left")
    assert group.selected?("center")
    assert_not group.selected?("right")
  end

  test "single selection mode allows deselecting by clicking same item" do
    group = single_default_group

    # Select an item
    group.select_item("left")
    assert group.selected?("left")

    # Click same item to deselect
    group.toggle_item("left")
    assert_not group.selected?("left")
    assert_equal [], group.selected_items
  end

  test "single selection mode with initial value" do
    group = single_outline_group

    # Should have italic selected initially (from value: "italic" in showcase)
    assert group.selected?("italic")
    assert_not group.selected?("bold")
    assert_not group.selected?("underline")
  end

  # === Multiple Selection Tests ===

  test "multiple selection mode allows multiple items to be selected" do
    group = interactive_multiple_group

    # Select multiple items
    group.toggle_item("feature-a")
    group.toggle_item("feature-b")

    assert group.selected?("feature-a")
    assert group.selected?("feature-b")
    assert_not group.selected?("feature-c")
    assert_equal ["feature-a", "feature-b"], group.selected_items.sort
  end

  test "multiple selection mode allows deselecting items" do
    group = multiple_group

    # Should have bold and italic selected initially
    assert group.selected?("bold")
    assert group.selected?("italic")

    # Deselect one
    group.toggle_item("bold")
    assert_not group.selected?("bold")
    assert group.selected?("italic")

    # Deselect the other
    group.toggle_item("italic")
    assert_not group.selected?("italic")
    assert_equal [], group.selected_items
  end

  test "multiple selection mode with initial values" do
    group = multiple_group

    # Should have bold and italic selected initially (from value: ["bold", "italic"])
    assert group.selected?("bold")
    assert group.selected?("italic")
    assert_not group.selected?("underline")
    assert_not group.selected?("strikethrough")
  end

  # === Type Detection Tests ===

  test "detects single selection type" do
    group = single_default_group

    assert_equal "single", group.type
    assert group.single_selection?
    assert_not group.multiple_selection?
  end

  test "detects multiple selection type" do
    group = multiple_group

    assert_equal "multiple", group.type
    assert group.multiple_selection?
    assert_not group.single_selection?
  end

  # === Item Count and Values Tests ===

  test "returns correct item count" do
    assert_equal 3, single_default_group.item_count
    assert_equal 3, single_outline_group.item_count
    assert_equal 4, multiple_group.item_count
  end

  test "returns all item values" do
    assert_equal ["left", "center", "right"], single_default_group.item_values
    assert_equal ["bold", "italic", "underline"], single_outline_group.item_values
    assert_equal ["bold", "italic", "underline", "strikethrough"], multiple_group.item_values
  end

  # === ARIA Accessibility Tests ===

  test "single selection mode has radiogroup role" do
    group = single_default_group

    aria = group.group_aria_attributes
    assert_equal "radiogroup", aria[:role]
  end

  test "multiple selection mode has group role" do
    group = multiple_group

    aria = group.group_aria_attributes
    assert_equal "group", aria[:role]
  end

  test "single selection mode items have aria-checked attribute" do
    group = single_default_group

    # Select an item
    group.select_item("left")

    # Check ARIA attributes
    left_aria = group.item_aria_attributes("left")
    center_aria = group.item_aria_attributes("center")

    assert_equal "true", left_aria[:checked]
    assert_equal "false", center_aria[:checked]
  end

  test "multiple selection mode items have aria-pressed attribute" do
    group = multiple_group

    # bold and italic should be pressed initially
    bold_aria = group.item_aria_attributes("bold")
    italic_aria = group.item_aria_attributes("italic")
    underline_aria = group.item_aria_attributes("underline")

    assert_equal "true", bold_aria[:pressed]
    assert_equal "true", italic_aria[:pressed]
    assert_equal "false", underline_aria[:pressed]
  end

  test "single selection items have radio role implicitly" do
    group = single_default_group

    # Items in radiogroup should have radio role
    aria = group.item_aria_attributes("left")
    assert_equal "radio", aria[:role]
  end

  # === Data State Tests ===

  test "selected items have data-state on" do
    group = single_default_group

    group.select_item("left")

    left_item = group.item("left")
    center_item = group.item("center")

    assert_equal "on", left_item["data-state"]
    assert_equal "off", center_item["data-state"]
  end

  test "data-state updates correctly in multiple mode" do
    group = interactive_multiple_group

    group.toggle_item("feature-a")
    group.toggle_item("feature-b")

    feature_a = group.item("feature-a")
    feature_b = group.item("feature-b")
    feature_c = group.item("feature-c")

    assert_equal "on", feature_a["data-state"]
    assert_equal "on", feature_b["data-state"]
    assert_equal "off", feature_c["data-state"]
  end

  # === Keyboard Activation Tests ===

  test "supports Enter key to activate focused item" do
    group = interactive_single_group

    # Focus first item
    option1 = group.item("1")
    option1.native.focus

    # Press Enter
    group.press_enter
    sleep 0.1

    # Item should be selected
    assert group.selected?("1")
  end

  test "supports Space key to activate focused item" do
    group = interactive_single_group

    # Focus second item
    option2 = group.item("2")
    option2.native.focus

    # Press Space
    group.press_space
    sleep 0.1

    # Item should be selected
    assert group.selected?("2")
  end

  # === Size Variant Tests ===

  test "different size variants render correctly" do
    # Just verify they exist and have correct number of items
    assert_equal 3, size_sm_group.item_count
    assert_equal 3, size_default_group.item_count
    assert_equal 3, size_lg_group.item_count
  end

  # === Spacing Tests ===

  test "spacing variant renders with gap between items" do
    group = spacing_group

    # Verify it exists and has items
    assert_equal 3, group.item_count

    # Check data-spacing attribute
    assert_equal "2", group.node["data-spacing"]
  end

  # === Selected Item Helpers ===

  test "selected_item returns single selected value in single mode" do
    group = single_outline_group

    # Should have italic selected initially
    assert_equal "italic", group.selected_item
  end

  test "selected_items returns array in multiple mode" do
    group = multiple_group

    # Should have bold and italic selected initially
    assert_equal ["bold", "italic"], group.selected_items.sort
  end

  test "selected_item returns nil when nothing selected in single mode" do
    group = interactive_single_group

    # No initial selection
    assert_nil group.selected_item
    assert_equal [], group.selected_items
  end

  # === Interactive State Changes ===

  test "clicking items updates state in real time" do
    group = interactive_single_group

    # Initially nothing selected
    assert_equal [], group.selected_items

    # Click first option
    group.select_item("1")
    assert_equal "1", group.selected_item

    # Click second option
    group.select_item("2")
    assert_equal "2", group.selected_item
    assert_not group.selected?("1")

    # Click third option
    group.select_item("3")
    assert_equal "3", group.selected_item
    assert_not group.selected?("2")
  end

  test "multiple selection accumulates selections" do
    group = interactive_multiple_group

    # Start with no selection
    initial_count = group.selected_items.count
    assert_equal 0, initial_count

    # Add selections
    group.toggle_item("feature-a")
    assert_equal 1, group.selected_items.count

    group.toggle_item("feature-b")
    assert_equal 2, group.selected_items.count

    group.toggle_item("feature-c")
    assert_equal 3, group.selected_items.count

    # All should be selected
    assert group.selected?("feature-a")
    assert group.selected?("feature-b")
    assert group.selected?("feature-c")
  end

  # === Edge Cases ===

  test "handles rapid consecutive clicks" do
    group = interactive_single_group

    # Rapidly select different items
    group.toggle_item("1")
    group.toggle_item("2")
    group.toggle_item("3")

    # Should end with last item selected
    assert group.selected?("3")
    assert_equal ["3"], group.selected_items
  end

  test "handles toggling same item multiple times in multiple mode" do
    group = interactive_multiple_group

    # Toggle same item multiple times
    group.toggle_item("feature-a")
    assert group.selected?("feature-a")

    group.toggle_item("feature-a")
    assert_not group.selected?("feature-a")

    group.toggle_item("feature-a")
    assert group.selected?("feature-a")
  end
end
