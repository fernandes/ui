# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the Select component.
    #
    # @example Basic usage
    #   select = SelectElement.new(find('[data-controller="ui--select"]'))
    #   select.select("Apple")
    #   assert_equal "Apple", select.selected
    #
    # @example Keyboard navigation
    #   select.open
    #   select.press_arrow_down
    #   select.press_arrow_down
    #   select.press_enter
    #
    class SelectElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--select"]'

      # === Actions ===

      # Open the select dropdown
      def open
        return if open?

        trigger.click
        wait_for_open
      end

      # Close the select dropdown
      def close
        return if closed?

        press_escape
        wait_for_closed
      end

      # Select an option by its visible text
      #
      # @param option_text [String] The text of the option to select
      #
      def select(option_text)
        open
        option = find_option(option_text)
        option.click
        wait_for_closed
      end

      # Select an option by its data-value attribute
      #
      # @param value [String] The data-value of the option
      #
      def select_by_value(value)
        open
        option = find_option_by_value(value)
        option.click
        wait_for_closed
      end

      # Select an option using keyboard navigation
      #
      # @param option_text [String] The text of the option to select
      #
      def select_with_keyboard(option_text)
        focus_trigger
        press_enter # Open the select

        wait_for_open

        # Navigate to the option
        current_options = options
        target_index = current_options.index(option_text)

        return unless target_index

        # Navigate down to the target
        target_index.times { press_arrow_down }

        press_enter # Select
        wait_for_closed
      end

      # === State Queries ===

      # Check if the dropdown is open
      def open?
        node["data-ui--select-open-value"] == "true"
      end

      # Check if the dropdown is closed
      def closed?
        !open?
      end

      # Get the currently selected option text
      #
      # @return [String] The text of the selected option
      #
      def selected
        trigger.text.strip
      end

      # Get the currently selected option value
      #
      # @return [String, nil] The data-value of the selected option
      #
      def selected_value
        node["data-ui--select-value-value"]
      end

      # Check if a placeholder is shown (no selection)
      def has_placeholder?
        trigger["data-placeholder"].present?
      end

      # Get the placeholder text
      #
      # @return [String, nil] The placeholder text
      #
      def placeholder
        trigger["data-placeholder"]
      end

      # === Options Queries ===

      # Get all available option texts
      #
      # @return [Array<String>] Array of option texts
      #
      def options
        ensure_open
        all_options.map { |opt| opt.text.strip }
      end

      # Get all available option values
      #
      # @return [Array<String>] Array of option data-values
      #
      def option_values
        ensure_open
        all_options.map { |opt| opt["data-value"] }
      end

      # Check if an option with the given text exists
      #
      # @param text [String] The option text to check
      # @return [Boolean]
      #
      def has_option?(text)
        ensure_open
        content.has_css?('[role="option"]', text: text)
      end

      # Get the number of options
      #
      # @return [Integer]
      #
      def option_count
        ensure_open
        all_options.count
      end

      # Check if an option is disabled
      #
      # @param text [String] The option text
      # @return [Boolean]
      #
      def option_disabled?(text)
        ensure_open
        option = find_option(text)
        option["data-disabled"] == "true" || option["aria-disabled"] == "true"
      end

      # Get the currently highlighted option (keyboard focus)
      #
      # @return [String, nil] The text of the highlighted option
      #
      def highlighted_option
        ensure_open
        highlighted = content.first('[role="option"][data-highlighted="true"]')
        highlighted&.text&.strip
      end

      # === Sub-elements ===

      # Get the trigger button element
      #
      # @return [Capybara::Node::Element]
      #
      def trigger
        find_within('[data-ui--select-target="trigger"]')
      end

      # Get the content/dropdown element (rendered as portal)
      #
      # @return [Capybara::Node::Element]
      #
      def content
        # Content is positioned absolutely within the select container
        find_within('[data-ui--select-target="content"]')
      end

      # Get the viewport element (scrollable area)
      #
      # @return [Capybara::Node::Element, nil]
      #
      def viewport
        first_within('[data-ui--select-target="viewport"]')
      end

      # === Keyboard Navigation ===

      # Focus the trigger button
      def focus_trigger
        trigger.click
        # Wait a moment for focus
        sleep 0.05
      end

      # Navigate to next option
      def navigate_down
        press_arrow_down
      end

      # Navigate to previous option
      def navigate_up
        press_arrow_up
      end

      # Navigate to first option
      def navigate_to_first
        press_home
      end

      # Navigate to last option
      def navigate_to_last
        press_end
      end

      # Select the currently highlighted option
      def confirm_selection
        press_enter
      end

      # === ARIA Queries ===

      # Check if trigger has correct ARIA attributes
      #
      # @return [Hash] Hash of ARIA attribute values
      #
      def trigger_aria_attributes
        {
          expanded: trigger["aria-expanded"],
          haspopup: trigger["aria-haspopup"],
          role: trigger["role"]
        }
      end

      # Check if content has correct role
      #
      # @return [String, nil] The role attribute
      #
      def content_role
        content["role"]
      end

      # === Scroll Button Queries (for scrollable selects) ===

      # Check if scroll up button is visible
      def scroll_up_visible?
        ensure_open
        btn = first_within('[data-ui--select-target="scrollUpButton"]')
        btn&.visible?
      end

      # Check if scroll down button is visible
      def scroll_down_visible?
        ensure_open
        btn = first_within('[data-ui--select-target="scrollDownButton"]')
        btn&.visible?
      end

      # === Waiters ===

      def wait_for_open(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if open?
          raise Capybara::ExpectationNotMet, "Select did not open after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      def wait_for_closed(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if closed?
          raise Capybara::ExpectationNotMet, "Select did not close after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      private

      def ensure_open
        open unless open?
      end

      def find_option(text)
        content.find('[role="option"]', text: text)
      end

      def find_option_by_value(value)
        content.find("[role='option'][data-value='#{value}']")
      end

      def all_options
        content.all('[role="option"]')
      end
    end
  end
end
