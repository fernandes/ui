# frozen_string_literal: true

module UI
  module Sonner
    # Sonner Toaster component (Phlex)
    # Container for toast notifications - render once in your layout
    #
    # @example Basic usage
    #   <%= render UI::Sonner::Toaster.new %>
    #
    # @example With options
    #   <%= render UI::Sonner::Toaster.new(
    #     position: "top-center",
    #     theme: "dark",
    #     rich_colors: true,
    #     close_button: true
    #   ) %>
    class Toaster < Phlex::HTML
      include UI::Sonner::ToasterBehavior

      # @param position [String] Toast position (top-left, top-center, top-right, bottom-left, bottom-center, bottom-right)
      # @param theme [String] Theme (light, dark, system)
      # @param rich_colors [Boolean] Use rich colors for toast types
      # @param expand [Boolean] Expand toasts on hover
      # @param duration [Integer] Default toast duration in milliseconds
      # @param close_button [Boolean] Show close button on toasts
      # @param visible_toasts [Integer] Maximum number of visible toasts
      # @param classes [String] Additional CSS classes
      # @param attributes [Hash] Additional HTML attributes
      def initialize(
        position: "bottom-right",
        theme: "system",
        rich_colors: false,
        expand: false,
        duration: 4000,
        close_button: false,
        visible_toasts: 3,
        classes: "",
        **attributes
      )
        @position = position
        @theme = theme
        @rich_colors = rich_colors
        @expand = expand
        @duration = duration
        @close_button = close_button
        @visible_toasts = visible_toasts
        @classes = classes
        @attributes = attributes
      end

      def view_template
        ol(**toaster_html_attributes)
      end
    end
  end
end
