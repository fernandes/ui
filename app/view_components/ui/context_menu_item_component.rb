# frozen_string_literal: true

# ItemComponent - ViewComponent implementation
class UI::ContextMenuItemComponent < ViewComponent::Base
  include UI::ContextMenuItemBehavior

  def initialize(href: nil, inset: false, variant: "default", classes: "", **attributes)
    @href = href
    @inset = inset
    @variant = variant
    @classes = classes
    @attributes = attributes
  end

  def call
    attrs = context_menu_item_html_attributes
    attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))

    if @href
      content_tag :a, **attrs.merge(@attributes.except(:data)) do
        content
      end
    else
      content_tag :div, **attrs.merge(@attributes.except(:data)) do
        content
      end
    end
  end
end
