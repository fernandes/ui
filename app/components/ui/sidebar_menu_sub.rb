# frozen_string_literal: true

    # MenuSub - Phlex implementation
    #
    # Nested submenu container for hierarchical navigation.
    # Typically used inside a collapsible menu item.
    #
    # @example Basic usage with collapsible
    #   render UI::Collapsible.new(open: true, as_child: true) do |collapsible_attrs|
    #     render UI::MenuItem.new(**collapsible_attrs) do
    #       render UI::CollapsibleTrigger.new(as_child: true) do |trigger_attrs|
    #         render UI::MenuButton.new(**trigger_attrs) do
    #           render UI::Icon.new(name: "folder")
    #           span { "Documents" }
    #           render UI::Icon.new(name: "chevron-right", class: "ml-auto transition-transform group-data-[state=open]:rotate-90")
    #         end
    #       end
    #       render UI::CollapsibleContent.new do
    #         render UI::MenuSub.new do
    #           render UI::MenuSubItem.new do
    #             render UI::MenuSubButton.new { "Report.pdf" }
    #           end
    #         end
    #       end
    #     end
    #   end
    class UI::SidebarMenuSub < Phlex::HTML
      include UI::SidebarMenuSubBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        all_attributes = sidebar_menu_sub_html_attributes

        if @attributes.key?(:class)
          merged_class = TailwindMerge::Merger.new.merge([
            all_attributes[:class],
            @attributes[:class]
          ].compact.join(" "))
          all_attributes = all_attributes.merge(class: merged_class)
        end

        all_attributes = all_attributes.deep_merge(@attributes.except(:class))

        ul(**all_attributes, &block)
      end
    end
