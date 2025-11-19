# frozen_string_literal: true

module UI
  module Badge
    # BadgeBehavior
    #
    # Shared behavior for Badge component across ERB, ViewComponent, and Phlex implementations.
    # This module provides consistent variant styling and HTML attribute generation.
    #
    # Based on shadcn/ui Badge: https://ui.shadcn.com/docs/components/badge
    module BadgeBehavior
      # Returns HTML attributes for the badge element
      def badge_html_attributes
        {
          class: badge_classes,
          data: { slot: "badge" }
        }
      end

      # Returns combined CSS classes for the badge
      def badge_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          badge_base_classes,
          badge_variant_classes,
          classes_value
        ].compact.join(" "))
      end

      private

      # Base classes applied to all badges
      # Matches shadcn/ui v4 exactly
      def badge_base_classes
        "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden"
      end

      # Variant-specific classes based on @variant
      # Matches shadcn/ui v4 variants exactly
      def badge_variant_classes
        case @variant.to_s
        when "secondary"
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90"
        when "destructive"
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
        when "outline"
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
        else # default
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90"
        end
      end
    end
  end
end
