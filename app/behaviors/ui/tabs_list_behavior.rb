# frozen_string_literal: true

    # Shared behavior for TabsList component
    # Container for tab triggers
    module UI::TabsListBehavior
      # Build complete HTML attributes hash for tabs list
      def list_html_attributes
        base_attrs = @attributes&.except(:data) || {}
        user_data = @attributes&.fetch(:data, {}) || {}

        base_attrs.merge(
          class: "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px] #{@classes}".strip,
          "data-orientation": @orientation || "horizontal",
          "data-slot": "tabs-list",
          role: "tablist",
          "aria-orientation": @orientation || "horizontal",
          data: user_data
        )
      end
    end
