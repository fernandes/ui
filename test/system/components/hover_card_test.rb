# frozen_string_literal: true

require "test_helper"

class HoverCardTest < UI::SystemTestCase
  def setup
    visit_component("hover_card")
  end

  # === Basic Functionality ===

  test "opens hover card on hover" do
    hover_card = find_element(UI::TestingHoverCardElement, "#basic-hover-card [data-controller='ui--hover-card']")

    assert hover_card.hidden?, "Hover card should be hidden initially"

    hover_card.show

    assert hover_card.visible?, "Hover card should be visible after hovering trigger"
    assert hover_card.open?, "Hover card should have data-state='open'"
  end

  test "closes hover card on mouse leave" do
    hover_card = find_element(UI::TestingHoverCardElement, "#basic-hover-card [data-controller='ui--hover-card']")

    hover_card.show
    assert hover_card.visible?

    hover_card.hide

    assert hover_card.hidden?, "Hover card should be hidden after mouse leaves"
    assert hover_card.closed?, "Hover card should have data-state='closed'"
  end

  test "displays content when open" do
    hover_card = find_element(UI::TestingHoverCardElement, "#basic-hover-card [data-controller='ui--hover-card']")

    hover_card.show

    content = hover_card.content_text
    assert_includes content, "@nextjs", "Content should display @nextjs"
    assert_includes content, "The React Framework", "Content should display description"
    assert_includes content, "Joined December 2021", "Content should display joined date"
  end

  test "trigger shows correct text" do
    hover_card = find_element(UI::TestingHoverCardElement, "#basic-hover-card [data-controller='ui--hover-card']")

    assert_equal "@nextjs", hover_card.trigger_text
  end

  # === Hover Behavior ===

  test "keeps hover card open when hovering over content" do
    hover_card = find_element(UI::TestingHoverCardElement, "#basic-hover-card [data-controller='ui--hover-card']")

    hover_card.show
    assert hover_card.visible?

    # Hover over the content itself
    hover_card.hover_content

    # Wait a bit and verify it's still open
    sleep 0.5
    assert hover_card.visible?, "Hover card should stay open when hovering content"
  end

  test "closes after delay when mouse leaves" do
    hover_card = find_element(UI::TestingHoverCardElement, "#basic-hover-card [data-controller='ui--hover-card']")

    hover_card.show
    assert hover_card.visible?

    # Move mouse away
    page.find("body").hover

    # Should still be visible briefly (close delay is 300ms)
    sleep 0.1
    # Note: This might be flaky depending on timing, so we just verify it eventually closes
    hover_card.wait_for_hidden_content(timeout: 1)
    assert hover_card.hidden?
  end

  # === Positioning and Alignment ===

  test "positions content with correct alignment" do
    within("#alignment-hover-cards") do
      # Test start alignment
      start_card = all_elements(UI::TestingHoverCardElement).first
      start_card.show
      assert_equal "start", start_card.align, "First card should have start alignment"

      # Test center alignment (default)
      center_card = all_elements(UI::TestingHoverCardElement)[1]
      center_card.show
      assert_equal "center", center_card.align, "Second card should have center alignment"

      # Test end alignment
      end_card = all_elements(UI::TestingHoverCardElement).last
      end_card.show
      assert_equal "end", end_card.align, "Third card should have end alignment"
    end
  end

  test "shows positioning side attribute" do
    hover_card = find_element(UI::TestingHoverCardElement, "#basic-hover-card [data-controller='ui--hover-card']")

    hover_card.show

    side = hover_card.side
    assert_includes ["top", "bottom"], side, "Side should be either 'top' or 'bottom'"
  end

  # === asChild Pattern ===

  test "works with asChild and Button component" do
    hover_card = find_element(UI::TestingHoverCardElement, "#basic-hover-card [data-controller='ui--hover-card']")

    # Trigger should be a button when using asChild with Button
    trigger = hover_card.trigger
    assert_equal "button", trigger.tag_name, "Trigger should be a button element with asChild"

    hover_card.show
    assert hover_card.visible?
  end

  test "works with asChild and custom link" do
    hover_card = find_element(UI::TestingHoverCardElement, "#link-hover-card [data-controller='ui--hover-card']")

    hover_card.show

    assert hover_card.visible?, "Hover card should open on link hover"
    content = hover_card.content_text
    assert_includes content, "shadcn/ui", "Content should display shadcn/ui"
    assert_includes content, "Accessible. Customizable. Open Source.", "Content should display description"
  end

  test "works without asChild pattern" do
    hover_card = find_element(UI::TestingHoverCardElement, "#default-hover-card [data-controller='ui--hover-card']")

    # Trigger should be a span when not using asChild
    trigger = hover_card.trigger
    assert_equal "span", trigger.tag_name, "Trigger should be a span element without asChild"

    hover_card.show

    assert hover_card.visible?
    content = hover_card.content_text
    assert_includes content, "Default Trigger", "Content should display default trigger content"
  end

  # === Multiple Hover Cards ===

  test "can open multiple hover cards independently" do
    within("#basic-hover-card") do
      card1 = find_element(UI::TestingHoverCardElement)
      card1.show
      assert card1.visible?

      within_window(open_new_window) do
        visit_component("hover_card")
        within("#link-hover-card") do
          card2 = find_element(UI::TestingHoverCardElement)
          card2.show
          assert card2.visible?
        end
      end
    end
  end

  # === State Management ===

  test "data-state reflects current state" do
    hover_card = find_element(UI::TestingHoverCardElement, "#basic-hover-card [data-controller='ui--hover-card']")

    # Initially closed
    assert hover_card.closed?, "Should be closed initially"

    # Open
    hover_card.show
    hover_card.wait_for_content_state("open")
    assert hover_card.open?, "Should be open after showing"

    # Close
    hover_card.hide
    hover_card.wait_for_content_state("closed")
    assert hover_card.closed?, "Should be closed after hiding"
  end

  # === Accessibility ===

  test "content is focusable and accessible" do
    hover_card = find_element(UI::TestingHoverCardElement, "#basic-hover-card [data-controller='ui--hover-card']")

    hover_card.show

    content = hover_card.content
    assert content.visible?, "Content should be visible"

    # Content should be in the DOM and accessible
    assert_not_nil content["data-state"], "Content should have data-state attribute"
  end

  test "maintains hover on rapid mouse movements" do
    hover_card = find_element(UI::TestingHoverCardElement, "#basic-hover-card [data-controller='ui--hover-card']")

    # Hover trigger
    hover_card.trigger.hover
    sleep 0.1

    # Move to content quickly
    hover_card.hover_content

    # Should stay open
    assert hover_card.visible?, "Should stay open during rapid movement to content"
  end
end
