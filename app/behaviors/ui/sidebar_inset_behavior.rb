# frozen_string_literal: true

require "tailwind_merge"

    # SidebarInsetBehavior
    #
    # Shared behavior for SidebarInset component.
    # The SidebarInset is the main content area that sits alongside the sidebar.
    module UI::SidebarInsetBehavior
      def sidebar_inset_html_attributes
        {
          class: sidebar_inset_classes,
          data: sidebar_inset_data_attributes
        }
      end

      def sidebar_inset_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          sidebar_inset_base_classes,
          classes_value
        ].compact.join(" "))
      end

      def sidebar_inset_data_attributes
        {
          slot: "sidebar-inset"
        }
      end

      private

      def sidebar_inset_base_classes
        "relative flex min-h-svh flex-1 flex-col bg-background " \
        "peer-data-[variant=inset]:min-h-[calc(100svh-calc(var(--spacing)*4))] " \
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 " \
        "md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow"
      end
    end
