# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Collapsible
    # CollapsibleBehavior
    #
    # Shared behavior for Collapsible root component across ERB, ViewComponent, and Phlex implementations.
    module CollapsibleBehavior
      def collapsible_html_attributes
        attrs = {
          data: collapsible_data_attributes
        }
        unless @as_child
          attrs[:class] = collapsible_classes
        end
        attrs
      end

      def collapsible_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          collapsible_base_classes,
          classes_value
        ].compact.join(" "))
      end

      def collapsible_data_attributes
        {
          controller: "ui--collapsible",
          slot: "collapsible",
          state: @open ? "open" : "closed",
          ui__collapsible_open_value: @open.to_s,
          ui__collapsible_disabled_value: @disabled.to_s
        }
      end

      private

      def collapsible_base_classes
        "group/collapsible"
      end
    end
  end
end
