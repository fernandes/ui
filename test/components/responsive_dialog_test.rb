# frozen_string_literal: true

require "test_helper"

# Rendering tests for Responsive Dialog in all three renderers.
#
# It renders a Drawer (mobile) and a Dialog (desktop). The caller's body is
# rendered once, inside the Dialog; the controller moves it into the Drawer
# below the breakpoint. Both children render closed: the controller opens
# only the visible one when `open: true`.
class ResponsiveDialogComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: the body is rendered once (no duplicated ids)" do
      doc = rd_doc(renderer)

      assert_equal 1, doc.css("#profile-name").size
      body = doc.at_css("[data-ui--responsive-dialog-target='body']")
      assert body, "body target missing"
      assert body.at_css("#profile-name")
    end

    test "#{renderer}: drawer and dialog each have a slot inside their content" do
      doc = rd_doc(renderer)

      drawer_content = doc.at_css("[data-ui--responsive-dialog-target='drawer'] [data-ui--drawer-target='content']")
      dialog_content = doc.at_css("[data-ui--responsive-dialog-target='dialog'] [data-ui--dialog-target='content']")
      assert drawer_content&.at_css("[data-ui--responsive-dialog-target='drawerSlot']"), "drawer slot missing"
      assert dialog_content&.at_css("[data-ui--responsive-dialog-target='dialogSlot'] [data-ui--responsive-dialog-target='body']"), "body not in the dialog slot"
    end

    test "#{renderer}: dialog content sits inside its overlay container (stays live when the page goes inert)" do
      doc = rd_doc(renderer)

      assert doc.at_css("[data-ui--dialog-target='container'] [data-ui--dialog-target='content']")
    end

    test "#{renderer}: open: true leaves both children closed for the controller to open one" do
      doc = rd_doc(renderer, open: true)

      root = doc.at_css("[data-controller='ui--responsive-dialog']")
      # Phlex renders a true boolean as a bare attribute, which Stimulus reads as true
      assert_includes ["true", ""], root["data-ui--responsive-dialog-open-value"]
      # false, or omitted (Phlex drops false booleans): the Stimulus default is closed
      assert_includes ["false", nil], doc.at_css("[data-controller='ui--drawer']")["data-ui--drawer-open-value"]
      assert_includes ["false", nil], doc.at_css("[data-controller='ui--dialog']")["data-ui--dialog-open-value"]
      doc.css("[role='dialog']").each { |content| assert_equal "closed", content["data-state"] }
    end

    test "#{renderer}: each variant gets the trigger" do
      doc = rd_doc(renderer)

      assert_equal "Edit profile", doc.at_css("[data-ui--drawer-target='trigger']")&.text&.strip
      assert_equal "Edit profile", doc.at_css("[data-ui--dialog-target='trigger']")&.text&.strip
    end
  end

  private

  def rd_doc(renderer, open: false)
    Nokogiri::HTML::DocumentFragment.parse(send(:"render_#{renderer}", open: open))
  end

  def render_erb(open:)
    ApplicationController.render(inline: <<~ERB, layout: false, locals: {open: open})
      <%= render "ui/responsive_dialog", open: open, trigger: "Edit profile" do %>
        <h2>Edit profile</h2>
        <input id="profile-name" aria-label="Name">
      <% end %>
    ERB
  end

  def render_phlex(open:)
    PhlexRd.new(open).call
  end

  def render_vc(open:)
    ApplicationController.render(VcRd.new(open), layout: false)
  end

  class PhlexRd < Phlex::HTML
    def initialize(open)
      @open = open
    end

    def view_template
      render UI::ResponsiveDialog.new(open: @open) do |rd|
        rd.with_trigger { "Edit profile" }
        rd.with_content do
          h2 { "Edit profile" }
          input(id: "profile-name", aria_label: "Name")
        end
      end
    end
  end

  class VcRd < ViewComponent::Base
    def initialize(open)
      @open = open
    end

    def call
      render(UI::ResponsiveDialogComponent.new(open: @open)) do |rd|
        rd.with_trigger { "Edit profile" }
        safe_join([content_tag(:h2, "Edit profile"), tag.input(id: "profile-name", "aria-label": "Name")])
      end
    end
  end
end
