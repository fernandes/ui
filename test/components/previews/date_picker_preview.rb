class DatePickerPreview < Lookbook::Preview
  def default
    date = nil
    render UI::Popover.new(class: "relative -top-20") do |pop|
      pop.trigger do
        pop.button(class: "inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-[280px] justify-start text-left font-normal text-muted-foreground") do |b|
          b.render UI::Icon.new(:calendar)
          if date.present?
            pop.plain date
          else
            pop.span { "Pick a date" }
          end
        end
      end
      pop.content(class: "w-auto p-0") do
        pop.render UI::Calendar.new(month: Date.today.month, year: Date.today.year)
      end
    end
  end
end
