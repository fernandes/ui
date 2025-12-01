# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the DatePicker component.
    #
    # @example Basic usage
    #   picker = DatePickerElement.new(find('[data-controller="ui--datepicker"]'))
    #   picker.open
    #   picker.select_date(Date.today)
    #   assert_equal "November 27, 2025", picker.selected_text
    #
    # @example Range selection
    #   picker.open
    #   picker.select_date(Date.today)
    #   picker.select_date(Date.today + 7)
    #   assert picker.range_selected?
    #
    # @example Keyboard navigation
    #   picker.trigger.send_keys(:enter)
    #   picker.press_escape
    #
    class DatePickerElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--datepicker"]'

      # === Actions ===

      # Open the date picker by clicking the trigger
      def open
        return if open?

        trigger.click
        wait_for_open
      end

      # Close the date picker
      def close
        return if closed?

        # Click outside to close
        page.evaluate_script("document.body.click()")
        wait_for_closed
      end

      # Close using Escape key
      def close_with_escape
        return if closed?

        press_escape
        wait_for_closed
      end

      # Select a date in the calendar
      #
      # @param date [Date] The date to select
      #
      def select_date(date)
        calendar.select_date(date)
        sleep 0.1 # Wait for state update
      end

      # Navigate to next month
      def next_month
        calendar.next_month
      end

      # Navigate to previous month
      def previous_month
        calendar.previous_month
      end

      # Navigate to a specific month
      #
      # @param month [Integer] Month number (1-12)
      # @param year [Integer] Year
      #
      def navigate_to_month(month, year)
        calendar.navigate_to_month(month, year)
      end

      # Clear the selection (if supported)
      def clear
        # Currently no clear button, but we can click the trigger to toggle
        # For now, this would need to select nothing or click a clear icon if added
      end

      # === State Queries ===

      # Check if the date picker popover is open
      def open?
        popover.open?
      end

      # Check if the date picker popover is closed
      def closed?
        popover.closed?
      end

      # Get the selected date text displayed in the trigger
      #
      # @return [String] The displayed date text
      #
      def selected_text
        label.text.strip
      end

      # Get the placeholder text (when no date is selected)
      #
      # @return [String] The placeholder text
      #
      def placeholder
        node["data-ui--datepicker-placeholder-value"]
      end

      # Check if the selected text shows a placeholder (no selection)
      def has_placeholder?
        text = selected_text
        # Check if text includes typical placeholder keywords
        placeholder_keywords = ["Pick", "Select", "Choose"]
        placeholder_keywords.any? { |keyword| text.include?(keyword) }
      end

      # Check if a specific date is selected
      #
      # @param date [Date] The date to check
      # @return [Boolean]
      #
      def date_selected?(date)
        calendar.date_selected?(date)
      end

      # Get the selected dates from the calendar
      #
      # @return [Array<Date>] Array of selected dates
      #
      def selected_dates
        calendar.selected_dates
      end

      # Check if date range is selected (for range mode)
      def range_selected?
        selected_dates.count == 2
      end

      # Get the selection mode
      #
      # @return [String] "single", "range", or "multiple"
      #
      def mode
        node["data-ui--datepicker-mode-value"] || "single"
      end

      # Check if in range mode
      def range_mode?
        mode == "range"
      end

      # Check if in multiple selection mode
      def multiple_mode?
        mode == "multiple"
      end

      # Get the locale setting
      #
      # @return [String] BCP 47 locale tag
      #
      def locale
        node["data-ui--datepicker-locale-value"] || "en-US"
      end

      # Get the format setting
      #
      # @return [String] Date format style
      #
      def format
        node["data-ui--datepicker-format-value"] || "long"
      end

      # Check if close_on_select is enabled
      def close_on_select?
        value = node["data-ui--datepicker-close-on-select-value"]
        value.nil? || value == "true"
      end

      # Get the label text (if present)
      #
      # @return [String, nil] Label text
      #
      def label_text
        return nil unless has_label?

        label_element.text.strip
      end

      # Check if picker has a label
      def has_label?
        node.has_css?("label", wait: 0)
      end

      # === Sub-elements ===

      # Get the trigger button element
      #
      # @return [Capybara::Node::Element]
      #
      def trigger
        find_within('[data-ui--popover-target="trigger"]')
      end

      # Get the label span within the trigger
      #
      # @return [Capybara::Node::Element]
      #
      def label
        find_within('[data-ui--datepicker-target="label"]')
      end

      # Get the label element (if present)
      #
      # @return [Capybara::Node::Element, nil]
      #
      def label_element
        find_within("label")
      rescue Capybara::ElementNotFound
        nil
      end

      # Get the popover element
      #
      # @return [PopoverElement]
      #
      def popover
        PopoverElement.new(find_within('[data-controller="ui--popover"]'))
      end

      # Get the calendar element within the popover
      # Note: Calendar is rendered in the popover content, which may be outside the main node
      # The calendar may not be visible when popover is closed
      #
      # @return [CalendarElement]
      #
      def calendar
        # Find calendar within the popover's content element
        popover_content = popover.content
        CalendarElement.new(popover_content.find('[data-controller="ui--calendar"]', visible: :all))
      end

      # Get the hidden input (if present)
      #
      # @return [Capybara::Node::Element, nil]
      #
      def hidden_input
        find_within('[data-ui--datepicker-target="hiddenInput"]', visible: :all)
      rescue Capybara::ElementNotFound
        nil
      end

      # Check if picker has a hidden input for form submission
      def has_hidden_input?
        node.has_css?('[data-ui--datepicker-target="hiddenInput"]', visible: :all, wait: 0)
      end

      # Get the hidden input value
      #
      # @return [String, nil] The hidden input value
      #
      def hidden_input_value
        return nil unless has_hidden_input?

        hidden_input.value
      end

      # === Icon Queries ===

      # Check if trigger has a calendar icon
      def has_calendar_icon?
        # Check for SVG with calendar-specific path d="M8 2v4"
        trigger.has_css?('svg path[d="M8 2v4"]', wait: 0)
      end

      # Check if trigger has a chevron icon
      def has_chevron_icon?
        # Check for SVG with chevron-specific path d="m6 9 6 6 6-6"
        trigger.has_css?('svg path[d="m6 9 6 6 6-6"]', wait: 0)
      end

      # === Waiters ===

      def wait_for_open(timeout: Capybara.default_max_wait_time)
        popover.wait_for_open(timeout: timeout)
      end

      def wait_for_closed(timeout: Capybara.default_max_wait_time)
        popover.wait_for_closed(timeout: timeout)
      end

      # Wait for a date to be selected
      #
      # @param date [Date] The date to wait for
      # @param timeout [Float] Maximum time to wait
      #
      def wait_for_date_selected(date, timeout: Capybara.default_max_wait_time)
        calendar.wait_for_date_selected(date, timeout: timeout)
      end

      # Wait for the selected text to update
      #
      # @param expected_text [String] The expected text
      # @param timeout [Float] Maximum time to wait
      #
      def wait_for_selected_text(expected_text, timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if selected_text == expected_text
          if Time.now - start_time > timeout
            raise Capybara::ExpectationNotMet,
              "Expected selected text '#{expected_text}', got '#{selected_text}' after #{timeout}s"
          end

          sleep 0.05
        end
      end
    end
  end
end
