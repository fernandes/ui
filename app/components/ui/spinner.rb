# frozen_string_literal: true

    # Spinner - Phlex implementation
    #
    # A loading indicator component using an animated spinner icon.
    # Uses SpinnerBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::Spinner.new
    #
    # @example With size
    #   render UI::Spinner.new(size: "lg")
    class UI::Spinner < Phlex::HTML
      include UI::SpinnerBehavior

      # @param size [String] Size variant (sm, default, lg, xl)
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(size: "default", classes: "", **attributes)
        @size = size
        @classes = classes
        @attributes = attributes
      end

      def view_template
        svg(
          **spinner_html_attributes.merge(@attributes),
          xmlns: "http://www.w3.org/2000/svg",
          width: "24",
          height: "24",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          stroke_width: "2",
          stroke_linecap: "round",
          stroke_linejoin: "round"
        ) do |s|
          s.path(d: "M21 12a9 9 0 1 1-6.219-8.56")
        end
      end
    end
