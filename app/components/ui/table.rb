# frozen_string_literal: true

class UI::Table < Phlex::HTML
  include UI::TableBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    table(**table_html_attributes.deep_merge(@attributes)) do
      yield(self) if block_given?
    end
  end

  # DSL methods
  def header(classes: "", **attributes, &block)
    render UI::TableHeader.new(classes: classes, **attributes, &block)
  end

  def body(classes: "", **attributes, &block)
    render UI::TableBody.new(classes: classes, **attributes, &block)
  end

  def footer(classes: "", **attributes, &block)
    render UI::TableFooter.new(classes: classes, **attributes, &block)
  end

  def caption(classes: "", **attributes, &block)
    render UI::TableCaption.new(classes: classes, **attributes, &block)
  end

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
