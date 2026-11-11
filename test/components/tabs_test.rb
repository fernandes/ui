# frozen_string_literal: true

require "test_helper"

# Rendering tests for Tabs in all three renderers (ERB, Phlex, ViewComponent).
#
# Ids and aria-controls / aria-labelledby are wired by the tabs controller on
# connect, so the markup must not carry value-derived ids (they collide across
# tab sets and the trigger side never had one).
class TabsComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: no value-derived ids or dangling references" do
      doc = tabs_doc(renderer)

      assert_empty doc.css("[id]").map { |node| node["id"] }
      assert_empty doc.css("[aria-controls], [aria-labelledby]").to_a
    end

    test "#{renderer}: an id passed to a panel is kept" do
      doc = tabs_doc(renderer, ids: true)

      assert doc.at_css("div#my-panel[role='tabpanel']"), "panel id dropped"
    end

    test "#{renderer}: triggers bind keyboard navigation through data-action" do
      trigger = tabs_doc(renderer).at_css("[role='tab']")

      assert_includes trigger["data-action"], "click->ui--tabs#selectTab"
      assert_includes trigger["data-action"], "keydown->ui--tabs#handleKeyDown"
    end

    test "#{renderer}: a disabled trigger is disabled and marked data-disabled" do
      trigger = tabs_doc(renderer).at_css("[role='tab'][data-value='password']")

      assert trigger.key?("disabled")
      assert trigger.key?("data-disabled")
    end
  end

  private

  def tabs_doc(renderer, ids: false)
    Nokogiri::HTML::DocumentFragment.parse(send(:"render_#{renderer}", ids: ids))
  end

  def render_erb(ids:)
    content_attrs = ids ? "attributes: { id: 'my-panel' }" : "attributes: {}"
    ApplicationController.render(inline: <<~ERB, layout: false)
      <%= render "ui/tabs", default_value: "account" do %>
        <%= render "ui/tabs/list" do %>
          <%= render "ui/tabs/trigger", value: "account" do %>Account<% end %>
          <%= render "ui/tabs/trigger", value: "password", disabled: true do %>Password<% end %>
        <% end %>
        <%= render "ui/tabs/content", value: "account", #{content_attrs} do %>Account panel<% end %>
        <%= render "ui/tabs/content", value: "password" do %>Password panel<% end %>
      <% end %>
    ERB
  end

  def render_phlex(ids:)
    PhlexTabs.new(ids: ids).call
  end

  def render_vc(ids:)
    ApplicationController.render(VcTabs.new(ids: ids), layout: false)
  end

  class PhlexTabs < Phlex::HTML
    def initialize(ids:)
      @ids = ids
    end

    def view_template
      render UI::Tabs.new(default_value: "account") do
        render UI::TabsList.new do
          render UI::TabsTrigger.new(value: "account", default_value: "account") { "Account" }
          render UI::TabsTrigger.new(value: "password", default_value: "account", disabled: true) { "Password" }
        end
        render UI::TabsContent.new(value: "account", default_value: "account", attributes: (@ids ? {id: "my-panel"} : {})) { "Account panel" }
        render UI::TabsContent.new(value: "password", default_value: "account") { "Password panel" }
      end
    end
  end

  class VcTabs < ViewComponent::Base
    def initialize(ids:)
      @ids = ids
    end

    def call
      render(UI::TabsComponent.new(default_value: "account")) do
        safe_join([
          render(UI::TabsListComponent.new) do
            safe_join([
              render(UI::TabsTriggerComponent.new(value: "account", default_value: "account")) { "Account" },
              render(UI::TabsTriggerComponent.new(value: "password", default_value: "account", disabled: true)) { "Password" }
            ])
          end,
          render(UI::TabsContentComponent.new(value: "account", default_value: "account", attributes: (@ids ? {id: "my-panel"} : {}))) { "Account panel" },
          render(UI::TabsContentComponent.new(value: "password", default_value: "account")) { "Password panel" }
        ])
      end
    end
  end
end
