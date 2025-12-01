# frozen_string_literal: true


# UI::CommandDialogBehavior

#

# @ui_component Command Dialog

# @ui_category other

#

# @ui_anatomy Command Dialog - Root container with state management (required)

#

# @ui_feature Keyboard navigation

# @ui_feature Custom styling with Tailwind classes

# @ui_feature Form integration

# @ui_feature Animation support

#
module UI::CommandDialogBehavior
  def command_dialog_base_classes
    ""
  end

  def command_dialog_classes
    UI::TailwindMerge.merge([command_dialog_base_classes, @classes].compact.join(" "))
  end

  def command_dialog_html_attributes
    {
      data: {
        controller: "ui--command-dialog",
        ui__command_dialog_shortcut_value: @shortcut,
        action: "keydown.#{shortcut_action}@document->ui--command-dialog#toggle"
      }
    }
  end

  def shortcut_action
    # Convert "meta+j" to Stimulus format "meta+j"
    @shortcut.downcase
  end

  def command_dialog_content_classes
    "overflow-hidden p-0"
  end
end
