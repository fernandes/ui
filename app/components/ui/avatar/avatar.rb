# frozen_string_literal: true

module UI
  module Avatar
    # Avatar - Phlex implementation
    #
    # Displays an image element with a fallback for representing users.
    # Uses AvatarBehavior module for shared styling logic.
    #
    # Based on shadcn/ui Avatar: https://ui.shadcn.com/docs/components/avatar
    # Based on Radix UI Avatar: https://www.radix-ui.com/primitives/docs/components/avatar
    #
    # @example Basic usage
    #   render UI::Avatar::Avatar.new do
    #     render UI::Avatar::Image.new(src: "https://github.com/shadcn.png", alt: "User")
    #     render UI::Avatar::Fallback.new { "CN" }
    #   end
    class Avatar < Phlex::HTML
      include UI::Avatar::AvatarBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        span(**avatar_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
