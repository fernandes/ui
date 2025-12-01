# frozen_string_literal: true

# ContentComponent - ViewComponent implementation
class UI::ContextMenuContentComponent < ViewComponent::Base
  include UI::ContextMenuContentBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    attrs = context_menu_content_html_attributes
    attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))

    content_tag :div, **attrs.merge(@attributes.except(:data)) do
      content
    end
  end
end
