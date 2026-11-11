# frozen_string_literal: true

require "test_helper"

# Rendering tests for Switch in all three renderers (ERB, Phlex, ViewComponent).
class SwitchComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: the id belongs to the button only, not the hidden input" do
      doc = parse(renderer, id: "wifi", name: "wifi", checked: true)

      assert_equal ["wifi"], doc.css("[id]").map { |node| node["id"] }
      assert_equal "switch", doc.at_css("#wifi")["role"]
      hidden = doc.at_css("input[type='hidden']")
      assert_equal "wifi", hidden["name"]
      assert_nil hidden["id"]
    end

    test "#{renderer}: a custom value is submitted and handed to the controller" do
      doc = parse(renderer, id: "plan", name: "plan", value: "pro", checked: true)

      assert_equal "pro", doc.at_css("input[type='hidden']")["value"]
      assert_equal "pro", doc.at_css("[role='switch']")["data-ui--switch-value-value"]
    end

    test "#{renderer}: unchecked submits 0" do
      doc = parse(renderer, id: "plan", name: "plan", value: "pro")

      assert_equal "0", doc.at_css("input[type='hidden']")["value"]
      assert_equal "false", doc.at_css("[role='switch']")["aria-checked"]
    end

    test "#{renderer}: required is exposed as aria-required" do
      assert_equal "true", parse(renderer, id: "x", required: true).at_css("[role='switch']")["aria-required"]
      assert_nil parse(renderer, id: "x").at_css("[role='switch']")["aria-required"]
    end
  end

  private

  def parse(renderer, **options)
    Nokogiri::HTML::DocumentFragment.parse(send(:"render_#{renderer}", **options))
  end

  def render_erb(**options)
    ApplicationController.render(partial: "ui/switch", locals: options, layout: false)
  end

  def render_phlex(**options)
    UI::Switch.new(**options).call
  end

  def render_vc(**options)
    ApplicationController.render(UI::SwitchComponent.new(**options), layout: false)
  end
end
