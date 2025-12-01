# frozen_string_literal: true

# Link - Phlex implementation
#
# Navigation link component. Supports asChild pattern for composition with link_to.
#
# @example Basic usage
#   render UI::Link.new(href: "/docs") { "Documentation" }
#
# @example With asChild for Rails link_to
#   render UI::Link.new(as_child: true) do |link_attrs|
#     link_to "Documentation", docs_path, **link_attrs
#   end
#
# @example Active link
#   render UI::Link.new(href: "/docs", active: true) { "Documentation" }
#
# @example As trigger style (for direct links without dropdown)
#   render UI::Link.new(as_child: true, trigger_style: true) do |link_attrs|
#     link_to "About", about_path, **link_attrs
#   end
class UI::NavigationMenuLink < Phlex::HTML
  include UI::LinkBehavior
  include UI::SharedAsChildBehavior

  # @param href [String] URL for the link (ignored when as_child: true)
  # @param active [Boolean] Whether this link is currently active
  # @param as_child [Boolean] When true, yields attributes to block instead of rendering anchor
  # @param trigger_style [Boolean] When true, uses trigger styling (for direct links)
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(href: nil, active: false, as_child: false, trigger_style: false, classes: "", **attributes)
    @href = href
    @active = active
    @as_child = as_child
    @trigger_style = trigger_style
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    link_attrs = build_link_attributes

    if @as_child
      # Yield attributes to block - child must accept them
      yield(link_attrs) if block_given?
    else
      # Default: render as anchor
      a(**link_attrs) do
        yield if block_given?
      end
    end
  end

  private

  def build_link_attributes
    base_attrs = navigation_menu_link_html_attributes

    # Override classes if trigger_style is true
    if @trigger_style
      base_attrs[:class] = TailwindMerge::Merger.new.merge([
        navigation_menu_link_trigger_style_classes,
        @classes
      ].compact.join(" "))
    end

    base_attrs.deep_merge(@attributes)
  end
end
