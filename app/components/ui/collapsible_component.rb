# frozen_string_literal: true

    class UI::CollapsibleComponent < ViewComponent::Base
      include UI::CollapsibleBehavior

      def initialize(open: false, disabled: false, as_child: false, classes: "", **attributes)
        @open = open
        @disabled = disabled
        @as_child = as_child
        @classes = classes
        @attributes = attributes
      end

      def call
        collapsible_attrs = collapsible_html_attributes.deep_merge(@attributes)

        if @as_child
          content
        else
          content_tag(:div, content, **collapsible_attrs)
        end
      end
    end
