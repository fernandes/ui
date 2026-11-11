# frozen_string_literal: true

require "test_helper"

# Rendering tests for Context Menu in all three renderers (ERB, Phlex,
# ViewComponent).
class ContextMenuComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: checkbox and radio items render aria-checked as true/false" do
      doc = menu_doc(renderer)

      assert_equal "true", doc.at_css("[role='menuitemcheckbox']:contains('Show bookmarks')")["aria-checked"]
      assert_equal "false", doc.at_css("[role='menuitemcheckbox']:contains('Show full URLs')")["aria-checked"]
      assert_equal "true", doc.at_css("[role='menuitemradio']:contains('Pedro')")["aria-checked"]
      assert_equal "false", doc.at_css("[role='menuitemradio']:contains('Colm')")["aria-checked"]
    end

    test "#{renderer}: every item activates on click, so checkbox/radio items can toggle" do
      doc = menu_doc(renderer)

      %w[menuitem menuitemcheckbox menuitemradio].each do |role|
        doc.css("[role='#{role}']").each do |item|
          assert_includes item["data-action"], "click->ui--context-menu#select", "#{role} #{item.text.strip}"
        end
      end
    end

    test "#{renderer}: disabled items carry aria-disabled and data-disabled" do
      doc = menu_doc(renderer)

      %w[menuitem menuitemcheckbox menuitemradio].each do |role|
        item = doc.at_css("[role='#{role}'][aria-disabled='true']")
        assert item, "no disabled #{role}"
        assert item.key?("data-disabled"), "#{role} lacks data-disabled"
      end
      assert_nil doc.at_css("[role='menuitem']:contains('Back')")["aria-disabled"]
    end

    test "#{renderer}: the menu takes an accessible name from aria-label" do
      assert_equal "Page actions", menu_doc(renderer).at_css("[role='menu']")["aria-label"]
    end
  end

  private

  def menu_doc(renderer)
    Nokogiri::HTML::DocumentFragment.parse(send(:"render_#{renderer}"))
  end

  def render_erb
    ApplicationController.render(inline: <<~ERB, layout: false)
      <%= render "ui/context_menu" do %>
        <%= render "ui/context_menu/trigger" do %>Right click here<% end %>
        <%= render "ui/context_menu/content", attributes: { "aria-label": "Page actions" } do %>
          <%= render "ui/context_menu/item" do %>Back<% end %>
          <%= render "ui/context_menu/item", disabled: true do %>Forward<% end %>
          <%= render "ui/context_menu/checkbox_item", checked: true do %>Show bookmarks<% end %>
          <%= render "ui/context_menu/checkbox_item" do %>Show full URLs<% end %>
          <%= render "ui/context_menu/checkbox_item", disabled: true do %>Show sidebar<% end %>
          <%= render "ui/context_menu/radio_group" do %>
            <%= render "ui/context_menu/radio_item", checked: true do %>Pedro<% end %>
            <%= render "ui/context_menu/radio_item" do %>Colm<% end %>
            <%= render "ui/context_menu/radio_item", disabled: true do %>Ana<% end %>
          <% end %>
        <% end %>
      <% end %>
    ERB
  end

  def render_phlex
    PhlexMenu.new.call
  end

  def render_vc
    ApplicationController.render(VcMenu.new, layout: false)
  end

  class PhlexMenu < Phlex::HTML
    def view_template
      render UI::ContextMenu.new do
        render(UI::ContextMenuTrigger.new) { "Right click here" }
        render UI::ContextMenuContent.new("aria-label": "Page actions") do
          render(UI::ContextMenuItem.new) { "Back" }
          render(UI::ContextMenuItem.new(disabled: true)) { "Forward" }
          render(UI::ContextMenuCheckboxItem.new(checked: true)) { "Show bookmarks" }
          render(UI::ContextMenuCheckboxItem.new) { "Show full URLs" }
          render(UI::ContextMenuCheckboxItem.new(disabled: true)) { "Show sidebar" }
          render UI::ContextMenuRadioGroup.new do
            render(UI::ContextMenuRadioItem.new(checked: true)) { "Pedro" }
            render(UI::ContextMenuRadioItem.new) { "Colm" }
            render(UI::ContextMenuRadioItem.new(disabled: true)) { "Ana" }
          end
        end
      end
    end
  end

  class VcMenu < ViewComponent::Base
    def call
      render(UI::ContextMenuComponent.new) do
        safe_join([
          render(UI::ContextMenuTriggerComponent.new) { "Right click here" },
          render(UI::ContextMenuContentComponent.new("aria-label": "Page actions")) do
            safe_join([
              render(UI::ContextMenuItemComponent.new) { "Back" },
              render(UI::ContextMenuItemComponent.new(disabled: true)) { "Forward" },
              render(UI::ContextMenuCheckboxItemComponent.new(checked: true)) { "Show bookmarks" },
              render(UI::ContextMenuCheckboxItemComponent.new) { "Show full URLs" },
              render(UI::ContextMenuCheckboxItemComponent.new(disabled: true)) { "Show sidebar" },
              render(UI::ContextMenuRadioGroupComponent.new) do
                safe_join([
                  render(UI::ContextMenuRadioItemComponent.new(checked: true)) { "Pedro" },
                  render(UI::ContextMenuRadioItemComponent.new) { "Colm" },
                  render(UI::ContextMenuRadioItemComponent.new(disabled: true)) { "Ana" }
                ])
              end
            ])
          end
        ])
      end
    end
  end
end
