# frozen_string_literal: true

class UI::TableHead < Phlex::HTML
  include UI::TableHeadBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    th(**head_html_attributes.deep_merge(@attributes)) do
      yield if block_given?
    end
  end
end
