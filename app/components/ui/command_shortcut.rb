# frozen_string_literal: true

class UI::CommandShortcut < Phlex::HTML
  include UI::CommandShortcutBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&)
    span(**command_shortcut_html_attributes.deep_merge(@attributes), &)
  end
end
