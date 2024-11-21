class SheetPreview < Lookbook::Preview
  class SheetBody < UI::Base
    def view_template
      div(class: "grid gap-4 py-4") do
        div(class: "grid grid-cols-4 items-center gap-4") do
          render UI::Label.new(htmlFor: "name", class: "text-right") { "Name" }
          render UI::Input.new(id: "name", placeholder: "Name", value: "Pedro Duarte", class: "md:text-sm col-span-3")
        end
        div(class: "grid grid-cols-4 items-center gap-4") do
          render UI::Label.new(htmlFor: "username", class: "text-right") { "Username" }
          render UI::Input.new(id: "username", placeholder: "Username", value: "@peduarte", class: "md:text-sm col-span-3")
        end
      end

      div(class: "flex justify-end") do
        render UI::Button.new { "Save Changes" }
      end
    end
  end

  def default
    render UI::Sheet.new do |sheet|
      sheet.content do
        sheet.header do
          sheet.title "Edit profile"
          sheet.description "Make changes to your profile here. Click save when you're done."
        end

        sheet.render SheetBody.new

        sheet.footer do
          sheet.close do
            render UI::Button.new { "Save Changes" }
          end
        end
      end
    end
  end
end
