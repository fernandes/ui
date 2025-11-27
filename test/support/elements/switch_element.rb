# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the Switch component.
    #
    # @example Basic usage
    #   switch = SwitchElement.new(find('[data-controller="ui--switch"]'))
    #   switch.toggle
    #   assert switch.on?
    #
    # @example Keyboard interaction
    #   switch.focus
    #   switch.press_space
    #   assert switch.on?
    #
    class SwitchElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--switch"]'

      # === Actions ===

      # Toggle the switch (click to change state)
      def toggle
        return if disabled?

        node.click
        sleep 0.05 # Allow state to update
      end

      # Turn the switch on (if not already on)
      def turn_on
        return if on?

        toggle
      end

      # Turn the switch off (if not already off)
      def turn_off
        return if off?

        toggle
      end

      # === State Queries ===

      # Check if the switch is on (checked)
      #
      # @return [Boolean]
      #
      def on?
        checked?
      end

      # Check if the switch is off (unchecked)
      #
      # @return [Boolean]
      #
      def off?
        !on?
      end

      # Check if the switch is checked (via data-state or aria-checked)
      #
      # @return [Boolean]
      #
      def checked?
        data_state == "checked" || aria_checked?
      end

      # Check if the switch is unchecked
      #
      # @return [Boolean]
      #
      def unchecked?
        data_state == "unchecked" || !aria_checked?
      end

      # === Value Queries ===

      # Get the value when checked (from hidden input if present)
      #
      # @return [String, nil]
      #
      def value
        input = hidden_input
        input ? input["value"] : nil
      end

      # Get the name attribute (from hidden input if present)
      #
      # @return [String, nil]
      #
      def name
        input = hidden_input
        input ? input["name"] : nil
      end

      # === Sub-elements ===

      # Get the thumb element
      #
      # @return [Capybara::Node::Element, nil]
      #
      def thumb
        first_within('[data-ui--switch-target="thumb"]')
      end

      # Get the hidden input element (for form submission)
      #
      # @return [Capybara::Node::Element, nil]
      #
      def hidden_input
        first_within('input[type="hidden"]', visible: :all)
      end

      # === ARIA Queries ===

      # Check if switch has correct ARIA attributes
      #
      # @return [Hash] Hash of ARIA attribute values
      #
      def aria_attributes
        {
          role: node["role"],
          checked: node["aria-checked"]
        }
      end

      # === Keyboard Navigation ===

      # Override focus to use JavaScript (capybara-playwright-driver doesn't support send_keys([]))
      def focus
        script = "document.evaluate('#{node.path}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.focus()"
        page.evaluate_script(script)
        sleep 0.05
      end

      # Focus the switch and verify it received focus
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

      # Wait for switch to be checked
      #
      # @param timeout [Integer] Maximum time to wait in seconds
      #
      def wait_for_checked(timeout: Capybara.default_max_wait_time)
        wait_for_state("checked", timeout: timeout)
      end

      # Wait for switch to be unchecked
      #
      # @param timeout [Integer] Maximum time to wait in seconds
      #
      def wait_for_unchecked(timeout: Capybara.default_max_wait_time)
        wait_for_state("unchecked", timeout: timeout)
      end
    end
  end
end
