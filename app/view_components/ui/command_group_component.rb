# frozen_string_literal: true

    class UI::CommandGroupComponent < ViewComponent::Base
      include UI::CommandGroupBehavior

      def initialize(heading: nil, classes: "", **attributes)
        @heading = heading
        @heading_id = "command-group-#{SecureRandom.hex(4)}" if heading
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag(:div, **command_group_html_attributes.deep_merge(@attributes)) do
          safe_join([
            (@heading ? content_tag(:div, @heading, class: command_group_heading_classes, id: @heading_id) : nil),
            content
          ].compact)
        end
      end
    end
