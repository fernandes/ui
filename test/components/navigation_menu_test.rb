# frozen_string_literal: true

require "test_helper"

# Rendering tests for Navigation Menu in all three renderers.
#
# Trigger ↔ content ids (aria-controls / aria-labelledby) are wired by the
# controller; the markup must keep every trigger in the Tab order, hide
# closed panels in viewport mode too, and name the <nav> landmark.
class NavigationMenuComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: default (viewport) menu renders its viewport" do
      doc = nav_doc(renderer)

      assert doc.at_css("nav [data-ui--navigation-menu-target='viewport']"), "viewport missing"
      # Phlex renders a bare boolean attribute, which Stimulus reads as true
      assert_includes ["true", ""], doc.at_css("nav")["data-ui--navigation-menu-viewport-value"]
    end

    test "#{renderer}: every trigger is a tab stop, even with first:" do
      triggers = nav_doc(renderer).css("[data-ui--navigation-menu-target='trigger']")

      assert_equal 2, triggers.size
      triggers.each do |trigger|
        assert_nil trigger["tabindex"], "trigger #{trigger.text.strip} has tabindex=#{trigger["tabindex"]}"
        assert_equal "false", trigger["aria-expanded"]
      end
    end

    test "#{renderer}: closed content is hidden in viewport mode" do
      content = nav_doc(renderer).at_css("[data-ui--navigation-menu-target='content']")

      assert_equal "closed", content["data-state"]
      assert_includes content["class"].split, "data-[state=closed]:invisible"
    end

    test "#{renderer}: the nav landmark is named Main by default" do
      assert_equal "Main", nav_doc(renderer).at_css("nav")["aria-label"]
    end

    test "#{renderer}: an author's aria-label replaces the default" do
      assert_equal "Docs", nav_doc(renderer, label: "Docs").at_css("nav")["aria-label"]
    end

    test "#{renderer}: no generated ids in the markup" do
      assert_empty nav_doc(renderer).css("[id]").map { |node| node["id"] }
    end
  end

  private

  def nav_doc(renderer, label: nil)
    Nokogiri::HTML::DocumentFragment.parse(send(:"render_#{renderer}", label: label))
  end

  def render_erb(label:)
    attrs = label ? %(, attributes: { "aria-label": #{label.inspect} }) : ""
    ApplicationController.render(inline: <<~ERB, layout: false)
      <%= render "ui/navigation_menu"#{attrs} do %>
        <%= render "ui/navigation_menu/list" do %>
          <%= render "ui/navigation_menu/item" do %>
            <%= render "ui/navigation_menu/trigger", first: true do %>Learn<% end %>
            <%= render "ui/navigation_menu/content" do %>
              <%= render "ui/navigation_menu/link", href: "#guides" do %>Guides<% end %>
            <% end %>
          <% end %>
          <%= render "ui/navigation_menu/item" do %>
            <%= render "ui/navigation_menu/trigger" do %>Build<% end %>
            <%= render "ui/navigation_menu/content" do %>
              <%= render "ui/navigation_menu/link", href: "#starters" do %>Starters<% end %>
            <% end %>
          <% end %>
        <% end %>
      <% end %>
    ERB
  end

  def render_phlex(label:)
    PhlexNav.new(label: label).call
  end

  def render_vc(label:)
    ApplicationController.render(VcNav.new(label: label), layout: false)
  end

  class PhlexNav < Phlex::HTML
    def initialize(label:)
      @label = label
    end

    def view_template
      render UI::NavigationMenu.new(**(@label ? {"aria-label": @label} : {})) do
        render UI::NavigationMenuList.new do
          [["Learn", "Guides", true], ["Build", "Starters", false]].each do |trigger, link, first|
            render UI::NavigationMenuItem.new do
              render(UI::NavigationMenuTrigger.new(first: first)) { trigger }
              render UI::NavigationMenuContent.new do
                render(UI::NavigationMenuLink.new(href: "##{link.downcase}")) { link }
              end
            end
          end
        end
      end
    end
  end

  class VcNav < ViewComponent::Base
    def initialize(label:)
      @label = label
    end

    def call
      render(UI::NavigationMenuComponent.new(**(@label ? {"aria-label": @label} : {}))) do
        render(UI::NavigationMenuListComponent.new) do
          safe_join([["Learn", "Guides", true], ["Build", "Starters", false]].map { |trigger, link, first|
            render(UI::NavigationMenuItemComponent.new) do
              safe_join([
                render(UI::NavigationMenuTriggerComponent.new(first: first)) { trigger },
                render(UI::NavigationMenuContentComponent.new) do
                  render(UI::NavigationMenuLinkComponent.new(href: "##{link.downcase}")) { link }
                end
              ])
            end
          })
        end
      end
    end
  end
end
