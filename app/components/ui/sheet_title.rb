# frozen_string_literal: true

class UI::SheetTitle < Phlex::HTML
  def initialize(classes: nil)
    @classes = classes
  end

  def view_template(&block)
    h2(class: title_classes) do
      yield if block_given?
    end
  end

  private

  def title_classes
    UI::ClassMerger.merge([
      "text-foreground font-semibold",
      @classes
    ].compact.join(" "))
  end
end
