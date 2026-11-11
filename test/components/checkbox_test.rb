# frozen_string_literal: true

require "test_helper"

# Rendering tests for Checkbox in all three renderers (ERB, Phlex, ViewComponent).
#
# The checkbox is a native <input type="checkbox">, so the browser exposes its
# state; the markup must not carry aria-checked (it goes stale on form reset).
# "Mixed" is rendered as data-indeterminate / data-state and applied by JS.
class CheckboxComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: renders a native checkbox without aria-checked" do
      input = checkbox(renderer, checked: true)

      assert_equal "checkbox", input["type"]
      assert input.key?("checked")
      assert_equal "checked", input["data-state"]
      assert_nil input["aria-checked"]
    end

    test "#{renderer}: indeterminate is rendered for the controller to apply" do
      input = checkbox(renderer, indeterminate: true)

      assert_equal "indeterminate", input["data-state"]
      assert_equal "true", input["data-indeterminate"]
      assert_nil input["aria-checked"]
    end

    test "#{renderer}: not indeterminate by default" do
      input = checkbox(renderer)

      assert_equal "unchecked", input["data-state"]
      assert_nil input["data-indeterminate"]
    end

    test "#{renderer}: icons are hidden from assistive technology" do
      doc = parse(renderer, indeterminate: true)

      assert_equal 2, doc.css("svg").size
      doc.css("svg").each { |svg| assert_equal "true", svg["aria-hidden"] }
    end

    test "#{renderer}: caller data attributes merge with the controller's" do
      input = checkbox(renderer, data: {testid: "x"})

      assert_equal "ui--checkbox", input["data-controller"]
      assert_equal "x", input["data-testid"]
    end
  end

  private

  def checkbox(renderer, **options)
    parse(renderer, **options).at_css("input[type='checkbox']")
  end

  def parse(renderer, **options)
    Nokogiri::HTML::DocumentFragment.parse(send(:"render_#{renderer}", **options))
  end

  def render_erb(data: nil, **options)
    locals = {id: "terms", name: "terms"}.merge(options)
    locals[:attributes] = {data: data} if data
    ApplicationController.render(partial: "ui/checkbox", locals: locals, layout: false)
  end

  def render_phlex(data: nil, **options)
    UI::Checkbox.new(id: "terms", name: "terms", **options, **(data ? {data: data} : {})).call
  end

  def render_vc(data: nil, **options)
    ApplicationController.render(UI::CheckboxComponent.new(id: "terms", name: "terms", **options, **(data ? {data: data} : {})), layout: false)
  end
end
