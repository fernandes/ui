# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the Toggle component.
    #
    # @example Basic usage
    #   toggle = ToggleElement.new(find('[data-controller="ui--toggle"]'))
    #   toggle.toggle
    #   assert toggle.pressed?
    #
    # @example Keyboard interaction
    #   toggle.focus
    #   toggle.press_space
    #   assert toggle.pressed?
    #
    class ToggleElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--toggle"]'

      # === Actions ===

      # Toggle the button (click to change state)
      def toggle
        return if disabled?

        node.click
        sleep 0.05 # Allow state to update
      end

      # Press the toggle (if not already pressed)
      def press
        return if pressed?

        toggle
      end

      # Release the toggle (if currently pressed)
      def release
        return if released?

        toggle
      end

      # === State Queries ===

      # Check if the toggle is pressed (active)
      #
      # @return [Boolean]
      #
      def pressed?
        data_state == "on" || aria_pressed?
      end

      # Check if the toggle is released (inactive)
      #
      # @return [Boolean]
      #
      def released?
        !pressed?
      end

      # === ARIA Queries ===

      # Check if toggle has correct ARIA attributes
      #
      # @return [Hash] Hash of ARIA attribute values
      #
      def aria_attributes
        {
          role: node["role"],
          pressed: node["aria-pressed"]
        }
      end

      # === Keyboard Navigation ===

      # Override focus to use JavaScript (capybara-playwright-driver doesn't support send_keys([]))
      def focus
        script = "document.evaluate('#{node.path}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.focus()"
        page.evaluate_script(script)
        sleep 0.05
      end

      # Focus the toggle and verify it received focus
      def focus_and_verify
        # Use JavaScript to focus the element
        script = "document.evaluate('#{node.path}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.focus()"
        page.evaluate_script(script)
        sleep 0.05

        check_script = "document.activeElement === document.evaluate('#{node.path}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue"
        is_focused = page.evaluate_script(check_script)

        is_focused
      end

      # Toggle using Space key
      def toggle_with_space
        press_space
        sleep 0.05 # Allow state to update
      end

      # Toggle using Enter key
      def toggle_with_enter
        press_enter
        sleep 0.05 # Allow state to update
      end

      # === Waiters ===

      # Wait for toggle to be pressed
      #
      # @param timeout [Integer] Maximum time to wait in seconds
      #
      def wait_for_pressed(timeout: Capybara.default_max_wait_time)
        wait_for_state("on", timeout: timeout)
      end

      # Wait for toggle to be released
      #
      # @param timeout [Integer] Maximum time to wait in seconds
      #
      def wait_for_released(timeout: Capybara.default_max_wait_time)
        wait_for_state("off", timeout: timeout)
      end
    end
  end
end
