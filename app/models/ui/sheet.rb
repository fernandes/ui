class UI::Sheet < UI::Base
  def content(&block)
    div(
      role: "dialog",
      id: "radix-:r2cs:",
      aria_describedby: "radix-:r2cu:",
      aria_labelledby: "radix-:r2ct:",
      data_state: "open",
      class:
        "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      tabindex: "-1",
      style: "pointer-events:auto",
      &block
    )
  end

  def header(&block)
    div(class: "flex flex-col space-y-2 text-center sm:text-left", &block)
  end

  def title(text)
    h2(class: "text-lg font-semibold text-foreground") { text }
  end

  def description(text)
    p(id: "radix-:r2cu:", class: "text-sm text-muted-foreground") { text }
  end

  def close(&block)
    button(
      type: "button",
      class:
        "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
    ) do
      render UI::Icon.new(:x, class: "h-4 w-4")
      span(class: "sr-only") { "Close" }
    end
  end

  def view_template(&block)
    render UI::Backdrop.new
    yield
  end
end
