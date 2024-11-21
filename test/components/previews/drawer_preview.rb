class DrawerPreview < Lookbook::Preview
  def default
    render UI::Drawer.new do |drawer|
      drawer.trigger do |trigger|
        trigger.render UI::Button.new(variant: :outline) { "Open Drawer" }
      end

      drawer.content do |content|
        content.div(class: "mx-auto w-full max-w-sm") do
          content.header do |header|
            header.title { "Move Goal" }
            header.description { "Set your daily activity goal." }
          end

          content.body do
            content.render DrawerContent.new
          end

          content.footer do |footer|
            footer.render UI::Button.new { "Submit" }
            footer.render UI::Button.new(variant: :outline) { "Cancel" }
          end
        end
      end
    end
  end

  class DrawerContent < UI::Base
    def view_template
      div(class: "p-4 pb-0") do
        div(class: "flex items-center justify-center space-x-2") do
          whitespace
          render UI::Button.new(variant: :outline, size: :icon, class: "h-8 w-8 shrink-0 rounded-full") do
            render UI::Icon.new(:minus)
            span(class: %(sr-only)) { %(Decrease) }
          end
          div(class: "flex-1 text-center") do
            div(class: "text-7xl font-bold tracking-tighter") { "330" }
            div(class: "text-[0.70rem] uppercase text-muted-foreground") do
              "Calories/day"
            end
          end
          whitespace
          render UI::Button.new(variant: :outline, size: :icon, class: "h-8 w-8 shrink-0 rounded-full") do
            render UI::Icon.new(:plus)
            span(class: %(sr-only)) { %(Increase) }
          end
        end
        div(class: "mt-3 h-[120px]") do
          render Chart.new
        end
      end
    end
  end

  class Chart < UI::Base
    def view_template
      div(
        class: "recharts-responsive-container",
        style: "width:100%;height:100%;min-width:0"
      ) do
        div(
          class: "recharts-wrapper",
          style:
            "position:relative;cursor:default;width:100%;height:100%;max-height:120px;max-width:352px"
        ) do
          svg(
            class: "recharts-surface",
            width: "352",
            height: "120",
            style: "width:100%;height:100%",
            viewbox: "0 0 352 120"
          ) do |s|
            s.title
            s.desc
            s.defs do
              s.clipPath(id: "recharts93-clip") do
                s.rect(x: "5", y: "5", height: "110", width: "342")
              end
            end
            s.g(class: "recharts-layer recharts-bar") do
              s.g(class: "recharts-layer recharts-bar-rectangles") do
                s.g(class: "recharts-layer") do
                  s.g(class: "recharts-layer recharts-bar-rectangle") do
                    s.path(
                      x: "7.63076923076923",
                      y: "5",
                      width: "21",
                      height: "110",
                      radius: "0",
                      style: "fill: hsl(var(--foreground)); opacity: 0.9;",
                      class: "recharts-rectangle",
                      d: "M 7.63076923076923,5 h 21 v 110 h -21 Z"
                    )
                  end
                  s.g(class: "recharts-layer recharts-bar-rectangle") do
                    s.path(
                      x: "33.93846153846154",
                      y: "32.5",
                      width: "21",
                      height: "82.5",
                      radius: "0",
                      style: "fill: hsl(var(--foreground)); opacity: 0.9;",
                      class: "recharts-rectangle",
                      d: "M 33.93846153846154,32.5 h 21 v 82.5 h -21 Z"
                    )
                  end
                  s.g(class: "recharts-layer recharts-bar-rectangle") do
                    s.path(
                      x: "60.246153846153845",
                      y: "60",
                      width: "21",
                      height: "55",
                      radius: "0",
                      style: "fill: hsl(var(--foreground)); opacity: 0.9;",
                      class: "recharts-rectangle",
                      d: "M 60.246153846153845,60 h 21 v 55 h -21 Z"
                    )
                  end
                  s.g(class: "recharts-layer recharts-bar-rectangle") do
                    s.path(
                      x: "86.55384615384615",
                      y: "32.5",
                      width: "21",
                      height: "82.5",
                      radius: "0",
                      style: "fill: hsl(var(--foreground)); opacity: 0.9;",
                      class: "recharts-rectangle",
                      d: "M 86.55384615384615,32.5 h 21 v 82.5 h -21 Z"
                    )
                  end
                  s.g(class: "recharts-layer recharts-bar-rectangle") do
                    s.path(
                      x: "112.86153846153846",
                      y: "60",
                      width: "21",
                      height: "55",
                      radius: "0",
                      style: "fill: hsl(var(--foreground)); opacity: 0.9;",
                      class: "recharts-rectangle",
                      d: "M 112.86153846153846,60 h 21 v 55 h -21 Z"
                    )
                  end
                  s.g(class: "recharts-layer recharts-bar-rectangle") do
                    s.path(
                      x: "139.16923076923078",
                      y: "38.55000000000001",
                      width: "21",
                      height: "76.44999999999999",
                      radius: "0",
                      style: "fill: hsl(var(--foreground)); opacity: 0.9;",
                      class: "recharts-rectangle",
                      d:
                        "M 139.16923076923078,38.55000000000001 h 21 v 76.44999999999999 h -21 Z"
                    )
                  end
                  s.g(class: "recharts-layer recharts-bar-rectangle") do
                    s.path(
                      x: "165.47692307692307",
                      y: "63.025000000000006",
                      width: "21",
                      height: "51.974999999999994",
                      radius: "0",
                      style: "fill: hsl(var(--foreground)); opacity: 0.9;",
                      class: "recharts-rectangle",
                      d:
                        "M 165.47692307692307,63.025000000000006 h 21 v 51.974999999999994 h -21 Z"
                    )
                  end
                  s.g(class: "recharts-layer recharts-bar-rectangle") do
                    s.path(
                      x: "191.78461538461536",
                      y: "49.27499999999999",
                      width: "21",
                      height: "65.72500000000001",
                      radius: "0",
                      style: "fill: hsl(var(--foreground)); opacity: 0.9;",
                      class: "recharts-rectangle",
                      d:
                        "M 191.78461538461536,49.27499999999999 h 21 v 65.72500000000001 h -21 Z"
                    )
                  end
                  s.g(class: "recharts-layer recharts-bar-rectangle") do
                    s.path(
                      x: "218.09230769230768",
                      y: "32.5",
                      width: "21",
                      height: "82.5",
                      radius: "0",
                      style: "fill: hsl(var(--foreground)); opacity: 0.9;",
                      class: "recharts-rectangle",
                      d: "M 218.09230769230768,32.5 h 21 v 82.5 h -21 Z"
                    )
                  end
                  s.g(class: "recharts-layer recharts-bar-rectangle") do
                    s.path(
                      x: "244.4",
                      y: "60",
                      width: "21",
                      height: "55",
                      radius: "0",
                      style: "fill: hsl(var(--foreground)); opacity: 0.9;",
                      class: "recharts-rectangle",
                      d: "M 244.4,60 h 21 v 55 h -21 Z"
                    )
                  end
                  s.g(class: "recharts-layer recharts-bar-rectangle") do
                    s.path(
                      x: "270.7076923076923",
                      y: "38.55000000000001",
                      width: "21",
                      height: "76.44999999999999",
                      radius: "0",
                      style: "fill: hsl(var(--foreground)); opacity: 0.9;",
                      class: "recharts-rectangle",
                      d:
                        "M 270.7076923076923,38.55000000000001 h 21 v 76.44999999999999 h -21 Z"
                    )
                  end
                  s.g(class: "recharts-layer recharts-bar-rectangle") do
                    s.path(
                      x: "297.01538461538456",
                      y: "63.025000000000006",
                      width: "21",
                      height: "51.974999999999994",
                      radius: "0",
                      style: "fill: hsl(var(--foreground)); opacity: 0.9;",
                      class: "recharts-rectangle",
                      d:
                        "M 297.01538461538456,63.025000000000006 h 21 v 51.974999999999994 h -21 Z"
                    )
                  end
                  s.g(class: "recharts-layer recharts-bar-rectangle") do
                    s.path(
                      x: "323.3230769230769",
                      y: "19.02499999999999",
                      width: "21",
                      height: "95.97500000000001",
                      radius: "0",
                      style: "fill: hsl(var(--foreground)); opacity: 0.9;",
                      class: "recharts-rectangle",
                      d:
                        "M 323.3230769230769,19.02499999999999 h 21 v 95.97500000000001 h -21 Z"
                    )
                  end
                end
              end
              s.g(class: "recharts-layer")
            end
          end
        end
      end
    end
  end
end
