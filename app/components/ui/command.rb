# frozen_string_literal: true

class UI::Command < Phlex::HTML
  include UI::CommandBehavior

  def initialize(loop: true, classes: "", **attributes)
    @loop = loop
    @classes = classes
    @attributes = attributes
  end

  def view_template(&)
    div(**command_html_attributes.deep_merge(@attributes), &)
  end
end
