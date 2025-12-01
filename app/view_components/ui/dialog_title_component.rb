# frozen_string_literal: true

# Dialog title component (ViewComponent)
# Title heading for the dialog
#
# @example
#   <%= render UI::TitleComponent.new { "Dialog Title" } %>
class UI::DialogTitleComponent < ViewComponent::Base
  # @param classes [String] additional CSS classes
  def initialize(classes: "")
    @classes = classes
  end

  def call
    content_tag :h2, content, class: title_classes
  end

  private

  def title_classes
    TailwindMerge::Merger.new.merge([
      "text-lg font-semibold",
      @classes
    ].compact.join(" "))
  end
end
