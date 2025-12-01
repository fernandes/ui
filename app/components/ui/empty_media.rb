# frozen_string_literal: true

# EmptyMedia - Phlex implementation
#
# Displays visual content like icons or avatars.
#
# @example Icon variant
#   render UI::EmptyMedia.new(variant: "icon") do
#     svg(class: "size-6") { path(d: "...") }
#   end
#
# @example Default variant (for larger images/avatars)
#   render UI::EmptyMedia.new(variant: "default") do
#     img(src: "/avatar.jpg", class: "size-20 rounded-full")
#   end
class UI::EmptyMedia < Phlex::HTML
  include UI::EmptyMediaBehavior

  def initialize(variant: "default", classes: "", **attributes)
    @variant = variant
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**empty_media_html_attributes.merge(@attributes), &block)
  end
end
