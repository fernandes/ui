class CollapsiblePreview < Lookbook::Preview
  def default
    render UI::Collapsible.new(class: "w-[350px] space-y-2") do |c|
      c.div(class: "flex items-center justify-between space-x-4 px-4") do
        c.h4(class: "text-sm font-semibold") { " @peduarte starred 3 repositories" }
        c.trigger(:chevrons_up_down)
      end

      c.div(class: "rounded-md border px-4 py-3 font-mono text-sm") do
        " @radix-ui/primitives"
      end

      c.content(class: "space-y-2") do
        c.div(class: "rounded-md border px-4 py-3 font-mono text-sm") do
          " @radix-ui/colors"
        end
        c.div(class: "rounded-md border px-4 py-3 font-mono text-sm") do
          " @stitches/react"
        end
      end
    end
  end

  def open
    render UI::Collapsible.new(open: true, class: "w-[350px] space-y-2") do |c|
      c.div(class: "flex items-center justify-between space-x-4 px-4") do
        c.h4(class: "text-sm font-semibold") { " @peduarte starred 3 repositories" }
        c.trigger(:chevrons_up_down)
      end

      c.div(class: "rounded-md border px-4 py-3 font-mono text-sm") do
        " @radix-ui/primitives"
      end

      c.content(class: "space-y-2") do
        c.div(class: "rounded-md border px-4 py-3 font-mono text-sm") do
          " @radix-ui/colors"
        end
        c.div(class: "rounded-md border px-4 py-3 font-mono text-sm") do
          " @stitches/react"
        end
      end
    end
  end
end
