# frozen_string_literal: true

require "test_helper"

# Rendering tests for Tooltip in all three renderers (ERB, Phlex, ViewComponent).
#
# The content id and the trigger's aria-describedby are wired by the Stimulus
# controller (so an author's aria-describedby survives); the markup carries
# the role and the actions.
class TooltipComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: content has the tooltip role" do
      content = tooltip_doc(renderer).at_css("[data-ui--tooltip-target='content']")

      assert_equal "tooltip", content["role"]
    end

    test "#{renderer}: trigger opens on hover and focus" do
      trigger = tooltip_doc(renderer).at_css("[data-ui--tooltip-target='trigger']")

      assert_equal "button", trigger.name
      %w[mouseenter->ui--tooltip#show mouseleave->ui--tooltip#hide focus->ui--tooltip#show blur->ui--tooltip#hide].each do |action|
        assert_includes trigger["data-action"], action
      end
    end

    test "#{renderer}: no generated ids in the markup" do
      assert_empty tooltip_doc(renderer).css("[id]").map { |node| node["id"] }
    end
  end

  private

  def tooltip_doc(renderer)
    Nokogiri::HTML::DocumentFragment.parse(send(:"render_#{renderer}"))
  end

  def render_erb
    ApplicationController.render(inline: <<~ERB, layout: false)
      <%= render "ui/tooltip" do %>
        <%= render "ui/tooltip/trigger" do %>Add<% end %>
        <%= render "ui/tooltip/content" do %>Add to library<% end %>
      <% end %>
    ERB
  end

  def render_phlex
    PhlexTooltip.new.call
  end

  def render_vc
    ApplicationController.render(VcTooltip.new, layout: false)
  end

  class PhlexTooltip < Phlex::HTML
    def view_template
      render UI::Tooltip.new do
        render(UI::TooltipTrigger.new) { "Add" }
        render(UI::TooltipContent.new) { "Add to library" }
      end
    end
  end

  class VcTooltip < ViewComponent::Base
    def call
      render(UI::TooltipComponent.new) do
        safe_join([
          render(UI::TooltipTriggerComponent.new) { "Add" },
          render(UI::TooltipContentComponent.new) { "Add to library" }
        ])
      end
    end
  end
end
