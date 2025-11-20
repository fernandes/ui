module UI
  module ApplicationHelper
    # Render a Lucide icon
    # @param name [String, Symbol] Icon name (e.g. :check, 'chevron-right')
    # @param options [Hash] HTML attributes to add to the SVG element
    # @return [String] SVG markup for the icon
    #
    # @example Basic usage
    #   lucide_icon(:check)
    #
    # @example With custom classes
    #   lucide_icon(:check, class: "size-4")
    #
    # @example With multiple attributes
    #   lucide_icon("chevron-right", class: "ml-auto h-4 w-4")
    def ui_lucide_icon(name, options = {})
      lucide_icon(name.to_s, options)
    end
  end
end
