# frozen_string_literal: true

    # Content - Phlex implementation
    #
    # Scrollable content area in the middle of the sidebar.
    #
    # @example Basic usage
    #   render UI::Content.new do
    #     render UI::Group.new { ... }
    #   end
    class UI::SidebarContent < Phlex::HTML
      include UI::SidebarContentBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        all_attributes = sidebar_content_html_attributes

        if @attributes.key?(:class)
          merged_class = TailwindMerge::Merger.new.merge([
            all_attributes[:class],
            @attributes[:class]
          ].compact.join(" "))
          all_attributes = all_attributes.merge(class: merged_class)
        end

        all_attributes = all_attributes.deep_merge(@attributes.except(:class))

        div(**all_attributes, &block)
      end
    end
