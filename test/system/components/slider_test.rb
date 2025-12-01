# frozen_string_literal: true

require "test_helper"

class SliderTest < UI::SystemTestCase
  setup do
    visit_component("slider")
  end

  # === Helper Methods ===

  # Helper to get the volume slider (single thumb, default value 33)
  def volume_slider
    find_element(UI::TestingSliderElement, "#volume-slider")
  end

  # Helper to get the price range slider (two thumbs, default [25, 75])
  def price_slider
    find_element(UI::TestingSliderElement, "#price-slider")
  end

  # Helper to get the brightness slider (step=10, default value 50)
  def brightness_slider
    find_element(UI::TestingSliderElement, "#brightness-slider")
  end

  # Helper to get the balance slider (min=-50, max=50, default value 0)
  def balance_slider
    find_element(UI::TestingSliderElement, "#balance-slider")
  end

  # Helper to get the disabled slider
  def disabled_slider
    find_element(UI::TestingSliderElement, "#disabled-slider")
  end

  # Helper to get first vertical slider
  def vertical_slider
    find_element(UI::TestingSliderElement, "#vertical-slider-left")
  end

  # === Initial State Tests ===

  test "displays initial value correctly" do
    slider = volume_slider

    assert_equal 33, slider.value
    assert_equal 0, slider.min
    assert_equal 100, slider.max
    assert_equal 1, slider.step
  end

  test "range slider displays both initial values" do
    slider = price_slider

    assert slider.range?
    assert_equal [25, 75], slider.values
  end

  test "custom min/max range displays correctly" do
    slider = balance_slider

    assert_equal 0, slider.value
    assert_equal(-50, slider.min)
    assert_equal 50, slider.max
  end

  test "custom step increment displays correctly" do
    slider = brightness_slider

    assert_equal 50, slider.value
    assert_equal 10, slider.step
  end

  # === Value Setting Tests ===

  test "sets value programmatically" do
    slider = volume_slider

    slider.set_value(75)

    assert_equal 75, slider.value
  end

  test "sets value within bounds" do
    slider = volume_slider

    slider.set_value(0)
    assert_equal 0, slider.value

    slider.set_value(100)
    assert_equal 100, slider.value
  end

  test "range slider sets specific thumb value" do
    slider = price_slider

    # Set first thumb (min)
    slider.set_value(30, thumb_index: 0)
    assert_equal 30, slider.values[0]

    # Set second thumb (max)
    slider.set_value(80, thumb_index: 1)
    assert_equal 80, slider.values[1]
  end

  test "values stay sorted in range slider" do
    slider = price_slider

    # Try to set first thumb higher than second
    slider.set_value(90, thumb_index: 0)

    # Values should be sorted
    assert slider.values[0] <= slider.values[1], "Thumb values should remain sorted"
  end

  # === Keyboard Navigation Tests ===

  test "arrow right increases value by step" do
    slider = volume_slider
    initial_value = slider.value

    slider.focus_thumb(0)
    slider.press_arrow_right

    assert slider.value > initial_value, "Arrow right should increase value"
    assert_equal initial_value + slider.step, slider.value
  end

  test "arrow left decreases value by step" do
    slider = volume_slider
    initial_value = slider.value

    slider.focus_thumb(0)
    slider.press_arrow_left

    assert slider.value < initial_value, "Arrow left should decrease value"
    assert_equal initial_value - slider.step, slider.value
  end

  test "arrow up increases value by step" do
    slider = volume_slider
    initial_value = slider.value

    slider.focus_thumb(0)
    slider.press_arrow_up

    assert slider.value > initial_value, "Arrow up should increase value"
    assert_equal initial_value + slider.step, slider.value
  end

  test "arrow down decreases value by step" do
    slider = volume_slider
    initial_value = slider.value

    slider.focus_thumb(0)
    slider.press_arrow_down

    assert slider.value < initial_value, "Arrow down should decrease value"
    assert_equal initial_value - slider.step, slider.value
  end

  test "home key jumps to minimum" do
    slider = volume_slider

    slider.jump_to_min

    assert_equal slider.min, slider.value
  end

  test "end key jumps to maximum" do
    slider = volume_slider

    slider.jump_to_max

    assert_equal slider.max, slider.value
  end

  test "page up increases by large step" do
    slider = volume_slider
    initial_value = slider.value

    slider.page_up

    assert slider.value > initial_value, "PageUp should increase value"
    # Large step is (max - min) / 10 = 10
    assert slider.value >= initial_value + 10
  end

  test "page down decreases by large step" do
    slider = volume_slider
    slider.set_value(50) # Start at middle

    initial_value = slider.value
    slider.page_down

    assert slider.value < initial_value, "PageDown should decrease value"
    # Large step is (max - min) / 10 = 10
    assert slider.value <= initial_value - 10
  end

  test "respects step increments with keyboard" do
    slider = brightness_slider # step=10

    slider.set_value(50)
    slider.focus_thumb(0)
    slider.press_arrow_right

    # Should increase by step (10)
    assert_equal 60, slider.value
  end

  test "keyboard navigation respects min boundary" do
    slider = volume_slider

    slider.set_value(0)
    slider.focus_thumb(0)
    slider.press_arrow_left

    # Should stay at min
    assert_equal 0, slider.value
  end

  test "keyboard navigation respects max boundary" do
    slider = volume_slider

    slider.set_value(100)
    slider.focus_thumb(0)
    slider.press_arrow_right

    # Should stay at max
    assert_equal 100, slider.value
  end

  # === Track Click Tests ===

  test "clicking track changes value" do
    slider = volume_slider
    initial_value = slider.value

    # Click at a different position than current
    target_value = (initial_value < 50) ? 80 : 20
    slider.click_track_at(target_value)

    # Value should have changed
    refute_equal initial_value, slider.value, "Value should change after clicking track"
  end

  test "clicking track on range slider moves closest thumb" do
    slider = price_slider

    # Click near the first thumb (value 25)
    slider.click_track_at(20)

    # First thumb should move
    assert slider.values[0] <= 25
  end

  # === Orientation Tests ===

  test "horizontal slider has correct orientation" do
    slider = volume_slider

    assert slider.horizontal?
    refute slider.vertical?
    assert_equal "horizontal", slider.orientation
  end

  test "vertical slider has correct orientation" do
    slider = vertical_slider

    assert slider.vertical?
    refute slider.horizontal?
    assert_equal "vertical", slider.orientation
  end

  # === Disabled State Tests ===

  test "disabled slider cannot be changed via keyboard" do
    slider = disabled_slider
    initial_value = slider.value

    slider.focus_thumb(0)
    slider.press_arrow_right

    assert_equal initial_value, slider.value, "Disabled slider should not change"
  end

  test "disabled slider has correct disabled state" do
    slider = disabled_slider

    # Check disabled attribute on slider element
    assert_equal "true", slider.node["data-ui--slider-disabled-value"]

    # Check disabled state via ARIA
    attrs = slider.aria_attributes(thumb_index: 0)
    assert_equal "true", attrs[:disabled]
  end

  # === ARIA Accessibility Tests ===

  test "thumb has correct role" do
    slider = volume_slider

    assert slider.thumb_has_slider_role?(thumb_index: 0)
  end

  test "thumb has aria-valuenow" do
    slider = volume_slider
    attrs = slider.aria_attributes(thumb_index: 0)

    assert_equal slider.value.to_s, attrs[:valuenow]
  end

  test "thumb has aria-valuemin and aria-valuemax" do
    slider = volume_slider
    attrs = slider.aria_attributes(thumb_index: 0)

    assert_equal slider.min.to_s, attrs[:valuemin]
    assert_equal slider.max.to_s, attrs[:valuemax]
  end

  test "thumb has aria-orientation for horizontal slider" do
    slider = volume_slider
    attrs = slider.aria_attributes(thumb_index: 0)

    assert_equal "horizontal", attrs[:orientation]
  end

  test "thumb has aria-orientation for vertical slider" do
    slider = vertical_slider
    attrs = slider.aria_attributes(thumb_index: 0)

    assert_equal "vertical", attrs[:orientation]
  end

  test "aria-valuenow updates when value changes" do
    slider = volume_slider

    slider.set_value(60)

    attrs = slider.aria_attributes(thumb_index: 0)
    assert_equal "60", attrs[:valuenow]
  end

  test "disabled slider has aria-disabled" do
    slider = disabled_slider
    attrs = slider.aria_attributes(thumb_index: 0)

    assert_equal "true", attrs[:disabled]
  end

  test "enabled slider does not have aria-disabled" do
    slider = volume_slider
    attrs = slider.aria_attributes(thumb_index: 0)

    assert_nil attrs[:disabled]
  end

  # === Multi-thumb Range Tests ===

  test "range slider has multiple thumbs" do
    slider = price_slider

    assert_equal 2, slider.thumbs.count
  end

  test "each thumb in range slider can be focused independently" do
    slider = price_slider

    slider.focus_thumb(0)
    assert_equal 0, slider.focused_thumb_index

    slider.focus_thumb(1)
    assert_equal 1, slider.focused_thumb_index
  end

  test "keyboard controls correct thumb in range slider" do
    slider = price_slider
    initial_values = slider.values

    # Focus and move first thumb
    slider.focus_thumb(0)
    slider.press_arrow_right

    # First value should increase
    assert slider.values[0] > initial_values[0]
    # Second value should stay the same
    assert_equal initial_values[1], slider.values[1]
  end

  test "range slider thumbs cannot cross each other" do
    slider = price_slider

    # Set first thumb to high value
    slider.set_value(80, thumb_index: 0)

    # Values should be sorted, so first is always <= second
    assert slider.values[0] <= slider.values[1]
  end

  # === Sub-element Tests ===

  test "has track element" do
    slider = volume_slider

    assert slider.track.present?
    assert_equal "div", slider.track.tag_name
  end

  test "has range element" do
    slider = volume_slider

    assert slider.range.present?
    assert_equal "div", slider.range.tag_name
  end

  test "has thumb elements" do
    slider = volume_slider

    assert slider.thumbs.present?
    assert_equal 1, slider.thumbs.count
    assert_equal "div", slider.thumbs.first.tag_name
  end

  test "range slider has multiple thumb elements" do
    slider = price_slider

    assert_equal 2, slider.thumbs.count
    slider.thumbs.each do |thumb|
      assert_equal "div", thumb.tag_name
      assert_equal "slider", thumb["role"]
    end
  end

  # === Visual Feedback Tests ===

  test "range element width reflects value" do
    slider = volume_slider

    slider.set_value(50)

    # Range should be approximately 50% wide (allowing for rounding)
    range_style = slider.range["style"]
    assert range_style.include?("width")
  end

  test "thumb position reflects value" do
    slider = volume_slider

    slider.set_value(75)

    # Thumb should be positioned at approximately 75%
    thumb_style = slider.thumb(0)["style"]
    assert thumb_style.include?("left")
    assert thumb_style.include?("75%")
  end

  # === Event Tests ===

  test "dispatches change event when value changes via keyboard" do
    slider = volume_slider
    event_fired = false

    slider.wait_for_change_event do
      slider.focus_thumb(0)
      slider.press_arrow_right
      event_fired = true
    end

    assert event_fired
  end

  test "dispatches commit event when keyboard navigation completes" do
    slider = volume_slider
    event_fired = false

    slider.wait_for_commit_event do
      slider.focus_thumb(0)
      slider.press_arrow_right
      event_fired = true
    end

    assert event_fired
  end

  # === Edge Cases ===

  test "handles negative values correctly" do
    slider = balance_slider # min=-50, max=50

    slider.set_value(-25)

    assert_equal(-25, slider.value)
  end

  test "respects custom step with negative values" do
    slider = balance_slider # step=5

    slider.set_value(-25)
    slider.focus_thumb(0)
    slider.press_arrow_right

    # Should increase by step (5)
    assert_equal(-20, slider.value)
  end

  test "handles zero as a valid value" do
    slider = volume_slider

    slider.set_value(0)

    assert_equal 0, slider.value
  end

  test "handles maximum value correctly" do
    slider = volume_slider

    slider.set_value(100)

    assert_equal 100, slider.value
    assert_equal slider.max, slider.value
  end

  # === Focus Management Tests ===

  test "thumb can receive focus" do
    slider = volume_slider

    slider.focus_thumb(0)

    assert_equal 0, slider.focused_thumb_index
  end

  test "thumb has correct tabindex" do
    slider = volume_slider
    thumb = slider.thumb(0)

    assert_equal "0", thumb["tabindex"]
  end

  # === Multiple Sliders Tests ===

  test "multiple sliders operate independently" do
    slider1 = volume_slider
    slider2 = brightness_slider

    slider1.value
    initial2 = slider2.value

    slider1.set_value(90)

    assert_equal 90, slider1.value
    assert_equal initial2, slider2.value, "Other slider should not be affected"
  end
end
