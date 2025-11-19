# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Shared
    # AsChildBehavior provides the `asChild` composition pattern
    # Inspired by Radix UI's Slot component
    #
    # When `as_child: true`, components don't render their own wrapper element.
    # Instead, they yield attributes to the block, allowing the child to receive them.
    #
    # Example:
    #   render UI::Dialog::Trigger.new(as_child: true) do |attrs|
    #     render UI::Button::Button.new(**attrs, variant: :outline) do
    #       "Open"
    #     end
    #   end
    module AsChildBehavior
      # Merges parent component attributes with child component attributes
      #
      # Uses Rails' deep_merge for nested hashes (like data attributes)
      # Uses TailwindMerge for CSS classes to resolve conflicts
      # Concatenates Stimulus actions so both handlers execute
      #
      # @param parent_attrs [Hash] Attributes from parent component
      # @param child_attrs [Hash] Attributes from child element
      # @return [Hash] Merged attributes hash
      #
      # @example Basic merge
      #   merge_attributes(
      #     { class: "p-4", data: { controller: "dialog" } },
      #     { class: "p-2", data: { testid: "button" } }
      #   )
      #   # => { class: "p-2", data: { controller: "dialog", testid: "button" } }
      #
      # @example Stimulus actions concatenation
      #   merge_attributes(
      #     { data: { action: "click->dialog#open" } },
      #     { data: { action: "click->analytics#track" } }
      #   )
      #   # => { data: { action: "click->dialog#open click->analytics#track" } }
      def merge_attributes(parent_attrs, child_attrs)
        # Use Rails' deep_merge for automatic nested hash merging
        merged = parent_attrs.deep_merge(child_attrs)

        # CSS Classes: Use TailwindMerge to resolve conflicts intelligently
        # Example: "p-4 text-sm" + "p-2 text-lg" => "p-2 text-lg"
        # (later values override earlier conflicting values)
        if parent_attrs[:class] && child_attrs[:class]
          merged[:class] = TailwindMerge::Merger.new.merge(
            [parent_attrs[:class], child_attrs[:class]].join(" ")
          )
        end

        # Stimulus Actions: Concatenate so both handlers execute
        # This is critical for composition - both parent and child actions should run
        if parent_attrs.dig(:data, :action) && child_attrs.dig(:data, :action)
          merged[:data][:action] = [
            parent_attrs.dig(:data, :action),
            child_attrs.dig(:data, :action)
          ].join(" ")
        end

        # Styles: Concatenate with semicolon (if both exist)
        # Example: "padding: 8px" + "background: blue" => "padding: 8px; background: blue"
        if parent_attrs[:style] && child_attrs[:style]
          merged[:style] = "#{parent_attrs[:style]}; #{child_attrs[:style]}"
        end

        merged
      end
    end
  end
end
