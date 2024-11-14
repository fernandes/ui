class PopoverPreview < Lookbook::Preview
  def default
    render UI::Popover.new do |pop|
      pop.trigger do
        pop.render UI::Button.new { "Open!" }
      end

      pop.content(class: "p-4") do
        pop.render PopoverContent.new
      end
    end
  end

  class PopoverContent < UI::Base
    def view_template
      div(class: "grid gap-4") do
        div(class: "space-y-2") do
          h4(class: "font-medium leading-none") { "Dimensions" }
          p(class: "text-sm text-muted-foreground") do
            "Set the dimensions for the layer."
          end
        end
        div(class: "grid gap-2") do
          div(class: "grid grid-cols-3 items-center gap-4") do
            label(
              class:
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              for: "width"
            ) { "Width" }
            input(
              class:
                "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-2 h-8",
              id: "width",
              value: "100%"
            )
          end
          div(class: "grid grid-cols-3 items-center gap-4") do
            label(
              class:
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              for: "maxWidth"
            ) { "Max. width" }
            input(
              class:
                "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-2 h-8",
              id: "maxWidth",
              value: "300px"
            )
          end
          div(class: "grid grid-cols-3 items-center gap-4") do
            label(
              class:
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              for: "height"
            ) { "Height" }
            input(
              class:
                "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-2 h-8",
              id: "height",
              value: "25px"
            )
          end
          div(class: "grid grid-cols-3 items-center gap-4") do
            label(
              class:
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              for: "maxHeight"
            ) { "Max. height" }
            input(
              class:
                "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-2 h-8",
              id: "maxHeight",
              value: "none"
            )
          end
        end
      end
    end
  end
end
