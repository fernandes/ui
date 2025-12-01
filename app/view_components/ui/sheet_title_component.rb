# frozen_string_literal: true

# Sheet title component (ViewComponent)
#
# @example
#   <%= render UI::TitleComponent.new { "Edit Profile" } %>
class UI::SheetTitleComponent < ViewComponent::Base
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
      "text-foreground font-semibold",
      @classes
    ].compact.join(" "))
  end
end
