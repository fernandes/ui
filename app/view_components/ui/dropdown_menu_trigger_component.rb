# frozen_string_literal: true

# TriggerComponent - ViewComponent implementation
class UI::DropdownMenuTriggerComponent < ViewComponent::Base
  include UI::DropdownMenuTriggerBehavior

  renders_one :trigger_content

  def initialize(as_child: false, classes: "", **attributes)
    @as_child = as_child
    @classes = classes
    @attributes = attributes
  end

  # Returns trigger attributes for as_child mode
  def trigger_attrs
    attrs = dropdown_menu_trigger_html_attributes.deep_merge(@attributes)
    # When as_child is true, only pass functional attributes (data, aria, tabindex, role)
    # The child component handles its own styling (following shadcn pattern)
    attrs.except(:class)
  end

  def call
    all_attrs = dropdown_menu_trigger_html_attributes.deep_merge(@attributes)

    if @as_child
      # asChild mode: yield attributes to block, child handles rendering
      content
    else
      # Default mode: render as div
      content_tag :div, **all_attrs do
        content
      end
    end
  end
end
