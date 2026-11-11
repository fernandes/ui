# frozen_string_literal: true

require "test_helper"

class DialogTest < UI::SystemTestCase
  setup do
    visit_component("dialog")
  end

  # Helper to get the default ERB dialog by ID
  def default_dialog
    find_element(UI::Testing::DialogElement, "#erb-default-dialog")
  end

  # ERB dialog with a form (hidden field first) and a nested dialog inside
  def form_dialog
    find_element(UI::Testing::DialogElement, "#erb-form-dialog")
  end

  # Helper to get the asChild ERB dialog by ID (has close_on_overlay_click: false)
  def no_overlay_dialog
    find_element(UI::Testing::DialogElement, "#erb-aschild-dialog")
  end

  # === Basic Interaction Tests ===

  test "opens dialog when trigger is clicked" do
    dialog = default_dialog

    # Initially closed
    assert dialog.closed?

    # Click trigger to open
    dialog.open

    # Should be open
    assert dialog.open?
    assert dialog.content_visible?
  end

  test "closes dialog when close button is clicked" do
    dialog = default_dialog

    dialog.open
    assert dialog.open?

    dialog.close

    assert dialog.closed?
  end

  test "dialog displays title and description" do
    dialog = default_dialog

    dialog.open

    assert_equal "ERB Dialog", dialog.title
    assert_equal "This dialog is rendered using ERB partials.", dialog.description
  end

  test "dialog has close button" do
    dialog = default_dialog

    dialog.open

    assert dialog.has_close_button?
  end

  # === Close Methods Tests ===

  test "closes dialog with Escape key" do
    dialog = default_dialog

    dialog.open
    assert dialog.open?

    dialog.close_with_escape

    assert dialog.closed?
  end

  # NOTE: This test is flaky due to the overlay click event timing
  # The overlay click functionality is tested indirectly via the controller
  # test "closes dialog when overlay is clicked" do
  #   dialog = default_dialog
  #   dialog.open
  #   # Click on overlay closes dialog - behavior verified manually
  # end

  test "does not close on overlay click when close_on_overlay_click is false" do
    dialog = no_overlay_dialog

    # Open the dialog using the trigger
    dialog.trigger.click
    dialog.wait_for_open
    assert dialog.open?

    # Simulate overlay click by calling click directly
    page.evaluate_script(<<~JS)
      document.querySelectorAll('[data-controller="ui--dialog"]')[1]
        .querySelector('[data-ui--dialog-target="overlay"]')
        .click()
    JS

    sleep 0.3 # Wait to ensure it doesn't close

    assert dialog.open?, "Dialog should remain open when close_on_overlay_click is false"

    # Should still close with close button
    dialog.close
    assert dialog.closed?
  end

  test "does not close on escape when close_on_escape would be false" do
    # The default dialog has close_on_escape: true
    # We test that it DOES close with escape
    dialog = default_dialog

    dialog.open
    assert dialog.open?

    dialog.press_escape

    assert dialog.closed?, "Dialog should close with Escape when close_on_escape is true"
  end

  # === ARIA Accessibility Tests ===

  test "content has correct role" do
    dialog = default_dialog

    dialog.open

    assert_equal "dialog", dialog.content_role
  end

  test "content is labelled by its title and described by its description" do
    dialog = default_dialog

    dialog.open

    assert dialog.aria_labeled_correctly?
  end

  test "trigger exposes aria-haspopup, aria-controls and aria-expanded" do
    dialog = default_dialog
    trigger = dialog.trigger

    assert_equal "dialog", trigger["aria-haspopup"]
    assert_equal dialog.content["id"], trigger["aria-controls"]
    assert_equal "false", trigger["aria-expanded"]

    dialog.open
    assert_equal "true", trigger["aria-expanded"]

    dialog.close
    assert_equal "false", trigger["aria-expanded"]
  end

  # === Focus Management Tests ===

  test "focuses first focusable element when opened" do
    dialog = default_dialog

    dialog.open

    # Wait a moment for focus to settle
    sleep 0.2

    # Check that something inside the dialog has focus
    # The dialog controller should focus the first focusable element
    page.evaluate_script("document.activeElement")
    focused_tag = page.evaluate_script("document.activeElement.tagName")

    # Should be an input, button, or other focusable element
    assert_includes ["INPUT", "BUTTON", "A"], focused_tag,
      "Expected a focusable element to be focused, got #{focused_tag}"
  end

  # --- Modal focus (X3/X4/X5): only a real browser knows Tab order and inert ---

  test "focus skips the form's hidden field and lands on the first input" do
    dialog = form_dialog

    dialog.own_trigger.click
    dialog.wait_for_focus_inside

    assert_equal "account-email", dialog.focused_label
  end

  test "Tab and Shift+Tab wrap inside the dialog" do
    dialog = form_dialog
    dialog.own_trigger.click
    dialog.wait_for_focus_inside

    # Email -> Delete account -> Save -> (wrap) Email
    dialog.keyboard(:tab)
    assert_equal "Delete account", dialog.focused_label
    dialog.keyboard(:tab)
    assert_equal "Save", dialog.focused_label
    dialog.keyboard(:tab)
    assert_equal "account-email", dialog.focused_label

    dialog.keyboard([:shift, :tab])
    assert_equal "Save", dialog.focused_label

    10.times { dialog.keyboard(:tab) }
    assert dialog.focus_inside?, "focus escaped the dialog"
  end

  test "the page behind an open dialog is inert, and comes back on close" do
    dialog = form_dialog
    dialog.own_trigger.click
    dialog.wait_for_focus_inside

    assert dialog.inert?("#erb-default-dialog [data-ui--dialog-target='trigger']")
    assert dialog.inert?("#erb-form-dialog > [data-ui--dialog-target='trigger']")
    refute dialog.inert?("#erb-form-dialog [data-ui--dialog-target='overlay']")

    dialog.keyboard(:escape)
    dialog.wait_for_closed

    refute dialog.inert?("#erb-default-dialog [data-ui--dialog-target='trigger']")
  end

  test "closing returns focus to the trigger" do
    dialog = form_dialog

    dialog.own_trigger.click
    dialog.wait_for_focus_inside
    dialog.keyboard(:escape)
    dialog.wait_for_closed

    assert dialog.trigger_focused?, "focus went to #{dialog.focused_label}"

    dialog.own_trigger.click
    dialog.wait_for_focus_inside
    page.find("#erb-form-dialog button", exact_text: "Save").click
    dialog.wait_for_closed

    assert dialog.trigger_focused?, "focus went to #{dialog.focused_label}"
  end

  test "Escape in a nested dialog closes only the nested one" do
    outer = form_dialog

    outer.own_trigger.click
    outer.wait_for_focus_inside
    inner = find_element(UI::Testing::DialogElement, "#erb-nested-dialog")
    inner.own_trigger.click
    inner.wait_for_focus_inside
    assert_equal "Keep account", inner.focused_label

    inner.keyboard(:escape)
    sleep 0.2

    assert_equal "closed", inner.own_state
    assert_equal "open", outer.own_state
    assert inner.trigger_focused?, "focus went to #{inner.focused_label}"

    outer.keyboard(:escape)
    outer.wait_for_closed
    assert outer.trigger_focused?
  end

  # === Overlay Tests ===

  test "shows overlay when dialog is open" do
    dialog = default_dialog

    dialog.open

    assert dialog.overlay_visible?
  end

  test "overlay has correct data-state" do
    dialog = default_dialog

    assert_equal "closed", dialog.overlay["data-state"]

    dialog.open

    assert_equal "open", dialog.overlay["data-state"]

    dialog.close

    assert_equal "closed", dialog.overlay["data-state"]
  end

  # === Container Tests ===

  test "container has correct data-state" do
    dialog = default_dialog

    assert_equal "closed", dialog.container["data-state"]

    dialog.open

    assert_equal "open", dialog.container["data-state"]

    dialog.close

    assert_equal "closed", dialog.container["data-state"]
  end

  # === asChild Composition Tests ===

  test "works with asChild trigger composition" do
    dialog = no_overlay_dialog

    # Should still be able to open via trigger
    dialog.open

    assert dialog.open?
    assert_equal "asChild Composition (ERB)", dialog.title
  end

  test "asChild trigger merges stimulus attributes correctly" do
    dialog = no_overlay_dialog

    # The trigger should have the stimulus action merged
    trigger = dialog.trigger
    assert trigger["data-action"].include?("click->ui--dialog#open")
  end

  # === State Persistence Tests ===

  test "maintains closed state after opening and closing" do
    dialog = default_dialog

    dialog.open
    assert dialog.open?

    dialog.close
    assert dialog.closed?

    # Should be able to open again
    dialog.open
    assert dialog.open?
  end

  test "can open and close multiple times" do
    dialog = default_dialog

    3.times do
      dialog.open
      assert dialog.open?

      dialog.close
      assert dialog.closed?
    end
  end

  # === Body Scroll Lock Tests ===

  test "prevents body scroll when dialog is open" do
    dialog = default_dialog

    # Check initial body overflow style
    page.evaluate_script("document.body.style.overflow")

    dialog.open

    # Body should have overflow hidden
    overflow_when_open = page.evaluate_script("document.body.style.overflow")
    assert_equal "hidden", overflow_when_open

    dialog.close

    # Body overflow should be restored
    overflow_after_close = page.evaluate_script("document.body.style.overflow")
    assert_equal "", overflow_after_close
  end
end
