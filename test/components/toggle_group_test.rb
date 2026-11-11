# frozen_string_literal: true

require "test_helper"

# Rendering tests for Toggle Group in all three renderers (ERB, Phlex, ViewComponent).
#
# Roving tabindex and arrow keys are wired by the controller; the markup has
# to expose the roles, the orientation and the disabled state.
class ToggleGroupComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: single mode is a radiogroup of radios with aria-orientation" do
      doc = parse(renderer, type: "single", value: "b", orientation: "vertical")
      root = doc.at_css("[data-controller='ui--toggle-group']")

      assert_equal "radiogroup", root["role"]
      assert_equal "vertical", root["aria-orientation"]
      assert_equal "vertical", root["data-orientation"]
      assert_equal %w[radio radio], doc.css("button").map { |b| b["role"] }
      assert_equal %w[false true], doc.css("button").map { |b| b["aria-checked"] }
    end

    test "#{renderer}: multiple mode is a group without aria-orientation" do
      root = parse(renderer, type: "multiple", orientation: "horizontal").at_css("[data-controller='ui--toggle-group']")

      assert_equal "group", root["role"]
      assert_nil root["aria-orientation"]
      assert_equal "horizontal", root["data-orientation"]
    end

    test "#{renderer}: no orientation by default" do
      root = parse(renderer).at_css("[data-controller='ui--toggle-group']")

      assert_nil root["aria-orientation"]
      assert_nil root["data-orientation"]
    end

    test "#{renderer}: disabled on the group disables every item" do
      doc = parse(renderer, disabled: true)

      assert doc.at_css("[data-controller='ui--toggle-group']").key?("data-disabled")
      doc.css("button").each do |button|
        assert button.key?("disabled"), "item not disabled"
        assert button.key?("data-disabled")
      end
    end

    test "#{renderer}: loop: false reaches the controller" do
      root = parse(renderer, loop: false).at_css("[data-controller='ui--toggle-group']")

      assert_equal "false", root["data-ui--toggle-group-loop-value"]
      assert_nil parse(renderer).at_css("[data-controller]")["data-ui--toggle-group-loop-value"]
    end

    test "#{renderer}: items carry data-state once" do
      html = send(:"render_#{renderer}", value: "a")

      assert_equal 2, html.scan("data-state=").size
    end
  end

  private

  def parse(renderer, **options)
    Nokogiri::HTML::DocumentFragment.parse(send(:"render_#{renderer}", **options))
  end

  def render_erb(**options)
    ApplicationController.render(inline: <<~ERB, locals: {options: options}, layout: false)
      <%= render "ui/toggle_group", **options do %>
        <%= render "ui/toggle_group/item", value: "a" do %>A<% end %>
        <%= render "ui/toggle_group/item", value: "b" do %>B<% end %>
      <% end %>
    ERB
  end

  def render_phlex(**options)
    UI::ToggleGroup.new(**options).call do |group|
      group.render UI::ToggleGroupItem.new(value: "a") { "A" }
      group.render UI::ToggleGroupItem.new(value: "b") { "B" }
    end
  end

  def render_vc(**options)
    ApplicationController.render(VcGroup.new(**options), layout: false)
  end

  class VcGroup < ViewComponent::Base
    def initialize(**options)
      @options = options
    end

    def call
      render(UI::ToggleGroupComponent.new(**@options)) do
        safe_join([
          render(UI::ToggleGroupItemComponent.new(value: "a")) { "A" },
          render(UI::ToggleGroupItemComponent.new(value: "b")) { "B" }
        ])
      end
    end
  end
end
