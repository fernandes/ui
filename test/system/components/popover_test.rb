# frozen_string_literal: true

require "test_helper"

class PopoverTest < UI::SystemTestCase
  setup do
    visit_component("popover")
  end

  # Helper to get the ERB basic popover by ID
  def basic_popover
    find_element(UI::Testing::PopoverElement, "#erb-basic-popover")
  end

  # Helper to get the ERB top placement popover by ID
  def top_popover
    find_element(UI::Testing::PopoverElement, "#erb-top-popover")
  end

  # Helper to get the ERB bottom placement popover by ID
  def bottom_popover
    find_element(UI::Testing::PopoverElement, "#erb-bottom-popover")
  end

  # Helper to get the ERB form popover by ID
  def form_popover
    find_element(UI::Testing::PopoverElement, "#erb-form-popover")
  end

  # === Basic Interaction Tests ===

  test "opens popover when trigger is clicked" do
    popover = basic_popover

    # Initially closed
    assert popover.closed?
    assert popover.content_hidden?

    # Click trigger to open
    popover.open

    # Should be open
    assert popover.open?
    assert popover.content_visible?
  end

  test "closes popover when clicking outside" do
    popover = basic_popover

    popover.open
    assert popover.open?

    popover.close

    assert popover.closed?
    assert popover.content_hidden?
  end

  test "popover displays content" do
    popover = basic_popover

    popover.open

    assert popover.content_text.include?("Information")
    assert popover.content_text.include?("This is a popover using ERB partials")
  end

  test "can toggle popover open and closed" do
    popover = basic_popover

    # Initially closed
    assert popover.closed?

    # Toggle to open
    popover.toggle
    assert popover.open?

    # Toggle to closed
    popover.toggle
    assert popover.closed?
  end

  # === Close Methods Tests ===

  test "closes popover with Escape key" do
    popover = basic_popover

    popover.open
    assert popover.open?

    popover.close_with_escape

    assert popover.closed?
    assert popover.content_hidden?
  end

  test "Escape key closes popover without overlay click" do
    popover = basic_popover

    popover.open
    assert popover.open?

    # Press escape directly on the popover
    popover.press_escape

    assert popover.closed?
  end

  # === Placement Tests ===

  test "popover respects top placement" do
    popover = top_popover

    # Should have placement value set
    assert_equal "top", popover.placement

    popover.open

    # After positioning, should have data-side attribute
    popover.wait_for_positioned
    assert_equal "top", popover.content_side
  end

  test "popover respects bottom placement" do
    popover = bottom_popover

    # Should have placement value set
    assert_equal "bottom", popover.placement

    popover.open

    # After positioning, should have data-side attribute
    popover.wait_for_positioned
    assert_equal "bottom", popover.content_side
  end

  test "content is positioned with floating-ui" do
    popover = basic_popover

    popover.open

    # Give floating-ui a moment to position the content
    sleep 0.2

    # Should have left and top styles set by floating-ui
    # Check using the style attribute directly
    style_attr = popover.content["style"]
    assert style_attr.include?("left"), "Content should have left position set by floating-ui"
    assert style_attr.include?("top"), "Content should have top position set by floating-ui"
  end

  # === Data Attributes Tests ===

  test "content has correct data-state attribute" do
    popover = basic_popover

    # Initially closed
    assert_equal "closed", popover.content["data-state"]

    popover.open

    # Should be open
    assert_equal "open", popover.content["data-state"]

    popover.close

    # Should be closed again
    assert_equal "closed", popover.content["data-state"]
  end

  test "trigger has correct data target" do
    popover = basic_popover

    assert_equal "trigger", popover.trigger["data-ui--popover-target"]
  end

  test "content has correct data target" do
    popover = basic_popover

    assert_equal "content", popover.content["data-ui--popover-target"]
  end

  # === Configuration Tests ===

  test "popover has default trigger mode of click" do
    popover = basic_popover

    # Default trigger should be "click"
    assert_equal "click", popover.trigger_mode
  end

  test "popover has default offset" do
    popover = basic_popover

    # Check that offset value is set
    refute_nil popover.offset
  end

  # === Animation and Visibility Tests ===

  test "content uses invisible class when closed" do
    popover = basic_popover

    # When closed, content should be invisible (not visible to Capybara)
    assert popover.closed?
    assert popover.content_hidden?

    popover.open

    # When open, content should be visible
    assert popover.content_visible?
  end

  test "content has animation classes" do
    popover = basic_popover

    content = popover.content
    classes = content[:class]

    # Should have data-state animation classes
    assert classes.include?("data-[state=open]:animate-in")
    assert classes.include?("data-[state=closed]:animate-out")
    assert classes.include?("data-[state=open]:fade-in-0")
    assert classes.include?("data-[state=closed]:fade-out-0")
    assert classes.include?("data-[state=open]:zoom-in-95")
    assert classes.include?("data-[state=closed]:zoom-out-95")
  end

  test "content has visibility control classes" do
    popover = basic_popover

    content = popover.content
    classes = content[:class]

    # Should control visibility with data-state
    assert classes.include?("data-[state=closed]:invisible")
    assert classes.include?("data-[state=open]:visible")
  end

  test "content has pointer-events control classes" do
    popover = basic_popover

    content = popover.content
    classes = content[:class]

    # Should control pointer events with data-state
    assert classes.include?("data-[state=open]:pointer-events-auto")
    assert classes.include?("data-[state=closed]:pointer-events-none")
  end

  # === State Persistence Tests ===

  test "maintains closed state after opening and closing" do
    popover = basic_popover

    popover.open
    assert popover.open?

    popover.close
    assert popover.closed?

    # Should be able to open again
    popover.open
    assert popover.open?
  end

  test "can open and close multiple times" do
    popover = basic_popover

    3.times do
      popover.open
      assert popover.open?

      popover.close
      assert popover.closed?
    end
  end

  # === Content Tests ===

  test "form popover displays form content" do
    popover = form_popover

    popover.open

    # Should show form content
    assert popover.content_text.include?("Settings")
    assert popover.content_text.include?("Configure your preferences")
    assert popover.content_text.include?("Name")
    assert popover.content_text.include?("Email")
  end

  test "popover content can contain interactive elements" do
    popover = form_popover

    popover.open

    # Should be able to find and interact with form inputs
    within popover.content do
      assert page.has_field?("name", with: "John Doe")
      assert page.has_field?("email", with: "john@example.com")
    end
  end

  # === Styling Tests ===

  test "content has correct base styling classes" do
    popover = basic_popover

    content = popover.content
    classes = content[:class]

    # Base styling from shadcn/ui
    assert classes.include?("bg-popover")
    assert classes.include?("text-popover-foreground")
    assert classes.include?("absolute")
    assert classes.include?("z-50")
    assert classes.include?("rounded-md")
    assert classes.include?("border")
    assert classes.include?("shadow-md")
  end

  test "content has default width" do
    popover = basic_popover

    content = popover.content
    classes = content[:class]

    # Default width is w-72
    assert classes.include?("w-72")
  end

  # === Positioning Edge Cases ===

  test "opens multiple popovers independently" do
    popover1 = basic_popover
    popover2 = top_popover

    # Both should be closed initially
    assert popover1.closed?
    assert popover2.closed?

    # Open first popover
    popover1.open
    assert popover1.open?
    assert popover2.closed?

    # Close first with escape key (more reliable than clicking outside)
    popover1.close_with_escape
    assert popover1.closed?

    # Open second popover
    popover2.open
    assert popover1.closed?
    assert popover2.open?

    # Clean up
    popover2.close_with_escape
  end

  # === Trigger Element Tests ===

  test "trigger element is clickable" do
    popover = basic_popover

    # Trigger should respond to click
    popover.trigger.click
    assert popover.open?
  end

  test "trigger maintains asChild composition" do
    popover = basic_popover

    # Trigger wraps a button (asChild pattern)
    # Should have inline-flex class from trigger behavior
    assert popover.trigger[:class].include?("inline-flex")
  end

  # === Container Tests ===

  test "popover container has correct classes" do
    popover = basic_popover

    # Container should have relative positioning
    assert popover.node[:class].include?("relative")
    assert popover.node[:class].include?("inline-block")
  end

  test "popover container has stimulus controller" do
    popover = basic_popover

    # Should have ui--popover controller
    assert_equal "ui--popover", popover.node["data-controller"]
  end

  # === Event Dispatching Tests (via state changes) ===

  test "popover state changes are reflected immediately" do
    popover = basic_popover

    # State should change immediately on trigger click
    popover.trigger.click
    assert popover.open?, "Popover should be open immediately after trigger click"

    # State should change immediately on escape
    popover.press_escape
    assert popover.closed?, "Popover should be closed immediately after escape"
  end

  # === Accessibility Tests ===

  test "popover content is accessible when open" do
    popover = basic_popover

    popover.open

    # Content should be marked as open via data-state
    assert popover.content_visible?
    assert_equal "open", popover.content["data-state"]
  end

  test "popover content is not accessible when closed" do
    popover = basic_popover

    # Content should be marked as closed via data-state
    assert popover.content_hidden?
    assert_equal "closed", popover.content["data-state"]
  end

  # === Click Outside Behavior ===

  test "clicking outside closes popover" do
    popover = basic_popover

    popover.open
    assert popover.open?

    # Click on page title (outside popover) - more reliable than body click
    page.find("h1").click
    popover.wait_for_closed

    assert popover.closed?
  end

  test "clicking trigger toggles popover" do
    popover = basic_popover

    # Click trigger to open
    popover.trigger.click
    popover.wait_for_open
    assert popover.open?

    # Click trigger again to close
    popover.trigger.click
    popover.wait_for_closed
    assert popover.closed?
  end
end
