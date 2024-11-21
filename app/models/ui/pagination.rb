class UI::Pagination < UI::Base
  def previous(to:, **attrs)
    li(**attrs) do
      a(
        class:
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-1 pl-2.5",
        aria_label: "Go to previous page",
        href: to
      ) do
        render UI::Icon.new(:chevron_left, class: "h-4 w-4")
        span { "Previous" }
      end
    end
  end

  def link(label, to:, active: false)
    li(class: "") do
      a(
        class: [
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 w-10",
          ("border border-input bg-background" if active)
        ],
        href: to
      ) { label }
    end
  end

  def ellipsis
    li(class: "") do
      span(
        aria_hidden: "true",
        class: "flex h-9 w-9 items-center justify-center"
      ) do
        render UI::Icon.new(:ellipsis, class: "h-4 w-4")
        span(class: "sr-only") { "More pages" }
      end
    end
  end

  def next(to:, **attrs)
    li(**attrs) do
      a(
        class:
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-1 pr-2.5",
        aria_label: "Go to next page",
        href: to
      ) do
        span { "Next" }
        render UI::Icon.new(:chevron_right, class: "h-4 w-4")
      end
    end
  end

  def view_template(&block)
    nav(
      role: "navigation",
      aria_label: "pagination",
      class: "mx-auto flex w-full justify-center"
    ) do
      ul(class: "flex flex-row items-center gap-1", &block)
    end
  end
end
