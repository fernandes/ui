# frozen_string_literal: true

# Badge - Phlex implementation
#
# Displays a badge or a component that looks like a badge.
# Uses BadgeBehavior module for shared styling logic.
#
# Based on shadcn/ui Badge: https://ui.shadcn.com/docs/components/badge
#
# @example Basic usage
#   render UI::Badge.new { "New" }
#
# @example With variant
#   render UI::Badge.new(variant: :destructive) { "Error" }
#
# @example As a link
#   a(href: "/notifications", class: "no-underline") do
#     render UI::Badge.new { "5" }
#   end
class UI::Badge < Phlex::HTML
  include UI::BadgeBehavior

  # @param variant [Symbol, String] Visual style variant (:default, :secondary, :destructive, :outline)
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(variant: :default, classes: "", **attributes)
    @variant = variant
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    span(**badge_html_attributes.deep_merge(@attributes)) do
      yield if block_given?
    end
  end
end
