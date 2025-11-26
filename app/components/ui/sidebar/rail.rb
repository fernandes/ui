# frozen_string_literal: true

module UI
  module Sidebar
    # Rail - Phlex implementation
    #
    # Invisible rail on the sidebar edge for drag-to-expand interaction.
    #
    # @example Basic usage
    #   render UI::Sidebar::Sidebar.new do
    #     render UI::Sidebar::Rail.new
    #     # other content...
    #   end
    class Rail < Phlex::HTML
      include UI::Sidebar::RailBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template
        all_attributes = sidebar_rail_html_attributes

        if @attributes.key?(:class)
          merged_class = TailwindMerge::Merger.new.merge([
            all_attributes[:class],
            @attributes[:class]
          ].compact.join(" "))
          all_attributes = all_attributes.merge(class: merged_class)
        end

        all_attributes = all_attributes.deep_merge(@attributes.except(:class))

        button(**all_attributes)
      end
    end
  end
end
