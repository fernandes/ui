# frozen_string_literal: true

require "tailwind_merge"

# UI::InputOtpSlotBehavior
#
# @ui_component Input OTP Slot
# @ui_description Slot - Phlex implementation
# @ui_category other
#
# @ui_anatomy Input OTP Slot - Draws one character of the OTP input's value. (required)
#
# @ui_feature Custom styling with Tailwind classes
# @ui_feature Active slot and fake caret via data-active / data-caret
#
# A slot is decorative (aria-hidden): the container's single <input> is what
# users and assistive technology interact with. The controller fills the
# slots from that input's value and marks the active one.
#
# `value:` pre-fills this slot's character (collected into the input's value);
# `disabled:` disables the whole input. `id:` is ignored and `name:` is only a
# fallback (without a trailing `[n]`) when the container has no `name:` —
# name and id belong to the container's input.
module UI::InputOtpSlotBehavior
  # Returns HTML attributes for the input OTP slot element
  def input_otp_slot_html_attributes
    {
      class: input_otp_slot_classes,
      "aria-hidden": "true",
      data: input_otp_slot_data_attributes
    }
  end

  # The character this slot shows when rendered (before JS).
  def input_otp_slot_char
    register_input_otp_slot
    @input_otp_slot_char
  end

  # Returns combined CSS classes for the input OTP slot
  def input_otp_slot_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    UI::ClassMerger.merge([
      input_otp_slot_base_classes,
      classes_value
    ].compact.join(" "))
  end

  # Returns data attributes for Stimulus integration
  def input_otp_slot_data_attributes
    register_input_otp_slot
    {
      slot: "input-otp-slot",
      ui__input_otp_target: "slot",
      index: @input_otp_slot_index,
      active: "false",
      invalid: (@input_otp_slot_invalid ? "true" : nil)
    }.compact
  end

  def input_otp_caret_classes
    "pointer-events-none absolute inset-0 hidden items-center justify-center group-data-[caret=true]/slot:flex"
  end

  def input_otp_caret_line_classes
    "h-4 w-px animate-pulse bg-foreground"
  end

  private

  # Takes this slot's index and character from the container's context once.
  def register_input_otp_slot
    return if @input_otp_slot_registered

    @input_otp_slot_registered = true
    context = Thread.current[:ui_input_otp_context]
    explicit_index = @index if @index.is_a?(Integer) && @index.positive?
    index = explicit_index || (context ? context[:next_index] : @index.to_i)
    @input_otp_slot_index = index
    @input_otp_slot_char = @value.to_s[0]

    return unless context

    context[:next_index] = index + 1
    context[:chars][index] = @input_otp_slot_char if @input_otp_slot_char.present?
    context[:disabled] = true if @disabled
    context[:slot_name] ||= @slot_name.to_s.sub(/\[\d*\]\z/, "").presence
    @input_otp_slot_invalid = context[:invalid]
    @input_otp_slot_char = context[:value][index] if context[:value].present?
  end

  # Base classes applied to all input OTP slots (from shadcn/ui)
  def input_otp_slot_base_classes
    "group/slot relative flex size-9 items-center justify-center border-y border-r border-input text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md dark:bg-input/30 data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-[3px] data-[active=true]:ring-ring/50 data-[invalid=true]:border-destructive data-[active=true]:data-[invalid=true]:ring-destructive/20 dark:data-[active=true]:data-[invalid=true]:ring-destructive/40"
  end
end
