# frozen_string_literal: true

# Drawer container component (ViewComponent)
# A mobile-first drawer with gesture-based drag-to-close
#
# @example Basic usage
#   <%= render UI::DrawerComponent.new(open: false) do %>
#     <%= render UI::TriggerComponent.new { "Open Drawer" } %>
#     <%= render UI::OverlayComponent.new %>
#     <%= render UI::ContentComponent.new do %>
#       <%= render UI::HeaderComponent.new do %>
#         <%= render UI::TitleComponent.new { "Drawer Title" } %>
#         <%= render UI::DescriptionComponent.new { "Drawer description" } %>
#       <% end %>
#       <!-- Content -->
#       <%= render UI::FooterComponent.new do %>
#         <%= render UI::CloseComponent.new { "Cancel" } %>
#       <% end %>
#     <% end %>
#   <% end %>
#
# @example With snap points
#   <%= render UI::DrawerComponent.new(
#     snap_points: ["148px", "355px", 1],
#     modal: false
#   ) do %>
#     <!-- Drawer content -->
#   <% end %>
class UI::DrawerComponent < ViewComponent::Base
  include UI::DrawerBehavior

  # @param open [Boolean] whether the drawer is open
  # @param direction [String] drawer position: "bottom", "top", "left", "right"
  # @param dismissible [Boolean] allow closing via drag/overlay/escape
  # @param modal [Boolean] block background interaction
  # @param snap_points [Array] snap positions (px values or 0-1)
  # @param active_snap_point [Integer] current snap point index
  # @param fade_from_index [Integer] overlay fade threshold
  # @param snap_to_sequential_point [Boolean] prevent velocity-based skip
  # @param handle_only [Boolean] restrict dragging to handle only
  # @param reposition_inputs [Boolean] reposition when keyboard appears
  # @param classes [String] additional CSS classes
  # @param attributes [Hash] additional HTML attributes
  def initialize(
    open: false,
    direction: "bottom",
    dismissible: true,
    modal: true,
    snap_points: nil,
    active_snap_point: nil,
    fade_from_index: nil,
    snap_to_sequential_point: false,
    handle_only: false,
    reposition_inputs: true,
    classes: "",
    id: nil,
    attributes: {}
  )
    @open = open
    @direction = direction
    @dismissible = dismissible
    @modal = modal
    @snap_points = snap_points
    @active_snap_point = active_snap_point
    @fade_from_index = fade_from_index
    @snap_to_sequential_point = snap_to_sequential_point
    @handle_only = handle_only
    @reposition_inputs = reposition_inputs
    @classes = classes
    @id = id
    @attributes = attributes
  end

  def call
    attrs = drawer_html_attributes
    attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))
    attrs[:id] = @id if @id

    content_tag :div, content, **attrs.merge(@attributes.except(:data))
  end
end
