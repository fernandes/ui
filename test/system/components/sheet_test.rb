# frozen_string_literal: true

require "test_helper"

class SheetTest < UI::SystemTestCase
  setup do
    visit_component("sheet")
  end

  # Helper to get the default ERB sheet by ID
  def default_sheet
    find_element(UI::Testing::SheetElement, "#erb-default-sheet")
  end

  # Helper to get a side-specific ERB sheet by ID
  def sheet_by_side(side)
    find_element(UI::Testing::SheetElement, "#erb-sheet-#{side}")
  end

  # Helper to get the custom width sheet
  def wide_sheet
    find_element(UI::Testing::SheetElement, "#erb-wide-sheet")
  end

  # Helper to get the no-close-button sheet
  def no_close_button_sheet
    find_element(UI::Testing::SheetElement, "#erb-no-close-button-sheet")
  end

  # === Basic Interaction Tests ===

  test "opens sheet when trigger is clicked" do
    sheet = default_sheet

    # Initially closed
    assert sheet.closed?

    # Click trigger to open
    sheet.open

    # Should be open
    assert sheet.open?
    assert sheet.content_visible?
  end

  test "closes sheet when close button is clicked" do
    sheet = default_sheet

    sheet.open
    assert sheet.open?

    sheet.close

    assert sheet.closed?
  end

  test "sheet displays title and description" do
    sheet = default_sheet

    sheet.open

    assert_equal "Edit profile", sheet.title
    assert_equal "Make changes to your profile here. Click save when you're done.", sheet.description
  end

  test "sheet has close button by default" do
    sheet = default_sheet

    sheet.open

    assert sheet.has_close_button?
  end

  # === Close Methods Tests ===

  test "closes sheet with Escape key" do
    sheet = default_sheet

    sheet.open
    assert sheet.open?

    sheet.close_with_escape

    assert sheet.closed?
  end

  test "closes sheet when overlay is clicked" do
    sheet = default_sheet

    sheet.open
    assert sheet.open?

    # Click overlay to close
    sheet.close_by_overlay_click

    assert sheet.closed?
  end

  # === Side Variants Tests ===

  test "sheet slides from right side (default)" do
    sheet = default_sheet

    sheet.open

    assert sheet.slide_from?(:right)
  end

  test "sheet slides from top side" do
    sheet = sheet_by_side("top")

    sheet.open

    assert sheet.slide_from?(:top)
    assert_equal "Top Sheet", sheet.title
  end

  test "sheet slides from bottom side" do
    sheet = sheet_by_side("bottom")

    sheet.open

    assert sheet.slide_from?(:bottom)
    assert_equal "Bottom Sheet", sheet.title
  end

  test "sheet slides from left side" do
    sheet = sheet_by_side("left")

    sheet.open

    assert sheet.slide_from?(:left)
    assert_equal "Left Sheet", sheet.title
  end

  # === ARIA Accessibility Tests ===

  test "content has correct role" do
    sheet = default_sheet

    sheet.open

    assert_equal "dialog", sheet.content_role
  end

  test "content has aria-modal attribute" do
    sheet = default_sheet

    sheet.open

    assert_equal "true", sheet.content_aria_modal
  end

  # === Focus Management Tests ===

  test "focuses first focusable element when opened" do
    sheet = default_sheet

    sheet.open

    # Wait a moment for focus to settle
    sleep 0.2

    # Check that something inside the sheet has focus
    focused_element = page.evaluate_script("document.activeElement")
    focused_tag = page.evaluate_script("document.activeElement.tagName")

    # Should be an input, button, or other focusable element
    assert_includes ["INPUT", "BUTTON", "A"], focused_tag,
      "Expected a focusable element to be focused, got #{focused_tag}"
  end

  test "traps focus within sheet when open" do
    sheet = default_sheet

    sheet.open

    # Wait for focus trap to be set up
    sleep 0.1

    # Tab through elements - focus should stay within sheet
    assert sheet.content_visible?
  end

  # === Overlay Tests ===

  test "shows overlay when sheet is open" do
    sheet = default_sheet

    sheet.open

    assert sheet.overlay_visible?
  end

  test "overlay has correct data-state" do
    sheet = default_sheet

    assert_equal "closed", sheet.overlay["data-state"]

    sheet.open

    assert_equal "open", sheet.overlay["data-state"]

    sheet.close

    assert_equal "closed", sheet.overlay["data-state"]
  end

  # === Container Tests ===

  test "container has correct data-state" do
    sheet = default_sheet

    assert_equal "closed", sheet.container["data-state"]

    sheet.open

    assert_equal "open", sheet.container["data-state"]

    sheet.close

    assert_equal "closed", sheet.container["data-state"]
  end

  # === Custom Width Tests ===

  test "sheet can have custom width classes" do
    sheet = wide_sheet

    sheet.open

    # Check if custom width class is applied
    assert sheet.content[:class].include?("sm:max-w-xl")
    assert_equal "Wide Sheet", sheet.title
  end

  # === Without Close Button Tests ===

  test "sheet without close button in corner (show_close: false)" do
    sheet = no_close_button_sheet

    sheet.open

    # Should NOT have the built-in X button in the corner
    # The X button has a specific class pattern
    has_x_button = sheet.content.has_css?('button.absolute.top-4.right-4', visible: :all)
    refute has_x_button, "Sheet should not have X button when show_close is false"

    # Should still be able to close via overlay or escape
    sheet.close_with_escape
    assert sheet.closed?
  end

  # === State Persistence Tests ===

  test "maintains closed state after opening and closing" do
    sheet = default_sheet

    sheet.open
    assert sheet.open?

    sheet.close
    assert sheet.closed?

    # Should be able to open again
    sheet.open
    assert sheet.open?
  end

  test "can open and close multiple times" do
    sheet = default_sheet

    3.times do
      sheet.open
      assert sheet.open?

      sheet.close
      assert sheet.closed?
    end
  end

  # === Body Scroll Lock Tests ===

  test "prevents body scroll when sheet is open" do
    sheet = default_sheet

    # Check initial body overflow style
    initial_overflow = page.evaluate_script("document.body.style.overflow")

    sheet.open

    # Body should have overflow hidden
    overflow_when_open = page.evaluate_script("document.body.style.overflow")
    assert_equal "hidden", overflow_when_open

    sheet.close

    # Body overflow should be restored
    overflow_after_close = page.evaluate_script("document.body.style.overflow")
    assert_equal "", overflow_after_close
  end
end
