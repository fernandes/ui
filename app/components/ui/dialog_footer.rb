# frozen_string_literal: true

class UI::DialogFooter < Phlex::HTML
  include UI::DialogFooterBehavior

  def initialize(classes: nil)
    @classes = classes
  end

  def view_template(&block)
    div(**dialog_footer_html_attributes) do
      yield if block_given?
    end
  end
end
