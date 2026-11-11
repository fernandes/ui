# frozen_string_literal: true

require "tailwind_merge"

# UI::InputOtpBehavior
#
# @ui_component Input OTP
# @ui_description InputOtp - Phlex implementation
# @ui_category forms
#
# @ui_anatomy Input OTP - Accessible one-time password container component. (required)
# @ui_anatomy Group - Container for grouping OTP input slots together visually.
# @ui_anatomy Separator - Visual divider between OTP input groups.
#
# @ui_feature One real, labelable <input> (autocomplete="one-time-code"); the slots only draw its value
# @ui_feature SMS / password-manager autofill
# @ui_feature Submits a single value under `name`
# @ui_feature Custom styling with Tailwind classes
# @ui_feature Disabled state support
#
# @ui_keyboard ArrowLeft Moves to the previous slot
# @ui_keyboard ArrowRight Moves to the next slot
# @ui_keyboard Home Moves to the first slot
# @ui_keyboard End Moves to the last filled slot
# @ui_keyboard Backspace Deletes the character before the caret (or the selected one)
#
# Like shadcn's input-otp: the container renders the slots (groups, slots,
# separators — decorative, aria-hidden) and one transparent <input> laid over
# them. `id`, `name`, `value`, `autofocus`, `required` and the aria-* label
# attributes belong to that input, so `<label for>` and autofill work.
module UI::InputOtpBehavior
  # Returns HTML attributes for the input OTP container element
  def input_otp_html_attributes
    {
      class: input_otp_classes,
      data: input_otp_data_attributes
    }
  end

  # Returns combined CSS classes for the input OTP container
  def input_otp_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    UI::ClassMerger.merge([
      input_otp_base_classes,
      classes_value
    ].compact.join(" "))
  end

  # Returns data attributes for Stimulus controller
  def input_otp_data_attributes
    {
      controller: "ui--input-otp",
      slot: "input-otp",
      ui__input_otp_length_value: @length,
      ui__input_otp_pattern_value: @pattern,
      ui__input_otp_autofocus_value: (@autofocus ? "true" : nil)
    }.compact
  end

  # The one real input. `context` is what the slots collected while rendering
  # (pre-filled characters, slot-level disabled).
  def input_otp_input_attributes(context = nil)
    extra = (respond_to?(:input_attributes, true) ? input_attributes : @input_attributes) || {}
    {
      type: "text",
      id: @id,
      name: @name.presence || context&.dig(:slot_name),
      value: input_otp_initial_value(context).presence,
      maxlength: @length,
      inputmode: input_otp_inputmode,
      autocomplete: "one-time-code",
      autocorrect: "off",
      autocapitalize: "off",
      spellcheck: "false",
      disabled: ((@disabled || context&.dig(:disabled)) ? true : nil),
      required: (@required ? true : nil),
      autofocus: (@autofocus ? true : nil),
      "aria-invalid": (@invalid ? "true" : nil),
      class: input_otp_input_classes,
      data: {
        slot: "input-otp-input",
        ui__input_otp_target: "input",
        action: "input->ui--input-otp#input keydown->ui--input-otp#keydown paste->ui--input-otp#paste focus->ui--input-otp#focus blur->ui--input-otp#blur click->ui--input-otp#focus"
      }
    }.deep_merge(extra).compact
  end

  # "numeric" for the default digits-only pattern, "text" otherwise
  # (an explicit `inputmode:` wins).
  def input_otp_inputmode
    return @inputmode if @inputmode.present?

    %w[\\d [0-9]].include?(@pattern.to_s) ? "numeric" : "text"
  end

  def input_otp_initial_value(context = nil)
    value = @value.to_s
    if value.empty? && context && context[:chars].any?
      value = Array.new((context[:chars].keys.max || -1) + 1) { |i| context[:chars][i].to_s }.join
    end
    value[0, @length || value.length]
  end

  # Shared with the slots while the container renders.
  def input_otp_context
    {value: @value.to_s, chars: {}, disabled: false, next_index: 0, invalid: @invalid ? true : false, slot_name: nil}
  end

  # Renders the children with the context available to the slots; returns the
  # block's result and the context they filled in.
  def with_input_otp_context
    previous = Thread.current[:ui_input_otp_context]
    context = input_otp_context
    Thread.current[:ui_input_otp_context] = context
    begin
      [yield, context]
    ensure
      Thread.current[:ui_input_otp_context] = previous
    end
  end

  # The input covers the slots and is transparent: the slots draw its value.
  def input_otp_input_classes
    "absolute inset-0 z-20 size-full cursor-text appearance-none border-0 bg-transparent p-0 font-mono text-transparent caret-transparent outline-none tracking-[-0.5em] selection:bg-transparent selection:text-transparent disabled:cursor-not-allowed"
  end

  private

  # Base classes applied to all input OTP containers
  def input_otp_base_classes
    "relative flex items-center gap-2 has-[:disabled]:opacity-50"
  end
end
