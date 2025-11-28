# frozen_string_literal: true

    class UI::CollapsibleTriggerComponent < ViewComponent::Base
      include UI::CollapsibleTriggerBehavior

      def initialize(as_child: false, classes: "", **attributes)
        @as_child = as_child
        @classes = classes
        @attributes = attributes
      end

      def call
        trigger_attrs = collapsible_trigger_html_attributes.deep_merge(@attributes)

        if @as_child
          content
        else
          content_tag(:button, content, type: "button", **trigger_attrs)
        end
      end
    end
