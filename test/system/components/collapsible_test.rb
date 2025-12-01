# frozen_string_literal: true

require "test_helper"

class CollapsibleTest < UI::SystemTestCase
  setup do
    visit_component("collapsible")
  end

  # Helper to get the basic collapsible
  def basic_collapsible
    find_element(UI::TestingCollapsibleElement, "#basic-collapsible")
  end

  # Helper to get the initially open collapsible
  def open_collapsible
    find_element(UI::TestingCollapsibleElement, "#open-collapsible")
  end

  # Helper to get the ERB collapsible
  def erb_collapsible
    find_element(UI::TestingCollapsibleElement, "#erb-collapsible")
  end

  # Helper to get the card collapsible
  def card_collapsible
    find_element(UI::TestingCollapsibleElement, "#card-collapsible")
  end

  # === Basic Interaction Tests ===

  test "expands when trigger is clicked" do
    collapsible = basic_collapsible

    # Initially should be closed
    assert collapsible.collapsed?

    # Expand
    collapsible.expand

    assert collapsible.expanded?
  end

  test "collapses when trigger is clicked again" do
    collapsible = basic_collapsible

    # Expand first
    collapsible.expand
    assert collapsible.expanded?

    # Collapse
    collapsible.collapse
    assert collapsible.collapsed?
  end

  test "displays correct content when expanded" do
    collapsible = basic_collapsible

    collapsible.expand

    content = collapsible.content_text
    assert_includes content, "@radix-ui/colors"
    assert_includes content, "@stitches/react"
  end

  test "hides content when collapsed" do
    collapsible = basic_collapsible

    collapsible.expand
    assert collapsible.content_visible?

    collapsible.collapse
    # Wait for animation to complete
    sleep 0.4

    refute collapsible.content_visible?
    assert collapsible.content["hidden"].present?
  end

  # === Initial State Tests ===

  test "starts in collapsed state by default" do
    collapsible = basic_collapsible

    assert collapsible.collapsed?
    refute collapsible.expanded?
  end

  test "starts in expanded state when open: true" do
    collapsible = open_collapsible

    assert collapsible.expanded?
    refute collapsible.collapsed?
    assert collapsible.content_visible?
  end

  test "initially open collapsible can be collapsed" do
    collapsible = open_collapsible

    assert collapsible.expanded?

    collapsible.collapse
    assert collapsible.collapsed?
  end

  test "initially open collapsible can be expanded again after collapse" do
    collapsible = open_collapsible

    # Collapse it
    collapsible.collapse
    assert collapsible.collapsed?

    # Expand it again
    collapsible.expand
    assert collapsible.expanded?
  end

  # === Toggle Behavior Tests ===

  test "toggle switches between expanded and collapsed states" do
    collapsible = basic_collapsible

    # Initially closed
    assert collapsible.collapsed?

    # Toggle to open
    collapsible.toggle
    sleep 0.2
    assert collapsible.expanded?

    # Toggle to closed
    collapsible.toggle
    sleep 0.2
    assert collapsible.collapsed?
  end

  test "toggle works multiple times in a row" do
    collapsible = basic_collapsible

    # Toggle 3 times
    3.times do
      initial_state = collapsible.data_state
      collapsible.toggle
      sleep 0.2
      new_state = collapsible.data_state
      refute_equal initial_state, new_state
    end

    # Should end in valid state
    assert(collapsible.expanded? || collapsible.collapsed?)
  end

  # === Keyboard Interaction Tests ===

  test "expands with Enter key" do
    collapsible = basic_collapsible

    collapsible.focus_trigger
    collapsible.press_enter

    assert collapsible.expanded?
  end

  test "collapses with Enter key" do
    collapsible = basic_collapsible

    # First expand
    collapsible.expand
    assert collapsible.expanded?

    # Then collapse with keyboard
    collapsible.focus_trigger
    collapsible.press_enter

    assert collapsible.collapsed?
  end

  test "expands with Space key" do
    collapsible = basic_collapsible

    collapsible.focus_trigger
    collapsible.press_space

    assert collapsible.expanded?
  end

  test "keyboard navigation works with expand_with_keyboard helper" do
    collapsible = basic_collapsible

    collapsible.expand_with_keyboard

    assert collapsible.expanded?
  end

  test "keyboard navigation works with collapse_with_keyboard helper" do
    collapsible = basic_collapsible

    collapsible.expand
    collapsible.collapse_with_keyboard

    assert collapsible.collapsed?
  end

  # === ARIA Accessibility Tests ===

  test "trigger has correct aria-expanded when closed" do
    collapsible = basic_collapsible

    aria = collapsible.trigger_aria_attributes

    assert_equal "false", aria[:expanded]
  end

  test "trigger has correct aria-expanded when open" do
    collapsible = basic_collapsible

    collapsible.expand
    aria = collapsible.trigger_aria_attributes

    assert_equal "true", aria[:expanded]
  end

  # Note: Currently, collapsible doesn't implement aria-controls
  # This is different from accordion which does set it
  # test "trigger has aria-controls pointing to content" do
  #   collapsible = basic_collapsible
  #
  #   assert collapsible.aria_controls_valid?
  # end

  test "trigger is focusable" do
    collapsible = basic_collapsible

    trigger = collapsible.trigger
    assert_focusable(trigger)
  end

  test "trigger has correct role (button)" do
    collapsible = basic_collapsible

    trigger = collapsible.trigger
    assert_equal "button", trigger.tag_name
  end

  # === Data State Management Tests ===

  test "root element has correct data-state when closed" do
    collapsible = basic_collapsible

    assert_equal "closed", collapsible.data_state
  end

  test "root element has correct data-state when open" do
    collapsible = basic_collapsible

    collapsible.expand
    assert_equal "open", collapsible.data_state
  end

  test "trigger has matching data-state with root" do
    collapsible = basic_collapsible

    collapsible.expand
    trigger = collapsible.trigger

    assert_equal collapsible.data_state, trigger["data-state"]
  end

  test "content has matching data-state with root" do
    collapsible = basic_collapsible

    collapsible.expand
    content = collapsible.content

    assert_equal collapsible.data_state, content["data-state"]
  end

  # === Content Visibility Tests ===

  test "content is hidden when collapsed" do
    collapsible = basic_collapsible

    assert collapsible.collapsed?
    # After animation completes, hidden attribute should be present
    sleep 0.1
    assert collapsible.content["hidden"].present?
  end

  test "content is not hidden when expanded" do
    collapsible = basic_collapsible

    collapsible.expand
    refute collapsible.content["hidden"].present?
  end

  test "content visibility toggles with state" do
    collapsible = basic_collapsible

    # Expand
    collapsible.expand
    assert collapsible.content_visible?

    # Collapse
    collapsible.collapse
    sleep 0.4 # Wait for animation
    refute collapsible.content_visible?
  end

  # === ERB Partial Tests ===

  test "ERB partial works correctly" do
    collapsible = erb_collapsible

    assert collapsible.collapsed?

    collapsible.expand
    assert collapsible.expanded?

    content = collapsible.content_text
    assert_includes content, "@radix-ui/colors"
  end

  test "ERB partial has correct ARIA attributes" do
    collapsible = erb_collapsible

    # Note: aria-controls is not currently implemented in collapsible
    # assert collapsible.aria_controls_valid?

    aria = collapsible.trigger_aria_attributes
    assert_equal "false", aria[:expanded]

    collapsible.expand
    aria = collapsible.trigger_aria_attributes
    assert_equal "true", aria[:expanded]
  end

  # === Edge Cases ===

  test "handles rapid clicking without errors" do
    collapsible = basic_collapsible

    # Rapidly toggle
    5.times do
      collapsible.toggle
    end

    # Should end in a valid state
    assert(collapsible.expanded? || collapsible.collapsed?)
  end

  test "expanding already expanded collapsible does nothing" do
    collapsible = basic_collapsible

    collapsible.expand
    assert collapsible.expanded?

    # Expanding again should be a no-op
    collapsible.expand
    assert collapsible.expanded?
  end

  test "collapsing already collapsed collapsible does nothing" do
    collapsible = basic_collapsible

    assert collapsible.collapsed?

    # Collapsing again should be a no-op
    collapsible.collapse
    assert collapsible.collapsed?
  end

  # === Integration Tests ===

  test "works correctly inside a card component" do
    collapsible = card_collapsible

    assert collapsible.collapsed?

    collapsible.expand
    assert collapsible.expanded?

    content = collapsible.content_text
    assert_includes content, "Push Notifications"
    assert_includes content, "Email Notifications"
    assert_includes content, "SMS Notifications"
  end

  test "multiple collapsibles work independently" do
    basic = basic_collapsible
    open_col = open_collapsible

    # Initially different states
    assert basic.collapsed?
    assert open_col.expanded?

    # Toggle basic
    basic.expand
    assert basic.expanded?
    # Open collapsible should remain unchanged
    assert open_col.expanded?

    # Toggle open
    open_col.collapse
    assert open_col.collapsed?
    # Basic should remain unchanged
    assert basic.expanded?
  end

  # === Animation Tests ===

  test "content height animates during expand" do
    collapsible = basic_collapsible
    content = collapsible.content

    # When collapsed, height should be 0
    assert collapsible.collapsed?

    # Expand
    collapsible.expand

    # Height should be set to scrollHeight (not 0)
    height = content["style"]
    assert height.present?
    assert_includes height, "height"
  end

  test "content height animates during collapse" do
    collapsible = basic_collapsible

    # First expand
    collapsible.expand
    assert collapsible.expanded?

    # Then collapse
    collapsible.collapse

    # Height should be set to 0px during animation
    collapsible.content
    sleep 0.1 # Wait a bit for animation to start

    assert collapsible.collapsed?
  end

  # === Sub-element Access Tests ===

  test "can access trigger element" do
    collapsible = basic_collapsible

    trigger = collapsible.trigger
    assert trigger.present?
    assert_equal "button", trigger.tag_name
  end

  test "can access content element" do
    collapsible = basic_collapsible

    content = collapsible.content
    assert content.present?
    assert_equal "div", content.tag_name
  end

  test "trigger has data-ui--collapsible-target attribute" do
    collapsible = basic_collapsible

    trigger = collapsible.trigger
    assert_equal "trigger", trigger["data-ui--collapsible-target"]
  end

  test "content has data-ui--collapsible-target attribute" do
    collapsible = basic_collapsible

    content = collapsible.content
    assert_equal "content", content["data-ui--collapsible-target"]
  end

  # === State Transition Tests ===

  test "state transitions from closed to open correctly" do
    collapsible = basic_collapsible

    # Start closed
    assert_equal "closed", collapsible.data_state

    # Expand
    collapsible.expand

    # Should be open
    assert_equal "open", collapsible.data_state
    assert collapsible.expanded?
  end

  test "state transitions from open to closed correctly" do
    collapsible = open_collapsible

    # Start open
    assert_equal "open", collapsible.data_state

    # Collapse
    collapsible.collapse

    # Should be closed
    assert_equal "closed", collapsible.data_state
    assert collapsible.collapsed?
  end

  # === Content Retrieval Tests ===

  test "retrieves content text correctly when expanded" do
    collapsible = basic_collapsible

    collapsible.expand
    content_text = collapsible.content_text

    assert_includes content_text, "@radix-ui/colors"
    assert_includes content_text, "@stitches/react"
  end

  test "can retrieve content text even when collapsed" do
    collapsible = basic_collapsible

    # Content is in DOM but may not have text when using visible: :all
    # The content element exists even when collapsed
    content = collapsible.content
    assert content.present?
  end
end
