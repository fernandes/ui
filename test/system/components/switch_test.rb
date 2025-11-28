# frozen_string_literal: true

require "test_helper"

class SwitchTest < UI::SystemTestCase
  setup do
    visit_component("switch")
  end

  # Helper to get the airplane mode switch (Phlex, unchecked by default)
  def airplane_switch
    find_element(UI::TestingSwitchElement, "#phlex-airplane-mode")
  end

  # Helper to get the notifications switch (Phlex, checked by default)
  def notifications_switch
    find_element(UI::TestingSwitchElement, "#phlex-notifications")
  end

  # Helper to get the disabled off switch (ViewComponent)
  def disabled_off_switch
    find_element(UI::TestingSwitchElement, "#vc-disabled-off")
  end

  # Helper to get the disabled on switch (ViewComponent)
  def disabled_on_switch
    find_element(UI::TestingSwitchElement, "#vc-disabled-on")
  end

  # Helper to get the marketing switch (ERB, form integration)
  def marketing_switch
    find_element(UI::TestingSwitchElement, "#marketing")
  end

  # Helper to get the keyboard test switch
  def keyboard_switch
    find_element(UI::TestingSwitchElement, "#keyboard-test")
  end

  # === Basic Interaction Tests ===

  test "toggles on when clicked" do
    switch = airplane_switch

    # Initially off
    assert switch.off?

    # Toggle on
    switch.toggle

    assert switch.on?
    assert_equal "checked", switch.data_state
  end

  test "toggles off when clicked" do
    switch = notifications_switch

    # Initially on (checked by default)
    assert switch.on?

    # Toggle off
    switch.toggle

    assert switch.off?
    assert_equal "unchecked", switch.data_state
  end

  test "toggle changes state back and forth" do
    switch = airplane_switch

    # Start off
    assert switch.off?

    # Toggle on
    switch.toggle
    assert switch.on?

    # Toggle off
    switch.toggle
    assert switch.off?

    # Toggle on again
    switch.toggle
    assert switch.on?
  end

  test "turn_on only toggles if currently off" do
    switch = airplane_switch

    # Start off
    assert switch.off?

    # Turn on
    switch.turn_on
    assert switch.on?

    # Turn on again (should not toggle)
    switch.turn_on
    assert switch.on?
  end

  test "turn_off only toggles if currently on" do
    switch = notifications_switch

    # Start on
    assert switch.on?

    # Turn off
    switch.turn_off
    assert switch.off?

    # Turn off again (should not toggle)
    switch.turn_off
    assert switch.off?
  end

  # === State Query Tests ===

  test "checked? returns true when on" do
    switch = notifications_switch

    assert switch.checked?
    assert switch.on?
  end

  test "unchecked? returns true when off" do
    switch = airplane_switch

    assert switch.unchecked?
    assert switch.off?
  end

  test "data_state reflects current state" do
    switch = airplane_switch

    assert_equal "unchecked", switch.data_state

    switch.toggle

    assert_equal "checked", switch.data_state
  end

  # === Keyboard Interaction Tests ===

  test "toggles with Space key" do
    switch = keyboard_switch

    # Start off
    assert switch.off?

    # Focus and press space
    switch.focus
    switch.toggle_with_space

    assert switch.on?
  end

  test "toggles with Enter key" do
    switch = keyboard_switch

    # Start off
    assert switch.off?

    # Focus and press enter
    switch.focus
    switch.toggle_with_enter

    assert switch.on?
  end

  test "multiple Space presses toggle correctly" do
    switch = keyboard_switch

    switch.focus

    # Start off
    assert switch.off?

    # Press Space - should turn on
    switch.toggle_with_space
    assert switch.on?

    # Press Space - should turn off
    switch.toggle_with_space
    assert switch.off?

    # Press Space - should turn on again
    switch.toggle_with_space
    assert switch.on?
  end

  test "Enter and Space both work for toggling" do
    switch = keyboard_switch

    switch.focus

    # Start off
    assert switch.off?

    # Press Space - on
    switch.toggle_with_space
    assert switch.on?

    # Press Enter - off
    switch.toggle_with_enter
    assert switch.off?

    # Press Enter - on
    switch.toggle_with_enter
    assert switch.on?

    # Press Space - off
    switch.toggle_with_space
    assert switch.off?
  end

  # === ARIA Accessibility Tests ===

  test "has correct ARIA role" do
    switch = airplane_switch

    assert_role(switch, "switch")
  end

  test "aria-checked is false when unchecked" do
    switch = airplane_switch

    assert switch.off?
    assert_aria_attributes(switch, checked: "false")
  end

  test "aria-checked is true when checked" do
    switch = notifications_switch

    assert switch.on?
    assert_aria_attributes(switch, checked: "true")
  end

  test "aria-checked updates when toggled" do
    switch = airplane_switch

    # Start unchecked
    assert_aria_attributes(switch, checked: "false")

    # Toggle to checked
    switch.toggle
    assert_aria_attributes(switch, checked: "true")

    # Toggle back to unchecked
    switch.toggle
    assert_aria_attributes(switch, checked: "false")
  end

  test "has aria-disabled when disabled" do
    switch = disabled_off_switch

    assert switch.disabled?
    assert_aria_attributes(switch, disabled: "true")
  end

  test "is focusable when enabled" do
    switch = airplane_switch

    assert_focusable(switch)
  end

  test "has correct tabindex when enabled" do
    switch = airplane_switch

    assert_equal "0", switch["tabindex"]
  end

  test "has negative tabindex when disabled" do
    switch = disabled_off_switch

    assert_equal "-1", switch["tabindex"]
  end

  # === Disabled State Tests ===

  test "disabled switch cannot be toggled by click" do
    switch = disabled_off_switch

    # Initially off and disabled
    assert switch.off?
    assert switch.disabled?

    # Try to toggle (should do nothing)
    switch.node.click rescue nil # Click anyway despite disabled
    sleep 0.1

    # Should remain off
    assert switch.off?
  end

  test "disabled checked switch remains checked" do
    switch = disabled_on_switch

    # Initially on and disabled
    assert switch.on?
    assert switch.disabled?

    # Try to toggle
    switch.node.click rescue nil
    sleep 0.1

    # Should remain on
    assert switch.on?
  end

  # === Sub-element Tests ===

  test "has thumb element" do
    switch = airplane_switch

    assert switch.thumb.present?
    assert_equal "span", switch.thumb.tag_name
  end

  test "thumb has correct data attributes" do
    switch = airplane_switch

    thumb = switch.thumb

    assert_equal "switch-thumb", thumb["data-slot"]
    assert_equal "unchecked", thumb["data-state"]
  end

  test "thumb state updates when switch toggles" do
    switch = airplane_switch

    # Initially unchecked
    assert_equal "unchecked", switch.thumb["data-state"]

    # Toggle to checked
    switch.toggle
    assert_equal "checked", switch.thumb["data-state"]

    # Toggle back
    switch.toggle
    assert_equal "unchecked", switch.thumb["data-state"]
  end

  # === Form Integration Tests ===

  test "form switch has hidden input with name" do
    switch = marketing_switch

    assert switch.hidden_input.present?
    assert_equal "settings[marketing]", switch.name
  end

  test "hidden input value is 1 when checked" do
    switch = marketing_switch

    # Initially checked
    assert switch.on?
    assert_equal "1", switch.value
  end

  test "hidden input value updates when toggled" do
    switch = marketing_switch

    # Start checked (value = "1")
    assert_equal "1", switch.value

    # Toggle to unchecked (value = "0")
    switch.toggle
    assert_equal "0", switch.value

    # Toggle back to checked (value = "1")
    switch.toggle
    assert_equal "1", switch.value
  end

  # === State Persistence Tests ===

  test "maintains state after multiple toggles" do
    switch = airplane_switch

    # Toggle 5 times
    5.times do
      switch.toggle
      sleep 0.05
    end

    # Should be on (started off, toggled odd number of times)
    assert switch.on?
  end

  # === Visual State Tests ===

  test "switch has correct data-state attribute" do
    switch = airplane_switch

    assert switch.node["data-state"].present?
    assert_equal "unchecked", switch.node["data-state"]

    switch.toggle

    assert_equal "checked", switch.node["data-state"]
  end

  test "all switches have controller attribute" do
    switch = airplane_switch

    controller_attr = switch.node["data-controller"]
    assert_includes controller_attr, "ui--switch"
  end

  # === Multiple Switches Tests ===

  test "toggling one switch does not affect others" do
    switch1 = airplane_switch
    switch2 = notifications_switch

    # Initial states
    assert switch1.off?
    assert switch2.on?

    # Toggle first switch
    switch1.toggle

    # Check states
    assert switch1.on?
    assert switch2.on? # Should not be affected

    # Toggle second switch
    switch2.toggle

    # Check states
    assert switch1.on? # Should not be affected
    assert switch2.off?
  end

  # === Focus Management Tests ===

  test "can receive keyboard focus" do
    switch = keyboard_switch

    is_focused = switch.focus_and_verify

    assert is_focused, "Switch should be focusable"
  end
end
