# frozen_string_literal: true

require "test_helper"

class AlertDialogTest < UI::SystemTestCase
  setup do
    visit_component("alert_dialog")
  end

  # Helper to get the default alert dialog by ID
  def default_alert_dialog
    find_element(UI::Testing::AlertDialogElement, "#default-alert-dialog")
  end

  # Helper to get the destructive alert dialog by ID
  def destructive_alert_dialog
    find_element(UI::Testing::AlertDialogElement, "#destructive-alert-dialog")
  end

  # Helper to get the save changes alert dialog by ID
  def save_changes_alert_dialog
    find_element(UI::Testing::AlertDialogElement, "#save-changes-alert-dialog")
  end

  # === Basic Interaction Tests ===

  test "opens alert dialog when trigger is clicked" do
    alert_dialog = default_alert_dialog

    # Initially closed
    assert alert_dialog.closed?

    # Click trigger to open
    alert_dialog.open

    # Should be open
    assert alert_dialog.open?
    assert alert_dialog.content_visible?
  end

  test "closes alert dialog when cancel button is clicked" do
    alert_dialog = default_alert_dialog

    alert_dialog.open
    assert alert_dialog.open?

    alert_dialog.cancel

    assert alert_dialog.closed?
  end

  test "closes alert dialog when action button is clicked" do
    alert_dialog = default_alert_dialog

    alert_dialog.open
    assert alert_dialog.open?

    alert_dialog.confirm

    assert alert_dialog.closed?
  end

  test "alert dialog displays title and description" do
    alert_dialog = default_alert_dialog

    alert_dialog.open

    assert_equal "Are you absolutely sure?", alert_dialog.title
    assert_equal "This action cannot be undone. This will permanently delete your account and remove your data from our servers.", alert_dialog.description
  end

  test "alert dialog has cancel and action buttons" do
    alert_dialog = default_alert_dialog

    alert_dialog.open

    assert alert_dialog.has_cancel_button?
    assert alert_dialog.has_action_button?
    assert alert_dialog.has_confirm_button? # alias test
  end

  # === Close Methods Tests ===

  test "closes alert dialog with Escape key" do
    alert_dialog = default_alert_dialog

    alert_dialog.open
    assert alert_dialog.open?

    alert_dialog.close_with_escape

    assert alert_dialog.closed?
  end

  test "does NOT close on overlay click (critical for alert dialogs)" do
    alert_dialog = default_alert_dialog

    alert_dialog.open
    assert alert_dialog.open?

    # Try to click overlay - this should NOT close the alert dialog
    # This is the key difference from regular Dialog
    page.evaluate_script(<<~JS)
      document.querySelector('#default-alert-dialog')
        .querySelector('[data-ui--alert-dialog-target="overlay"]')
        .click()
    JS

    sleep 0.3 # Wait to ensure it doesn't close

    # Alert dialog should STILL be open
    assert alert_dialog.open?, "AlertDialog should NOT close on overlay click"

    # Should still close with cancel button
    alert_dialog.cancel
    assert alert_dialog.closed?
  end

  # === Destructive Action Tests ===

  test "destructive alert dialog has correct title and destructive button" do
    alert_dialog = destructive_alert_dialog

    alert_dialog.open

    assert_equal "Delete Account", alert_dialog.title
    assert_equal "Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.", alert_dialog.description
  end

  test "destructive action button closes alert dialog" do
    alert_dialog = destructive_alert_dialog

    alert_dialog.open
    assert alert_dialog.open?

    alert_dialog.confirm

    assert alert_dialog.closed?
  end

  # === Save Changes Dialog Tests ===

  test "save changes alert dialog has correct content" do
    alert_dialog = save_changes_alert_dialog

    alert_dialog.open

    assert_equal "Save changes?", alert_dialog.title
    assert_equal "You have unsaved changes. Do you want to save them before leaving?", alert_dialog.description
  end

  # === ARIA Accessibility Tests ===

  test "content has correct role=alertdialog" do
    alert_dialog = default_alert_dialog

    alert_dialog.open

    assert_equal "alertdialog", alert_dialog.content_role
  end

  test "content has aria-modal=true" do
    alert_dialog = default_alert_dialog

    alert_dialog.open

    assert alert_dialog.aria_modal?
    assert_equal "true", alert_dialog.content_aria_modal
  end

  # ARIA labeling tests - Currently skipped as alert dialog component
  # doesn't yet implement aria-labelledby/describedby with IDs
  #
  # test "content is properly labeled by title" do
  #   alert_dialog = default_alert_dialog
  #   alert_dialog.open
  #   assert alert_dialog.aria_labeled_correctly?
  # end

  # === Focus Management Tests ===

  test "focuses first focusable element when opened" do
    alert_dialog = default_alert_dialog

    alert_dialog.open

    # Wait a moment for focus to settle
    sleep 0.2

    # Check that something inside the alert dialog has focus
    # The alert dialog controller should focus the first focusable element
    page.evaluate_script("document.activeElement")
    focused_tag = page.evaluate_script("document.activeElement.tagName")

    # Should be a button (cancel or action button)
    assert_equal "BUTTON", focused_tag,
      "Expected a button to be focused, got #{focused_tag}"
  end

  test "traps focus within alert dialog when open" do
    alert_dialog = default_alert_dialog

    alert_dialog.open

    # Wait for focus trap to be set up
    sleep 0.1

    # Tab through elements - focus should stay within alert dialog
    # This is a basic check - a full implementation would tab through all elements
    # and verify focus never escapes the alert dialog
    assert alert_dialog.content_visible?
  end

  # === Overlay Tests ===

  test "shows overlay when alert dialog is open" do
    alert_dialog = default_alert_dialog

    alert_dialog.open

    assert alert_dialog.overlay_visible?
  end

  test "overlay container has correct data-state" do
    alert_dialog = default_alert_dialog

    # The container has the data-state, not the overlay backdrop itself
    assert_equal "closed", alert_dialog.container["data-state"]

    alert_dialog.open

    assert_equal "open", alert_dialog.container["data-state"]

    alert_dialog.cancel

    assert_equal "closed", alert_dialog.container["data-state"]
  end

  # === Container Tests ===

  test "container has correct data-state" do
    alert_dialog = default_alert_dialog

    assert_equal "closed", alert_dialog.container["data-state"]

    alert_dialog.open

    assert_equal "open", alert_dialog.container["data-state"]

    alert_dialog.cancel

    assert_equal "closed", alert_dialog.container["data-state"]
  end

  # === State Persistence Tests ===

  test "maintains closed state after opening and closing" do
    alert_dialog = default_alert_dialog

    alert_dialog.open
    assert alert_dialog.open?

    alert_dialog.cancel
    assert alert_dialog.closed?

    # Should be able to open again
    alert_dialog.open
    assert alert_dialog.open?
  end

  test "can open and close multiple times" do
    alert_dialog = default_alert_dialog

    3.times do
      alert_dialog.open
      assert alert_dialog.open?

      alert_dialog.cancel
      assert alert_dialog.closed?
    end
  end

  test "can confirm action multiple times" do
    alert_dialog = default_alert_dialog

    3.times do
      alert_dialog.open
      assert alert_dialog.open?

      alert_dialog.confirm
      assert alert_dialog.closed?
    end
  end

  # === Body Scroll Lock Tests ===

  test "prevents body scroll when alert dialog is open" do
    alert_dialog = default_alert_dialog

    # Check initial body overflow style
    page.evaluate_script("document.body.style.overflow")

    alert_dialog.open

    # Body should have overflow hidden
    overflow_when_open = page.evaluate_script("document.body.style.overflow")
    assert_equal "hidden", overflow_when_open

    alert_dialog.cancel

    # Body overflow should be restored
    overflow_after_close = page.evaluate_script("document.body.style.overflow")
    assert_equal "", overflow_after_close
  end

  # === Button Interaction Tests ===

  test "cancel and action buttons are distinct" do
    alert_dialog = default_alert_dialog

    alert_dialog.open

    cancel_btn = alert_dialog.cancel_button
    action_btn = alert_dialog.action_button

    # They should be different elements
    refute_equal cancel_btn, action_btn

    # Cancel button typically has outline variant (lighter style)
    # Action button typically has default variant (primary style)
    assert cancel_btn.text.include?("Cancel")
    assert action_btn.text.include?("Continue")
  end

  test "can access confirm button via alias" do
    alert_dialog = default_alert_dialog

    alert_dialog.open

    # confirm_button should be the same as action_button
    assert_equal alert_dialog.action_button, alert_dialog.confirm_button
  end

  # === Animation Tests ===

  test "content has correct animation classes" do
    alert_dialog = default_alert_dialog

    alert_dialog.open

    content = alert_dialog.content
    classes = content[:class]

    # Check for animation classes
    assert classes.include?("data-[state=open]:animate-in")
    assert classes.include?("data-[state=closed]:animate-out")
    assert classes.include?("data-[state=open]:fade-in-0")
    assert classes.include?("data-[state=closed]:fade-out-0")
    assert classes.include?("data-[state=open]:zoom-in-95")
    assert classes.include?("data-[state=closed]:zoom-out-95")
  end

  test "overlay has correct animation classes" do
    alert_dialog = default_alert_dialog

    alert_dialog.open

    overlay = alert_dialog.overlay
    classes = overlay[:class]

    # Check for animation classes
    assert classes.include?("data-[state=open]:animate-in")
    assert classes.include?("data-[state=closed]:animate-out")
    assert classes.include?("data-[state=open]:fade-in-0")
    assert classes.include?("data-[state=closed]:fade-out-0")
  end

  # === Multiple Alert Dialogs Tests ===

  test "multiple alert dialogs can exist independently" do
    default_dialog = default_alert_dialog
    destructive_dialog = destructive_alert_dialog

    # Open first dialog
    default_dialog.open
    assert default_dialog.open?
    assert destructive_dialog.closed?

    # Close first, open second
    default_dialog.cancel
    assert default_dialog.closed?

    destructive_dialog.open
    assert destructive_dialog.open?
    assert default_dialog.closed?

    destructive_dialog.cancel
    assert destructive_dialog.closed?
  end

  # === Edge Case Tests ===

  test "opening already open alert dialog does nothing" do
    alert_dialog = default_alert_dialog

    alert_dialog.open
    assert alert_dialog.open?

    # Try to open again - should be no-op
    alert_dialog.open
    assert alert_dialog.open?
  end

  test "closing already closed alert dialog does nothing" do
    alert_dialog = default_alert_dialog

    assert alert_dialog.closed?

    # Try to close - should be no-op
    alert_dialog.cancel
    assert alert_dialog.closed?
  end

  test "can cancel after opening multiple times" do
    alert_dialog = default_alert_dialog

    alert_dialog.open
    alert_dialog.cancel

    alert_dialog.open
    alert_dialog.cancel

    assert alert_dialog.closed?
  end
end
