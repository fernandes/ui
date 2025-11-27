# frozen_string_literal: true

require "test_helper"

class SonnerTest < UI::SystemTestCase
  setup do
    visit_component("sonner")
  end

  # Helper to get the sonner (toaster) element
  def sonner
    find_element(UI::Testing::SonnerElement)
  end

  # === Basic Toast Type Tests ===

  test "shows default toast with title and description" do
    sonner.trigger("#default-toast-btn")

    assert_equal 1, sonner.toast_count
    assert_equal "Event has been created", sonner.toast_title
    assert_equal "Sunday, December 03, 2023 at 9:00 AM", sonner.toast_description
    assert_nil sonner.toast_type
  end

  test "shows success toast with correct type" do
    sonner.trigger("#success-toast-btn")

    assert_equal 1, sonner.toast_count
    assert_equal "Profile updated", sonner.toast_title
    assert_equal "Your changes have been saved successfully.", sonner.toast_description
    assert_equal "success", sonner.toast_type
  end

  test "shows error toast with correct type" do
    sonner.trigger("#error-toast-btn")

    assert_equal 1, sonner.toast_count
    assert_equal "Error occurred", sonner.toast_title
    assert_equal "There was a problem with your request.", sonner.toast_description
    assert_equal "error", sonner.toast_type
  end

  test "shows info toast with correct type" do
    sonner.trigger("#info-toast-btn")

    assert_equal 1, sonner.toast_count
    assert_equal "Did you know?", sonner.toast_title
    assert_equal "You can customize the position of toasts.", sonner.toast_description
    assert_equal "info", sonner.toast_type
  end

  test "shows warning toast with correct type" do
    sonner.trigger("#warning-toast-btn")

    assert_equal 1, sonner.toast_count
    assert_equal "Warning", sonner.toast_title
    assert_equal "Your session will expire in 5 minutes.", sonner.toast_description
    assert_equal "warning", sonner.toast_type
  end

  # === Simple Toast (No Description) Tests ===

  test "shows toast without description" do
    sonner.trigger("#copy-toast-btn")

    assert_equal 1, sonner.toast_count
    assert_equal "Copied to clipboard!", sonner.toast_title
    assert_nil sonner.toast_description
    assert_equal "success", sonner.toast_type
  end

  test "shows error toast without description" do
    sonner.trigger("#save-fail-toast-btn")

    assert_equal 1, sonner.toast_count
    assert_equal "Failed to save", sonner.toast_title
    assert_nil sonner.toast_description
    assert_equal "error", sonner.toast_type
  end

  # === Auto-Dismiss Tests ===

  test "toast auto-dismisses after 1 second" do
    sonner.trigger("#quick-toast-btn")

    assert_equal 1, sonner.toast_count
    assert_equal "Quick toast", sonner.toast_title

    # Wait for auto-dismiss (1 second + buffer)
    sonner.wait_for_all_toasts_to_dismiss(timeout: 2)

    assert_equal 0, sonner.toast_count
  end

  test "toast stays visible for 10 seconds" do
    sonner.trigger("#long-toast-btn")

    assert_equal 1, sonner.toast_count
    assert_equal "Long toast", sonner.toast_title

    # Wait 2 seconds - toast should still be visible
    sleep 2
    assert_equal 1, sonner.toast_count

    # Wait for full duration (10 seconds + buffer)
    sonner.wait_for_all_toasts_to_dismiss(timeout: 12)
    assert_equal 0, sonner.toast_count
  end

  # === Multiple Toasts Stacking Tests ===

  test "shows multiple toasts stacked" do
    page.find("#success-toast-btn").click
    sleep 0.05
    page.find("#error-toast-btn").click
    sleep 0.05
    page.find("#info-toast-btn").click
    sleep 0.2 # Wait for all toasts to render

    # Should have at least 2 toasts visible (3rd might be outside visible limit)
    assert_operator sonner.toast_count, :>=, 2
    assert_operator sonner.toast_count, :<=, 3

    # Most recent toast (info) should be first
    assert_equal "Did you know?", sonner.toast_title_at(0)
    assert_equal "info", sonner.toast_type_at(0)

    # Second most recent toast (error) should be second
    assert_equal "Error occurred", sonner.toast_title_at(1)
    assert_equal "error", sonner.toast_type_at(1)
  end

  test "limits visible toasts to 3 by default" do
    # Trigger 5 toasts with delays
    5.times do |i|
      page.find("#success-toast-btn").click
      sleep 0.1
    end

    # Wait for all toasts to render
    sleep 0.3

    # Should only show 3 visible toasts
    assert_equal 3, sonner.toast_count

    # Note: Sonner actually removes invisible toasts from DOM (not just hidden)
    # So we should have only the visible 3 in the DOM
    assert_operator sonner.all_toasts.count, :>=, 3
  end

  # === Action Button Tests ===

  test "shows toast with action button" do
    sonner.trigger("#action-toast-btn")

    assert_equal 1, sonner.toast_count
    assert_equal "With Action", sonner.toast_title
    assert sonner.has_action_button?

    action_btn = sonner.action_button
    assert_equal "Undo", action_btn.text
  end

  test "clicking action button dismisses toast" do
    sonner.trigger("#action-toast-btn")

    assert_equal 1, sonner.toast_count

    sonner.click_action_button

    # Toast should be dismissed (click_action_button waits internally)
    assert_equal 0, sonner.toast_count
  end

  # === Toast Position Tests ===

  test "toaster has correct default position" do
    assert_equal "bottom-right", sonner.position
  end

  test "toaster has correct y and x position attributes" do
    assert_equal "bottom", sonner.node["data-y-position"]
    assert_equal "right", sonner.node["data-x-position"]
  end

  # === Theme Tests ===

  test "toaster detects and applies theme" do
    theme = sonner.theme
    assert_includes [ "light", "dark" ], theme
  end

  # === JavaScript API Tests ===

  test "triggers toast via JavaScript custom event" do
    sonner.trigger("#trigger-js-toast-btn")

    assert_equal 1, sonner.toast_count
    assert_equal "Event from JS", sonner.toast_title
    assert_equal "Triggered via CustomEvent", sonner.toast_description
    assert_equal "success", sonner.toast_type
  end

  # === Toast Lifecycle Tests ===

  test "toast is mounted after animation" do
    sonner.trigger("#success-toast-btn")

    # Wait a moment for mount animation
    sleep 0.2

    assert sonner.toast_mounted?
  end

  test "toasts auto-dismiss in order" do
    # Trigger 2 toasts with default 4 second duration
    page.find("#success-toast-btn").click
    sleep 0.15
    page.find("#error-toast-btn").click
    sleep 0.3

    # Verify toasts rendered
    assert_operator sonner.toast_count, :>=, 2

    # Wait for all to auto-dismiss (4 seconds + buffer)
    sonner.wait_for_all_toasts_to_dismiss(timeout: 6)

    assert_equal 0, sonner.toast_count
  end

  # === Hover/Expand Tests ===

  test "toasts start collapsed" do
    sonner.trigger("#success-toast-btn")

    # Initially collapsed
    refute sonner.toast_expanded?
  end

  test "hovering toaster expands toasts" do
    sonner.trigger("#success-toast-btn")
    sonner.trigger("#error-toast-btn")

    # Initially collapsed
    refute sonner.toast_expanded?(0)
    refute sonner.toast_expanded?(1)

    # Hover to expand
    sonner.hover

    # Should be expanded
    assert sonner.toast_expanded?(0)
    assert sonner.toast_expanded?(1)
  end

  test "unhovering toaster collapses toasts" do
    sonner.trigger("#success-toast-btn")
    sonner.trigger("#error-toast-btn")

    # Expand
    sonner.hover
    assert sonner.toast_expanded?(0)

    # Collapse
    sonner.unhover
    refute sonner.toast_expanded?(0)
  end

  test "hovering pauses auto-dismiss" do
    sonner.trigger("#quick-toast-btn") # 1 second duration

    # Immediately hover
    sonner.hover

    # Wait 2 seconds (longer than duration)
    sleep 2

    # Toast should still be visible (timer paused)
    assert_equal 1, sonner.toast_count

    # Unhover to resume timer
    sonner.unhover

    # Should now dismiss after remaining time
    sonner.wait_for_all_toasts_to_dismiss(timeout: 3)
    assert_equal 0, sonner.toast_count
  end

  # === Data Attributes Tests ===

  test "toaster has correct data attributes" do
    assert sonner.node["data-controller"].include?("ui--sonner")
    assert_equal "", sonner.node["data-sonner-toaster"]
    assert_equal "ltr", sonner.node["dir"]
  end

  test "toast has correct data attributes" do
    sonner.trigger("#success-toast-btn")

    toast = sonner.toasts.first
    assert_equal "", toast["data-sonner-toast"]
    assert_equal "true", toast["data-styled"]
    assert_equal "true", toast["data-visible"]
    assert_equal "true", toast["data-front"]
    assert_equal "false", toast["data-swipe-out"]
    assert_equal "success", toast["data-type"]
  end

  # === Edge Cases ===

  test "handles rapid toast triggering" do
    # Trigger 10 toasts with small delays
    10.times do
      page.find("#success-toast-btn").click
      sleep 0.05
    end

    # Wait for all toasts to render
    sleep 0.3

    # Should show 3 visible (default limit)
    assert_equal 3, sonner.toast_count

    # Note: Sonner removes invisible toasts from DOM for performance
    # So we'll just verify we have at least 3
    assert_operator sonner.all_toasts.count, :>=, 3
  end

  test "handles empty toast count gracefully" do
    # No toasts triggered
    assert_equal 0, sonner.toast_count
    assert_nil sonner.toast_title
    assert_nil sonner.toast_description
    assert_nil sonner.toast_type
  end

  test "handles toast without action button gracefully" do
    sonner.trigger("#success-toast-btn")

    assert_equal 1, sonner.toast_count
    refute sonner.has_action_button?
    assert_nil sonner.action_button
  end

  # === Content Safety Tests ===

  test "escapes HTML in toast title and description" do
    # Trigger toast via JavaScript with HTML content
    page.evaluate_script(<<~JS)
      document.dispatchEvent(new CustomEvent('ui:toast', {
        detail: {
          message: '<script>alert("xss")</script>',
          description: '<img src=x onerror=alert("xss")>'
        }
      }));
    JS

    sonner.wait_for_toast_to_appear

    # HTML should be escaped (rendered as text)
    assert_includes sonner.toast_title, "<script>"
    assert_includes sonner.toast_description, "<img"
  end

  # === Programmatic Dismiss Tests ===

  test "dismissAll removes all toasts" do
    # Trigger multiple toasts with delays
    page.find("#success-toast-btn").click
    sleep 0.15
    page.find("#error-toast-btn").click
    sleep 0.15
    page.find("#info-toast-btn").click
    sleep 0.15

    assert_equal 3, sonner.toast_count

    # Dismiss all via JavaScript
    page.evaluate_script(%(
      (function() {
        var controller = document.querySelector('[data-controller="ui--sonner"]');
        window.Stimulus.getControllerForElementAndIdentifier(controller, 'ui--sonner').dismissAll();
      })();
    ))

    sleep 0.5 # Wait for dismiss animation

    assert_equal 0, sonner.toast_count
  end

  # === Toast Order Tests ===

  test "most recent toast appears at index 0" do
    page.find("#success-toast-btn").click
    sleep 0.15
    page.find("#error-toast-btn").click
    sleep 0.3

    # Most recent (error) should be at index 0
    assert_equal "Error occurred", sonner.toast_title_at(0)
    assert_equal "error", sonner.toast_type_at(0)

    # Older (success) should be at index 1
    assert_equal "Profile updated", sonner.toast_title_at(1)
    assert_equal "success", sonner.toast_type_at(1)
  end

  # === CSS Variables Tests ===

  test "toaster sets CSS variables" do
    width = page.evaluate_script(<<~JS)
      getComputedStyle(document.querySelector('[data-controller="ui--sonner"]')).getPropertyValue('--width')
    JS

    gap = page.evaluate_script(<<~JS)
      getComputedStyle(document.querySelector('[data-controller="ui--sonner"]')).getPropertyValue('--gap')
    JS

    assert_equal "356px", width.strip
    assert_equal "14px", gap.strip
  end
end
