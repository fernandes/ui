# frozen_string_literal: true

require "test_helper"

class ResizableTest < UI::SystemTestCase
  setup do
    visit_component("resizable")
  end

  # === Helper Methods ===

  def basic_horizontal
    find_element(UI::Testing::ResizableElement, "#erb-basic-horizontal")
  end

  def vertical_resizable
    find_element(UI::Testing::ResizableElement, "#erb-vertical")
  end

  def handle_grip_resizable
    find_element(UI::Testing::ResizableElement, "#erb-handle-grip")
  end

  def constrained_resizable
    find_element(UI::Testing::ResizableElement, "#erb-with-constraints")
  end

  def sidebar_resizable
    find_element(UI::Testing::ResizableElement, "#erb-sidebar")
  end

  # === Basic Structure Tests ===

  test "renders panel group with correct structure" do
    resizable = basic_horizontal

    assert resizable.visible?
    # basic_horizontal has 2 direct children: panel "One" and panel with nested group
    assert_equal 2, resizable.panel_count
    assert_equal 1, resizable.handle_count
  end

  test "identifies direction correctly for horizontal layout" do
    resizable = basic_horizontal

    assert resizable.horizontal?
    refute resizable.vertical?
    assert_equal "horizontal", resizable.direction
  end

  test "identifies direction correctly for vertical layout" do
    resizable = vertical_resizable

    assert resizable.vertical?
    refute resizable.horizontal?
    assert_equal "vertical", resizable.direction
  end

  test "has correct number of panels and handles" do
    resizable = vertical_resizable

    assert_equal 2, resizable.panel_count
    assert_equal 1, resizable.handle_count
  end

  # === Initial State Tests ===

  test "initializes with default panel sizes" do
    resizable = vertical_resizable

    # Both panels should start at 50%
    assert_in_delta 50.0, resizable.panel_size(0), 1.0
    assert_in_delta 50.0, resizable.panel_size(1), 1.0
  end

  test "panel sizes sum to 100 percent" do
    resizable = vertical_resizable

    assert resizable.sizes_sum_to_100?
  end

  test "stores default size in data attribute" do
    resizable = vertical_resizable

    assert_equal 50.0, resizable.panel_default_size(0)
    assert_equal 50.0, resizable.panel_default_size(1)
  end

  test "respects custom default sizes" do
    resizable = sidebar_resizable

    # Sidebar should be 20%, main content 80%
    assert_in_delta 20.0, resizable.panel_size(0), 2.0
    assert_in_delta 80.0, resizable.panel_size(1), 2.0
  end

  # === Constraint Tests ===

  test "stores min size constraint in data attribute" do
    resizable = constrained_resizable

    assert_equal 20.0, resizable.panel_min_size(0)
    assert_equal 20.0, resizable.panel_min_size(1)
  end

  test "stores max size constraint in data attribute" do
    resizable = constrained_resizable

    assert_equal 80.0, resizable.panel_max_size(0)
    assert_equal 80.0, resizable.panel_max_size(1)
  end

  test "panels start within constraints" do
    resizable = constrained_resizable

    assert resizable.panel_within_constraints?(0)
    assert resizable.panel_within_constraints?(1)
    assert resizable.all_panels_within_constraints?
  end

  test "sidebar has correct min and max constraints" do
    resizable = sidebar_resizable

    assert_equal 15.0, resizable.panel_min_size(0)
    assert_equal 30.0, resizable.panel_max_size(0)
  end

  # === Drag Interaction Tests ===

  test "dragging handle horizontally changes panel sizes" do
    resizable = handle_grip_resizable

    initial_left_size = resizable.panel_size(0)
    initial_right_size = resizable.panel_size(1)

    # Drag handle 50px to the right
    resizable.drag_handle(0, 50)

    new_left_size = resizable.panel_size(0)
    new_right_size = resizable.panel_size(1)

    # Left panel should grow, right panel should shrink
    assert new_left_size > initial_left_size, "Left panel should grow"
    assert new_right_size < initial_right_size, "Right panel should shrink"

    # Sizes should still sum to ~100%
    assert resizable.sizes_sum_to_100?(tolerance: 2.0)
  end

  test "dragging handle vertically changes panel sizes" do
    resizable = vertical_resizable

    initial_top_size = resizable.panel_size(0)
    initial_bottom_size = resizable.panel_size(1)

    # Drag handle 30px down
    resizable.drag_handle(0, 30)

    new_top_size = resizable.panel_size(0)
    new_bottom_size = resizable.panel_size(1)

    # Top panel should grow, bottom panel should shrink
    assert new_top_size > initial_top_size, "Top panel should grow"
    assert new_bottom_size < initial_bottom_size, "Bottom panel should shrink"

    # Sizes should still sum to ~100%
    assert resizable.sizes_sum_to_100?(tolerance: 2.0)
  end

  test "dragging handle in negative direction changes sizes correctly" do
    resizable = handle_grip_resizable

    initial_left_size = resizable.panel_size(0)
    initial_right_size = resizable.panel_size(1)

    # Drag handle 50px to the left
    resizable.drag_handle(0, -50)

    new_left_size = resizable.panel_size(0)
    new_right_size = resizable.panel_size(1)

    # Left panel should shrink, right panel should grow
    assert new_left_size < initial_left_size, "Left panel should shrink"
    assert new_right_size > initial_right_size, "Right panel should grow"
  end

  test "respects min size constraint during drag" do
    resizable = constrained_resizable

    # Try to drag far to the left (should hit min constraint of 20%)
    resizable.drag_handle(0, -200)

    left_size = resizable.panel_size(0)
    min_size = resizable.panel_min_size(0)

    assert left_size >= min_size, "Panel should not go below min size"
    assert resizable.panel_within_constraints?(0)
  end

  test "respects max size constraint during drag" do
    resizable = constrained_resizable

    # Try to drag far to the right (should hit max constraint of 80%)
    resizable.drag_handle(0, 200)

    left_size = resizable.panel_size(0)
    max_size = resizable.panel_max_size(0)

    assert left_size <= max_size, "Panel should not go above max size"
    assert resizable.panel_within_constraints?(0)
  end

  # === Keyboard Interaction Tests ===

  test "arrow right increases left panel size in horizontal layout" do
    resizable = handle_grip_resizable

    initial_size = resizable.panel_size(0)
    resizable.keyboard_resize(0, :right, times: 3)

    new_size = resizable.panel_size(0)
    assert new_size > initial_size, "Left panel should grow with arrow right"
  end

  test "arrow left decreases left panel size in horizontal layout" do
    resizable = handle_grip_resizable

    initial_size = resizable.panel_size(0)
    resizable.keyboard_resize(0, :left, times: 3)

    new_size = resizable.panel_size(0)
    assert new_size < initial_size, "Left panel should shrink with arrow left"
  end

  test "arrow down increases top panel size in vertical layout" do
    resizable = vertical_resizable

    initial_size = resizable.panel_size(0)
    resizable.keyboard_resize(0, :down, times: 3)

    new_size = resizable.panel_size(0)
    assert new_size > initial_size, "Top panel should grow with arrow down"
  end

  test "arrow up decreases top panel size in vertical layout" do
    resizable = vertical_resizable

    initial_size = resizable.panel_size(0)
    resizable.keyboard_resize(0, :up, times: 3)

    new_size = resizable.panel_size(0)
    assert new_size < initial_size, "Top panel should shrink with arrow up"
  end

  test "Home key minimizes left panel to min size" do
    resizable = constrained_resizable

    resizable.minimize_left_panel(0)

    left_size = resizable.panel_size(0)
    min_size = resizable.panel_min_size(0)

    assert_in_delta min_size, left_size, 2.0, "Panel should be at minimum size"
  end

  test "End key maximizes left panel to max size" do
    resizable = constrained_resizable

    resizable.maximize_left_panel(0)

    left_size = resizable.panel_size(0)
    max_size = resizable.panel_max_size(0)

    assert_in_delta max_size, left_size, 2.0, "Panel should be at maximum size"
  end

  test "keyboard resize respects min size constraint" do
    resizable = constrained_resizable

    # Minimize first
    resizable.minimize_left_panel(0)

    # Try to go smaller with arrow left
    resizable.keyboard_resize(0, :left, times: 5)

    left_size = resizable.panel_size(0)
    min_size = resizable.panel_min_size(0)

    assert left_size >= min_size, "Keyboard resize should respect min size"
  end

  test "keyboard resize respects max size constraint" do
    resizable = constrained_resizable

    # Maximize first
    resizable.maximize_left_panel(0)

    # Try to go larger with arrow right
    resizable.keyboard_resize(0, :right, times: 5)

    left_size = resizable.panel_size(0)
    max_size = resizable.panel_max_size(0)

    assert left_size <= max_size, "Keyboard resize should respect max size"
  end

  # === ARIA Accessibility Tests ===

  test "handle has separator role" do
    resizable = handle_grip_resizable

    assert resizable.handle_has_separator_role?(0)

    aria = resizable.handle_aria_attributes(0)
    assert_equal "separator", aria[:role]
  end

  test "handle has aria-valuenow reflecting current size" do
    resizable = handle_grip_resizable

    aria = resizable.handle_aria_attributes(0)

    assert aria[:valuenow].present?
    assert aria[:valuenow].to_i.between?(0, 100)
  end

  test "handle has aria-valuemin and aria-valuemax" do
    resizable = handle_grip_resizable

    aria = resizable.handle_aria_attributes(0)

    assert_equal "0", aria[:valuemin]
    assert_equal "100", aria[:valuemax]
  end

  test "handle is focusable with tabindex" do
    resizable = handle_grip_resizable

    assert resizable.handle_focusable?(0)
  end

  test "handle updates aria-valuenow after resize" do
    resizable = handle_grip_resizable

    initial_aria = resizable.handle_aria_attributes(0)
    initial_valuenow = initial_aria[:valuenow].to_i

    # Resize
    resizable.keyboard_resize(0, :right, times: 3)

    updated_aria = resizable.handle_aria_attributes(0)
    updated_valuenow = updated_aria[:valuenow].to_i

    assert updated_valuenow != initial_valuenow, "aria-valuenow should update after resize"
  end

  # === Handle State Tests ===

  test "handle has data-resize-handle-state attribute" do
    resizable = handle_grip_resizable

    state = resizable.handle_state(0)
    assert state.present?
  end

  test "handle state is inactive by default" do
    resizable = handle_grip_resizable

    state = resizable.handle_state(0)
    assert_equal "inactive", state
  end

  test "handle direction matches panel group direction" do
    resizable = handle_grip_resizable
    handle = resizable.handle(0)

    assert_equal "horizontal", handle["data-panel-group-direction"]
  end

  test "vertical handle has correct direction attribute" do
    resizable = vertical_resizable
    handle = resizable.handle(0)

    assert_equal "vertical", handle["data-panel-group-direction"]
  end

  # === Nested Panels Test ===

  test "handles nested panel groups correctly" do
    resizable = basic_horizontal

    # Basic horizontal has 2 direct children: panel "One" and panel with nested group
    # The nested panels (Two/Three) are inside a nested panel group
    assert_equal 2, resizable.panel_count
    assert_equal 1, resizable.handle_count
  end

  # === Panel Access Tests ===

  test "can access individual panels by index" do
    resizable = vertical_resizable

    panel_0 = resizable.panel(0)
    panel_1 = resizable.panel(1)

    assert panel_0.present?
    assert panel_1.present?
  end

  test "can access individual handles by index" do
    resizable = vertical_resizable

    handle_0 = resizable.handle(0)

    assert handle_0.present?
  end

  test "returns nil for out of bounds panel index" do
    resizable = vertical_resizable

    panel = resizable.panel(99)

    assert_nil panel
  end

  test "returns nil for out of bounds handle index" do
    resizable = vertical_resizable

    handle = resizable.handle(99)

    assert_nil handle
  end

  # === Panel Sizes Array Test ===

  test "returns all panel sizes as array" do
    resizable = vertical_resizable

    sizes = resizable.panel_sizes

    assert_equal 2, sizes.count
    assert sizes.all? { |s| s.is_a?(Float) }
    assert sizes.all? { |s| s >= 0 && s <= 100 }
  end

  # === Focus Tests ===

  test "can focus a resize handle" do
    resizable = handle_grip_resizable

    resizable.focus_handle(0)

    # After focusing, should be able to use keyboard without error
    resizable.press_arrow_right
    sleep 0.1

    # If we got here without error, focus worked
    assert true
  end

  # === Multiple Resize Operations ===

  test "multiple drag operations maintain size consistency" do
    resizable = handle_grip_resizable

    # Drag right
    resizable.drag_handle(0, 30)
    assert resizable.sizes_sum_to_100?(tolerance: 2.0)

    # Drag left
    resizable.drag_handle(0, -20)
    assert resizable.sizes_sum_to_100?(tolerance: 2.0)

    # Drag right again
    resizable.drag_handle(0, 10)
    assert resizable.sizes_sum_to_100?(tolerance: 2.0)
  end

  test "multiple keyboard operations maintain size consistency" do
    resizable = handle_grip_resizable

    resizable.keyboard_resize(0, :right, times: 5)
    assert resizable.sizes_sum_to_100?(tolerance: 2.0)

    resizable.keyboard_resize(0, :left, times: 3)
    assert resizable.sizes_sum_to_100?(tolerance: 2.0)
  end

  test "mixing drag and keyboard operations maintains consistency" do
    resizable = handle_grip_resizable

    # Drag
    resizable.drag_handle(0, 40)
    assert resizable.sizes_sum_to_100?(tolerance: 2.0)

    # Keyboard
    resizable.keyboard_resize(0, :left, times: 2)
    assert resizable.sizes_sum_to_100?(tolerance: 2.0)

    # Drag again
    resizable.drag_handle(0, -20)
    assert resizable.sizes_sum_to_100?(tolerance: 2.0)
  end

  # === Edge Cases ===

  test "handles rapid keyboard input without errors" do
    resizable = handle_grip_resizable

    resizable.focus_handle(0)

    # Rapidly press arrow keys
    10.times do
      resizable.press_arrow_right
    end

    sleep 0.2

    # Should still be in valid state
    assert resizable.sizes_sum_to_100?(tolerance: 2.0)
    assert resizable.all_panels_within_constraints?
  end

  test "panel group has correct data attribute for direction" do
    resizable = basic_horizontal

    assert_equal "horizontal", resizable.node["data-panel-group-direction"]
  end

  test "vertical panel group has correct data attribute" do
    resizable = vertical_resizable

    assert_equal "vertical", resizable.node["data-panel-group-direction"]
  end

  # === Waiter Tests ===

  test "waiter can detect panel size changes" do
    resizable = handle_grip_resizable

    initial_size = resizable.panel_size(0)

    # Start resize in background (simulate async operation)
    resizable.keyboard_resize(0, :right, times: 3)

    # Wait for size to change (with tolerance)
    expected_size = initial_size + 30 # keyboard_resize_by default is 10, times 3
    resizable.wait_for_panel_size(0, expected_size, tolerance: 5.0)

    assert true, "Waiter detected size change"
  end
end
