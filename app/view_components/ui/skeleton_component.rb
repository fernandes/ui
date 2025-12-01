# frozen_string_literal: true

class UI::SkeletonComponent < ViewComponent::Base
  def initialize(**attributes)
    @attributes = attributes
  end

  def call
    attrs = component_html_attributes.deep_merge(@attributes)

    # Merge Tailwind classes intelligently
    attrs[:class] = TailwindMerge::Merger.new.merge([
      component_html_attributes[:class],
      @attributes[:class]
    ].compact.join(" "))

    content_tag :div, "", **attrs
  end

  private

  def component_html_attributes
    {
      data: {
        slot: "skeleton"
      },
      class: "bg-accent animate-pulse rounded-md"
    }
  end
end
