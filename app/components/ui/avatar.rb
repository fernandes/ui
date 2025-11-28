# frozen_string_literal: true

    # Avatar - Phlex implementation
    #
    # Displays an image element with a fallback for representing users.
    # Uses AvatarBehavior module for shared styling logic.
    #
    # Based on shadcn/ui Avatar: https://ui.shadcn.com/docs/components/avatar
    # Based on Radix UI Avatar: https://www.radix-ui.com/primitives/docs/components/avatar
    #
    # @example Basic usage
    #   render UI::Avatar.new do
    #     render UI::Image.new(src: "https://github.com/shadcn.png", alt: "User")
    #     render UI::Fallback.new { "CN" }
    #   end
    class UI::Avatar < Phlex::HTML
      include UI::AvatarBehavior

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
