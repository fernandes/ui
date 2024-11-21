class ScrollAreaPreview < Lookbook::Preview
  class ScrollAreaContent < UI::Base
    def view_template
      div(class: "p-4") do
        h4(class: "mb-4 text-sm font-medium leading-none") { "Tags" }
        div do
          50.downto(1) do |n|
            div(key: "tag", class: "text-sm") { "v1.2.0-beta.#{n}" }
            render UI::Separator.new(class: "my-2")
          end
        end
      end
    end
  end

  def default
    render UI::ScrollArea.new(class: "h-72 w-48 rounded-md border") do |scroll|
      scroll.render ScrollAreaContent
    end
  end
end
