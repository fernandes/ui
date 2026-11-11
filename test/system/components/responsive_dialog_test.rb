# frozen_string_literal: true

require "test_helper"

# Responsive Dialog lives on the Drawer showcase page.
class ResponsiveDialogTest < UI::SystemTestCase
  DESKTOP = [1280, 800].freeze
  MOBILE = [500, 800].freeze

  setup do
    page.current_window.resize_to(*DESKTOP)
    visit_component("drawer")
  end

  teardown do
    page.current_window.resize_to(*DESKTOP)
  end

  def rd(renderer = "phlex")
    find_element(UI::Testing::ResponsiveDialogElement, "#responsive-dialog-#{renderer}")
  end

  %w[phlex erb vc].each do |renderer|
    test "#{renderer}: desktop opens the dialog, named by the body's title" do
      dialog = rd(renderer)

      dialog.visible_trigger.click
      dialog.wait_for(message: "focus inside dialog") { dialog.focus_inside?(:dialog) }

      assert_equal "open", dialog.state(:dialog)
      assert_equal "closed", dialog.state(:drawer)
      assert_equal "Edit profile", dialog.accessible_name_source(:dialog)
    end
  end

  test "crossing the breakpoint while open hands over to the drawer, then closes cleanly" do
    dialog = rd
    dialog.visible_trigger.click
    dialog.wait_for(message: "focus inside dialog") { dialog.focus_inside?(:dialog) }

    page.current_window.resize_to(*MOBILE)
    dialog.wait_for(message: "drawer open") { dialog.state(:drawer) == "open" }
    dialog.wait_for(message: "focus inside drawer") { dialog.focus_inside?(:drawer) }

    assert_equal "closed", dialog.state(:dialog)
    assert dialog.body_in?(:drawer), "body was not moved into the drawer"
    assert_equal "Edit profile", dialog.accessible_name_source(:drawer)
    assert dialog.inert?("#drawer-default-phlex [data-action*='click->ui--drawer#open']")
    assert_equal "hidden", page.evaluate_script("document.body.style.overflow")

    dialog.keyboard(:escape)
    dialog.wait_for(message: "drawer closed") { dialog.state(:drawer) == "closed" }

    assert dialog.trigger_focused?(:drawer), "focus did not return to the mobile trigger"
    refute dialog.inert?("#drawer-default-phlex [data-action*='click->ui--drawer#open']")
    assert_equal "", page.evaluate_script("document.body.style.overflow")

    # Closed stays closed when going back to desktop
    page.current_window.resize_to(*DESKTOP)
    dialog.wait_for(message: "body back in dialog") { dialog.body_in?(:dialog) }
    assert_equal "closed", dialog.state(:dialog)
  end
end
