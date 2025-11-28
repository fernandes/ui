# frozen_string_literal: true

    # Shared behavior for Pagination Link component
    # Handles link styling and active state
    module UI::PaginationLinkBehavior
      # Base CSS classes for pagination link (from button component)
      def link_base_classes
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
      end

      # Variant classes based on active state
      def link_variant_classes
        if @active
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        else
          "hover:bg-accent hover:text-accent-foreground"
        end
      end

      # Size classes for pagination link
      def link_size_classes
        case @size.to_s
        when "icon"
          "size-9"
        when "default"
          "h-9 px-4 py-2"
        when "sm"
          "h-8 px-3 text-xs"
        when "lg"
          "h-10 px-8"
        else
          "size-9"
        end
      end

      # Merge all classes using TailwindMerge
      def link_classes
        TailwindMerge::Merger.new.merge([
          link_base_classes,
          link_variant_classes,
          link_size_classes,
          @classes
        ].compact.join(" "))
      end

      # Build complete HTML attributes hash for pagination link
      def link_html_attributes
        base_attrs = @attributes&.except(:data) || {}
        base_attrs.merge(
          href: @href,
          "data-slot": "pagination-link",
          "data-active": @active ? "true" : nil,
          "aria-current": @active ? "page" : nil,
          class: link_classes
        ).compact
      end
    end
