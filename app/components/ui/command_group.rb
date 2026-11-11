# frozen_string_literal: true

class UI::CommandGroup < Phlex::HTML
  include UI::CommandGroupBehavior

  def initialize(heading: nil, classes: "", **attributes)
    @heading = heading
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**command_group_html_attributes.deep_merge(@attributes)) do
      if @heading
        div(**command_group_heading_html_attributes) { @heading }
      end
      yield if block_given?
    end
  end
end
