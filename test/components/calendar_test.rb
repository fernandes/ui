# frozen_string_literal: true

require "test_helper"

# Rendering tests for Calendar in all three renderers (ERB, Phlex, ViewComponent).
#
# The day grid itself (gridcells, day labels, tab stop) is rendered by the
# Stimulus controller; see calendar_accessibility.test.js.
class CalendarComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: one month has one previous and one next button" do
      doc = calendar_doc(renderer, number_of_months: 1)

      assert_equal 1, doc.css("button[aria-label='Go to previous month']").size
      assert_equal 1, doc.css("button[aria-label='Go to next month']").size
    end

    test "#{renderer}: several months share one previous and one next button" do
      doc = calendar_doc(renderer, number_of_months: 3)

      assert_equal 3, doc.css("table[role='grid']").size
      assert_equal 1, doc.css("button[aria-label='Go to previous month']").size
      assert_equal 1, doc.css("button[aria-label='Go to next month']").size
    end

    test "#{renderer}: grid keyboard handling and grid tables are present" do
      doc = calendar_doc(renderer, number_of_months: 1)
      root = doc.at_css("[data-controller~='ui--calendar']")

      assert_includes root["data-action"], "keydown->ui--calendar#handleKeydown"
      assert doc.at_css("table[role='grid'] tbody[data-ui--calendar-target='grid']")
    end
  end

  private

  def calendar_doc(renderer, **options)
    options = {month: Date.new(2024, 11, 1)}.merge(options)
    html = case renderer
    when :erb then ApplicationController.render(partial: "ui/calendar", locals: options)
    when :phlex then UI::Calendar.new(**options).call
    when :vc then ApplicationController.render(UI::CalendarComponent.new(**options), layout: false)
    end
    Nokogiri::HTML::DocumentFragment.parse(html)
  end
end
