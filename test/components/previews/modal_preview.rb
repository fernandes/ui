class ModalPreview < Lookbook::Preview
  def default
    render UI::Modal.new do |m|
      m.render ModalContent.new
    end
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
          footer.cancel { footer.render UI::Button.new(variant: :secondary) { "Cancel" } }
          footer.action { footer.render UI::Button.new { "Continue" } }
        end
      end
    end
  end

  class ModalContent < UI::Base
    def view_template
      div(class: "flex flex-col space-y-2 text-center sm:text-left") do
        h2(id: "radix-:rj5:", class: "text-lg font-semibold") do
          "Are you absolutely sure?"
        end
        p(id: "radix-:rj6:", class: "text-sm text-muted-foreground") do
          "This action cannot be undone. This will permanently delete your account and remove your data from our servers."
        end
      end
    end
  end
end
