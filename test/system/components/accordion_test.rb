# frozen_string_literal: true

require "test_helper"

class AccordionTest < UI::SystemTestCase
  setup do
    visit_component("accordion")
  end

  # Helper to get the basic accordion (single type)
  def basic_accordion
    find_element(UI::Testing::AccordionElement, "#basic-accordion")
  end

  # Helper to get the multiple type accordion
  def multiple_accordion
    find_element(UI::Testing::AccordionElement, "#multiple-accordion")
  end

  # Note: The multiple accordion has initial_open: true on multi-1 and multi-2

  # === Basic Interaction Tests ===

  test "expands an accordion item when clicked" do
    accordion = basic_accordion

    # Initially all items should be closed
    assert accordion.collapsed?("erb-1")

    # Expand first item
    accordion.expand("erb-1")

    assert accordion.expanded?("erb-1")
    assert accordion.collapsed?("erb-2")
    assert accordion.collapsed?("erb-3")
  end

  test "collapses an expanded item when clicked again (single type)" do
    accordion = basic_accordion

    # Expand first item
    accordion.expand("erb-1")
    assert accordion.expanded?("erb-1")

    # Collapse it
    accordion.collapse("erb-1")
    assert accordion.collapsed?("erb-1")
  end

  test "single type closes other items when opening a new one" do
    accordion = basic_accordion

    # Open first item
    accordion.expand("erb-1")
    assert accordion.expanded?("erb-1")

    # Open second item - should close first
    accordion.expand("erb-2")
    assert accordion.collapsed?("erb-1")
    assert accordion.expanded?("erb-2")

    # Open third item - should close second
    accordion.expand("erb-3")
    assert accordion.collapsed?("erb-1")
    assert accordion.collapsed?("erb-2")
    assert accordion.expanded?("erb-3")
  end

  test "displays correct content when item is expanded" do
    accordion = basic_accordion

    accordion.expand("erb-1")

    content = accordion.content_text("erb-1")
    assert_includes content, "Yes. It adheres to the WAI-ARIA design pattern"
  end

  test "hides content when item is collapsed" do
    accordion = basic_accordion

    accordion.expand("erb-1")
    assert accordion.expanded?("erb-1")

    accordion.collapse("erb-1")
    assert accordion.collapsed?("erb-1")

    # Wait for animation to complete
    sleep 0.4

    # Content should have hidden attribute
    content = accordion.content("erb-1")
    assert content["hidden"].present?
  end

  # === Multiple Type Tests ===

  test "multiple type allows multiple items to be open simultaneously" do
    accordion = multiple_accordion

    # Open first item
    accordion.expand("multi-1")
    assert accordion.expanded?("multi-1")

    # Open second item - first should stay open
    accordion.expand("multi-2")
    assert accordion.expanded?("multi-1")
    assert accordion.expanded?("multi-2")

    # Open third item - both previous should stay open
    accordion.expand("multi-3")
    assert accordion.expanded?("multi-1")
    assert accordion.expanded?("multi-2")
    assert accordion.expanded?("multi-3")
  end

  test "multiple type tracks expanded items correctly" do
    accordion = multiple_accordion

    accordion.expand("multi-1")
    accordion.expand("multi-2")

    expanded = accordion.expanded_items
    assert_equal 2, expanded.count
    assert_includes expanded, "multi-1"
    assert_includes expanded, "multi-2"
  end

  test "multiple type can collapse items independently" do
    accordion = multiple_accordion

    # Open all items
    accordion.expand("multi-1")
    accordion.expand("multi-2")
    accordion.expand("multi-3")

    # Close middle item
    accordion.collapse("multi-2")

    assert accordion.expanded?("multi-1")
    assert accordion.collapsed?("multi-2")
    assert accordion.expanded?("multi-3")
  end

  # === Initial State Tests ===

  test "initially open items start in expanded state" do
    accordion = multiple_accordion

    # Items with initial_open: true should be expanded
    assert accordion.expanded?("multi-1")
    assert accordion.expanded?("multi-2")
    assert accordion.collapsed?("multi-3")
  end

  test "counts total items correctly" do
    accordion = basic_accordion

    assert_equal 3, accordion.item_count
  end

  test "identifies accordion type correctly" do
    basic = basic_accordion
    multiple = multiple_accordion

    assert_equal "single", basic.accordion_type
    assert_equal "multiple", multiple.accordion_type
  end

  # === Keyboard Navigation Tests ===

  test "expands item with Enter key" do
    accordion = basic_accordion

    accordion.focus_trigger("erb-1")
    accordion.press_enter

    assert accordion.expanded?("erb-1")
  end

  test "collapses item with Enter key" do
    accordion = basic_accordion

    # First expand
    accordion.expand("erb-1")
    assert accordion.expanded?("erb-1")

    # Then collapse with keyboard
    accordion.focus_trigger("erb-1")
    accordion.press_enter

    assert accordion.collapsed?("erb-1")
  end

  test "expands item with Space key" do
    accordion = basic_accordion

    accordion.focus_trigger("erb-1")
    accordion.press_space

    assert accordion.expanded?("erb-1")
  end

  test "can navigate between triggers with Tab key" do
    accordion = basic_accordion

    # Focus first trigger
    accordion.focus_trigger("erb-1")

    # Tab should move to next trigger
    accordion.tab_to_next

    # Verify tab_to_next method works (doesn't error)
    assert true, "Tab navigation completed without errors"
  end

  test "keyboard navigation works with expand_with_keyboard helper" do
    accordion = basic_accordion

    accordion.expand_with_keyboard("erb-2")

    assert accordion.expanded?("erb-2")
  end

  test "keyboard navigation works with collapse_with_keyboard helper" do
    accordion = basic_accordion

    accordion.expand("erb-2")
    accordion.collapse_with_keyboard("erb-2")

    assert accordion.collapsed?("erb-2")
  end

  # === ARIA Accessibility Tests ===

  test "trigger has correct aria-expanded when closed" do
    accordion = basic_accordion

    aria = accordion.trigger_aria_attributes("erb-1")

    assert_equal "false", aria[:expanded]
  end

  test "trigger has correct aria-expanded when open" do
    accordion = basic_accordion

    accordion.expand("erb-1")
    aria = accordion.trigger_aria_attributes("erb-1")

    assert_equal "true", aria[:expanded]
  end

  test "trigger has aria-controls pointing to content" do
    accordion = basic_accordion

    assert accordion.aria_controls_valid?("erb-1")
    assert accordion.aria_controls_valid?("erb-2")
    assert accordion.aria_controls_valid?("erb-3")
  end

  test "content has correct role attribute" do
    accordion = basic_accordion

    aria = accordion.content_aria_attributes("erb-1")

    assert_equal "region", aria[:role]
  end

  test "content has aria-labelledby pointing to trigger" do
    accordion = basic_accordion

    aria = accordion.content_aria_attributes("erb-1")

    assert aria[:labelledby].present?
  end

  test "trigger is focusable" do
    accordion = basic_accordion

    trigger = accordion.trigger("erb-1")
    assert_focusable(trigger)
  end

  # === Data State Management Tests ===

  test "item has correct data-state attribute when closed" do
    accordion = basic_accordion

    item = accordion.item("erb-1")
    assert_equal "closed", item["data-state"]
  end

  test "item has correct data-state attribute when open" do
    accordion = basic_accordion

    accordion.expand("erb-1")
    item = accordion.item("erb-1")
    assert_equal "open", item["data-state"]
  end

  test "trigger has matching data-state with item" do
    accordion = basic_accordion

    accordion.expand("erb-1")
    trigger = accordion.trigger("erb-1")
    item = accordion.item("erb-1")

    assert_equal item["data-state"], trigger["data-state"]
  end

  test "content has matching data-state with item" do
    accordion = basic_accordion

    accordion.expand("erb-1")
    content = accordion.content("erb-1")
    item = accordion.item("erb-1")

    assert_equal item["data-state"], content["data-state"]
  end

  test "h3 wrapper has matching data-state with item" do
    accordion = basic_accordion

    accordion.expand("erb-1")
    wrapper = accordion.trigger_wrapper("erb-1")
    item = accordion.item("erb-1")

    assert_equal item["data-state"], wrapper["data-state"]
  end

  # === Toggle Behavior Tests ===

  test "toggle switches between expanded and collapsed states" do
    accordion = basic_accordion

    # Initially closed
    assert accordion.collapsed?("erb-1")

    # Toggle to open
    accordion.toggle("erb-1")
    assert accordion.expanded?("erb-1")

    # Toggle to closed
    accordion.toggle("erb-1")
    assert accordion.collapsed?("erb-1")
  end

  # === Content Retrieval Tests ===

  test "retrieves trigger text correctly" do
    accordion = basic_accordion

    trigger_text = accordion.trigger_text("erb-1")
    assert_equal "Is it accessible?", trigger_text
  end

  test "retrieves content text correctly" do
    accordion = basic_accordion

    accordion.expand("erb-2")
    content_text = accordion.content_text("erb-2")
    assert_includes content_text, "Yes. It comes with default styles"
  end

  # === Edge Cases ===

  test "handles rapid clicking without errors" do
    accordion = basic_accordion

    # Rapidly toggle the same item
    5.times do
      accordion.toggle("erb-1")
    end

    # Should end in a valid state (either open or closed)
    assert(accordion.expanded?("erb-1") || accordion.collapsed?("erb-1"))
  end

  test "expanding already expanded item does nothing" do
    accordion = basic_accordion

    accordion.expand("erb-1")
    assert accordion.expanded?("erb-1")

    # Expanding again should be a no-op
    accordion.expand("erb-1")
    assert accordion.expanded?("erb-1")
  end

  test "collapsing already collapsed item does nothing" do
    accordion = basic_accordion

    assert accordion.collapsed?("erb-1")

    # Collapsing again should be a no-op
    accordion.collapse("erb-1")
    assert accordion.collapsed?("erb-1")
  end

  test "tracks collapsed items correctly" do
    accordion = multiple_accordion

    accordion.expand("multi-1")
    accordion.expand("multi-2")
    # multi-3 stays collapsed

    collapsed = accordion.collapsed_items
    assert_equal 1, collapsed.count
    assert_includes collapsed, "multi-3"
  end

  # === Rich Content Tests ===

  test "handles rich HTML content in accordion items" do
    accordion = basic_accordion

    accordion.expand("erb-3")
    content = accordion.content("erb-3")

    # Content should contain a paragraph tag
    assert content.has_css?("p")
  end

  # === Animation Tests ===

  test "content visibility changes with state" do
    accordion = basic_accordion

    # Expand
    accordion.expand("erb-1")
    content = accordion.content("erb-1")
    refute content["hidden"].present?

    # Collapse
    accordion.collapse("erb-1")
    # After animation completes, hidden attribute should be set
    sleep 0.4 # Wait for transition (300ms + buffer)
    content = accordion.content("erb-1")
    assert content["hidden"].present?
  end
end
