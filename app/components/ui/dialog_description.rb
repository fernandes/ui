# frozen_string_literal: true

class UI::DialogDescription < Phlex::HTML
  def initialize(classes: nil)
    @classes = classes
  end

  def view_template(&block)
    p(class: description_classes) do
      yield if block_given?
    end
  end

  private

  def description_classes
    TailwindMerge::Merger.new.merge([
      "text-muted-foreground text-sm",
      @classes
    ].compact.join(" "))
  end
end
