# frozen_string_literal: true

require "test_helper"

# Rendering tests for Resizable in all three renderers (ERB, Phlex, ViewComponent).
#
# The handle binds its keyboard handler with data-action (a listener added in
# connect() piled up on every Turbo reconnect). aria-valuenow/min/max,
# aria-orientation and aria-controls depend on the panels and are set by the
# controller on connect, so Ruby no longer hard-codes 50/0/100.
class ResizableComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: the handle is a focusable separator with keyboard bound via data-action" do
      handle = resizable_doc(renderer).at_css("[data-ui--resizable-target='handle']")

      assert_equal "separator", handle["role"]
      assert_equal "0", handle["tabindex"]
      assert_includes handle["data-action"].split, "keydown->ui--resizable#handleKeyDown"
    end

    test "#{renderer}: no hard-coded aria values on the handle" do
      handle = resizable_doc(renderer).at_css("[data-ui--resizable-target='handle']")

      assert_nil handle["aria-valuenow"]
      assert_nil handle["aria-valuemin"]
      assert_nil handle["aria-valuemax"]
    end
  end

  private

  def resizable_doc(renderer)
    Nokogiri::HTML::DocumentFragment.parse(send(:"render_#{renderer}"))
  end

  def render_erb
    ApplicationController.render(inline: <<~ERB, layout: false)
      <%= render "ui/resizable/panel_group" do %>
        <%= render "ui/resizable/panel", default_size: 30, min_size: 20 do %>One<% end %>
        <%= render "ui/resizable/handle" %>
        <%= render "ui/resizable/panel", default_size: 70 do %>Two<% end %>
      <% end %>
    ERB
  end

  def render_phlex
    PhlexResizable.new.call
  end

  def render_vc
    ApplicationController.render(VcResizable.new, layout: false)
  end

  class PhlexResizable < Phlex::HTML
    def view_template
      render UI::ResizablePanelGroup.new do
        render(UI::ResizablePanel.new(default_size: 30, min_size: 20)) { "One" }
        render UI::ResizableHandle.new
        render(UI::ResizablePanel.new(default_size: 70)) { "Two" }
      end
    end
  end

  class VcResizable < ViewComponent::Base
    def call
      render(UI::ResizablePanelGroupComponent.new) do
        safe_join([
          render(UI::ResizablePanelComponent.new(default_size: 30, min_size: 20)) { "One" },
          render(UI::ResizableHandleComponent.new),
          render(UI::ResizablePanelComponent.new(default_size: 70)) { "Two" }
        ])
      end
    end
  end
end
