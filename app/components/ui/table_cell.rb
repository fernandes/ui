# frozen_string_literal: true

class UI::TableCell < Phlex::HTML
  include UI::TableCellBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    td(**cell_html_attributes.deep_merge(@attributes)) do
      yield if block_given?
    end
  end
end
