class CardPreview < Lookbook::Preview
  def default
    render UI::Card.new do |card|
      card.header do |header|
        header.title { "Create project" }
        header.description { "Deploy your new project in one-click." }
      end

      card.content do |content|
        content.render CardContent.new
      end

      card.footer do |footer|
        footer.render UI::Button.new(variant: :secondary) { "Cancel" }
        footer.render UI::Button.new { "Deploy" }
      end
    end
  end

  def notifications_card
    render UI::Card.new(class: "w-[400px]") do |card|
      card.header do |header|
        header.title { "Notifications" }
        header.description { "You have 3 unread messages." }
      end

      card.content(class: "grid gap-4") do |content|
        content.render NotificationsContent.new
      end

      card.footer do |footer|
        footer.render UI::Button.new(class: "w-full") do |b|
          b.render UI::Icon.new(:check, class: "mr-2 h-4 w-4")
          b.plain "Mark all as read"
        end
      end
    end
  end

  class NotificationsContent < UI::Base
    def view_template
      div(class: "flex items-center space-x-4 rounded-md border p-4") do
        render UI::Icon.new(:bell_ring)
        div(class: "flex-1 space-y-1") do
          p(class: "text-sm font-medium leading-none") { "Push Notifications" }
          p(class: "text-sm text-muted-foreground") do
            "Send notifications to device."
          end
        end
        render UI::Switch.new
      end
      div do
        notification("Your call has been confirmed.", "1 hour ago")
        notification("You have a new message!", "1 hour ago")
        notification("Your subscription is expiring soon!", "2 hours ago")
      end
    end

    def notification(title, message)
      div(
        class: "mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
      ) do
        span(class: "flex h-2 w-2 translate-y-1 rounded-full bg-sky-500")
        div(class: "space-y-1") do
          p(class: "text-sm font-medium leading-none") do
            "Your call has been confirmed."
          end
          p(class: "text-sm text-muted-foreground") { "1 hour ago" }
        end
      end
    end
  end

  class CardContent < UI::Base
    def view_template(&block)
      form do
        div(class: "grid w-full items-center gap-4") do
          div(class: "flex flex-col space-y-1.5") do
            label(
              class:
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              for: "name"
            ) { "Name" }
            input(
              class:
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              id: "name",
              placeholder: "Name of your project"
            )
          end
          div(class: "flex flex-col space-y-1.5") do
            label(
              class:
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              for: "framework"
            ) { "Framework" }
            button(
              type: "button",
              role: "combobox",
              aria_controls: "radix-:rte:",
              aria_expanded: "false",
              aria_autocomplete: "none",
              dir: "ltr",
              data_state: "closed",
              data_placeholder: "",
              class:
                " flex h-10  w-full items-center justify-between rounded-md border border-input bg-background px-3  py-2  text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2  focus:ring-ring focus:ring-offset-2  disabled:cursor-not-allowed disabled:opacity-50 [& amp;>span]:line-clamp-1",
              id: "framework"
            ) do
              span(style: "pointer-events:none") { "Select" }
              svg(
                xmlns: "http://www.w3.org/2000/svg",
                width: "24",
                height: "24",
                viewbox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                stroke_width: "2",
                stroke_linecap: "round",
                stroke_linejoin: "round",
                class: "lucide lucide-chevron-down h-4 w-4 opacity-50",
                aria_hidden: "true"
              ) { |s| s.path(d: "m6 9 6 6 6-6") }
            end
            select(
              aria_hidden: "true",
              tabindex: "-1",
              style:
                "position:absolute;border:0;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;overflow-wrap:normal"
            ) do
              option(value: "")
              option(value: "next") { "Next.js" }
              option(value: "sveltekit") { "SvelteKit" }
              option(value: "astro") { "Astro" }
              option(value: "nuxt") { "Nuxt.js" }
            end
          end
        end
      end
    end
  end
end
