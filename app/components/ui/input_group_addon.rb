# frozen_string_literal: true

    # Addon - Phlex implementation
    #
    # An addon element for input groups that can contain text, icons, or other elements.
    # Uses InputGroupAddonBehavior concern for shared styling logic.
    #
    # @example Text addon
    #   render UI::Addon.new(align: "inline-start") { "@" }
    #
    # @example Button addon
    #   render UI::Addon.new(align: "inline-end") do
    #     render UI::Button.new { "Submit" }
    #   end
    class UI::InputGroupAddon < Phlex::HTML
      include UI::InputGroupAddonBehavior

      # @param align [String] Alignment position: "inline-start", "inline-end", "block-start", "block-end"
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(align: "inline-start", classes: "", **attributes)
        @align = align
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**input_group_addon_html_attributes) do
          yield if block_given?
        end
      end
    end
