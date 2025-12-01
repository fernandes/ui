# frozen_string_literal: true

class UI::ItemComponent < ViewComponent::Base
  include UI::ItemBehavior
  include UI::SharedAsChildBehavior

  def initialize(variant: "default", size: "default", as_child: false, classes: "", **attributes)
    @variant = variant
    @size = size
    @as_child = as_child
    @classes = classes
    @attributes = attributes
  end

  def call
    item_attrs = item_html_attributes.merge(@attributes)

    if @as_child
      # Yield attributes to block - child element will receive them
      yield(item_attrs) if block_given?
    else
      # Default: render as div
      content_tag :div, content, **item_attrs
    end
  end

  private

  attr_reader :variant, :size, :as_child, :classes, :attributes
end
