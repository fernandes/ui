# frozen_string_literal: true

    # Menubar - Phlex implementation
    #
    # Container for horizontal menu bar with Stimulus controller for interactivity.
    # Uses MenubarBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::Menubar.new do
    #     render UI::Menu.new do
    #       render UI::Trigger.new(first: true) { "File" }
    #       render UI::Content.new do
    #         render UI::Item.new { "New Tab" }
    #       end
    #     end
    #   end
    class UI::Menubar < Phlex::HTML
      include UI::MenubarBehavior

      # @param loop [Boolean] Enable loop navigation
      # @param aria_label [String] Accessible label for the menubar
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(loop: false, aria_label: nil, classes: "", **attributes)
        @loop = loop
        @aria_label = aria_label
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**menubar_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
