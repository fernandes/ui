# frozen_string_literal: true

require "test_helper"

# Rendering tests for Popover in all three renderers (ERB, Phlex, ViewComponent).
#
# The content id and the trigger's aria-controls / aria-expanded are wired by
# the Stimulus controller; the markup carries the role and the static ARIA of
# an as_child trigger.
class PopoverComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: content is a focusable non-modal dialog" do
      content = popover_doc(renderer).at_css("[data-ui--popover-target='content']")

      assert_equal "dialog", content["role"]
      assert_equal "-1", content["tabindex"]
      assert_nil content["aria-modal"]
    end

    test "#{renderer}: as_child trigger announces a dialog and starts collapsed" do
      trigger = popover_doc(renderer, as_child: true).at_css("button[data-ui--popover-target='trigger']")

      assert trigger, "as_child trigger target missing"
      assert_equal "dialog", trigger["aria-haspopup"]
      assert_equal "false", trigger["aria-expanded"]
    end

    test "#{renderer}: the default trigger wrapper carries no button ARIA" do
      trigger = popover_doc(renderer).at_css("div[data-ui--popover-target='trigger']")

      assert trigger, "trigger wrapper missing"
      assert_nil trigger["aria-haspopup"]
      assert_nil trigger["aria-expanded"]
    end

    test "#{renderer}: auto_focus: false opts out of moving focus in" do
      root = popover_doc(renderer, auto_focus: false).at_css("[data-controller='ui--popover']")
      assert_equal "false", root["data-ui--popover-auto-focus-value"]

      default_root = popover_doc(renderer).at_css("[data-controller='ui--popover']")
      assert_nil default_root["data-ui--popover-auto-focus-value"]
    end

    test "#{renderer}: no generated ids in the markup" do
      assert_empty popover_doc(renderer).css("[id]").map { |node| node["id"] }
    end
  end

  private

  def popover_doc(renderer, as_child: false, auto_focus: true)
    Nokogiri::HTML::DocumentFragment.parse(send(:"render_#{renderer}", as_child: as_child, auto_focus: auto_focus))
  end

  def render_erb(as_child:, auto_focus:)
    trigger = if as_child
      <<~ERB
        <%= render "ui/popover/trigger", as_child: true do |attrs| %>
          <%= content_tag :button, "Open", type: "button", **attrs %>
        <% end %>
      ERB
    else
      %(<%= render "ui/popover/trigger" do %><button type="button">Open</button><% end %>)
    end

    ApplicationController.render(inline: <<~ERB, layout: false)
      <%= render "ui/popover", auto_focus: #{auto_focus} do %>
        #{trigger}
        <%= render "ui/popover/content" do %>Dimensions<% end %>
      <% end %>
    ERB
  end

  def render_phlex(as_child:, auto_focus:)
    PhlexPopover.new(as_child: as_child, auto_focus: auto_focus).call
  end

  def render_vc(as_child:, auto_focus:)
    ApplicationController.render(VcPopover.new(as_child: as_child, auto_focus: auto_focus), layout: false)
  end

  class PhlexPopover < Phlex::HTML
    def initialize(as_child:, auto_focus:)
      @as_child = as_child
      @auto_focus = auto_focus
    end

    def view_template
      render UI::Popover.new(auto_focus: @auto_focus) do
        if @as_child
          render UI::PopoverTrigger.new(as_child: true) do |attrs|
            button(type: "button", **attrs) { "Open" }
          end
        else
          render(UI::PopoverTrigger.new) { button(type: "button") { "Open" } }
        end
        render(UI::PopoverContent.new) { "Dimensions" }
      end
    end
  end

  class VcPopover < ViewComponent::Base
    def initialize(as_child:, auto_focus:)
      @as_child = as_child
      @auto_focus = auto_focus
    end

    def call
      render(UI::PopoverComponent.new(auto_focus: @auto_focus)) do
        safe_join([
          trigger,
          render(UI::PopoverContentComponent.new) { "Dimensions" }
        ])
      end
    end

    private

    def trigger
      if @as_child
        render(UI::PopoverTriggerComponent.new(as_child: true)) { content_tag(:button, "Open", type: "button") }
      else
        render(UI::PopoverTriggerComponent.new) { content_tag(:button, "Open", type: "button") }
      end
    end
  end
end
