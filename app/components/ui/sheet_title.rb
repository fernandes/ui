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
    TailwindMerge::Merger.new.merge([
      "text-foreground font-semibold",
      @classes
    ].compact.join(" "))
  end
end
