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
        node.checked? || data_state == "checked" || aria_checked?
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
        aria("checked") == "mixed"
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
        return false unless indicator

        # Check opacity class to determine visibility
        indicator[:class].include?("peer-checked:opacity-100") && checked?
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

      # Get the aria-checked attribute value
      #
      # @return [String, nil] "true", "false", or "mixed"
      #
      def aria_checked_value
        aria("checked")
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
