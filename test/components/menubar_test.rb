# frozen_string_literal: true

require "test_helper"

# Rendering tests for Menubar in all three renderers (ERB, Phlex,
# ViewComponent). Trigger ↔ content ids are wired by the controller.
class MenubarComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: triggers are menu buttons, collapsed" do
      trigger = menubar_doc(renderer).at_css("[role='menubar'] [data-ui--menubar-target='trigger']")

      assert_equal "button", trigger.name
      assert_equal "menuitem", trigger["role"]
      assert_equal "menu", trigger["aria-haspopup"]
      assert_equal "false", trigger["aria-expanded"]
    end

    test "#{renderer}: sub triggers announce a submenu" do
      sub_trigger = menubar_doc(renderer).at_css("[role='menuitem']:contains('Share')")

      assert_equal "menu", sub_trigger["aria-haspopup"]
      assert_equal "false", sub_trigger["aria-expanded"]
    end

    test "#{renderer}: disabled items carry aria-disabled and data-disabled" do
      doc = menubar_doc(renderer)

      ["New Window", "Always show URLs", "Andy", "Share"].each do |label|
        item = doc.at_css("[data-ui--menubar-target='item']:contains('#{label}')")
        assert_equal "true", item["aria-disabled"], label
        assert item.key?("data-disabled"), "#{label} lacks data-disabled"
      end
      assert_nil doc.at_css("[role='menuitem']:contains('New Tab')")["aria-disabled"]
    end

    test "#{renderer}: checkbox and radio items render aria-checked as true/false" do
      doc = menubar_doc(renderer)

      assert_equal "true", doc.at_css("[role='menuitemcheckbox']:contains('Show bookmarks')")["aria-checked"]
      assert_equal "false", doc.at_css("[role='menuitemradio']:contains('Andy')")["aria-checked"]
    end
  end

  private

  def menubar_doc(renderer)
    Nokogiri::HTML::DocumentFragment.parse(send(:"render_#{renderer}"))
  end

  def render_erb
    ApplicationController.render(inline: <<~ERB, layout: false)
      <%= render "ui/menubar" do %>
        <%= render "ui/menubar/menu" do %>
          <%= render "ui/menubar/trigger", first: true do %>File<% end %>
          <%= render "ui/menubar/content" do %>
            <%= render "ui/menubar/item" do %>New Tab<% end %>
            <%= render "ui/menubar/item", disabled: true do %>New Window<% end %>
            <%= render "ui/menubar/checkbox_item", checked: true do %>Show bookmarks<% end %>
            <%= render "ui/menubar/checkbox_item", disabled: true do %>Always show URLs<% end %>
            <%= render "ui/menubar/radio_group" do %>
              <%= render "ui/menubar/radio_item", value: "andy", disabled: true do %>Andy<% end %>
            <% end %>
            <%= render "ui/menubar/sub" do %>
              <%= render "ui/menubar/sub_trigger", disabled: true do %>Share<% end %>
              <%= render "ui/menubar/sub_content" do %>
                <%= render "ui/menubar/item" do %>Email link<% end %>
              <% end %>
            <% end %>
          <% end %>
        <% end %>
      <% end %>
    ERB
  end

  def render_phlex
    PhlexMenubar.new.call
  end

  def render_vc
    ApplicationController.render(VcMenubar.new, layout: false)
  end

  class PhlexMenubar < Phlex::HTML
    def view_template
      render UI::Menubar.new do
        render UI::MenubarMenu.new do
          render(UI::MenubarTrigger.new(first: true)) { "File" }
          render UI::MenubarContent.new do
            render(UI::MenubarItem.new) { "New Tab" }
            render(UI::MenubarItem.new(disabled: true)) { "New Window" }
            render(UI::MenubarCheckboxItem.new(checked: true)) { "Show bookmarks" }
            render(UI::MenubarCheckboxItem.new(disabled: true)) { "Always show URLs" }
            render UI::MenubarRadioGroup.new do
              render(UI::MenubarRadioItem.new(value: "andy", disabled: true)) { "Andy" }
            end
            render UI::MenubarSub.new do
              render(UI::MenubarSubTrigger.new(disabled: true)) { "Share" }
              render(UI::MenubarSubContent.new) { render(UI::MenubarItem.new) { "Email link" } }
            end
          end
        end
      end
    end
  end

  class VcMenubar < ViewComponent::Base
    def call
      render(UI::MenubarComponent.new) do
        render(UI::MenubarMenuComponent.new) do
          safe_join([
            render(UI::MenubarTriggerComponent.new(first: true)) { "File" },
            render(UI::MenubarContentComponent.new) do
              safe_join([
                render(UI::MenubarItemComponent.new) { "New Tab" },
                render(UI::MenubarItemComponent.new(disabled: true)) { "New Window" },
                render(UI::MenubarCheckboxItemComponent.new(checked: true)) { "Show bookmarks" },
                render(UI::MenubarCheckboxItemComponent.new(disabled: true)) { "Always show URLs" },
                render(UI::MenubarRadioGroupComponent.new) do
                  render(UI::MenubarRadioItemComponent.new(value: "andy", disabled: true)) { "Andy" }
                end,
                render(UI::MenubarSubComponent.new) do
                  safe_join([
                    render(UI::MenubarSubTriggerComponent.new(disabled: true)) { "Share" },
                    render(UI::MenubarSubContentComponent.new) { render(UI::MenubarItemComponent.new) { "Email link" } }
                  ])
                end
              ])
            end
          ])
        end
      end
    end
  end
end
