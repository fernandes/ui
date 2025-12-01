# frozen_string_literal: true

# ShortcutComponent - ViewComponent implementation
class UI::ContextMenuShortcutComponent < ViewComponent::Base
  include UI::ContextMenuShortcutBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    attrs = context_menu_shortcut_html_attributes

    content_tag :span, **attrs.merge(@attributes) do
      content
    end
  end
end
