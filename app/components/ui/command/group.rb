# frozen_string_literal: true

module UI
  module Command
    class Group < Phlex::HTML
      include GroupBehavior

      def initialize(heading: nil, classes: "", **attributes)
        @heading = heading
        @heading_id = "command-group-#{SecureRandom.hex(4)}" if heading
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**command_group_html_attributes.deep_merge(@attributes)) do
          if @heading
            div(class: command_group_heading_classes, id: @heading_id) { @heading }
          end
          yield if block_given?
        end
      end
    end
  end
end
