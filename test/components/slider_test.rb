# frozen_string_literal: true

require "test_helper"

# Rendering tests for Slider in all three renderers (ERB, Phlex, ViewComponent).
#
# Thumbs render their ARIA (value, range, orientation, disabled, name) on the
# server, and the root renders one hidden input per value for forms.
class SliderComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: thumbs render their ARIA values before JS runs" do
      thumbs = parse(renderer, default_value: [20, 80], min: 10, max: 90, orientation: "vertical").css("[role='slider']")

      assert_equal %w[20 80], thumbs.map { |t| t["aria-valuenow"] }
      thumbs.each do |thumb|
        assert_equal "10", thumb["aria-valuemin"]
        assert_equal "90", thumb["aria-valuemax"]
        assert_equal "vertical", thumb["aria-orientation"]
        assert_equal "0", thumb["tabindex"]
      end
    end

    test "#{renderer}: range thumbs are named Minimum and Maximum" do
      thumbs = parse(renderer, default_value: [20, 80]).css("[role='slider']")

      assert_equal %w[Minimum Maximum], thumbs.map { |t| t["aria-label"] }
    end

    test "#{renderer}: more than two thumbs are numbered" do
      thumbs = parse(renderer, default_value: [10, 20, 30]).css("[role='slider']")

      assert_equal ["Value 1 of 3", "Value 2 of 3", "Value 3 of 3"], thumbs.map { |t| t["aria-label"] }
    end

    test "#{renderer}: a single thumb takes the slider's aria-labelledby or aria-label" do
      labelled = parse(renderer, attributes: {"aria-labelledby": "vol"}).at_css("[role='slider']")
      named = parse(renderer, attributes: {"aria-label": "Volume"}).at_css("[role='slider']")

      assert_equal "vol", labelled["aria-labelledby"]
      assert_equal "Volume", named["aria-label"]
    end

    test "#{renderer}: an aria-label passed to the thumb wins" do
      thumb = parse(renderer, default_value: [20, 80], thumb_attributes: {"aria-label": "From"}).at_css("[role='slider']")

      assert_equal "From", thumb["aria-label"]
    end

    test "#{renderer}: a disabled slider disables its thumbs" do
      thumb = parse(renderer, disabled: true).at_css("[role='slider']")

      assert_equal "true", thumb["aria-disabled"]
      assert_equal "-1", thumb["tabindex"]
    end

    test "#{renderer}: name renders one hidden input per value" do
      single = parse(renderer, name: "volume", default_value: [40]).css("input[type='hidden']")
      range = parse(renderer, name: "price", default_value: [20, 80]).css("input[type='hidden']")

      assert_equal [["volume", "40"]], single.map { |i| [i["name"], i["value"]] }
      assert_equal [["price[]", "20"], ["price[]", "80"]], range.map { |i| [i["name"], i["value"]] }
      assert_empty parse(renderer).css("input")
    end
  end

  private

  def parse(renderer, **options)
    Nokogiri::HTML::DocumentFragment.parse(send(:"render_#{renderer}", **options))
  end

  def thumb_count(options)
    Array(options[:default_value] || [0]).length
  end

  def render_erb(thumb_attributes: {}, **options)
    ApplicationController.render(inline: <<~ERB, locals: {options: options, count: thumb_count(options), thumb_attributes: thumb_attributes}, layout: false)
      <%= render "ui/slider", **options do %>
        <%= render "ui/slider/track" do %><%= render "ui/slider/range" %><% end %>
        <% count.times do |i| %>
          <%= render "ui/slider/thumb", attributes: (i.zero? ? thumb_attributes : {}) %>
        <% end %>
      <% end %>
    ERB
  end

  def render_phlex(thumb_attributes: {}, **options)
    count = thumb_count(options)
    UI::Slider.new(**options).call do |slider|
      slider.render UI::SliderTrack.new { slider.render UI::SliderRange.new }
      count.times { |i| slider.render UI::SliderThumb.new(attributes: i.zero? ? thumb_attributes : {}) }
    end
  end

  def render_vc(thumb_attributes: {}, **options)
    ApplicationController.render(VcSlider.new(options, thumb_count(options), thumb_attributes), layout: false)
  end

  class VcSlider < ViewComponent::Base
    def initialize(options, count, thumb_attributes)
      @options = options
      @count = count
      @thumb_attributes = thumb_attributes
    end

    def call
      render(UI::SliderComponent.new(**@options)) do
        safe_join([
          render(UI::SliderTrackComponent.new) { render(UI::SliderRangeComponent.new) },
          *Array.new(@count) { |i| render(UI::SliderThumbComponent.new(attributes: i.zero? ? @thumb_attributes : {})) }
        ])
      end
    end
  end
end
