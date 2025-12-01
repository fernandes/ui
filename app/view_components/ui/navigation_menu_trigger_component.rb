# frozen_string_literal: true

# TriggerComponent - ViewComponent implementation
#
# Button that toggles the navigation menu content.
# Includes an animated chevron icon.
class UI::NavigationMenuTriggerComponent < ViewComponent::Base
  include UI::TriggerBehavior

  # @param first [Boolean] Whether this is the first trigger (gets tabindex=0)
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(first: false, classes: "", **attributes)
    @first = first
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :button, **navigation_menu_trigger_html_attributes.deep_merge(@attributes) do
      safe_join([
        content,
        chevron_icon
      ])
    end
  end

  private

  def chevron_icon
    content_tag :svg, xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      class: navigation_menu_trigger_chevron_classes,
      "aria-hidden": "true" do
      content_tag :path, nil, d: "m6 9 6 6 6-6"
    end
  end
end
