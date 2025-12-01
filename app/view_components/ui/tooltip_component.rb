# frozen_string_literal: true

# TooltipComponent - ViewComponent implementation
#
# Root container for tooltip. Manages tooltip state via Stimulus controller.
class UI::TooltipComponent < ViewComponent::Base
  include UI::TooltipBehavior

  # @param attributes [Hash] Additional HTML attributes
  def initialize(**attributes)
    @attributes = attributes
  end

  def call
    content_tag :div, **tooltip_html_attributes.merge(@attributes.except(:data)) do
      content
    end
  end
end
