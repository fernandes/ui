# frozen_string_literal: true

class UI::TableHeader < Phlex::HTML
  include UI::TableHeaderBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    thead(**header_html_attributes.deep_merge(@attributes)) do
      yield(self) if block_given?
    end
  end

  # DSL methods
  def row(classes: "", **attributes, &block)
    render UI::TableRow.new(classes: classes, **attributes, &block)
  end

  def head(classes: "", **attributes, &block)
    render UI::TableHead.new(classes: classes, **attributes, &block)
  end

  def cell(classes: "", **attributes, &block)
    render UI::TableCell.new(classes: classes, **attributes, &block)
  end
end
