class UI::InputOtp < UI::Base
  def group(**attrs, &block)
    render Group.new(**attrs, &block)
  end

  def separator(**attrs, &block)
    render Separator.new(**attrs, &block)
  end

  def slot(value: nil, input: false, **attrs, &block)
    render Slot.new(value: value, input: input, **attrs, &block)
  end

  class Group < UI::Base
    def view_template(&block)
      div(**attrs, &block)
    end

    def default_attrs
      {
        class: "flex items-center"
      }
    end
  end

  class Separator < UI::Base
    def view_template(&block)
      div(**attrs) do
        render UI::Icon.new(:dot)
      end
    end

    def default_attrs
      {
        role: :separator
      }
    end
  end

  class Slot < UI::Base
    attr_reader :value

    def initialize(value: nil, input: false, **attrs)
      @value = value
      @input = input
      super(**attrs)
    end

    def input?
      @input
    end

    def view_template(&block)
      if value.present?
        div(**attrs) { value }
      else
        div(**attrs) do
          span(class: "hidden")
          div(
            class:
              "pointer-events-none absolute inset-0 flex items-center justify-center hidden"
          ) do
            div(class: "h-4 w-px animate-caret-blink bg-foreground duration-1000")
          end
        end
      end
    end

    def default_attrs
      {
        data: {
          ui__input_otp_target: :slot,
        },
        class: [
          "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
          ("z-10 ring-2 ring-ring ring-offset-background" if input?)
        ]
      }
    end
  end

  def view_template(&block)
    div(**attrs) do
      yield
      div(style: "position:absolute;inset:0;pointer-events:none") do
        input(
          data: {
            ui__input_otp_target: :input,
            action: [
              "click->ui--input-otp#handleClick",
              "focus->ui--input-otp#handleFocus",
              # "change->ui--input-otp#handleInput",
              "keydown->ui--input-otp#handleInput"
            ]
          },
          autocomplete: "one-time-code",
          class: "disabled:cursor-not-allowed",
          data_input_otp: "true",
          inputmode: "numeric",
          pattern: %(^\d+$),
          style:
            "position: absolute; inset: 0px; width: calc(100% + 40px); height: 100%; display: flex; text-align: left; opacity: 1; color: transparent; pointer-events: all; background: transparent; caret-color: transparent; border: 0px solid transparent; outline: transparent solid 0px; box-shadow: none; line-height: 1; letter-spacing: -0.5em; font-size: var(--root-height); font-family: monospace; font-variant-numeric: tabular-nums; clip-path: inset(0px 40px 0px 0px);",
        )
      end
    end
  end

  def default_attrs
    {
      data: {
        controller: "ui--input-otp",
        ui__input_otp_mss_value: "0",
        ui__input_otp_mse_value: "0",
        ui__input_otp_focus_class: "z-10 ring-2 ring-ring ring-offset-background",
      },
      data_input_otp_container: "true",
      style:
        "position: relative; cursor: text; user-select: none; pointer-events: none; --root-height: 40px;",
      class: "flex items-center gap-2 has-[:disabled]:opacity-50"
    }
  end
end
