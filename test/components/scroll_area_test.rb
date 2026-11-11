# frozen_string_literal: true

require "test_helper"

# Rendering tests for Scroll Area in all three renderers (ERB, Phlex, ViewComponent).
#
# The custom scrollbars and corner are decorative (the viewport scrolls with
# the keyboard), so they are hidden from assistive technology like Base UI's.
# The viewport starts as a tab stop; the controller drops it to -1 when there
# is nothing to scroll.
class ScrollAreaComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: scrollbars and corner are aria-hidden" do
      doc = scroll_area_doc(renderer)

      refute_empty doc.css("[data-slot='scroll-area-scrollbar']")
      doc.css("[data-slot='scroll-area-scrollbar'], [data-slot='scroll-area-corner']").each do |node|
        assert_equal "true", node["aria-hidden"], "#{node["data-slot"]} must be aria-hidden"
      end
    end

    test "#{renderer}: the viewport is a tab stop before JS runs" do
      viewport = scroll_area_doc(renderer).at_css("[data-slot='scroll-area-viewport']")

      assert_equal "0", viewport["tabindex"]
    end
  end

  private

  def scroll_area_doc(renderer)
    Nokogiri::HTML::DocumentFragment.parse(send(:"render_#{renderer}"))
  end

  def render_erb
    ApplicationController.render(inline: <<~ERB, layout: false)
      <%= render "ui/scroll_area" do %>Content<% end %>
    ERB
  end

  def render_phlex
    PhlexScrollArea.new.call
  end

  def render_vc
    ApplicationController.render(VcScrollArea.new, layout: false)
  end

  class PhlexScrollArea < Phlex::HTML
    def view_template
      render(UI::ScrollArea.new) { "Content" }
    end
  end

  class VcScrollArea < ViewComponent::Base
    def call
      render(UI::ScrollAreaComponent.new) { "Content" }
    end
  end
end
