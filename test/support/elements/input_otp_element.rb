# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the Input OTP component.
    #
    # The OTP is one real <input> laid over decorative slots that draw its
    # value. This element drives that input with the keyboard, like a user,
    # and reads the slots for what is shown.
    #
    # It can wrap the container (`[data-controller="ui--input-otp"]`) or the
    # input itself (an `id:` passed to the component lands on the input).
    #
    # @example
    #   otp = InputOtpElement.new(find("#otp"))
    #   otp.enter_otp("123456")
    #   assert otp.complete?
    #   assert_equal "123456", otp.value
    #
    class InputOtpElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--input-otp"]'
      INPUT_SELECTOR = 'input[data-ui--input-otp-target="input"]'
      SLOT_SELECTOR = '[data-slot="input-otp-slot"]'

      def initialize(node)
        node = node.find(:xpath, 'ancestor::*[@data-controller="ui--input-otp"][1]') if node.tag_name == "input"
        super
      end

      # === Actions ===

      # Type a code from the current caret position (focuses the input first).
      def enter_otp(otp)
        focus_input
        input.send_keys(otp)
      end

      # Type one character on the given slot. Slots fill left to right, so the
      # caret can only go as far as the first empty slot.
      def enter_digit(index, char)
        focus_slot(index)
        input.send_keys(char)
      end

      # Paste text into the input (a real ClipboardEvent).
      def paste(text)
        focus_input
        page.execute_script(<<~JS, input, text)
          const [input, text] = arguments
          const data = new DataTransfer()
          data.setData("text/plain", text)
          input.dispatchEvent(new ClipboardEvent("paste", { clipboardData: data, bubbles: true, cancelable: true }))
        JS
      end

      # Delete every character with the keyboard.
      def clear
        focus_input
        input.send_keys(:end)
        (value.length + 1).times { input.send_keys(:backspace) }
      end

      def focus_input
        page.execute_script("arguments[0].focus()", input) unless focused?
      end

      # Put the caret on a slot (Home, then ArrowRight).
      def focus_slot(index)
        focus_input
        input.send_keys(:home)
        index.times { input.send_keys(:right) }
      end

      def focus_first_slot
        focus_slot(0)
      end

      def press_backspace
        input.send_keys(:backspace)
      end

      # === State Queries ===

      # The input's value: the code that is submitted.
      def value
        input.value
      end

      def complete?
        value.length >= length
      end

      # The character a slot shows.
      def slot_value(index)
        evaluate_script_on(slots[index], "arguments[0].firstChild && arguments[0].firstChild.nodeType === 3 ? arguments[0].firstChild.textContent : ''")
      end

      def slot_empty?(index)
        slot_value(index).blank?
      end

      def slot_filled?(index)
        slot_value(index).present?
      end

      def filled_count
        length.times.count { |i| slot_filled?(i) }
      end

      def empty_count
        length - filled_count
      end

      def disabled?
        input.disabled?
      end

      # Slots aren't controls: they're disabled when the input is.
      def slot_disabled?(_index)
        disabled?
      end

      def focused?
        page.evaluate_script("document.activeElement === arguments[0]", input)
      end

      # The slot marked active (the caret's), or nil when not focused.
      def focused_slot_index
        slots.index { |slot| slot["data-active"] == "true" }
      end

      # === Sub-elements ===

      def input
        node.find(INPUT_SELECTOR, visible: :all)
      end

      def slots
        node.all(SLOT_SELECTOR, visible: :all)
      end

      # Kept for older tests: the slots.
      def input_slots
        slots
      end

      def input_slot(index)
        slots[index]
      end

      def length
        slots.length
      end

      def has_separator?
        node.has_css?('[role="separator"]', visible: :all)
      end

      def separators
        node.all('[role="separator"]', visible: :all)
      end

      def separator_count
        separators.length
      end

      # === Keyboard Navigation ===

      def navigate_right
        input.send_keys(:right)
      end

      def navigate_left
        input.send_keys(:left)
      end

      def navigate_to_first
        input.send_keys(:home)
      end

      def navigate_to_last
        input.send_keys(:end)
      end

      # === Validation Queries ===

      def pattern
        node["data-ui--input-otp-pattern-value"]
      end

      def numeric_only?
        pattern == "\\d"
      end

      def alphanumeric?
        pattern == "[A-Za-z0-9]"
      end

      private

      def evaluate_script_on(element, script)
        page.evaluate_script(script, element)
      end
    end
  end
end
