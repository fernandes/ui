class HoverCardPreview < Lookbook::Preview
  class HoverCardContent < UI::Base
    def view_template
      div(class: "flex justify-between space-x-4") do
        render UI::Avatar.new do |avatar|
          avatar.image src: "https://avatars.githubusercontent.com/u/14985020?v=4"
          avatar.fallback { "VC" }
        end

        div(class: "space-y-1") do
          h4(class: "text-sm font-semibold") { "@nextjs" }
          p(class: "text-sm") do
            "The React Framework – created and maintained by @vercel."
          end
          div(class: "flex items-center pt-2") do
            render UI::Icon.new(:calendar_days, class: "mr-2 h-4 w-4 opacity-70")
            span(class: "text-xs text-muted-foreground") { "Joined December 2021" }
          end
        end
      end
    end
  end

  def default
    render UI::HoverCard.new do |hover|
      hover.trigger do |trg|
        trg.render UI::Button.new(variant: :link) { "@nextjs" }
      end

      hover.content(class: "w-80") do |content|
        content.render HoverCardContent
      end
    end
  end
end
