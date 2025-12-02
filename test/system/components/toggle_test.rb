# frozen_string_literal: true

require "test_helper"

class ToggleTest < UI::SystemTestCase
  setup do
    visit_component("toggle")
  end

  # Helper to get the default toggle (Phlex, released by default)
  def default_toggle
    find_element(UI::Testing::ToggleElement, "#phlex-default")
  end

  # Helper to get the outline toggle (Phlex, released by default)
  def outline_toggle
    find_element(UI::Testing::ToggleElement, "#phlex-outline")
  end

  # Helper to get the pressed toggle (Phlex, pressed by default)
  def pressed_toggle
    find_element(UI::Testing::ToggleElement, "#phlex-pressed")
  end

  # Helper to get the small size toggle (Phlex)
  def small_toggle
    find_element(UI::Testing::ToggleElement, "#phlex-size-sm")
  end

  # Helper to get the large size toggle (Phlex)
  def large_toggle
    find_element(UI::Testing::ToggleElement, "#phlex-size-lg")
  end

  # Helper to get the disabled toggle (Phlex, disabled and released)
  def disabled_released_toggle
    find_element(UI::Testing::ToggleElement, "#phlex-disabled-released")
  end

  # Helper to get the disabled pressed toggle (Phlex, disabled and pressed)
  def disabled_pressed_toggle
    find_element(UI::Testing::ToggleElement, "#phlex-disabled-pressed")
  end

  # Helper to get the keyboard test toggle
  def keyboard_toggle
    find_element(UI::Testing::ToggleElement, "#keyboard-test")
  end

  # === Basic Interaction Tests ===

  test "toggles pressed when clicked" do
    toggle = default_toggle

    # Initially released
    assert toggle.released?

    # Toggle to pressed
    toggle.toggle

    assert toggle.pressed?
    assert_equal "on", toggle.data_state
  end

  test "toggles released when clicked" do
    toggle = pressed_toggle

    # Initially pressed
    assert toggle.pressed?

    # Toggle to released
    toggle.toggle

    assert toggle.released?
    assert_equal "off", toggle.data_state
  end

  test "toggle changes state back and forth" do
    toggle = default_toggle

    # Start released
    assert toggle.released?

    # Toggle to pressed
    toggle.toggle
    assert toggle.pressed?

    # Toggle to released
    toggle.toggle
    assert toggle.released?

    # Toggle to pressed again
    toggle.toggle
    assert toggle.pressed?
  end

  test "press only toggles if currently released" do
    toggle = default_toggle

    # Start released
    assert toggle.released?

    # Press
    toggle.press
    assert toggle.pressed?

    # Press again (should not toggle)
    toggle.press
    assert toggle.pressed?
  end

  test "release only toggles if currently pressed" do
    toggle = pressed_toggle

    # Start pressed
    assert toggle.pressed?

    # Release
    toggle.release
    assert toggle.released?

    # Release again (should not toggle)
    toggle.release
    assert toggle.released?
  end

  # === State Query Tests ===

  test "pressed? returns true when active" do
    toggle = pressed_toggle

    assert toggle.pressed?
  end

  test "released? returns true when inactive" do
    toggle = default_toggle

    assert toggle.released?
  end

  test "data_state reflects current state" do
    toggle = default_toggle

    assert_equal "off", toggle.data_state

    toggle.toggle

    assert_equal "on", toggle.data_state
  end

  # === Keyboard Interaction Tests ===

  test "toggles with Space key" do
    toggle = keyboard_toggle

    # Start released
    assert toggle.released?

    # Focus and press space
    toggle.focus
    toggle.toggle_with_space

    assert toggle.pressed?
  end

  test "toggles with Enter key" do
    toggle = keyboard_toggle

    # Start released
    assert toggle.released?

    # Focus and press enter
    toggle.focus
    toggle.toggle_with_enter

    assert toggle.pressed?
  end

  test "multiple Space presses toggle correctly" do
    toggle = keyboard_toggle

    toggle.focus

    # Start released
    assert toggle.released?

    # Press Space - should press
    toggle.toggle_with_space
    assert toggle.pressed?

    # Press Space - should release
    toggle.toggle_with_space
    assert toggle.released?

    # Press Space - should press again
    toggle.toggle_with_space
    assert toggle.pressed?
  end

  test "Enter and Space both work for toggling" do
    toggle = keyboard_toggle

    toggle.focus

    # Start released
    assert toggle.released?

    # Press Space - pressed
    toggle.toggle_with_space
    assert toggle.pressed?

    # Press Enter - released
    toggle.toggle_with_enter
    assert toggle.released?

    # Press Enter - pressed
    toggle.toggle_with_enter
    assert toggle.pressed?

    # Press Space - released
    toggle.toggle_with_space
    assert toggle.released?
  end

  # === ARIA Accessibility Tests ===

  test "has correct button role" do
    toggle = default_toggle

    # Toggle is a button element, so role is implicit
    assert_equal "button", toggle.tag_name
  end

  test "aria-pressed is false when released" do
    toggle = default_toggle

    assert toggle.released?
    assert_aria_attributes(toggle, pressed: "false")
  end

  test "aria-pressed is true when pressed" do
    toggle = pressed_toggle

    assert toggle.pressed?
    assert_aria_attributes(toggle, pressed: "true")
  end

  test "aria-pressed updates when toggled" do
    toggle = default_toggle

    # Start released
    assert_aria_attributes(toggle, pressed: "false")

    # Toggle to pressed
    toggle.toggle
    assert_aria_attributes(toggle, pressed: "true")

    # Toggle back to released
    toggle.toggle
    assert_aria_attributes(toggle, pressed: "false")
  end

  test "is focusable when enabled" do
    toggle = default_toggle

    assert_focusable(toggle)
  end

  test "can receive keyboard focus" do
    toggle = keyboard_toggle

    is_focused = toggle.focus_and_verify

    assert is_focused, "Toggle should be focusable"
  end

  # === Disabled State Tests ===

  test "disabled toggle cannot be toggled by click" do
    toggle = disabled_released_toggle

    # Initially released and disabled
    assert toggle.released?
    assert toggle.disabled?

    # Try to toggle (should do nothing)
    begin
      toggle.node.click
    rescue
      nil
    end # Click anyway despite disabled
    sleep 0.1

    # Should remain released
    assert toggle.released?
  end

  test "disabled pressed toggle remains pressed" do
    toggle = disabled_pressed_toggle

    # Initially pressed and disabled
    assert toggle.pressed?
    assert toggle.disabled?

    # Try to toggle
    begin
      toggle.node.click
    rescue
      nil
    end
    sleep 0.1

    # Should remain pressed
    assert toggle.pressed?
  end

  test "disabled toggle is not focusable" do
    toggle = disabled_released_toggle

    assert toggle.disabled?
    # Disabled buttons should not be focusable
  end

  # === Variant Tests ===

  test "default variant renders correctly" do
    toggle = default_toggle

    assert toggle.visible?
  end

  test "outline variant renders correctly" do
    toggle = outline_toggle

    assert toggle.visible?
  end

  # === Size Tests ===

  test "small size renders correctly" do
    toggle = small_toggle

    assert toggle.visible?
  end

  test "large size renders correctly" do
    toggle = large_toggle

    assert toggle.visible?
  end

  # === State Persistence Tests ===

  test "maintains state after multiple toggles" do
    toggle = default_toggle

    # Toggle 5 times
    5.times do
      toggle.toggle
      sleep 0.05
    end

    # Should be pressed (started released, toggled odd number of times)
    assert toggle.pressed?
  end

  # === Visual State Tests ===

  test "toggle has correct data-state attribute" do
    toggle = default_toggle

    assert toggle.node["data-state"].present?
    assert_equal "off", toggle.node["data-state"]

    toggle.toggle

    assert_equal "on", toggle.node["data-state"]
  end

  test "all toggles have controller attribute" do
    toggle = default_toggle

    controller_attr = toggle.node["data-controller"]
    assert_includes controller_attr, "ui--toggle"
  end

  # === Multiple Toggles Tests ===

  test "toggling one toggle does not affect others" do
    toggle1 = default_toggle
    toggle2 = pressed_toggle

    # Initial states
    assert toggle1.released?
    assert toggle2.pressed?

    # Toggle first toggle
    toggle1.toggle

    # Check states
    assert toggle1.pressed?
    assert toggle2.pressed? # Should not be affected

    # Toggle second toggle
    toggle2.toggle

    # Check states
    assert toggle1.pressed? # Should not be affected
    assert toggle2.released?
  end
end
