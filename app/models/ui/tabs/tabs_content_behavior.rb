# frozen_string_literal: true

module UI
  module Tabs
    # Shared behavior for TabsContent component
    # Panel displaying content for active tab
    module TabsContentBehavior
      # Determine initial state based on value
      def content_state
        if @value == @default_value
          "active"
        else
          "inactive"
        end
      end

      # Build complete HTML attributes hash for content
      def content_html_attributes
        base_attrs = @attributes&.except(:data) || {}
        user_data = @attributes&.fetch(:data, {}) || {}

        content_data = {
          ui__tabs_target: "content",
          value: @value
        }.merge(user_data)

        base_attrs.merge(
          class: "flex-1 outline-none #{@classes}".strip,
          id: "tabs-content-#{@value}",
          role: "tabpanel",
          "aria-labelledby": "tabs-trigger-#{@value}",
          "data-state": content_state,
          "data-orientation": @orientation || "horizontal",
          "data-slot": "tabs-content",
          tabindex: "0",
          hidden: content_state == "inactive",
          data: content_data
        )
      end
    end
  end
end
