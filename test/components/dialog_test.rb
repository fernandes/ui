# frozen_string_literal: true

require "test_helper"

# Rendering tests for Dialog in all three renderers (ERB, Phlex, ViewComponent).
#
# Ids and the aria relationships between parts (aria-labelledby,
# aria-describedby, aria-controls) are wired by the Stimulus controller on
# connect, so the markup only has to mark the parts as targets, carry the
# trigger's static ARIA, and keep any id the caller passes.
class DialogComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: trigger announces a dialog and starts collapsed" do
      trigger = dialog_doc(renderer).at_css("[data-ui--dialog-target='trigger']")

      assert trigger, "trigger target missing"
      assert_equal "button", trigger.name
      assert_equal "dialog", trigger["aria-haspopup"]
      assert_equal "false", trigger["aria-expanded"]
      assert_includes trigger["data-action"], "click->ui--dialog#open"
    end

    test "#{renderer}: as_child trigger hands the ARIA and target to the child" do
      trigger = dialog_doc(renderer, as_child: true).at_css("a[data-ui--dialog-target='trigger']")

      assert trigger, "as_child trigger target missing"
      assert_equal "dialog", trigger["aria-haspopup"]
      assert_equal "false", trigger["aria-expanded"]
      assert_includes trigger["data-action"], "click->ui--dialog#open"
    end

    test "#{renderer}: title and description are targets the controller can link" do
      doc = dialog_doc(renderer)
      content = doc.at_css("[role='dialog']")

      assert_equal "true", content["aria-modal"]
      assert_equal "Edit profile", content.at_css("h2[data-ui--dialog-target='title']")&.text&.strip
      assert_equal "Make changes here.", content.at_css("p[data-ui--dialog-target='description']")&.text&.strip
    end

    test "#{renderer}: no generated ids in the markup" do
      doc = dialog_doc(renderer)

      assert_empty doc.css("[id]").map { |node| node["id"] }
    end

    test "#{renderer}: an id passed to the title and description is kept" do
      doc = dialog_doc(renderer, ids: true)

      assert doc.at_css("h2#my-title[data-ui--dialog-target='title']"), "title id dropped"
      assert doc.at_css("p#my-description[data-ui--dialog-target='description']"), "description id dropped"
    end
  end

  private

  def dialog_doc(renderer, as_child: false, ids: false)
    Nokogiri::HTML::DocumentFragment.parse(send(:"render_#{renderer}", as_child: as_child, ids: ids))
  end

  def render_erb(as_child:, ids:)
    title_attrs = ids ? "attributes: { id: 'my-title' }" : "attributes: {}"
    description_attrs = ids ? "attributes: { id: 'my-description' }" : "attributes: {}"
    trigger = if as_child
      <<~ERB
        <%= render "ui/dialog/trigger", as_child: true do |attrs| %>
          <%= content_tag :a, "Open", href: "#", **attrs %>
        <% end %>
      ERB
    else
      %(<%= render "ui/dialog/trigger" do %>Open<% end %>)
    end

    ApplicationController.render(inline: <<~ERB, layout: false)
      <%= render "ui/dialog" do %>
        #{trigger}
        <%= render "ui/dialog/overlay" do %>
          <%= render "ui/dialog/content" do %>
            <%= render "ui/dialog/title", #{title_attrs} do %>Edit profile<% end %>
            <%= render "ui/dialog/description", #{description_attrs} do %>Make changes here.<% end %>
            <%= render "ui/dialog/close" do %>Cancel<% end %>
          <% end %>
        <% end %>
      <% end %>
    ERB
  end

  def render_phlex(as_child:, ids:)
    component = PhlexDialog.new(as_child: as_child, ids: ids)
    component.call
  end

  def render_vc(as_child:, ids:)
    ApplicationController.render(VcDialog.new(as_child: as_child, ids: ids), layout: false)
  end

  class PhlexDialog < Phlex::HTML
    def initialize(as_child:, ids:)
      @as_child = as_child
      @ids = ids
    end

    def view_template
      render UI::Dialog.new do
        if @as_child
          render UI::DialogTrigger.new(as_child: true) do |attrs|
            a(href: "#", **attrs) { "Open" }
          end
        else
          render UI::DialogTrigger.new { "Open" }
        end
        render UI::DialogOverlay.new do
          render UI::DialogContent.new do
            render UI::DialogTitle.new(**(@ids ? {id: "my-title"} : {})) { "Edit profile" }
            render UI::DialogDescription.new(**(@ids ? {id: "my-description"} : {})) { "Make changes here." }
            render UI::DialogClose.new { "Cancel" }
          end
        end
      end
    end
  end

  class VcDialog < ViewComponent::Base
    def initialize(as_child:, ids:)
      @as_child = as_child
      @ids = ids
    end

    def call
      render(UI::DialogComponent.new) do
        safe_join([
          trigger,
          render(UI::DialogOverlayComponent.new) do
            render(UI::DialogContentComponent.new) do
              safe_join([
                render(UI::DialogTitleComponent.new(**(@ids ? {id: "my-title"} : {}))) { "Edit profile" },
                render(UI::DialogDescriptionComponent.new(**(@ids ? {id: "my-description"} : {}))) { "Make changes here." },
                render(UI::DialogCloseComponent.new) { "Cancel" }
              ])
            end
          end
        ])
      end
    end

    private

    def trigger
      if @as_child
        render(UI::DialogTriggerComponent.new(as_child: true)) { content_tag(:a, "Open", href: "#") }
      else
        render(UI::DialogTriggerComponent.new) { "Open" }
      end
    end
  end
end
