# frozen_string_literal: true

require "test_helper"

# Rendering tests for Drawer in all three renderers (ERB, Phlex, ViewComponent).
#
# Ids and aria relationships (aria-labelledby, aria-describedby,
# aria-controls) are wired by the Stimulus controller on connect; the markup
# marks the parts as targets, carries the trigger's static ARIA, keeps the
# caller's attributes and renders closed content inert.
class DrawerComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: trigger announces a dialog and starts collapsed" do
      trigger = drawer_doc(renderer).at_css("[data-ui--drawer-target='trigger']")

      assert trigger, "trigger target missing"
      assert_equal "button", trigger.name
      assert_equal "dialog", trigger["aria-haspopup"]
      assert_equal "false", trigger["aria-expanded"]
      assert_includes trigger["data-action"], "click->ui--drawer#open"
    end

    test "#{renderer}: content keeps the caller's attributes and is inert while closed" do
      content = drawer_doc(renderer).at_css("[role='dialog']")

      assert_equal "my-drawer", content["id"]
      assert_equal "yes", content["data-testid"]
      assert_equal "content", content["data-ui--drawer-target"]
      assert_includes content["data-action"], "pointerdown->ui--drawer#handlePointerDown"
      assert_equal "true", content["aria-modal"]
      assert content.key?("inert"), "closed content must be inert"
      assert_includes content["class"], "group/drawer-content"
    end

    test "#{renderer}: title is a real heading and a target; description is a target" do
      doc = drawer_doc(renderer)

      title = doc.at_css("[data-ui--drawer-target='title']")
      assert_equal "h2", title&.name
      assert_nil title["role"]
      assert_equal "Move goal", title.text.strip
      assert_equal "Set your daily goal.", doc.at_css("p[data-ui--drawer-target='description']")&.text&.strip
    end

    test "#{renderer}: an id passed to the title and description is kept" do
      doc = drawer_doc(renderer, ids: true)

      assert doc.at_css("h2#my-title[data-ui--drawer-target='title']"), "title id dropped"
      assert doc.at_css("p#my-description[data-ui--drawer-target='description']"), "description id dropped"
    end
  end

  private

  def drawer_doc(renderer, ids: false)
    Nokogiri::HTML::DocumentFragment.parse(send(:"render_#{renderer}", ids: ids))
  end

  def title_attrs(ids) = ids ? {id: "my-title"} : {}

  def description_attrs(ids) = ids ? {id: "my-description"} : {}

  CONTENT_ATTRS = {id: "my-drawer", data: {testid: "yes"}}.freeze

  def render_erb(ids:)
    ApplicationController.render(inline: <<~ERB, layout: false, locals: {t: title_attrs(ids), d: description_attrs(ids), c: CONTENT_ATTRS})
      <%= render "ui/drawer" do %>
        <%= render "ui/drawer/trigger" do %>Open<% end %>
        <%= render "ui/drawer/overlay" %>
        <%= render "ui/drawer/content", attributes: c do %>
          <%= render "ui/drawer/title", attributes: t do %>Move goal<% end %>
          <%= render "ui/drawer/description", attributes: d do %>Set your daily goal.<% end %>
          <%= render "ui/drawer/close" do %>Cancel<% end %>
        <% end %>
      <% end %>
    ERB
  end

  def render_phlex(ids:)
    PhlexDrawer.new(title_attrs(ids), description_attrs(ids)).call
  end

  def render_vc(ids:)
    ApplicationController.render(VcDrawer.new(title_attrs(ids), description_attrs(ids)), layout: false)
  end

  class PhlexDrawer < Phlex::HTML
    def initialize(title_attrs, description_attrs)
      @title_attrs = title_attrs
      @description_attrs = description_attrs
    end

    def view_template
      render UI::Drawer.new do
        render UI::DrawerTrigger.new { "Open" }
        render UI::DrawerOverlay.new
        render UI::DrawerContent.new(**CONTENT_ATTRS) do
          render UI::DrawerTitle.new(**@title_attrs) { "Move goal" }
          render UI::DrawerDescription.new(**@description_attrs) { "Set your daily goal." }
          render UI::DrawerClose.new { "Cancel" }
        end
      end
    end
  end

  class VcDrawer < ViewComponent::Base
    def initialize(title_attrs, description_attrs)
      @title_attrs = title_attrs
      @description_attrs = description_attrs
    end

    def call
      render(UI::DrawerComponent.new) do
        safe_join([
          render(UI::DrawerTriggerComponent.new) { "Open" },
          render(UI::DrawerOverlayComponent.new),
          render(UI::DrawerContentComponent.new(attributes: CONTENT_ATTRS)) do
            safe_join([
              render(UI::DrawerTitleComponent.new(attributes: @title_attrs)) { "Move goal" },
              render(UI::DrawerDescriptionComponent.new(attributes: @description_attrs)) { "Set your daily goal." },
              render(UI::DrawerCloseComponent.new) { "Cancel" }
            ])
          end
        ])
      end
    end
  end
end
