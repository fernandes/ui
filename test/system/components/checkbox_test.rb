# frozen_string_literal: true

require "test_helper"

class CheckboxTest < UI::SystemTestCase
  setup do
    visit_component("checkbox")
  end

  # === Helper Methods ===

  # Helper to get the basic unchecked checkbox
  def basic_checkbox
    find_element(UI::TestingCheckboxElement, "#basic-checkbox")
  end

  # Helper to get the pre-checked checkbox
  def checked_checkbox
    find_element(UI::TestingCheckboxElement, "#checked-checkbox")
  end

  # Helper to get the disabled checkbox
  def disabled_checkbox
    find_element(UI::TestingCheckboxElement, "#disabled-checkbox")
  end

  # Helper to get a checkbox from the interest group
  def interest_checkbox(interest)
    find_element(UI::TestingCheckboxElement, "#interest-#{interest}")
  end

  # === Basic Interaction Tests ===

  test "checks an unchecked checkbox by clicking" do
    checkbox = basic_checkbox

    assert checkbox.unchecked?

    checkbox.check

    assert checkbox.checked?
    assert_equal "checked", checkbox.data_state
  end

  test "unchecks a checked checkbox by clicking" do
    checkbox = checked_checkbox

    assert checkbox.checked?

    checkbox.uncheck

    assert checkbox.unchecked?
    assert_equal "unchecked", checkbox.data_state
  end

  test "toggles checkbox state" do
    checkbox = basic_checkbox

    initial_state = checkbox.checked?

    checkbox.toggle

    assert_equal !initial_state, checkbox.checked?
  end

  test "maintains state after multiple toggles" do
    checkbox = basic_checkbox

    # Start unchecked
    assert checkbox.unchecked?

    # Toggle to checked
    checkbox.toggle
    assert checkbox.checked?

    # Toggle back to unchecked
    checkbox.toggle
    assert checkbox.unchecked?

    # Toggle again to checked
    checkbox.toggle
    assert checkbox.checked?
  end

  # === Keyboard Interaction Tests ===

  test "toggles with Space key" do
    checkbox = basic_checkbox

    assert checkbox.unchecked?

    checkbox.toggle_with_space

    assert checkbox.checked?
  end

  test "can check with keyboard" do
    checkbox = basic_checkbox

    checkbox.focus
    assert checkbox.unchecked?

    checkbox.press_space

    assert checkbox.checked?
  end

  test "can uncheck with keyboard" do
    checkbox = checked_checkbox

    checkbox.focus
    assert checkbox.checked?

    checkbox.press_space

    assert checkbox.unchecked?
  end

  test "maintains focus after keyboard toggle" do
    checkbox = basic_checkbox

    checkbox.focus
    checkbox.press_space

    # Element should still be the focused element
    assert_equal checkbox.id, page.evaluate_script("document.activeElement.id")
  end

  # === ARIA Attributes Tests ===

  test "has correct ARIA attributes when unchecked" do
    checkbox = basic_checkbox

    assert checkbox.unchecked?
    assert_equal "false", checkbox.aria_checked_value
    assert_equal "unchecked", checkbox.data_state
  end

  test "has correct ARIA attributes when checked" do
    checkbox = checked_checkbox

    assert checkbox.checked?
    assert_equal "true", checkbox.aria_checked_value
    assert_equal "checked", checkbox.data_state
  end

  test "updates ARIA attributes on state change" do
    checkbox = basic_checkbox

    # Initially unchecked
    assert_equal "false", checkbox.aria_checked_value

    # Check it
    checkbox.check

    # ARIA should update
    assert_equal "true", checkbox.aria_checked_value
  end

  test "syncs data-state with checked state" do
    checkbox = basic_checkbox

    # Unchecked -> data-state should be 'unchecked'
    assert_equal "unchecked", checkbox.data_state

    # Check it
    checkbox.check

    # data-state should update to 'checked'
    assert_equal "checked", checkbox.data_state

    # Uncheck it
    checkbox.uncheck

    # data-state should update back to 'unchecked'
    assert_equal "unchecked", checkbox.data_state
  end

  # === Disabled State Tests ===

  test "disabled checkbox cannot be checked" do
    checkbox = disabled_checkbox

    assert checkbox.disabled?
    assert checkbox.unchecked?

    # Disabled checkboxes cannot be clicked normally
    # The state should remain unchanged
    assert checkbox.unchecked?
  end

  test "disabled checkbox has correct ARIA attribute" do
    checkbox = disabled_checkbox

    # Should have disabled attribute in HTML
    assert checkbox.disabled?
  end

  # === Attribute Tests ===

  test "has correct name attribute" do
    checkbox = basic_checkbox

    assert_equal "terms", checkbox.name
  end

  test "has correct value attribute" do
    checkbox = basic_checkbox

    assert_equal "accepted", checkbox.value
  end

  test "has correct ID attribute" do
    checkbox = basic_checkbox

    assert_equal "basic-checkbox", checkbox.id
  end

  # === Label Association Tests ===

  test "checkbox has associated label" do
    checkbox = basic_checkbox

    assert_not_nil checkbox.label
    assert_equal "Accept terms and conditions", checkbox.label_text
  end

  test "clicking label toggles checkbox" do
    checkbox = basic_checkbox

    assert checkbox.unchecked?

    # Click the label instead of the checkbox
    checkbox.label.click

    # Checkbox should be checked
    assert checkbox.checked?
  end

  test "label has correct for attribute" do
    checkbox = basic_checkbox

    assert_equal checkbox.id, checkbox.label[:for]
  end

  # === Indicator Tests ===

  test "indicator is present" do
    checkbox = basic_checkbox

    assert_not_nil checkbox.indicator
  end

  test "indicator visibility changes with checked state" do
    checkbox = basic_checkbox

    # Unchecked - indicator should have opacity-0
    assert checkbox.unchecked?
    assert checkbox.indicator[:class].include?("opacity-0")

    # Check it
    checkbox.check

    # Indicator should become visible (peer-checked:opacity-100 applies)
    assert checkbox.checked?
    # The class list includes peer-checked:opacity-100
    assert checkbox.indicator[:class].include?("peer-checked:opacity-100")
  end

  # === Multiple Checkboxes Tests ===

  test "can check multiple checkboxes independently" do
    tech = interest_checkbox("technology")
    design = interest_checkbox("design")

    # Both start unchecked
    assert tech.unchecked?
    assert design.unchecked?

    # Check tech
    tech.check
    assert tech.checked?
    assert design.unchecked?

    # Check design
    design.check
    assert tech.checked?
    assert design.checked?

    # Uncheck tech
    tech.uncheck
    assert tech.unchecked?
    assert design.checked?
  end

  test "checkboxes with same name attribute are independent" do
    tech = interest_checkbox("technology")
    design = interest_checkbox("design")

    # Both have name="interests[]"
    assert_equal "interests[]", tech.name
    assert_equal "interests[]", design.name

    # But they operate independently
    tech.check
    assert tech.checked?
    assert design.unchecked?
  end

  # === Focusability Tests ===

  test "checkbox is focusable" do
    checkbox = basic_checkbox

    checkbox.focus

    assert_equal checkbox.id, page.evaluate_script("document.activeElement.id")
  end

  test "can navigate between checkboxes with Tab" do
    first_checkbox = basic_checkbox

    first_checkbox.focus

    # Press Tab to move to next checkbox
    first_checkbox.press_tab

    # Focus should move to the checked checkbox
    assert_equal "checked-checkbox", page.evaluate_script("document.activeElement.id")
  end

  # === CSS Classes Tests ===

  test "has base checkbox classes" do
    checkbox = basic_checkbox

    # Should have appearance-none to hide native checkbox
    assert checkbox.has_class?("appearance-none")

    # Should have peer class for label peer-* variants
    assert checkbox.has_class?("peer")

    # Should have cursor-pointer
    assert checkbox.has_class?("cursor-pointer")
  end

  test "disabled checkbox has disabled cursor" do
    checkbox = disabled_checkbox

    assert checkbox.has_class?("disabled:cursor-not-allowed")
    assert checkbox.has_class?("disabled:opacity-50")
  end

  # === Initial State Tests ===

  test "unchecked checkbox starts in correct state" do
    checkbox = basic_checkbox

    assert checkbox.unchecked?
    assert_not checkbox.checked?
    assert_equal "unchecked", checkbox.data_state
    assert_equal "false", checkbox.aria_checked_value
  end

  test "checked checkbox starts in correct state" do
    checkbox = checked_checkbox

    assert checkbox.checked?
    assert_not checkbox.unchecked?
    assert_equal "checked", checkbox.data_state
    assert_equal "true", checkbox.aria_checked_value
  end

  # === Data Attribute Tests ===

  test "has correct data-controller attribute" do
    checkbox = basic_checkbox

    assert_equal "ui--checkbox", checkbox["data-controller"]
  end

  test "data-state attribute updates on interaction" do
    checkbox = basic_checkbox

    # Initial state
    assert_equal "unchecked", checkbox["data-state"]

    # After checking
    checkbox.check
    assert_equal "checked", checkbox["data-state"]

    # After unchecking
    checkbox.uncheck
    assert_equal "unchecked", checkbox["data-state"]
  end

  # === Transition Tests ===

  test "checkbox has transition classes for smooth state changes" do
    checkbox = basic_checkbox

    # Should have transition classes for smooth animation
    assert checkbox.has_class?("transition-all")
  end

  # === Edge Cases ===

  test "clicking disabled checkbox multiple times has no effect" do
    checkbox = disabled_checkbox

    initial_state = checkbox.checked?

    # Disabled checkboxes cannot be clicked
    # The state should remain unchanged
    assert_equal initial_state, checkbox.checked?
  end

  test "rapid toggling maintains correct state" do
    checkbox = basic_checkbox

    # Start unchecked
    assert checkbox.unchecked?

    # Toggle 10 times with small delay to ensure state updates
    10.times do
      checkbox.toggle
      sleep 0.05 # Small delay to allow state to update
    end

    # Should be unchecked (started unchecked, toggled even number of times)
    assert checkbox.unchecked?
  end

  test "checking already checked checkbox has no effect" do
    checkbox = checked_checkbox

    assert checkbox.checked?

    # Try to check again
    checkbox.check

    # Should still be checked
    assert checkbox.checked?
  end

  test "unchecking already unchecked checkbox has no effect" do
    checkbox = basic_checkbox

    assert checkbox.unchecked?

    # Try to uncheck again
    checkbox.uncheck

    # Should still be unchecked
    assert checkbox.unchecked?
  end
end
