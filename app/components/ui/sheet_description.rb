# frozen_string_literal: true

class UI::SheetDescription < Phlex::HTML
  # @param classes [String] Additional CSS classes
  # @param attributes [Hash] Additional HTML attributes (an `id` is kept)
  def initialize(classes: nil, **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    # The description target lets ui--dialog wire aria-describedby
    data = @attributes.fetch(:data, {}).merge(ui__dialog_target: "description")
    p(**@attributes.except(:class, :data), class: description_classes, data: data) do
      yield if block_given?
    end
  end

  private

  def description_classes
    UI::ClassMerger.merge([
      "text-muted-foreground text-sm",
      @classes
    ].compact.join(" "))
  end
end
