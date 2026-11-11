# frozen_string_literal: true

class UI::SheetTitle < Phlex::HTML
  # @param classes [String] Additional CSS classes
  # @param attributes [Hash] Additional HTML attributes (an `id` is kept)
  def initialize(classes: nil, **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    # The title target lets ui--dialog wire aria-labelledby
    data = @attributes.fetch(:data, {}).merge(ui__dialog_target: "title")
    h2(**@attributes.except(:class, :data), class: title_classes, data: data) do
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
