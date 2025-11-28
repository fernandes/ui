# frozen_string_literal: true

    # Menu - Phlex implementation
    #
    # List container for sidebar menu items.
    #
    # @example Basic usage
    #   render UI::Menu.new do
    #     render UI::MenuItem.new do
    #       render UI::MenuButton.new do
    #         render UI::Icon.new(name: "home")
    #         plain "Home"
    #       end
    #     end
    #   end
    class UI::SidebarMenu < Phlex::HTML
      include UI::SidebarMenuBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        all_attributes = sidebar_menu_html_attributes

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
