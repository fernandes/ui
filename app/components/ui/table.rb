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
    render Header.new(classes: classes, **attributes, &block)
  end

  def body(classes: "", **attributes, &block)
    render Body.new(classes: classes, **attributes, &block)
  end

  def footer(classes: "", **attributes, &block)
    render Footer.new(classes: classes, **attributes, &block)
  end

  def caption(classes: "", **attributes, &block)
    render Caption.new(classes: classes, **attributes, &block)
  end

  def row(classes: "", **attributes, &block)
    render Row.new(classes: classes, **attributes, &block)
  end

  def head(classes: "", **attributes, &block)
    render Head.new(classes: classes, **attributes, &block)
  end

  def cell(classes: "", **attributes, &block)
    render Cell.new(classes: classes, **attributes, &block)
  end
end
