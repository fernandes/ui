# frozen_string_literal: true

# Sheet title component (ViewComponent)
#
# @example
#   <%= render UI::TitleComponent.new { "Edit Profile" } %>
class UI::SheetTitleComponent < ViewComponent::Base
  # @param classes [String] additional CSS classes
  # @param attributes [Hash] additional HTML attributes (an `id` is kept)
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    # The title target lets ui--dialog wire aria-labelledby
    data = @attributes.fetch(:data, {}).merge(ui__dialog_target: "title")
    content_tag :h2, content, **@attributes.except(:class, :data), class: title_classes, data: data
  end

  private

  def title_classes
    UI::ClassMerger.merge([
      "text-foreground font-semibold",
      @classes
    ].compact.join(" "))
  end
end
