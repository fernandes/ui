# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the Checkbox component.
    #
    # @example Basic usage
    #   checkbox = CheckboxElement.new(find('[data-controller="ui--checkbox"]'))
    #   checkbox.check
    #   assert checkbox.checked?
    #
    # @example Keyboard interaction
    #   checkbox.focus
    #   checkbox.press_space
    #   assert checkbox.checked?
    #
    class CheckboxElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--checkbox"]'

      # === Actions ===

      # Check the checkbox (if not already checked)
      def check
        return if checked?

        click
        wait_for_checked
      end

      # Uncheck the checkbox (if not already unchecked)
      def uncheck
        return if unchecked?

        click
        wait_for_unchecked
      end

      # Toggle the checkbox state
      def toggle
        click
      end

      # === State Queries ===

      # Check if the checkbox is checked
      #
      # @return [Boolean]
      #
      def checked?
        node.checked?
      end

      # Check if the checkbox is unchecked
      #
      # @return [Boolean]
      #
      def unchecked?
        !checked?
      end

      # Check if the checkbox is in indeterminate state
      #
      # @return [Boolean]
      #
      def indeterminate?
        evaluate_script("document.getElementById(#{node[:id].to_json}).indeterminate") == true
      end

      # Check if the checkbox is disabled
      #
      # @return [Boolean]
      #
      def disabled?
        node.disabled? || aria_disabled?
      end

      # Check if the checkbox is required
      #
      # @return [Boolean]
      #
      def required?
        node[:required].present?
      end

      # Get the checkbox value attribute
      #
      # @return [String, nil]
      #
      def value
        node[:value]
      end

      # Get the checkbox name attribute
      #
      # @return [String, nil]
      #
      def name
        node[:name]
      end

      # Get the checkbox ID
      #
      # @return [String, nil]
      #
      def id
        node[:id]
      end

      # === Sub-elements ===

      # Get the checkmark indicator element (SVG icon)
      #
      # @return [Capybara::Node::Element, nil]
      #
      def indicator
        # The indicator is the SVG icon sibling within the parent div
        parent = node.find(:xpath, "..")
        parent.first("svg", visible: :all)
      end

      # Check if the indicator is visible
      #
      # @return [Boolean]
      #
      def indicator_visible?
        icon_settled_opacity(0) > 0
      end

      # Check if the indeterminate (minus) indicator is visible
      #
      # @return [Boolean]
      #
      def indeterminate_indicator_visible?
        icon_settled_opacity(1) > 0
      end

      # Computed opacity of the n-th icon next to the input, once the opacity
      # transition has settled (same value twice, 200ms apart).
      def icon_settled_opacity(index)
        script = "parseFloat(getComputedStyle(document.getElementById(#{node[:id].to_json}).parentElement.querySelectorAll('svg')[#{index}]).opacity)"
        previous = evaluate_script(script)
        10.times do
          sleep 0.2
          current = evaluate_script(script)
          return current if current == previous && [0.0, 1.0].include?(current)
          previous = current
        end
        previous
      end

      # Get the associated label element (if any)
      #
      # @return [Capybara::Node::Element, nil]
      #
      def label
        return nil unless id.present?

        page.first("label[for='#{id}']")
      end

      # Get the label text (if label exists)
      #
      # @return [String, nil]
      #
      def label_text
        label&.text&.strip
      end

      # === ARIA Queries ===

      # The checked state the browser exposes to assistive technology.
      # It's a native checkbox, so this comes from the element's properties,
      # not from an aria-checked attribute.
      #
      # @return [String] "true", "false", or "mixed"
      #
      def aria_checked_value
        return "mixed" if indeterminate?

        checked? ? "true" : "false"
      end

      # Check if checkbox has correct ARIA attributes
      #
      # @return [Hash] Hash of ARIA attribute values
      #
      def aria_attributes
        {
          checked: aria("checked"),
          disabled: aria("disabled"),
          invalid: aria("invalid")
        }
      end

      # === Keyboard Navigation ===

      # Focus the checkbox
      def focus
        node.native.focus
      end

      # Toggle checkbox with space key
      def toggle_with_space
        focus
        press_space
      end

      # === Waiters ===

      # Wait for checkbox to become checked
      def wait_for_checked(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if checked?
          if Time.now - start_time > timeout
            raise Capybara::ExpectationNotMet, "Checkbox did not become checked after #{timeout}s"
          end

          sleep 0.05
        end
      end

      # Wait for checkbox to become unchecked
      def wait_for_unchecked(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if unchecked?
          if Time.now - start_time > timeout
            raise Capybara::ExpectationNotMet, "Checkbox did not become unchecked after #{timeout}s"
          end

          sleep 0.05
        end
      end

      # Wait for specific data-state
      def wait_for_data_state(expected_state, timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if data_state == expected_state
          if Time.now - start_time > timeout
            raise Capybara::ExpectationNotMet,
              "Expected data-state='#{expected_state}', got '#{data_state}' after #{timeout}s"
          end

          sleep 0.05
        end
      end
    end
  end
end
