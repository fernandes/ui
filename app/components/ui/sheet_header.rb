# frozen_string_literal: true

class UI::SheetHeader < Phlex::HTML
  include UI::SheetHeaderBehavior

  def initialize(classes: nil)
    @classes = classes
  end

  def view_template(&block)
    div(**sheet_header_html_attributes) do
      yield if block_given?
    end
  end
end
