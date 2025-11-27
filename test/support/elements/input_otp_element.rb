# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the Input OTP component.
    #
    # @example Basic usage
    #   otp = InputOtpElement.new(find('#otp-input'))
    #   otp.enter_otp("123456")
    #   assert otp.complete?
    #   assert_equal "123456", otp.value
    #
    # @example Digit by digit entry
    #   otp = InputOtpElement.new(find('#otp-input'))
    #   otp.enter_digit(0, "1")
    #   otp.enter_digit(1, "2")
    #   otp.enter_digit(2, "3")
    #
    class InputOtpElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--input-otp"]'

      # === Actions ===

      # Enter a complete OTP value by filling all slots
      #
      # @param otp [String] The OTP value to enter
      #
      def enter_otp(otp)
        chars = otp.chars
        chars.each_with_index do |char, index|
          break if index >= input_slots.length

          slot = input_slots[index]
          slot.fill_in(with: char)
        end
      end

      # Enter a single digit in a specific slot
      #
      # @param index [Integer] The slot index (0-based)
      # @param value [String] The value to enter
      #
      def enter_digit(index, value)
        slot = input_slots[index]
        slot.fill_in(with: value)
      end

      # Paste a value into the OTP input (simulates paste)
      #
      # @param value [String] The value to paste
      #
      def paste(value)
        # Focus first input
        input_slots.first.click

        # Simulate paste using clipboard
        page.evaluate_script(<<~JAVASCRIPT)
          (function() {
            var input = document.querySelector('##{node[:id]} input[data-ui--input-otp-target="input"]');
            if (input) {
              var event = new ClipboardEvent('paste', {
                clipboardData: new DataTransfer(),
                bubbles: true,
                cancelable: true
              });
              event.clipboardData.setData('text/plain', '#{value}');
              input.dispatchEvent(event);
            }
          })();
        JAVASCRIPT
      end

      # Clear all OTP slots
      def clear
        input_slots.each do |slot|
          slot.fill_in(with: "")
        end
      end

      # Focus a specific slot
      #
      # @param index [Integer] The slot index (0-based)
      #
      def focus_slot(index)
        input_slots[index].click
      end

      # Focus the first slot
      def focus_first_slot
        focus_slot(0)
      end

      # Backspace in current focused slot
      def press_backspace
        send_keys(:backspace)
      end

      # === State Queries ===

      # Get the current OTP value (all digits combined)
      #
      # @return [String] The current OTP value
      #
      def value
        input_slots.map { |slot| slot.value }.join("")
      end

      # Check if all slots are filled (OTP is complete)
      #
      # @return [Boolean]
      #
      def complete?
        input_slots.all? { |slot| slot.value.present? }
      end

      # Get the value of a specific slot
      #
      # @param index [Integer] The slot index (0-based)
      # @return [String] The slot value
      #
      def slot_value(index)
        input_slots[index].value
      end

      # Check if a slot is empty
      #
      # @param index [Integer] The slot index (0-based)
      # @return [Boolean]
      #
      def slot_empty?(index)
        slot_value(index).blank?
      end

      # Check if a slot is filled
      #
      # @param index [Integer] The slot index (0-based)
      # @return [Boolean]
      #
      def slot_filled?(index)
        slot_value(index).present?
      end

      # Get the number of filled slots
      #
      # @return [Integer]
      #
      def filled_count
        input_slots.count { |slot| slot.value.present? }
      end

      # Get the number of empty slots
      #
      # @return [Integer]
      #
      def empty_count
        input_slots.count { |slot| slot.value.blank? }
      end

      # Check if any slot is disabled
      #
      # @return [Boolean]
      #
      def disabled?
        input_slots.any?(&:disabled?)
      end

      # Check if a specific slot is disabled
      #
      # @param index [Integer] The slot index (0-based)
      # @return [Boolean]
      #
      def slot_disabled?(index)
        input_slots[index].disabled?
      end

      # Get the currently focused slot index
      #
      # @return [Integer, nil] The index of the focused slot or nil
      #
      def focused_slot_index
        input_slots.each_with_index do |slot, index|
          return index if slot == page.driver.browser.active_element
        end
        nil
      end

      # === Sub-elements ===

      # Get all input slot elements
      #
      # @return [Array<Capybara::Node::Element>]
      #
      def input_slots
        all_within('[data-ui--input-otp-target="input"]')
      end

      # Get a specific input slot
      #
      # @param index [Integer] The slot index (0-based)
      # @return [Capybara::Node::Element]
      #
      def input_slot(index)
        input_slots[index]
      end

      # Get the number of slots
      #
      # @return [Integer]
      #
      def length
        input_slots.length
      end

      # Check if separator is present
      #
      # @return [Boolean]
      #
      def has_separator?
        has_css?('[role="separator"]')
      end

      # Get all separator elements
      #
      # @return [Array<Capybara::Node::Element>]
      #
      def separators
        all_within('[role="separator"]')
      end

      # Get the number of separators
      #
      # @return [Integer]
      #
      def separator_count
        separators.length
      end

      # === Keyboard Navigation ===

      # Navigate to next slot using arrow right
      def navigate_right
        press_arrow_right
      end

      # Navigate to previous slot using arrow left
      def navigate_left
        press_arrow_left
      end

      # Navigate to first slot using Home key
      def navigate_to_first
        press_home
      end

      # Navigate to last slot using End key
      def navigate_to_last
        press_end
      end

      # === Validation Queries ===

      # Get the pattern used for validation
      #
      # @return [String] The regex pattern
      #
      def pattern
        node["data-ui--input-otp-pattern-value"]
      end

      # Check if the pattern is numeric only
      #
      # @return [Boolean]
      #
      def numeric_only?
        pattern == "\\d"
      end

      # Check if the pattern is alphanumeric
      #
      # @return [Boolean]
      #
      def alphanumeric?
        pattern == "[A-Za-z0-9]"
      end
    end
  end
end
