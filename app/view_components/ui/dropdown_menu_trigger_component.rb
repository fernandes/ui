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
    if @as_child
      # asChild mode: yield attributes to block, child handles rendering
      content
    else
      # Default mode: a <button>, or a plain wrapper when the content is
      # itself interactive (see dropdown_menu_trigger_default_attributes)
      body = content
      attrs = dropdown_menu_trigger_default_attributes(body).deep_merge(@attributes)
      content_tag dropdown_menu_trigger_tag(body), body, **attrs
    end
  end
end
