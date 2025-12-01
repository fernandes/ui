# frozen_string_literal: true

# TriggerComponent - ViewComponent implementation
class UI::ContextMenuTriggerComponent < ViewComponent::Base
  include UI::ContextMenuTriggerBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    attrs = context_menu_trigger_html_attributes
    attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))

    content_tag :div, **attrs.merge(@attributes.except(:data)) do
      content
    end
  end
end
