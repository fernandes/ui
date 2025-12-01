# frozen_string_literal: true

# SubTriggerComponent - ViewComponent implementation
class UI::DropdownMenuSubTriggerComponent < ViewComponent::Base
  include UI::DropdownMenuSubTriggerBehavior

  def initialize(inset: false, classes: "", **attributes)
    @inset = inset
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :div, **dropdown_menu_sub_trigger_html_attributes.merge(@attributes.except(:data)) do
      safe_join([
        content,
        chevron_icon_html
      ])
    end
  end

  private

  def chevron_icon_html
    content_tag :svg, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "ml-auto lucide lucide-chevron-right h-4 w-4" do
      tag.path(d: "m9 18 6-6-6-6")
    end
  end
end
