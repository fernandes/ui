# frozen_string_literal: true

class UI::CommandEmpty < Phlex::HTML
  include UI::CommandEmptyBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&)
    div(**command_empty_html_attributes.deep_merge(@attributes), &)
  end
end
