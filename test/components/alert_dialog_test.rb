# frozen_string_literal: true

require "test_helper"

# Rendering tests for Alert Dialog (Phlex is its only renderer; ERB pages
# render the Phlex classes).
#
# Ids and aria relationships are wired by the Stimulus controller on connect;
# the markup marks the parts as targets, carries static trigger ARIA on an
# as_child trigger, and keeps any id the caller passes.
class AlertDialogComponentTest < ActiveSupport::TestCase
  test "wrapper trigger is the trigger target (the controller puts ARIA on its button)" do
    wrapper = doc.at_css("[data-ui--alert-dialog-target='trigger']")

    assert wrapper, "trigger target missing"
    assert_equal "div", wrapper.name
    assert_includes wrapper["data-action"], "click->ui--alert-dialog#open"
    assert wrapper.at_css("button"), "wrapped button missing"
  end

  test "as_child trigger hands the action, target and ARIA to the child" do
    trigger = doc(as_child: true).at_css("a[data-ui--alert-dialog-target='trigger']")

    assert trigger, "as_child trigger missing"
    assert_equal "dialog", trigger["aria-haspopup"]
    assert_equal "false", trigger["aria-expanded"]
    assert_includes trigger["data-action"], "click->ui--alert-dialog#open"
    assert_nil doc(as_child: true).at_css("div[data-action*='ui--alert-dialog#open']"), "as_child must not render the wrapper"
  end

  test "title, description and cancel are targets" do
    content = doc.at_css("[role='alertdialog']")

    assert_equal "true", content["aria-modal"]
    assert_equal "Are you sure?", content.at_css("h2[data-ui--alert-dialog-target='title']")&.text&.strip
    assert_equal "This cannot be undone.", content.at_css("p[data-ui--alert-dialog-target='description']")&.text&.strip
    cancel = content.at_css("button[data-ui--alert-dialog-target='cancel']")
    assert_equal "Cancel", cancel&.text&.strip
    assert_includes cancel["data-action"], "click->ui--alert-dialog#close"
  end

  test "caller data on title, description and cancel is kept next to the target" do
    content = doc(extra_data: true).at_css("[role='alertdialog']")

    assert content.at_css("h2[data-testid='t'][data-ui--alert-dialog-target='title']")
    assert content.at_css("p[data-testid='d'][data-ui--alert-dialog-target='description']")
    assert content.at_css("button[data-testid='c'][data-ui--alert-dialog-target='cancel']")
  end

  test "no generated ids; ids passed by the caller are kept" do
    assert_empty doc.css("[id]")

    with_ids = doc(ids: true)
    assert with_ids.at_css("h2#my-title[data-ui--alert-dialog-target='title']")
    assert with_ids.at_css("p#my-description[data-ui--alert-dialog-target='description']")
  end

  private

  def doc(as_child: false, ids: false, extra_data: false)
    Nokogiri::HTML::DocumentFragment.parse(PhlexAlertDialog.new(as_child:, ids:, extra_data:).call)
  end

  class PhlexAlertDialog < Phlex::HTML
    def initialize(as_child:, ids:, extra_data:)
      @as_child = as_child
      @ids = ids
      @extra_data = extra_data
    end

    def view_template
      render UI::AlertDialog.new do
        if @as_child
          render UI::AlertDialogTrigger.new(as_child: true) do |attrs|
            a(href: "#", **attrs) { "Delete" }
          end
        else
          render UI::AlertDialogTrigger.new { render UI::Button.new { "Delete" } }
        end
        render UI::AlertDialogOverlay.new do
          render UI::AlertDialogContent.new do
            render UI::AlertDialogHeader.new do
              render UI::AlertDialogTitle.new(**title_attrs) { "Are you sure?" }
              render UI::AlertDialogDescription.new(**description_attrs) { "This cannot be undone." }
            end
            render UI::AlertDialogFooter.new do
              render UI::AlertDialogCancel.new(**(@extra_data ? {data: {testid: "c"}} : {})) { "Cancel" }
              render UI::AlertDialogAction.new { "Continue" }
            end
          end
        end
      end
    end

    private

    def title_attrs
      return {id: "my-title"} if @ids
      @extra_data ? {data: {testid: "t"}} : {}
    end

    def description_attrs
      return {id: "my-description"} if @ids
      @extra_data ? {data: {testid: "d"}} : {}
    end
  end
end
