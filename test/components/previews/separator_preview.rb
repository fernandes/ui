class SeparatorPreview < Lookbook::Preview
  class SeparatorExample < UI::Base
    def view_template
      div do
        div(class: "space-y-1") do
          h4(class: "text-sm font-medium leading-none") { "Radix Primitives" }
          p(class: "text-sm text-muted-foreground") do
            " An open-source UI component library."
          end
        end
        whitespace
        render UI::Separator.new(class: "my-4")
        div(class: "flex h-5 items-center space-x-4 text-sm") do
          div { "Blog" }
          whitespace
          render UI::Separator.new(orientation: "vertical")
          div { "Docs" }
          whitespace
          render UI::Separator.new(orientation: "vertical")
          div { "Source" }
        end
      end
    end
  end

  def full_example
    render SeparatorExample.new
  end

  def horizontal
    render UI::Separator.new(orientation: :horizontal)
  end

  def vertical
    render UI::Separator.new(orientation: :vertical)
  end
end
