class UI::Toast < UI::Base
  include Phlex::DeferredRender

  class Action < UI::Base
    attr_reader :label, :to

    def initialize(label:, to: nil, **attrs)
      @to = to
      @label = label
      super(**attrs)
    end

    def view_template
      if to.present?
        a(href: to, **attrs) { label }
      else
        button(**attrs) { label }
      end
    end

    def default_attrs
      {
        type: "button",
        class: "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive"
      }
    end
  end

  def title(&block)
    @title = block
  end

  def content(&block)
    @content = block
  end

  ui_attribute :action
  attr_reader :variant

  def initialize(variant: :primary, **attrs)
    @variant = variant
    super(**attrs)
  end

  def view_template
    div(
      role: "region",
      aria_label: "Notifications (F8)",
      tabindex: "-1",
      style: "pointer-events:none"
    ) do
      ol(
        tabindex: "-1",
        class:
          "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
      )
    end

    div(
      role: "region",
      aria_label: "Notifications (F8)",
      tabindex: "-1",
      style: ""
    ) do
      span(
        aria_hidden: "true",
        tabindex: "0",
        style:
          "position:fixed;border:0;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;overflow-wrap:normal"
      )
      ol(
        tabindex: "-1",
        class:
          "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
      ) do
        li(
          role: "status",
          aria_live: "off",
          aria_atomic: "true",
          tabindex: "0",
          data_state: "open",
          data_swipe_direction: "right",
          class:
          [
            "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full border ",
            ("bg-background text-foreground" if @variant.to_sym == :primary),
            ("destructive group border-destructive bg-destructive text-destructive-foreground" if @variant.to_sym == :destructive)
          ],
          style: "user-select:none;touch-action:none",
          data_radix_collection_item: ""
        ) do
          div(class: "grid gap-1") do
            if @title.present?
              div(class: "text-sm font-semibold", &@title)
            end
            div(class: "text-sm opacity-90", &@content)
          end

          if @action.present?
            render @action
          end

          close_button
        end
      end
      span(
        aria_hidden: "true",
        tabindex: "0",
        style:
          "position:fixed;border:0;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;overflow-wrap:normal"
      )
    end
  end

  def close_button
    button(
      type: "button",
      class:
        "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      toast_close: "",
      data_radix_toast_announce_exclude: ""
    ) do
      render UI::Icon.new(:x, class: "h-4 w-4")
    end
  end
end
