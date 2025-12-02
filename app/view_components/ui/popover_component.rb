# frozen_string_literal: true

# PopoverComponent - ViewComponent implementation
#
# Container for popover trigger and content.
# Uses PopoverBehavior concern for shared styling logic.
#
# Supports asChild pattern for composition without wrapper elements.
#
# @example Basic usage
#   <%= render UI::PopoverComponent.new do %>
#     <%= render UI::TriggerComponent.new do %>
#       <button>Click me</button>
#     <% end %>
#     <%= render UI::ContentComponent.new do %>
#       Popover content
#     <% end %>
#   <% end %>
#
# @example With asChild - pass attributes to custom element
#   <%= render UI::PopoverComponent.new(as_child: true) do |popover| %>
#     <%= render UI::InputGroupAddonComponent.new(**popover.popover_attrs) do %>
#       <%= render UI::PopoverTriggerComponent.new(as_child: true) do |trigger| %>
#         <%= render UI::InputGroupButtonComponent.new(**trigger.trigger_attrs) { "Info" } %>
#       <% end %>
#       <%= render UI::PopoverContentComponent.new { "Content" } %>
#     <% end %>
#   <% end %>
class UI::PopoverComponent < ViewComponent::Base
  include UI::PopoverBehavior

  # @param as_child [Boolean] When true, yields self to block for attribute access
  # @param placement [String] Placement of the popover (e.g., "bottom", "top-start")
  # @param offset [Integer] Distance in pixels from the trigger
  # @param trigger [String] Trigger type ("click" or "hover")
  # @param hover_delay [Integer] Delay in milliseconds for hover trigger
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(
    as_child: false,
    placement: "bottom",
    offset: 4,
    trigger: "click",
    hover_delay: 200,
    classes: "",
    align: nil,
    side_offset: nil,
    **attributes
  )
    @as_child = as_child
    @placement = placement
    @offset = side_offset || offset
    @trigger = trigger
    @hover_delay = hover_delay
    @classes = classes
    @align = align
    @attributes = attributes
  end

  # Returns popover attributes for as_child mode
  def popover_attrs
    popover_html_attributes.deep_merge(@attributes)
  end

  def call
    if @as_child
      # asChild mode: yield self to block, child accesses popover_attrs
      content
    else
      # Default: render wrapper div with controller
      content_tag :div, **popover_html_attributes do
        content
      end
    end
  end
end
