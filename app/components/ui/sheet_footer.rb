# frozen_string_literal: true

class UI::SheetFooter < Phlex::HTML
  include UI::SheetFooterBehavior

  def initialize(classes: nil)
    @classes = classes
  end

  def view_template(&block)
    div(**sheet_footer_html_attributes) do
      yield if block_given?
    end
  end
end
