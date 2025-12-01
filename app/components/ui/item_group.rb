# frozen_string_literal: true

class UI::ItemGroup < Phlex::HTML
  include UI::ItemGroupBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**item_group_html_attributes, &block)
  end
end
