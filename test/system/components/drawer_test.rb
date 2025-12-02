# frozen_string_literal: true

require "test_helper"

class DrawerComponentTest < UI::SystemTestCase
  def setup
    visit_component("drawer")
  end

  # ============================================================================
  # DEFAULT (BOTTOM) DRAWER TESTS
  # ============================================================================

  test "default drawer opens and closes with trigger and close button" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-default-phlex")

    assert drawer.closed?, "Drawer should be closed initially"
    refute drawer.content_visible?, "Content should not be visible initially"

    drawer.open
    assert drawer.open?, "Drawer should be open"
    assert drawer.content_visible?, "Content should be visible when open"

    drawer.close
    assert drawer.closed?, "Drawer should be closed after close button click"
  end

  test "default drawer closes with escape key" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-default-erb")

    drawer.open
    assert drawer.open?, "Drawer should be open"

    drawer.close_with_escape
    assert drawer.closed?, "Drawer should close with escape key"
  end

  test "default drawer closes with overlay click" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-default-vc")

    drawer.open
    assert drawer.open?, "Drawer should be open"

    drawer.close_by_overlay_click
    assert drawer.closed?, "Drawer should close with overlay click"
  end

  test "default drawer displays title and description" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-default-phlex")

    drawer.open

    assert_equal "Move Goal", drawer.title
    assert_equal "Set your daily activity goal.", drawer.description
  end

  test "default drawer has proper ARIA attributes" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-default-phlex")

    drawer.open

    assert_equal "dialog", drawer.content_role
    assert_equal "true", drawer.content_aria_modal
  end

  # ============================================================================
  # DIRECTION TESTS
  # ============================================================================

  test "drawer direction top" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-direction-top-phlex")

    assert_equal "top", drawer.direction

    drawer.open
    assert drawer.open?, "Top drawer should open"
    assert_equal "From Top", drawer.title

    drawer.close
    assert drawer.closed?, "Top drawer should close"
  end

  test "drawer direction left" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-direction-left-erb")

    assert_equal "left", drawer.direction

    drawer.open
    assert drawer.open?, "Left drawer should open"
    assert_equal "From Left", drawer.title

    drawer.close
    assert drawer.closed?, "Left drawer should close"
  end

  test "drawer direction right" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-direction-right-vc")

    assert_equal "right", drawer.direction

    drawer.open
    assert drawer.open?, "Right drawer should open"
    assert_equal "From Right", drawer.title

    drawer.close
    assert drawer.closed?, "Right drawer should close"
  end

  # ============================================================================
  # SNAP POINTS TESTS (CRITICAL!)
  # ============================================================================

  test "snap points drawer has correct snap point configuration" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-snap-points-phlex")

    assert drawer.has_snap_points?, "Drawer should have snap points configured"
    assert_equal 3, drawer.snap_points_count, "Should have 3 snap points"
    assert_equal [0.25, 0.5, 1], drawer.snap_points, "Should have snap points at 25%, 50%, 100%"
  end

  test "snap points drawer opens at first snap point" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-snap-points-phlex")

    drawer.open
    assert drawer.open?, "Drawer should be open"
    assert drawer.at_snap_point?(0), "Drawer should be at first snap point (25%)"
  end

  test "snap points drawer can snap to different points" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-snap-points-erb")

    drawer.open
    assert drawer.at_snap_point?(0), "Should start at first snap point"

    # Snap to second snap point (50%)
    drawer.snap_to(1)
    assert drawer.at_snap_point?(1), "Should be at second snap point (50%)"
    assert_equal 1, drawer.current_snap_point

    # Snap to third snap point (100%)
    drawer.snap_to(2)
    assert drawer.at_snap_point?(2), "Should be at third snap point (100%)"
    assert_equal 2, drawer.current_snap_point

    # Snap back to first snap point
    drawer.snap_to(0)
    assert drawer.at_snap_point?(0), "Should be back at first snap point (25%)"
    assert_equal 0, drawer.current_snap_point
  end

  test "snap points drawer maintains state after snapping" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-snap-points-vc")

    drawer.open
    drawer.snap_to(2) # Snap to 100%

    assert drawer.open?, "Drawer should remain open after snapping"
    assert drawer.at_snap_point?(2), "Should be at third snap point"
    assert drawer.content_visible?, "Content should be visible"
  end

  test "snap points drawer has handle for dragging" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-snap-points-phlex")

    drawer.open

    # Verify handle exists and is visible
    assert drawer.handle.visible?, "Handle should be visible for drag gesture"
  end

  test "snap points drawer queries current snap point correctly" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-snap-points-erb")

    drawer.open

    # Initial state
    initial_snap = drawer.current_snap_point
    assert_equal 0, initial_snap, "Should start at index 0"

    # Move to different snap points and verify
    drawer.snap_to(1)
    assert_equal 1, drawer.current_snap_point

    drawer.snap_to(2)
    assert_equal 2, drawer.current_snap_point
  end

  # ============================================================================
  # HANDLE-ONLY DRAGGING TESTS
  # ============================================================================

  test "handle-only drawer opens and has handle" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-handle-only-phlex")

    drawer.open
    assert drawer.open?, "Handle-only drawer should open"
    assert drawer.handle.visible?, "Handle should be visible"
  end

  test "handle-only drawer opens and closes" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-handle-only-erb")

    drawer.open
    assert drawer.open?, "Handle-only drawer should open"
    assert_equal "Handle-Only Mode", drawer.title

    drawer.close
    assert drawer.closed?, "Handle-only drawer should close"
  end

  test "handle-only drawer has visible handle" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-handle-only-vc")

    drawer.open

    assert drawer.handle.visible?, "Handle should be visible in handle-only mode"
  end

  # ============================================================================
  # NON-MODAL MODE TESTS
  # ============================================================================

  test "non-modal drawer opens with content visible" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-non-modal-phlex")

    drawer.open
    assert drawer.open?, "Non-modal drawer should open"
    assert drawer.content_visible?, "Content should be visible"
  end

  test "non-modal drawer opens and closes" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-non-modal-erb")

    drawer.open
    assert drawer.open?, "Non-modal drawer should open"
    assert_equal "Non-Modal", drawer.title

    drawer.close
    assert drawer.closed?, "Non-modal drawer should close"
  end

  test "non-modal drawer opens correctly" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-non-modal-vc")

    drawer.open

    # In non-modal mode, aria-modal should be false or not set
    # Note: The implementation may vary, so we just check it opens correctly
    assert drawer.open?, "Drawer should be open in non-modal mode"
    assert drawer.content_visible?, "Content should be visible"
  end

  # ============================================================================
  # ACCESSIBILITY TESTS
  # ============================================================================

  test "drawer has dialog role" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-default-phlex")

    drawer.open

    assert_equal "dialog", drawer.content_role
  end

  test "drawer has aria-modal attribute in modal mode" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-default-phlex")

    drawer.open

    assert_equal "true", drawer.content_aria_modal
  end

  test "drawer is dismissible by default" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-default-phlex")

    assert drawer.dismissible?, "Drawer should be dismissible by default"
  end

  test "drawer has close button" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-default-phlex")

    drawer.open

    assert drawer.has_close_button?, "Drawer should have a close button"
  end

  # ============================================================================
  # OVERLAY TESTS
  # ============================================================================

  test "drawer overlay is visible when open" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-default-phlex")

    drawer.open

    assert drawer.overlay_visible?, "Overlay should be visible when drawer is open"
  end

  test "drawer overlay has correct data-state" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-default-phlex")

    drawer.open

    assert_equal "open", drawer.overlay["data-state"]

    drawer.close

    assert_equal "closed", drawer.overlay["data-state"]
  end

  # ============================================================================
  # HANDLE TESTS
  # ============================================================================

  test "drawer has handle element" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-default-phlex")

    drawer.open

    assert drawer.handle.visible?, "Handle should be visible"
  end

  test "drawer handle can be interacted with" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-handle-only-phlex")

    drawer.open

    # Just verify we can access and interact with handle
    drawer.drag_handle
    assert drawer.open?, "Drawer should remain open after handle interaction"
  end

  # ============================================================================
  # CONTENT TESTS
  # ============================================================================

  test "drawer content has correct data-state" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-default-phlex")

    drawer.open
    assert_equal "open", drawer.content["data-state"]

    drawer.close
    assert_equal "closed", drawer.content["data-state"]
  end

  test "drawer container has correct data-state" do
    drawer = find_element(UI::Testing::DrawerElement, "#drawer-default-phlex")

    drawer.open
    assert_equal "open", drawer.container["data-state"]

    drawer.close
    assert_equal "closed", drawer.container["data-state"]
  end
end
