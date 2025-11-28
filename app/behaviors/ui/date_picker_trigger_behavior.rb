# frozen_string_literal: true

    # Shared behavior for DatePicker trigger component (button)
    module UI::DatePickerTriggerBehavior
      # Generate data attributes for trigger
      def date_picker_trigger_data_attributes
        {
          ui__datepicker_target: "trigger",
          ui__popover_target: "trigger"
        }
      end

      # Build complete HTML attributes hash for trigger
      def date_picker_trigger_html_attributes
        base_attrs = @attributes&.except(:data) || {}
        user_data = @attributes&.fetch(:data, {}) || {}
        base_attrs.merge(
          class: date_picker_trigger_classes,
          type: "button",
          data: user_data.merge(date_picker_trigger_data_attributes)
        )
      end

      # Trigger classes - button with outline variant style
      def date_picker_trigger_classes
        TailwindMerge::Merger.new.merge([
          # Button base styles
          "inline-flex items-center justify-between gap-2 whitespace-nowrap rounded-md text-sm font-medium",
          "ring-offset-background transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          # Outline variant
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          # Size default
          "h-10 px-4 py-2",
          # Width
          "w-[280px]",
          @classes
        ].compact.join(" "))
      end

      # ChevronDown icon SVG
      def chevron_down_icon
        <<~SVG.html_safe
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 opacity-50">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        SVG
      end

      # Calendar icon SVG
      def calendar_icon
        <<~SVG.html_safe
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 opacity-50">
            <path d="M8 2v4"/>
            <path d="M16 2v4"/>
            <rect width="18" height="18" x="3" y="4" rx="2"/>
            <path d="M3 10h18"/>
          </svg>
        SVG
      end
    end
