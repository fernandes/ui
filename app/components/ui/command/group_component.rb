# frozen_string_literal: true

module UI
  module Command
    class GroupComponent < ViewComponent::Base
      include GroupBehavior

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
  end
end
