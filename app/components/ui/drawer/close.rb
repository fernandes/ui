# frozen_string_literal: true

module UI
  module Drawer
    class Close < Phlex::HTML
      include UI::Drawer::DrawerCloseBehavior

      def initialize(variant: :outline, size: :default, classes: nil, **attributes)
        @variant = variant
        @size = size
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        render UI::Button::Button.new(
          variant: @variant,
          size: @size,
          classes: @classes,
          **drawer_close_data_attributes.merge(@attributes)
        ) do
          yield if block_given?
        end
      end
    end
  end
end
