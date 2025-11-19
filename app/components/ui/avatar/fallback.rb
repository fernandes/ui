# frozen_string_literal: true

module UI
  module Avatar
    # Avatar Fallback - Phlex implementation
    #
    # Displays fallback content when the image hasn't loaded or fails to load.
    # Uses AvatarFallbackBehavior module for shared styling logic.
    #
    # Based on shadcn/ui Avatar: https://ui.shadcn.com/docs/components/avatar
    # Based on Radix UI Avatar: https://www.radix-ui.com/primitives/docs/components/avatar
    #
    # @example Basic usage
    #   render UI::Avatar::Fallback.new { "CN" }
    #
    # @example With custom styling
    #   render UI::Avatar::Fallback.new(classes: "bg-primary text-primary-foreground") do
    #     "AB"
    #   end
    class Fallback < Phlex::HTML
      include UI::Avatar::AvatarFallbackBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        span(**avatar_fallback_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
