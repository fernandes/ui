# frozen_string_literal: true

class UI::CollapsibleTrigger < Phlex::HTML
  include UI::CollapsibleTriggerBehavior

  def initialize(as_child: false, classes: "", **attributes)
    @as_child = as_child
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    trigger_attrs = collapsible_trigger_html_attributes.deep_merge(@attributes)

    if @as_child
      yield(trigger_attrs) if block_given?
    else
      button(**trigger_attrs, type: "button", &block)
    end
  end
end
