# frozen_string_literal: true

# Sheet description component (ViewComponent)
#
# @example
#   <%= render UI::DescriptionComponent.new { "Make changes to your profile here." } %>
class UI::SheetDescriptionComponent < ViewComponent::Base
  # @param classes [String] additional CSS classes
  # @param attributes [Hash] additional HTML attributes (an `id` is kept)
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    # The description target lets ui--dialog wire aria-describedby
    data = @attributes.fetch(:data, {}).merge(ui__dialog_target: "description")
    content_tag :p, content, **@attributes.except(:class, :data), class: description_classes, data: data
  end

  private

  def description_classes
    UI::ClassMerger.merge([
      "text-muted-foreground text-sm",
      @classes
    ].compact.join(" "))
  end
end
