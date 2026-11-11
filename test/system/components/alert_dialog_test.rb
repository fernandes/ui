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

  def as_child_alert_dialog
    find_element(UI::Testing::AlertDialogElement, "#as-child-alert-dialog")
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

  test "content is labelled by its title and described by its description" do
    alert_dialog = default_alert_dialog

    alert_dialog.open

    assert alert_dialog.aria_labeled_correctly?
  end

  test "the button inside the trigger wrapper exposes the dialog state" do
    alert_dialog = default_alert_dialog
    button = alert_dialog.trigger_button

    assert_equal "dialog", button["aria-haspopup"]
    assert_equal alert_dialog.content["id"], button["aria-controls"]
    assert_equal "false", button["aria-expanded"]

    alert_dialog.open
    assert_equal "true", button["aria-expanded"]

    alert_dialog.cancel
    assert_equal "false", button["aria-expanded"]
  end

  test "an as_child trigger is the button itself and exposes the dialog state" do
    alert_dialog = as_child_alert_dialog
    trigger = alert_dialog.trigger

    assert_equal "BUTTON", trigger.tag_name.upcase
    assert_equal alert_dialog.content["id"], trigger["aria-controls"]

    alert_dialog.open
    assert_equal "true", trigger["aria-expanded"]
  end

  # === Focus Management Tests ===

  # --- Modal focus (X3/X4/X5): only a real browser knows Tab order and inert ---

  test "focus starts on Cancel" do
    alert_dialog = default_alert_dialog

    alert_dialog.trigger_button.click
    alert_dialog.wait_for_focus_inside

    assert_equal "Cancel", alert_dialog.focused_label
  end

  test "focus starts on Cancel even when it comes after the action and a form's hidden token" do
    alert_dialog = as_child_alert_dialog

    alert_dialog.trigger.click
    alert_dialog.wait_for_focus_inside

    assert_equal "Keep access", alert_dialog.focused_label
  end

  test "Tab and Shift+Tab wrap inside the alert dialog" do
    alert_dialog = default_alert_dialog
    alert_dialog.trigger_button.click
    alert_dialog.wait_for_focus_inside

    alert_dialog.keyboard(:tab)
    assert_equal "Continue", alert_dialog.focused_label
    alert_dialog.keyboard(:tab)
    assert_equal "Cancel", alert_dialog.focused_label
    alert_dialog.keyboard([:shift, :tab])
    assert_equal "Continue", alert_dialog.focused_label

    6.times { alert_dialog.keyboard(:tab) }
    assert alert_dialog.focus_inside?, "focus escaped the alert dialog"
  end

  test "the page behind an open alert dialog is inert, and comes back on close" do
    alert_dialog = default_alert_dialog
    alert_dialog.trigger_button.click
    alert_dialog.wait_for_focus_inside

    assert alert_dialog.inert?("#destructive-alert-dialog [data-ui--alert-dialog-target='trigger']")

    alert_dialog.keyboard(:escape)
    alert_dialog.wait_for_closed

    refute alert_dialog.inert?("#destructive-alert-dialog [data-ui--alert-dialog-target='trigger']")
  end

  test "closing returns focus to the trigger" do
    alert_dialog = default_alert_dialog

    alert_dialog.trigger_button.click
    alert_dialog.wait_for_focus_inside
    alert_dialog.keyboard(:escape)
    alert_dialog.wait_for_closed

    assert alert_dialog.trigger_focused?, "focus went to #{alert_dialog.focused_label}"
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
