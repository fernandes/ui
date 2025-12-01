# frozen_string_literal: true

class UI::ItemSeparator < Phlex::HTML
  include UI::ItemSeparatorBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    hr(**item_separator_html_attributes, &block)
  end
end
