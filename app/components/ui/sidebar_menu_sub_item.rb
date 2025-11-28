# frozen_string_literal: true

    # MenuSubItem - Phlex implementation
    #
    # List item container for a sidebar submenu entry.
    #
    # @example Basic usage
    #   render UI::MenuSubItem.new do
    #     render UI::MenuSubButton.new { "Sub Item" }
    #   end
    class UI::SidebarMenuSubItem < Phlex::HTML
      include UI::SidebarMenuSubItemBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        all_attributes = sidebar_menu_sub_item_html_attributes

        if @attributes.key?(:class)
          merged_class = TailwindMerge::Merger.new.merge([
            all_attributes[:class],
            @attributes[:class]
          ].compact.join(" "))
          all_attributes = all_attributes.merge(class: merged_class)
        end

        all_attributes = all_attributes.deep_merge(@attributes.except(:class))

        li(**all_attributes, &block)
      end
    end
