# frozen_string_literal: true

module UI
  module Drawer
    class Trigger < Phlex::HTML
      include UI::Shared::AsChildBehavior
      include UI::Drawer::DrawerTriggerBehavior

      # @param as_child [Boolean] When true, yields attributes to block instead of rendering button
      # @param attributes [Hash] Additional HTML attributes
      def initialize(as_child: false, **attributes)
        @as_child = as_child
        @attributes = attributes
      end

      def view_template(&block)
        if @as_child
          # Yield attributes to block - child must accept and use them
          yield(drawer_trigger_html_attributes) if block_given?
        else
          # Default: render as button
          button(**drawer_trigger_html_attributes, &block)
        end
      end
    end
  end
end
