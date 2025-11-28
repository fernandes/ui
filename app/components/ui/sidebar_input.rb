# frozen_string_literal: true

    # Input - Phlex implementation
    #
    # Input field styled for sidebar usage.
    # Typically used for search or filter functionality.
    #
    # @example Basic usage
    #   render UI::Input.new(placeholder: "Search...")
    #
    # @example With icon
    #   render UI::Group.new do
    #     div(class: "relative") do
    #       render UI::Icon.new(name: "search", class: "absolute left-2 top-2 size-4 text-muted-foreground")
    #       render UI::Input.new(placeholder: "Search...", class: "pl-8")
    #     end
    #   end
    class UI::SidebarInput < Phlex::HTML
      include UI::SidebarInputBehavior

      def initialize(type: "text", classes: "", **attributes)
        @type = type
        @classes = classes
        @attributes = attributes
      end

      def view_template
        all_attributes = sidebar_input_html_attributes.merge(type: @type)

        if @attributes.key?(:class)
          merged_class = TailwindMerge::Merger.new.merge([
            all_attributes[:class],
            @attributes[:class]
          ].compact.join(" "))
          all_attributes = all_attributes.merge(class: merged_class)
        end

        all_attributes = all_attributes.deep_merge(@attributes.except(:class))

        input(**all_attributes)
      end
    end
