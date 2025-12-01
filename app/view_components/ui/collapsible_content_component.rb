# frozen_string_literal: true

class UI::CollapsibleContentComponent < ViewComponent::Base
  include UI::CollapsibleContentBehavior

  def initialize(force_mount: false, classes: "", **attributes)
    @force_mount = force_mount
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag(:div, content, **collapsible_content_html_attributes.deep_merge(@attributes))
  end
end
