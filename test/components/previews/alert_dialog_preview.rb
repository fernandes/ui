class AlertDialogPreview < Lookbook::Preview
  def default
    render UI::AlertDialog.new
  end

  def backdrop
    render UI::AlertDialog.new do |dialog|
      dialog.content do |content|
        content.header do |header|
          header.title { "Are you absolutely sure?" }
          header.body {
            "This action cannot be undone. This will permanently delete your account and remove your data from our servers."
          }
        end
        content.footer do |footer|
          footer.cancel { footer.render UI::Button.new(variant: :secondary) { "Cancel" }}
          footer.action { footer.render UI::Button.new { "Continue" }}
        end
      end
    end
  end
end
