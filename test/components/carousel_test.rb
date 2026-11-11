# frozen_string_literal: true

require "test_helper"

# Rendering tests for Carousel in all three renderers (ERB, Phlex, ViewComponent).
class CarouselComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: the root binds arrow-key navigation" do
      root = carousel_doc(renderer).at_css("[data-controller='ui--carousel']")

      assert_equal "region", root["role"]
      assert_equal "carousel", root["aria-roledescription"]
      assert_includes root["data-action"].to_s.split, "keydown->ui--carousel#keydown"
    end

    test "#{renderer}: an action the author passes is kept" do
      root = carousel_doc(renderer, action: "mouseenter->analytics#track").at_css("[data-controller='ui--carousel']")

      assert_equal %w[mouseenter->analytics#track keydown->ui--carousel#keydown], root["data-action"].split
    end
  end

  private

  def carousel_doc(renderer, action: nil)
    Nokogiri::HTML::DocumentFragment.parse(send(:"render_#{renderer}", action: action))
  end

  def render_erb(action:)
    attrs = action ? "attributes: { data: { action: #{action.inspect} } }" : "attributes: {}"
    ApplicationController.render(inline: <<~ERB, layout: false)
      <%= render "ui/carousel", #{attrs} do %>
        <%= render "ui/carousel/content" do %>
          <%= render "ui/carousel/item" do %>1<% end %>
        <% end %>
      <% end %>
    ERB
  end

  def render_phlex(action:)
    PhlexCarousel.new(action: action).call
  end

  def render_vc(action:)
    ApplicationController.render(VcCarousel.new(action: action), layout: false)
  end

  class PhlexCarousel < Phlex::HTML
    def initialize(action:)
      @action = action
    end

    def view_template
      render UI::Carousel.new(**(@action ? {data: {action: @action}} : {})) do
        render UI::CarouselContent.new do
          render(UI::CarouselItem.new) { "1" }
        end
      end
    end
  end

  class VcCarousel < ViewComponent::Base
    def initialize(action:)
      @action = action
    end

    def call
      render(UI::CarouselComponent.new(**(@action ? {data: {action: @action}} : {}))) do
        render(UI::CarouselContentComponent.new) do
          render(UI::CarouselItemComponent.new) { "1" }
        end
      end
    end
  end
end
