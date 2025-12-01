# frozen_string_literal: true

class UI::Collapsible < Phlex::HTML
  include UI::CollapsibleBehavior

  def initialize(open: false, disabled: false, as_child: false, classes: "", **attributes)
    @open = open
    @disabled = disabled
    @as_child = as_child
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    collapsible_attrs = collapsible_html_attributes.deep_merge(@attributes)

    if @as_child
      yield(collapsible_attrs) if block_given?
    else
      div(**collapsible_attrs, &block)
    end
  end
end
