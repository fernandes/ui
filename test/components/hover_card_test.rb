# frozen_string_literal: true

require "test_helper"

# Rendering tests for Hover Card triggers in all three renderers.
#
# The default trigger is an <a> (like Radix): with href it is a real link;
# without one it still gets tabindex="0" so keyboard focus opens the card.
class HoverCardComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: default trigger with href is a plain link" do
      trigger = trigger_node(renderer, href: "https://github.com/vercel")

      assert_equal "a", trigger.name
      assert_equal "https://github.com/vercel", trigger["href"]
      assert_nil trigger["tabindex"]
    end

    test "#{renderer}: default trigger without href stays focusable" do
      trigger = trigger_node(renderer)

      assert_equal "a", trigger.name
      assert_equal "0", trigger["tabindex"]
    end

    test "#{renderer}: tag: :span keeps working" do
      trigger = trigger_node(renderer, tag: :span)

      assert_equal "span", trigger.name
      assert_equal "0", trigger["tabindex"]
    end
  end

  private

  def trigger_node(renderer, **options)
    html = send(:"render_#{renderer}", **options)
    Nokogiri::HTML::DocumentFragment.parse(html).at_css("[data-ui--hover-card-target='trigger']")
  end

  def render_erb(href: nil, tag: nil)
    locals = []
    locals << "href: #{href.inspect}" if href
    locals << "tag: #{tag.inspect}" if tag
    args = locals.any? ? ", #{locals.join(", ")}" : ""

    ApplicationController.render(inline: <<~ERB, layout: false)
      <%= render "ui/hover_card" do %>
        <%= render "ui/hover_card/trigger"#{args} do %>@nextjs<% end %>
        <%= render "ui/hover_card/content" do %>The React Framework<% end %>
      <% end %>
    ERB
  end

  def render_phlex(href: nil, tag: nil)
    options = {href: href, tag: tag}.compact
    UI::HoverCardTrigger.new(**options).call { "@nextjs" }
  end

  def render_vc(href: nil, tag: nil)
    options = {href: href, tag: tag}.compact
    ApplicationController.render(UI::HoverCardTriggerComponent.new(**options).with_content("@nextjs"), layout: false)
  end
end
