# frozen_string_literal: true

require "test_helper"

class InputOtpTest < UI::SystemTestCase
  setup do
    visit_component("input_otp")
  end

  # Helper methods to get different OTP examples
  def default_otp
    element = find_element(UI::Testing::InputOtpElement, "#default-otp")
    scroll_to_element(element)
    element
  end

  def prefilled_otp
    element = find_element(UI::Testing::InputOtpElement, "#prefilled-otp")
    scroll_to_element(element)
    element
  end

  def four_digit_otp
    element = find_element(UI::Testing::InputOtpElement, "#four-digit-otp")
    scroll_to_element(element)
    element
  end

  def three_groups_otp
    element = find_element(UI::Testing::InputOtpElement, "#three-groups-otp")
    scroll_to_element(element)
    element
  end

  def no_separator_otp
    element = find_element(UI::Testing::InputOtpElement, "#no-separator-otp")
    scroll_to_element(element)
    element
  end

  def alphanumeric_otp
    element = find_element(UI::Testing::InputOtpElement, "#alphanumeric-otp")
    scroll_to_element(element)
    element
  end

  def disabled_otp
    element = find_element(UI::Testing::InputOtpElement, "#disabled-otp")
    scroll_to_element(element)
    element
  end

  def auto_generated_otp
    element = find_element(UI::Testing::InputOtpElement, "#auto-generated-otp")
    scroll_to_element(element)
    element
  end

  private

  def scroll_to_element(element)
    page.execute_script("arguments[0].scrollIntoView({block: 'center'});", element.node)
    sleep 0.1 # Wait for scroll
  end

  # === Basic Interaction Tests ===

  test "enters OTP value digit by digit" do
    otp = default_otp

    otp.enter_digit(0, "1")
    assert_equal "1", otp.slot_value(0)

    otp.enter_digit(1, "2")
    assert_equal "2", otp.slot_value(1)

    otp.enter_digit(2, "3")
    assert_equal "3", otp.slot_value(2)
  end

  test "enters complete OTP value at once" do
    otp = default_otp

    otp.enter_otp("123456")

    assert_equal "123456", otp.value
  end

  test "auto-advances to next slot on input" do
    otp = default_otp

    # Focus first slot and enter a digit
    otp.focus_slot(0)
    otp.enter_digit(0, "1")

    # Should auto-advance to slot 1
    sleep 0.1 # Wait for auto-advance

    # Enter digit in slot 1
    otp.enter_digit(1, "2")

    assert_equal "12", otp.value[0..1]
  end

  test "displays entered OTP value correctly" do
    otp = default_otp

    otp.enter_otp("987654")

    assert_equal "987654", otp.value
    assert_equal "9", otp.slot_value(0)
    assert_equal "8", otp.slot_value(1)
    assert_equal "7", otp.slot_value(2)
    assert_equal "6", otp.slot_value(3)
    assert_equal "5", otp.slot_value(4)
    assert_equal "4", otp.slot_value(5)
  end

  # === Completion State Tests ===

  test "marks OTP as complete when all slots are filled" do
    otp = default_otp

    refute otp.complete?

    otp.enter_otp("123456")

    assert otp.complete?
  end

  test "marks OTP as incomplete when not all slots are filled" do
    otp = default_otp

    otp.enter_otp("12345") # Only 5 digits

    refute otp.complete?
  end

  test "tracks filled and empty slot counts" do
    otp = default_otp

    assert_equal 0, otp.filled_count
    assert_equal 6, otp.empty_count

    otp.enter_otp("123")

    assert_equal 3, otp.filled_count
    assert_equal 3, otp.empty_count

    otp.enter_otp("123456")

    assert_equal 6, otp.filled_count
    assert_equal 0, otp.empty_count
  end

  # === Backspace Behavior Tests ===

  test "backspace clears the selected slot" do
    otp = default_otp

    otp.enter_otp("15")
    otp.focus_slot(1)
    otp.press_backspace

    assert otp.slot_empty?(1)
    assert_equal "1", otp.value
  end

  test "backspace on an empty slot deletes the previous character" do
    otp = default_otp

    otp.enter_otp("12")
    otp.press_backspace

    assert otp.slot_empty?(1)
    assert_equal "1", otp.value
  end

  # === Paste Functionality Tests ===

  test "paste fills all slots with pasted value" do
    otp = default_otp

    otp.paste("654321")

    assert_equal "654321", otp.value
    assert otp.complete?
  end

  test "paste only fills available slots if value is longer" do
    otp = default_otp

    otp.paste("12345678901") # More than 6 digits

    # Should only fill 6 slots
    assert_equal 6, otp.filled_count
  end

  test "paste distributes characters correctly" do
    otp = default_otp

    otp.paste("123456")

    assert_equal "1", otp.slot_value(0)
    assert_equal "2", otp.slot_value(1)
    assert_equal "3", otp.slot_value(2)
    assert_equal "4", otp.slot_value(3)
    assert_equal "5", otp.slot_value(4)
    assert_equal "6", otp.slot_value(5)
  end

  # === Keyboard Navigation Tests ===

  test "arrow right navigates to next slot" do
    otp = default_otp

    otp.enter_otp("123")
    otp.focus_slot(0)
    otp.navigate_right
    assert_equal 1, otp.focused_slot_index

    otp.input.send_keys("5")
    assert_equal "153", otp.value
  end

  test "arrow left navigates to previous slot" do
    otp = default_otp

    otp.enter_otp("123")
    otp.navigate_left
    assert_equal 2, otp.focused_slot_index

    otp.input.send_keys("7")
    assert_equal "127", otp.value
  end

  test "Home key navigates to first slot" do
    otp = default_otp

    otp.enter_otp("1234")
    otp.navigate_to_first
    assert_equal 0, otp.focused_slot_index

    otp.input.send_keys("9")
    assert_equal "9234", otp.value
  end

  test "End key navigates to the first empty slot" do
    otp = default_otp

    otp.enter_otp("12")
    otp.focus_slot(0)
    otp.navigate_to_last
    assert_equal 2, otp.focused_slot_index

    otp.input.send_keys("8")
    assert_equal "128", otp.value
  end

  # === Different Lengths Tests ===

  test "works with 4-digit OTP" do
    otp = four_digit_otp

    assert_equal 4, otp.length

    otp.enter_otp("1234")

    assert_equal "1234", otp.value
    assert otp.complete?
  end

  test "works with 9-digit OTP" do
    otp = three_groups_otp

    assert_equal 9, otp.length

    otp.enter_otp("123456789")

    assert_equal "123456789", otp.value
    assert otp.complete?
  end

  # === Separator Tests ===

  test "displays separator in default OTP" do
    otp = default_otp

    assert otp.has_separator?
    assert_equal 1, otp.separator_count
  end

  test "displays multiple separators in three groups OTP" do
    otp = three_groups_otp

    assert otp.has_separator?
    assert_equal 2, otp.separator_count
  end

  test "has no separator when not configured" do
    otp = no_separator_otp

    refute otp.has_separator?
    assert_equal 0, otp.separator_count
  end

  # === Pre-filled Value Tests ===

  test "displays pre-filled values correctly" do
    otp = prefilled_otp

    assert_equal "123456", otp.value
    assert otp.complete?
  end

  test "pre-filled values can be modified" do
    otp = prefilled_otp

    otp.focus_slot(0)
    otp.enter_digit(0, "9")

    assert_equal "9", otp.slot_value(0)
    assert_equal "923456", otp.value
  end

  # === Pattern Validation Tests ===

  test "numeric pattern accepts only digits" do
    otp = default_otp

    assert otp.numeric_only?

    # Try entering a letter - should be rejected
    otp.focus_slot(0)
    otp.input.send_keys("A")

    # Value should be empty (rejected by pattern validation)
    assert otp.slot_empty?(0)
  end

  test "alphanumeric pattern accepts letters and numbers" do
    otp = alphanumeric_otp

    assert otp.alphanumeric?

    otp.enter_otp("A1B2C3")
    assert_equal "A1B2C3", otp.value
    assert_equal "A", otp.slot_value(0)
    assert_equal "1", otp.slot_value(1)
  end

  test "pattern validation prevents invalid characters" do
    otp = default_otp # Numeric only

    otp.focus_slot(0)
    otp.input.send_keys("!")

    # Special character should be rejected
    assert otp.slot_empty?(0)
  end

  # === Disabled State Tests ===

  test "disabled OTP shows as disabled" do
    otp = disabled_otp

    assert otp.disabled?
  end

  test "individual slots can be checked for disabled state" do
    otp = disabled_otp

    assert otp.slot_disabled?(0)
    assert otp.slot_disabled?(1)
    assert otp.slot_disabled?(2)
    assert otp.slot_disabled?(3)
    assert otp.slot_disabled?(4)
    assert otp.slot_disabled?(5)
  end

  test "disabled OTP displays pre-filled values" do
    otp = disabled_otp

    # Disabled OTP in showcase has values "123456"
    assert_equal "123456", otp.value
  end

  # === Clear Functionality Tests ===

  test "clear removes all values" do
    otp = default_otp

    otp.enter_otp("123456")
    assert otp.complete?

    otp.clear

    assert_equal "", otp.value
    assert_equal 0, otp.filled_count
    refute otp.complete?
  end

  test "clear focuses first slot" do
    otp = default_otp

    otp.enter_otp("123456")
    otp.clear

    # After clear, first slot should be focused (can verify by entering digit)
    otp.enter_digit(0, "9")
    assert_equal "9", otp.slot_value(0)
  end

  # === Slot State Queries Tests ===

  test "slot_empty? returns true for empty slots" do
    otp = default_otp

    assert otp.slot_empty?(0)
    assert otp.slot_empty?(1)
    assert otp.slot_empty?(2)
  end

  test "slot_filled? returns true for filled slots" do
    otp = default_otp

    otp.enter_digit(0, "1")
    otp.enter_digit(1, "2")

    assert otp.slot_filled?(0)
    assert otp.slot_filled?(1)
    refute otp.slot_filled?(2)
  end

  test "value returns empty string when no digits entered" do
    otp = default_otp

    assert_equal "", otp.value
  end

  test "value returns partial OTP when partially filled" do
    otp = default_otp

    otp.enter_otp("123")

    # Partial value with empty slots
    assert_equal 3, otp.filled_count
  end

  # === Auto-generated OTP Tests ===

  test "auto-generated OTP creates correct number of slots" do
    otp = auto_generated_otp

    assert_equal 6, otp.length
  end

  test "auto-generated OTP accepts input" do
    otp = auto_generated_otp

    otp.enter_otp("789012")

    assert_equal "789012", otp.value
    assert otp.complete?
  end

  # === Edge Cases ===

  test "handles rapid input without errors" do
    otp = default_otp

    # Rapidly enter digits
    5.times do
      otp.enter_otp("123456")
      otp.clear
    end

    # Should still be functional
    otp.enter_otp("999999")
    assert_equal "999999", otp.value
  end

  test "handles partial entry and completion" do
    otp = default_otp

    # Enter partial
    otp.enter_otp("123")
    refute otp.complete?

    # Complete it
    otp.enter_otp("123456")
    assert otp.complete?
  end

  test "handles slot overflow gracefully" do
    otp = default_otp

    # Try to enter more digits than slots
    otp.enter_otp("12345678901234567890")

    # Should only fill available slots
    assert_equal 6, otp.filled_count
    assert_equal 6, otp.length
  end

  test "entering same digit multiple times works" do
    otp = default_otp

    otp.enter_otp("111111")

    assert_equal "111111", otp.value
    assert otp.complete?
  end

  test "replacing digits works correctly" do
    otp = default_otp

    otp.enter_otp("123456")
    assert_equal "123456", otp.value

    # Replace first digit
    otp.focus_slot(0)
    otp.enter_digit(0, "9")

    assert_equal "9", otp.slot_value(0)
  end

  # === Pattern Attribute Tests ===

  test "default OTP has numeric pattern" do
    otp = default_otp

    assert_equal "\\d", otp.pattern
  end

  test "alphanumeric OTP has correct pattern" do
    otp = alphanumeric_otp

    assert_equal "[A-Za-z0-9]", otp.pattern
  end

  # === Focus Management Tests ===

  test "does not steal focus on page load" do
    otp = default_otp

    assert_not otp.focused?
    assert_nil otp.focused_slot_index
  end

  test "focus_first_slot focuses the first slot" do
    otp = default_otp

    otp.focus_slot(3)
    otp.focus_first_slot

    # Verify by entering digit
    otp.enter_digit(0, "7")
    assert_equal "7", otp.slot_value(0)
  end

  test "focus_slot can focus any filled slot" do
    otp = default_otp

    otp.enter_otp("123456")
    otp.enter_digit(4, "6")

    assert_equal "6", otp.slot_value(4)
    assert_equal "123466", otp.value
  end

  # === Complex Scenarios ===

  test "complete workflow: enter, backspace, re-enter" do
    otp = default_otp

    # Enter complete OTP
    otp.enter_otp("123456")
    assert otp.complete?

    # Backspace last digit
    otp.focus_slot(5)
    otp.press_backspace

    refute otp.complete?
    assert_equal 5, otp.filled_count

    # Re-enter last digit
    otp.enter_digit(5, "6")

    assert otp.complete?
    assert_equal "123456", otp.value
  end

  test "keyboard navigation through all slots" do
    otp = default_otp

    otp.enter_otp("123456")
    otp.focus_slot(0)
    5.times { otp.navigate_right }
    assert_equal 5, otp.focused_slot_index

    otp.input.send_keys("9")
    assert_equal "123459", otp.value
  end

  test "mixed input methods: manual and paste" do
    otp = default_otp

    # Enter first 3 manually
    otp.enter_otp("123")

    # Paste complete value
    otp.paste("456789")

    # Should have valid OTP
    assert otp.complete?
    assert_equal 6, otp.filled_count
  end

  # === Accessibility and forms ===

  test "the OTP is one field named by its label" do
    otp = find_element(UI::Testing::InputOtpElement, "#form-otp")

    assert_equal 1, otp.node.all("input", visible: :all).size
    assert_equal "one-time-code", otp.input["autocomplete"]

    find("label", text: "One-time code").click
    assert otp.focused?
  end

  test "the whole code is submitted under name" do
    otp = find_element(UI::Testing::InputOtpElement, "#form-otp")

    otp.enter_otp("246810")

    assert_equal [["user[otp]", "246810"]],
      page.evaluate_script("Array.from(new FormData(document.getElementById('otp-form')).entries())")
  end

  test "a pasted code with spaces is cleaned up" do
    otp = find_element(UI::Testing::InputOtpElement, "#form-otp")

    otp.paste("135 791")

    assert_equal "135791", otp.value
  end

  # === Length Tests ===

  test "length returns correct number of slots for 6-digit OTP" do
    otp = default_otp

    assert_equal 6, otp.length
  end

  test "length returns correct number of slots for 4-digit OTP" do
    otp = four_digit_otp

    assert_equal 4, otp.length
  end

  test "length returns correct number of slots for 9-digit OTP" do
    otp = three_groups_otp

    assert_equal 9, otp.length
  end
end
