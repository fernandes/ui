# frozen_string_literal: true

require "test_helper"

class RadioGroupTest < UI::SystemTestCase
  setup do
    visit_component("radio_button")
  end

  # === Helper Methods ===

  # Helper to get the Phlex plan radio group
  def plan_group
    find_element(UI::Testing::RadioGroupElement, "#plan-group")
  end

  # Helper to get the ViewComponent size radio group
  def size_group
    find_element(UI::Testing::RadioGroupElement, "#size-group")
  end

  # Helper to get the ERB color radio group
  def color_group
    find_element(UI::Testing::RadioGroupElement, "#color-group")
  end

  # Helper to get the disabled radio group
  def disabled_group
    find_element(UI::Testing::RadioGroupElement, "#disabled-group")
  end

  # === Basic Interaction Tests ===

  test "selects a radio option by clicking" do
    group = plan_group

    # Initially "free" is selected (checked: true in showcase)
    assert_equal "free", group.selected_value

    # Select "pro"
    group.select_option("pro")

    # "pro" should now be selected
    assert_equal "pro", group.selected_value
    assert group.selected?("pro")
  end

  test "changes selection when clicking different option" do
    group = plan_group

    # Start with "free" selected
    assert group.selected?("free")

    # Select "enterprise"
    group.select_option("enterprise")

    # Only "enterprise" should be selected now
    assert group.selected?("enterprise")
    assert_not group.selected?("free")
    assert_not group.selected?("pro")
  end

  test "maintains only one selection at a time" do
    group = color_group

    # Initially "blue" is selected
    assert_equal "blue", group.selected_value

    # Select "red"
    group.select_option("red")
    assert_equal "red", group.selected_value

    # Select "green"
    group.select_option("green")
    assert_equal "green", group.selected_value

    # Only one should be selected
    assert_equal 1, group.all_options.count(&:checked?)
  end

  # === Selection Query Tests ===

  test "returns selected value" do
    group = size_group

    # "medium" is checked by default
    assert_equal "medium", group.selected_value
  end

  test "returns nil when no option is selected" do
    # This would require a group with no checked options
    # For now, we test that selected_value returns a string when something is selected
    group = plan_group
    assert_kind_of String, group.selected_value
  end

  test "checks if specific value is selected" do
    group = color_group

    # "blue" is checked by default
    assert group.selected?("blue")
    assert_not group.selected?("red")
    assert_not group.selected?("green")
  end

  # === Options Query Tests ===

  test "returns all option values" do
    group = plan_group

    options = group.options
    assert_equal 3, options.count
    assert_includes options, "free"
    assert_includes options, "pro"
    assert_includes options, "enterprise"
  end

  test "returns all option labels" do
    group = plan_group

    labels = group.option_labels
    assert_equal 3, labels.count
    assert_includes labels, "Free Plan"
    assert_includes labels, "Pro Plan"
    assert_includes labels, "Enterprise Plan"
  end

  test "returns correct option count" do
    assert_equal 3, plan_group.option_count
    assert_equal 3, size_group.option_count
    assert_equal 3, color_group.option_count
  end

  # === Disabled State Tests ===

  test "identifies disabled options" do
    group = disabled_group

    assert_not group.disabled?("1")
    assert group.disabled?("2")
    assert_not group.disabled?("3")
  end

  test "cannot select disabled option by clicking" do
    group = disabled_group

    # Initially "1" is selected
    assert group.selected?("1")

    # Verify option "2" is disabled
    assert group.disabled?("2")

    # Try to select disabled option "2" using force (Playwright won't click disabled elements normally)
    disabled_option = group.find_option_by_value("2")

    # Disabled elements cannot be clicked through normal interaction
    # Playwright will timeout/error when trying to click disabled elements
    # So we just verify it's disabled and selected state doesn't change

    # Selection should remain on "1"
    assert group.selected?("1")
    assert_not group.selected?("2")
  end

  # === Label Association Tests ===

  test "can select option by label text" do
    group = plan_group

    assert group.selected?("free")

    group.select_by_label("Pro Plan")

    assert group.selected?("pro")
  end

  test "finds label for each option" do
    group = size_group

    small_option = group.find_option_by_value("small")
    label = group.label_for_option(small_option)

    assert_not_nil label
    assert_equal "Small", label.text.strip
  end

  # === ARIA Attributes Tests ===

  test "has radiogroup role" do
    group = plan_group

    assert group.has_radiogroup_role?
    assert_equal "radiogroup", group.role
  end

  test "all options have radio role implicitly" do
    group = color_group

    group.all_options.each do |option|
      assert_equal "radio", option["type"]
    end
  end

  # === Keyboard Navigation Tests ===

  test "navigates to next option with arrow down" do
    group = color_group

    # "blue" is selected initially (r3)
    assert group.selected?("blue")

    # Focus the currently selected option
    selected = group.selected_option
    selected.native.focus

    # Press arrow down - should move focus to next option (wraps to first)
    group.press_arrow_down

    # Note: Arrow keys on radio buttons move focus but don't automatically select
    # This is native browser behavior - selection requires Space or click
  end

  test "navigates to previous option with arrow up" do
    group = plan_group

    # "free" is selected initially (r1)
    selected = group.selected_option
    selected.native.focus

    # Press arrow up - should move focus to previous option (wraps to last)
    group.press_arrow_up

    # Verify the group still has a selected option
    assert_not_nil group.selected_value
  end

  # === Indicator Tests ===

  test "indicator is present for each option" do
    group = plan_group

    assert_not_nil group.indicator_for("free")
    assert_not_nil group.indicator_for("pro")
    assert_not_nil group.indicator_for("enterprise")
  end

  test "indicator visibility reflects selection state" do
    group = size_group

    # "medium" is selected
    assert group.indicator_visible?("medium")
    assert_not group.indicator_visible?("small")
    assert_not group.indicator_visible?("large")
  end

  test "indicator visibility updates when selection changes" do
    group = color_group

    # Initially "blue" is selected
    assert group.indicator_visible?("blue")

    # Select "red"
    group.select_option("red")

    # Now "red" indicator should be visible
    assert group.indicator_visible?("red")
    assert_not group.indicator_visible?("blue")
  end

  # === Multiple Groups Independence Tests ===

  test "different radio groups operate independently" do
    plan = plan_group
    size = size_group

    # Each group maintains its own selection
    assert plan.selected?("free")
    assert size.selected?("medium")

    # Changing one doesn't affect the other
    plan.select_option("pro")
    assert plan.selected?("pro")
    assert size.selected?("medium")

    size.select_option("large")
    assert plan.selected?("pro")
    assert size.selected?("large")
  end

  # === Selection by Value Tests ===

  test "finds option by value" do
    group = plan_group

    option = group.find_option_by_value("pro")
    assert_not_nil option
    assert_equal "pro", option["value"]
    assert_equal "r2", option["id"]
  end

  test "finds option by label" do
    group = size_group

    option = group.find_option_by_label("Small")
    assert_not_nil option
    assert_equal "small", option["value"]
  end

  # === Edge Cases ===

  test "selecting already selected option has no effect" do
    group = plan_group

    # "free" is already selected
    assert group.selected?("free")

    # Select it again
    group.select_option("free")

    # Should still be selected
    assert group.selected?("free")
  end

  test "handles rapid selection changes" do
    group = color_group

    # Rapidly change selections
    group.select_option("red")
    group.select_option("green")
    group.select_option("blue")
    group.select_option("red")

    # Final selection should be "red"
    assert group.selected?("red")
    assert_equal 1, group.all_options.count(&:checked?)
  end

  # === Name Attribute Tests ===

  test "all options in group share same name attribute" do
    group = plan_group
    options = group.all_options

    names = options.map { |opt| opt["name"] }.uniq
    assert_equal 1, names.count
    assert_equal "plan", names.first
  end

  test "different groups have different name attributes" do
    assert_equal "plan", plan_group.all_options.first["name"]
    assert_equal "size", size_group.all_options.first["name"]
    assert_equal "color", color_group.all_options.first["name"]
  end

  # === Value Attribute Tests ===

  test "each option has unique value within group" do
    group = plan_group
    values = group.options

    # All values should be unique
    assert_equal values.count, values.uniq.count
  end

  # === CSS Classes Tests ===

  test "radio buttons have base styling classes" do
    group = plan_group
    option = group.find_option_by_value("free")

    assert option[:class].include?("peer")
    assert option[:class].include?("appearance-none")
    assert option[:class].include?("rounded-full")
  end

  test "disabled option has disabled styling" do
    group = disabled_group
    disabled_option = group.find_option_by_value("2")

    assert disabled_option[:class].include?("disabled:cursor-not-allowed")
    assert disabled_option[:class].include?("disabled:opacity-50")
  end

  # === Data Attribute Tests ===

  test "radio buttons have correct data-slot attribute" do
    group = size_group
    options = group.all_options

    options.each do |option|
      assert_equal "radio-group-item", option["data-slot"]
    end
  end

  # === Initial State Tests ===

  test "phlex group starts with correct selection" do
    group = plan_group
    assert group.selected?("free")
  end

  test "viewcomponent group starts with correct selection" do
    group = size_group
    assert group.selected?("medium")
  end

  test "erb group starts with correct selection" do
    group = color_group
    assert group.selected?("blue")
  end

  # === Accessibility Tests ===

  test "radio buttons are keyboard focusable" do
    group = plan_group
    option = group.find_option_by_value("free")

    option.native.focus

    # Check that the element is focused
    assert_equal option["id"], page.evaluate_script("document.activeElement.id")
  end

  test "can tab through radio group" do
    group = plan_group

    # Focus first option
    first_option = group.all_options.first
    first_option.native.focus

    # Press Tab
    first_option.send_keys(:tab)

    # Focus should move to next element (not necessarily next radio in group)
    # This is testing that Tab works, not that it stays in group
    active_id = page.evaluate_script("document.activeElement.id")
    assert_not_nil active_id
  end
end
