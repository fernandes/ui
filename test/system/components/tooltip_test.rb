# frozen_string_literal: true

require "test_helper"

class TooltipTest < UI::SystemTestCase
  setup do
    visit_component("tooltip")
  end

  # Helper to get the basic tooltip by ID
  def basic_tooltip
    find_element(UI::Testing::TooltipElement, "#basic-tooltip")
  end

  # Helper to get the top positioned tooltip by ID
  def top_tooltip
    find_element(UI::Testing::TooltipElement, "#tooltip-top")
  end

  # Helper to get the right positioned tooltip by ID
  def right_tooltip
    find_element(UI::Testing::TooltipElement, "#tooltip-right")
  end

  # Helper to get the bottom positioned tooltip by ID
  def bottom_tooltip
    find_element(UI::Testing::TooltipElement, "#tooltip-bottom")
  end

  # Helper to get the left positioned tooltip by ID
  def left_tooltip
    find_element(UI::Testing::TooltipElement, "#tooltip-left")
  end

  # Helper to get the tooltip with button by ID
  def button_tooltip
    find_element(UI::Testing::TooltipElement, "#tooltip-with-button")
  end

  # Helper to get the tooltip with destructive button by ID
  def destructive_tooltip
    find_element(UI::Testing::TooltipElement, "#tooltip-destructive")
  end

  # === Basic Interaction Tests ===

  test "shows tooltip on hover" do
    tooltip = basic_tooltip

    # Initially hidden
    assert tooltip.hidden?

    # Show on hover
    tooltip.show

    # Should be visible
    assert tooltip.visible?
  end

  test "hides tooltip when mouse moves away" do
    tooltip = basic_tooltip

    # Show the tooltip
    tooltip.show
    assert tooltip.visible?

    # Hide it
    tooltip.hide

    # Should be hidden
    assert tooltip.hidden?
  end

  test "displays correct content text" do
    tooltip = basic_tooltip

    tooltip.show

    assert_equal "Add to library", tooltip.content_text
  end

  test "displays correct trigger text" do
    tooltip = basic_tooltip

    assert_equal "Hover me (ERB)", tooltip.trigger_text
  end

  # === Positioning Tests ===

  test "displays tooltip on top by default" do
    tooltip = top_tooltip

    tooltip.show

    assert_equal "top", tooltip.side
  end

  test "displays tooltip on right when side is right" do
    tooltip = right_tooltip

    tooltip.show

    assert_equal "right", tooltip.side
  end

  test "displays tooltip on bottom when side is bottom" do
    tooltip = bottom_tooltip

    tooltip.show

    assert_equal "bottom", tooltip.side
  end

  test "displays tooltip on left when side is left" do
    tooltip = left_tooltip

    tooltip.show

    assert_equal "left", tooltip.side
  end

  # === State Management Tests ===

  test "sets data-state to open when shown" do
    tooltip = basic_tooltip

    tooltip.show

    assert tooltip.open?
    refute tooltip.closed?
  end

  test "sets data-state to closed when hidden" do
    tooltip = basic_tooltip

    tooltip.show
    assert tooltip.open?

    tooltip.hide

    assert tooltip.closed?
    refute tooltip.open?
  end

  # === ARIA Accessibility Tests ===

  # TODO: Add role="tooltip" attribute to content component
  # test "content has role tooltip" do
  #   tooltip = basic_tooltip
  #
  #   tooltip.show
  #
  #   assert_equal "tooltip", tooltip.content_role
  # end

  # === asChild Composition Tests ===

  # TODO: Fix hover on button triggers (element not visible error)
  # test "works with button trigger using asChild" do
  #   tooltip = button_tooltip
  #
  #   tooltip.show
  #
  #   assert tooltip.visible?
  #   assert_equal "Button with tooltip", tooltip.content_text
  # end
  #
  # test "works with destructive button using asChild" do
  #   tooltip = destructive_tooltip
  #
  #   tooltip.show
  #
  #   assert tooltip.visible?
  #   assert_equal "Delete item permanently", tooltip.content_text
  # end

  # === Keyboard Interaction Tests ===

  test "hides tooltip on Escape key" do
    tooltip = basic_tooltip

    tooltip.show
    assert tooltip.visible?

    # Press Escape
    tooltip.press_escape

    # Should hide
    assert tooltip.hidden?
  end

  # === Multiple Tooltips Tests ===

  test "can show multiple tooltips independently" do
    tooltip1 = basic_tooltip
    tooltip2 = top_tooltip

    # Show first tooltip
    tooltip1.show
    assert tooltip1.visible?
    assert tooltip2.hidden?

    # Move to second tooltip
    tooltip1.hide
    tooltip2.show
    assert tooltip1.hidden?
    assert tooltip2.visible?
  end

  # === Content Visibility Tests ===

  test "tooltip content is rendered but initially hidden" do
    tooltip = basic_tooltip

    # Content should exist but be closed
    assert tooltip.closed?
  end

  test "tooltip shows and hides smoothly with state transitions" do
    tooltip = basic_tooltip

    # Initially closed
    assert tooltip.closed?

    # Show
    tooltip.show
    tooltip.wait_for_content_state("open")
    assert tooltip.open?

    # Hide
    tooltip.hide
    tooltip.wait_for_content_state("closed")
    assert tooltip.closed?
  end

  # === Position Verification Tests ===

  test "tooltip content text matches expected for each position" do
    # Test all four positions
    top_tooltip.show
    assert_equal "Appears on top", top_tooltip.content_text
    top_tooltip.hide

    right_tooltip.show
    assert_equal "Appears on right", right_tooltip.content_text
    right_tooltip.hide

    bottom_tooltip.show
    assert_equal "Appears on bottom", bottom_tooltip.content_text
    bottom_tooltip.hide

    left_tooltip.show
    assert_equal "Appears on left", left_tooltip.content_text
    left_tooltip.hide
  end
end
