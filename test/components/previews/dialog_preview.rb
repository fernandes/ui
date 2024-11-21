class DialogPreview < Lookbook::Preview
  class DialogContent < UI::Base
    def initialize(dialog, **attrs)
      @dialog = dialog
    end

    def view_template
      div(class: "flex items-center space-x-2") do
        div(class: "grid flex-1 gap-2") do
          label(htmlfor: "link", class: "sr-only") { " Link " }
          render UI::Input.new(id: :link, value: "https://ui.shadcn.com/docs/installation", readonly: :readonly)
        end
        render UI::Button.new(type: "submit", size: "sm", class: "px-3") do
          span(class: "sr-only") { "Copy" }
          render UI::Icon.new(:copy)
        end
      end
    end
  end

  def default
    render UI::Dialog.new do |d|
      d.trigger do
        d.render UI::Button.new(variant: :outline) { "Share" }
      end

      d.content do |content|
        content.header do |header|
          header.title { "Share link" }
          header.description { "Anyone who has this link will be able to view this." }
        end
        content.body do
          content.render DialogContent.new(d)
        end
        content.footer(class: "sm:justify-start") do |footer|
          footer.close do
            footer.render UI::Button.new(variant: :secondary) { "Close" }
          end
        end
      end
    end
  end

  def opened
    render UI::Dialog.new(open: true) do |d|
      d.trigger do
        d.render UI::Button.new(variant: :outline) { "Share" }
      end

      d.content do |content|
        content.header do |header|
          header.title { "Share link" }
          header.description { "Anyone who has this link will be able to view this." }
        end
        content.body do
          content.render DialogContent.new(d)
        end
        content.footer(class: "sm:justify-start") do |footer|
          footer.close do
            footer.render UI::Button.new(variant: :secondary) { "Close" }
          end
        end
      end
    end
  end
end
