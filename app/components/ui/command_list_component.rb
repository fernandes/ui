# frozen_string_literal: true

    class UI::CommandListComponent < ViewComponent::Base
      include UI::CommandListBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag(:div, content, **command_list_html_attributes.deep_merge(@attributes))
      end
    end
