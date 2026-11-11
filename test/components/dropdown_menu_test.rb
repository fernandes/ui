# frozen_string_literal: true

require "test_helper"

# Rendering tests for Dropdown Menu in all three renderers (ERB, Phlex,
# ViewComponent). Ids and aria-controls / aria-labelledby are wired by the
# Stimulus controller on connect; the markup carries the static ARIA.
class DropdownMenuComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: checkbox and radio items render aria-checked as true/false" do
      doc = menu_doc(renderer)

      assert_equal "true", doc.at_css("[role='menuitemcheckbox']:contains('Status bar')")["aria-checked"]
      assert_equal "false", doc.at_css("[role='menuitemcheckbox']:contains('Activity bar')")["aria-checked"]
      assert_equal "true", doc.at_css("[role='menuitemradio']:contains('Top')")["aria-checked"]
      assert_equal "false", doc.at_css("[role='menuitemradio']:contains('Bottom')")["aria-checked"]
    end

    test "#{renderer}: disabled items carry aria-disabled and data-disabled" do
      doc = menu_doc(renderer)

      %w[menuitem menuitemcheckbox menuitemradio].each do |role|
        item = doc.at_css("[role='#{role}'][aria-disabled='true']")
        assert item, "no disabled #{role}"
        assert item.key?("data-disabled"), "#{role} lacks data-disabled"
      end
      sub_trigger = doc.at_css("[aria-haspopup='menu'][role='menuitem']:contains('Share')")
      assert_equal "true", sub_trigger["aria-disabled"]
      assert_nil doc.at_css("[role='menuitem']:contains('Profile')")["aria-disabled"]
    end

    test "#{renderer}: sub triggers announce a submenu" do
      sub_trigger = menu_doc(renderer).at_css("[role='menuitem']:contains('More tools')")

      assert_equal "menu", sub_trigger["aria-haspopup"]
      assert_equal "false", sub_trigger["aria-expanded"]
    end

    test "#{renderer}: items close the menu on click" do
      item = menu_doc(renderer).at_css("[role='menuitem']:contains('Profile')")

      assert_includes item["data-action"], "click->ui--dropdown#select"
    end

    test "#{renderer}: a text trigger renders one button with the menu-button ARIA" do
      trigger = menu_doc(renderer).at_css("[data-ui--dropdown-target='trigger']")

      assert_equal "button", trigger.name
      assert_equal "button", trigger["type"]
      assert_nil trigger["role"]
      assert_nil trigger["tabindex"]
      assert_equal "menu", trigger["aria-haspopup"]
      assert_equal "false", trigger["aria-expanded"]
      assert_includes trigger["data-action"], "keydown->ui--dropdown#handleTriggerKeydown"
    end

    test "#{renderer}: a trigger wrapping a button stays a plain wrapper (no nested interactive)" do
      doc = menu_doc(renderer, trigger: :button)
      wrapper = doc.at_css("[data-ui--dropdown-target='trigger']")

      assert_equal "div", wrapper.name
      assert_nil wrapper["role"]
      assert_nil wrapper["tabindex"]
      assert_nil wrapper["aria-haspopup"]
      assert_equal 1, doc.css("button").size
      assert_equal 0, doc.css("[tabindex='0']").size
    end

    test "#{renderer}: as_child hands the menu-button ARIA to the child" do
      trigger = menu_doc(renderer, trigger: :as_child).at_css("a[data-ui--dropdown-target='trigger']")

      assert trigger, "as_child trigger missing"
      assert_equal "menu", trigger["aria-haspopup"]
      assert_equal "false", trigger["aria-expanded"]
    end

    test "#{renderer}: no generated ids in the markup" do
      assert_empty menu_doc(renderer).css("[id]").map { |node| node["id"] }
    end
  end

  private

  def menu_doc(renderer, trigger: :text)
    Nokogiri::HTML::DocumentFragment.parse(send(:"render_#{renderer}", trigger))
  end

  def render_erb(trigger)
    trigger_erb = case trigger
    when :button
      %(<%= render "ui/dropdown_menu/trigger" do %><button type="button">Open</button><% end %>)
    when :as_child
      <<~ERB
        <%= render "ui/dropdown_menu/trigger", as_child: true do |attrs| %>
          <%= content_tag :a, "Open", href: "#", **attrs %>
        <% end %>
      ERB
    else
      %(<%= render "ui/dropdown_menu/trigger" do %>Open<% end %>)
    end

    ApplicationController.render(inline: <<~ERB, layout: false)
      <%= render "ui/dropdown_menu" do %>
        #{trigger_erb}
        <%= render "ui/dropdown_menu/content" do %>
          <%= render "ui/dropdown_menu/item" do %>Profile<% end %>
          <%= render "ui/dropdown_menu/item", disabled: true do %>Billing<% end %>
          <%= render "ui/dropdown_menu/checkbox_item", checked: true do %>Status bar<% end %>
          <%= render "ui/dropdown_menu/checkbox_item", checked: false do %>Activity bar<% end %>
          <%= render "ui/dropdown_menu/checkbox_item", disabled: true do %>Panel<% end %>
          <%= render "ui/dropdown_menu/radio_group" do %>
            <%= render "ui/dropdown_menu/radio_item", value: "top", checked: true do %>Top<% end %>
            <%= render "ui/dropdown_menu/radio_item", value: "bottom" do %>Bottom<% end %>
            <%= render "ui/dropdown_menu/radio_item", value: "right", disabled: true do %>Right<% end %>
          <% end %>
          <%= render "ui/dropdown_menu/sub" do %>
            <%= render "ui/dropdown_menu/sub_trigger" do %>More tools<% end %>
            <%= render "ui/dropdown_menu/sub_content" do %>
              <%= render "ui/dropdown_menu/item" do %>Save page<% end %>
            <% end %>
          <% end %>
          <%= render "ui/dropdown_menu/sub" do %>
            <%= render "ui/dropdown_menu/sub_trigger", disabled: true do %>Share<% end %>
            <%= render "ui/dropdown_menu/sub_content" do %>
              <%= render "ui/dropdown_menu/item" do %>Email<% end %>
            <% end %>
          <% end %>
        <% end %>
      <% end %>
    ERB
  end

  def render_phlex(trigger)
    PhlexMenu.new(trigger: trigger).call
  end

  def render_vc(trigger)
    ApplicationController.render(VcMenu.new(trigger: trigger), layout: false)
  end

  class PhlexMenu < Phlex::HTML
    def initialize(trigger:)
      @trigger = trigger
    end

    def view_template
      render UI::DropdownMenu.new do
        case @trigger
        when :button
          render(UI::DropdownMenuTrigger.new) { button(type: "button") { "Open" } }
        when :as_child
          render(UI::DropdownMenuTrigger.new(as_child: true)) { |attrs| a(href: "#", **attrs) { "Open" } }
        else
          render(UI::DropdownMenuTrigger.new) { "Open" }
        end
        render UI::DropdownMenuContent.new do
          render(UI::DropdownMenuItem.new) { "Profile" }
          render(UI::DropdownMenuItem.new(disabled: true)) { "Billing" }
          render(UI::DropdownMenuCheckboxItem.new(checked: true)) { "Status bar" }
          render(UI::DropdownMenuCheckboxItem.new(checked: false)) { "Activity bar" }
          render(UI::DropdownMenuCheckboxItem.new(disabled: true)) { "Panel" }
          render UI::DropdownMenuRadioGroup.new do
            render(UI::DropdownMenuRadioItem.new(value: "top", checked: true)) { "Top" }
            render(UI::DropdownMenuRadioItem.new(value: "bottom")) { "Bottom" }
            render(UI::DropdownMenuRadioItem.new(value: "right", disabled: true)) { "Right" }
          end
          render UI::DropdownMenuSub.new do
            render(UI::DropdownMenuSubTrigger.new) { "More tools" }
            render(UI::DropdownMenuSubContent.new) { render(UI::DropdownMenuItem.new) { "Save page" } }
          end
          render UI::DropdownMenuSub.new do
            render(UI::DropdownMenuSubTrigger.new(disabled: true)) { "Share" }
            render(UI::DropdownMenuSubContent.new) { render(UI::DropdownMenuItem.new) { "Email" } }
          end
        end
      end
    end
  end

  class VcMenu < ViewComponent::Base
    def initialize(trigger:)
      @trigger = trigger
    end

    def call
      render(UI::DropdownMenuComponent.new) do
        safe_join([trigger_html, content_html])
      end
    end

    private

    def trigger_html
      case @trigger
      when :button
        render(UI::DropdownMenuTriggerComponent.new) { content_tag(:button, "Open", type: "button") }
      when :as_child
        component = UI::DropdownMenuTriggerComponent.new(as_child: true)
        render(component) { content_tag(:a, "Open", href: "#", **component.trigger_attrs) }
      else
        render(UI::DropdownMenuTriggerComponent.new) { "Open" }
      end
    end

    def content_html
      render(UI::DropdownMenuContentComponent.new) do
        safe_join([
          render(UI::DropdownMenuItemComponent.new) { "Profile" },
          render(UI::DropdownMenuItemComponent.new(disabled: true)) { "Billing" },
          render(UI::DropdownMenuCheckboxItemComponent.new(checked: true)) { "Status bar" },
          render(UI::DropdownMenuCheckboxItemComponent.new(checked: false)) { "Activity bar" },
          render(UI::DropdownMenuCheckboxItemComponent.new(disabled: true)) { "Panel" },
          render(UI::DropdownMenuRadioGroupComponent.new) do
            safe_join([
              render(UI::DropdownMenuRadioItemComponent.new(value: "top", checked: true)) { "Top" },
              render(UI::DropdownMenuRadioItemComponent.new(value: "bottom")) { "Bottom" },
              render(UI::DropdownMenuRadioItemComponent.new(value: "right", disabled: true)) { "Right" }
            ])
          end,
          sub("More tools", "Save page"),
          sub("Share", "Email", disabled: true)
        ])
      end
    end

    def sub(label, item, disabled: false)
      render(UI::DropdownMenuSubComponent.new) do
        safe_join([
          render(UI::DropdownMenuSubTriggerComponent.new(disabled: disabled)) { label },
          render(UI::DropdownMenuSubContentComponent.new) { render(UI::DropdownMenuItemComponent.new) { item } }
        ])
      end
    end
  end
end
