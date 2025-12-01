# frozen_string_literal: true

# BreadcrumbLinkComponent - ViewComponent implementation
#
# Clickable breadcrumb link for navigation.
# Uses BreadcrumbLinkBehavior concern for shared styling logic.
#
# @example Basic usage
#   <%= render UI::BreadcrumbLinkComponent.new(href: "/") do %>
#     Home
#   <% end %>
class UI::BreadcrumbLinkComponent < ViewComponent::Base
  include UI::BreadcrumbLinkBehavior

  # @param href [String] URL for the link
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(href: "#", classes: "", **attributes)
    @href = href
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :a, **breadcrumb_link_html_attributes do
      content
    end
  end
end
