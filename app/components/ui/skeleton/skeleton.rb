# frozen_string_literal: true

module UI
  module Skeleton
    # Skeleton - Phlex implementation
    #
    # A simple loading placeholder component with pulsing animation.
    # This is a CSS-only component with no JavaScript behavior.
    #
    # @example Basic usage
    #   render UI::Skeleton::Skeleton.new(class: "h-[20px] w-[100px] rounded-full")
    #
    # @example Card skeleton
    #   div(class: "flex flex-col space-y-3") do
    #     render UI::Skeleton::Skeleton.new(class: "h-[125px] w-[250px] rounded-xl")
    #     div(class: "space-y-2") do
    #       render UI::Skeleton::Skeleton.new(class: "h-4 w-[250px]")
    #       render UI::Skeleton::Skeleton.new(class: "h-4 w-[200px]")
    #     end
    #   end
    class Skeleton < Phlex::HTML
      # @param classes [String] Additional CSS classes (width, height, shape)
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template
        div(**merged_attributes)
      end

      private

      def merged_attributes
        {
          data: { slot: "skeleton" },
          class: TailwindMerge::Merger.new.merge([
            "bg-accent animate-pulse rounded-md",
            @classes
          ].compact.join(" "))
        }.deep_merge(@attributes)
      end
    end
  end
end
