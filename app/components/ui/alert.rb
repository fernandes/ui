# frozen_string_literal: true

    # Alert - Phlex implementation
    #
    # A callout component for displaying important information to users.
    # Uses AlertBehavior module for shared styling logic.
    #
    # @example Basic usage
    #   render UI::Alert.new do
    #     svg class: "lucide lucide-circle-check" # Your icon here
    #     render UI::Title.new { "Success" }
    #     render UI::Description.new { "Your changes have been saved." }
    #   end
    class UI::Alert < Phlex::HTML
      include UI::AlertBehavior

      # @param variant [Symbol] Visual style variant (:default, :destructive)
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(variant: :default, classes: "", **attributes)
        @variant = variant
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**alert_html_attributes) do
          yield if block_given?
        end
      end
    end
