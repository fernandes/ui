# frozen_string_literal: true

require "test_helper"

# Rendering tests for Date Picker in all three renderers (ERB, Phlex, ViewComponent).
#
# The calendar inside the popover must receive the selection (and open on its
# month, so focus can land on the selected day), keep its own keyboard action
# next to the date picker's select action, and the hidden form field must
# carry the selected value.
class DatePickerComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze
  SELECTED = Date.new(2025, 6, 12)

  RENDERERS.each do |renderer|
    test "#{renderer}: calendar receives the selection and opens on its month" do
      calendar = date_picker_doc(renderer).at_css("[data-controller~='ui--calendar']")

      assert_equal ["2025-06-12"], JSON.parse(calendar["data-ui--calendar-selected-value"])
      assert_equal "2025-06-12", calendar["data-ui--calendar-month-value"]
    end

    test "#{renderer}: calendar keeps its keyboard navigation inside the date picker" do
      actions = date_picker_doc(renderer).at_css("[data-controller~='ui--calendar']")["data-action"].split

      assert_includes actions, "keydown->ui--calendar#handleKeydown"
      assert_includes actions, "ui--calendar:select->ui--datepicker#handleSelect"
      assert_equal actions.uniq, actions, "an action is bound twice"
    end

    test "#{renderer}: hidden field carries the selected date" do
      input = date_picker_doc(renderer).at_css("input[type='hidden'][name='event[date]']")

      assert_equal "2025-06-12", input["value"]
    end

    test "#{renderer}: without a selection the calendar opens on today's month" do
      calendar = date_picker_doc(renderer, selected: nil).at_css("[data-controller~='ui--calendar']")

      assert_equal Date.today.to_s, calendar["data-ui--calendar-month-value"]
    end
  end

  test "phlex: input mode renders (behavior used to be unqualified)" do
    html = UI::DatePickerInput.new(id: "when").call

    assert Nokogiri::HTML::DocumentFragment.parse(html).at_css("input#when")
  end

  test "vc: input mode renders (behavior used to be unqualified)" do
    html = ApplicationController.render(UI::DatePickerInputComponent.new(id: "when"), layout: false)

    assert Nokogiri::HTML::DocumentFragment.parse(html).at_css("input#when")
  end

  private

  def date_picker_doc(renderer, selected: SELECTED)
    Nokogiri::HTML::DocumentFragment.parse(send(:"render_#{renderer}", selected))
  end

  def render_erb(selected)
    ApplicationController.render(inline: <<~ERB, layout: false, locals: {selected: selected})
      <%= render "ui/date_picker", selected: selected, name: "event[date]" do %>
        <%= render "ui/date_picker/trigger", placeholder: "Pick a date", selected: selected %>
      <% end %>
    ERB
  end

  def render_phlex(selected)
    PhlexDatePicker.new(selected).call
  end

  def render_vc(selected)
    ApplicationController.render(VcDatePicker.new(selected), layout: false)
  end

  class PhlexDatePicker < Phlex::HTML
    def initialize(selected)
      @selected = selected
    end

    def view_template
      render UI::DatePicker.new(selected: @selected, name: "event[date]") do
        render UI::DatePickerTrigger.new(placeholder: "Pick a date", selected: @selected)
      end
    end
  end

  class VcDatePicker < ViewComponent::Base
    def initialize(selected)
      @selected = selected
    end

    def call
      render(UI::DatePickerComponent.new(selected: @selected, name: "event[date]")) do |dp|
        dp.with_trigger(placeholder: "Pick a date")
      end
    end
  end
end
