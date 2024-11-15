module UI::Tags
  NAMES = [
    "Accordion",
    "Alert",
    "AlertDialog",
    "AspectRatio",
    "Avatar",
    "Badge",
    "Breadcrumb",
    "Button",
    "Calendar",
    "Card",
    "Carousel",
    "Chart",
    "Checkbox",
    "Collapsible",
    "Combobox",
    "Command",
    "ContextMenu",
    "DataTable",
    "DatePicker",
    "Dialog",
    "Drawer",
    "DropdownMenu",
    "Form",
    "HoverCard",
    "InputOtp",
    "Label",
    "Menubar",
    "NavigationMenu",
    "Pagination",
    "Popover",
    "Progress",
    "Radio Group",
    "Resizable",
    "ScrollArea",
    "Select",
    "Separator",
    "Sheet",
    "Skeleton",
    "Slider",
    "Sonner",
    "Switch",
    "Table",
    "Tabs",
    "Textarea",
    "Toast",
    "Toggle",
    "ToggleGroup",
    "Tooltip",
  ]

  def self.generate
    NAMES.each do |name|
      content = <<~EOF
        class #{name}Preview < Lookbook::Preview
          def default
            render UI::#{name}.new
          end
        end
      EOF
      File.write(Rails.root.join("../../test/components/previews/#{name.underscore}_preview.rb"), content)

      content = <<~EOF
        class UI::#{name} < UI::Base
          def view_template
            div(class: "w-full") { "Component #{name}" }
          end
        end
      EOF
      File.write(Rails.root.join("../../app/models/ui/#{name.underscore}.rb"), content)

      content = <<~EOF
        import { Controller } from '@hotwired/stimulus';

        export default class extends Controller {
          connect() {
            this.element.textContent = "Hello from #{name}"
          }
        }
      EOF
      File.write(Rails.root.join("../../app/javascript/ui/#{name.underscore}_controller.js"), content)
    end
  end
end
