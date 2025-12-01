# frozen_string_literal: true

class UI::DialogContent < Phlex::HTML
  include UI::DialogContentBehavior

  def initialize(open: false, classes: nil, **attributes)
    @open = open
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**dialog_content_html_attributes) do
      yield if block_given?
    end
  end
end
