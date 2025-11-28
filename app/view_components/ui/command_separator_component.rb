# frozen_string_literal: true

    class UI::CommandSeparatorComponent < ViewComponent::Base
      include UI::CommandSeparatorBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag(:div, nil, **command_separator_html_attributes.deep_merge(@attributes))
      end
    end
