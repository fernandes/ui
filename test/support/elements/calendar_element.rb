# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the Calendar component.
    #
    # @example Basic usage
    #   calendar = CalendarElement.new(find('[data-controller="ui--calendar"]'))
    #   calendar.select_date(Date.today)
    #   assert calendar.date_selected?(Date.today)
    #
    # @example Range selection
    #   calendar.select_date(Date.today)
    #   calendar.select_date(Date.today + 7)
    #   assert_equal 2, calendar.selected_dates.count
    #
    # @example Keyboard navigation
    #   calendar.focus_day(Date.today)
    #   calendar.press_arrow_right
    #   calendar.press_enter
    #
    class CalendarElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--calendar"]'

      # === Actions ===

      # Select a date by clicking on it
      #
      # @param date [Date] The date to select
      #
      def select_date(date)
        day_button(date).click
        sleep 0.1 # Wait for state update
      end

      # Navigate to next month
      def next_month
        next_month_button.click
        sleep 0.2 # Wait for animation
      end

      # Navigate to previous month
      def previous_month
        previous_month_button.click
        sleep 0.2 # Wait for animation
      end

      # Navigate to a specific month and year
      #
      # @param month [Integer] Month number (1-12)
      # @param year [Integer] Year
      #
      def navigate_to_month(month, year)
        target_date = Date.new(year, month, 1)
        current = current_month_date

        # Navigate forward or backward until we reach the target month
        while current.year != year || current.month != month
          if target_date > current
            next_month
          else
            previous_month
          end
          current = current_month_date
        end
      end

      # Go to today's date
      def go_to_today
        today_button = day_button(Date.today)
        today_button.click
        sleep 0.1
      end

      # Focus a specific day
      #
      # @param date [Date] The date to focus
      #
      def focus_day(date)
        day_button(date).native.focus
        sleep 0.05
      end

      # === State Queries ===

      # Get the currently selected date(s)
      #
      # @return [Array<Date>] Array of selected dates
      #
      def selected_dates
        selected_buttons.map { |btn| Date.parse(btn["data-date"]) }
      end

      # Get the currently displayed month as a Date object
      #
      # @return [Date] The first day of the currently displayed month
      #
      def current_month_date
        # Parse the month label text (e.g., "November 2024")
        label_text = month_label.text.strip
        Date.parse("1 #{label_text}")
      end

      # Get the currently displayed month name
      #
      # @return [String] Month name (e.g., "November")
      #
      def current_month
        current_month_date.strftime("%B")
      end

      # Get the currently displayed year
      #
      # @return [Integer] Year (e.g., 2024)
      #
      def current_year
        current_month_date.year
      end

      # Check if a specific date is selected
      #
      # @param date [Date] The date to check
      # @return [Boolean]
      #
      def date_selected?(date)
        day_button(date)["aria-selected"] == "true"
      end

      # Check if a specific day is disabled
      #
      # @param date [Date] The date to check
      # @return [Boolean]
      #
      def day_disabled?(date)
        day_button(date).disabled?
      end

      # Check if a specific day is today
      #
      # @param date [Date] The date to check
      # @return [Boolean]
      #
      def day_today?(date)
        return false unless has_day?(date)

        button = day_button(date)
        classes = button[:class]&.split(/\s+/) || []
        classes.include?("bg-accent")
      end

      # Check if a specific date is visible in the calendar
      #
      # @param date [Date] The date to check
      # @return [Boolean]
      #
      def has_date?(date)
        date_str = date.strftime("%Y-%m-%d")
        node.has_css?("[data-date='#{date_str}']", wait: 0)
      end

      alias_method :has_day?, :has_date?

      # Get the calendar mode (single, range, or multiple)
      #
      # @return [String] "single", "range", or "multiple"
      #
      def mode
        node["data-ui--calendar-mode-value"] || "single"
      end

      # Check if the calendar is in range mode
      #
      # @return [Boolean]
      #
      def range_mode?
        mode == "range"
      end

      # Check if the calendar is in multiple selection mode
      #
      # @return [Boolean]
      #
      def multiple_mode?
        mode == "multiple"
      end

      # Get the number of months displayed
      #
      # @return [Integer]
      #
      def number_of_months
        grid_containers.count
      end

      # === Sub-elements ===

      # Get the month label element
      #
      # @return [Capybara::Node::Element]
      #
      def month_label
        find_within("[data-ui--calendar-target='monthLabel']")
      end

      # Get the day button for a specific date
      #
      # @param date [Date] The date
      # @return [Capybara::Node::Element]
      #
      def day_button(date)
        date_str = date.strftime("%Y-%m-%d")
        find_within("[data-date='#{date_str}']")
      end

      # Get all selected day buttons
      #
      # @return [Array<Capybara::Node::Element>]
      #
      def selected_buttons
        all_within("[aria-selected='true']")
      end

      # Get the previous month navigation button
      #
      # @return [Capybara::Node::Element]
      #
      def previous_month_button
        find_within("button[data-action*='previousMonth']")
      end

      # Get the next month navigation button
      #
      # @return [Capybara::Node::Element]
      #
      def next_month_button
        find_within("button[data-action*='nextMonth']")
      end

      # Get all calendar grid containers
      #
      # @return [Array<Capybara::Node::Element>]
      #
      def grid_containers
        all_within("[data-ui--calendar-target='grid']")
      end

      # Get the calendar grid (tbody element)
      #
      # @return [Capybara::Node::Element]
      #
      def grid
        find_within("[data-ui--calendar-target='grid']")
      end

      # Get the hidden input (if present)
      #
      # @return [Capybara::Node::Element, nil]
      #
      def hidden_input
        find_within("[data-ui--calendar-target='input']", visible: :all)
      rescue Capybara::ElementNotFound
        nil
      end

      # === ARIA Queries ===

      # Get ARIA attributes for a specific day button
      #
      # @param date [Date] The date
      # @return [Hash] Hash of ARIA attribute values
      #
      def day_aria_attributes(date)
        button = day_button(date)
        {
          selected: button["aria-selected"],
          label: button["aria-label"]
        }
      end

      # Get the grid role
      #
      # @return [String] Should be "grid"
      #
      def grid_role
        find_within("table")["role"]
      end

      # Check if the calendar has proper grid semantics
      #
      # @return [Boolean]
      #
      def has_grid_semantics?
        grid_role == "grid" &&
          node.has_css?("[role='rowgroup']", wait: 0)
      end

      # === Keyboard Navigation Helpers ===

      # Navigate using arrow keys
      def navigate_with_arrow_keys(direction, times: 1)
        times.times do
          case direction
          when :up
            press_arrow_up
          when :down
            press_arrow_down
          when :left
            press_arrow_left
          when :right
            press_arrow_right
          else
            raise ArgumentError, "Invalid direction: #{direction}"
          end
          sleep 0.05
        end
      end

      # Navigate to previous month with PageUp
      def page_up
        send_keys(:page_up)
        sleep 0.2
      end

      # Navigate to next month with PageDown
      def page_down
        send_keys(:page_down)
        sleep 0.2
      end

      # Navigate to start of week with Home
      def home
        press_home
        sleep 0.05
      end

      # Navigate to end of week with End
      def end_key
        press_end
        sleep 0.05
      end

      # Select the currently focused date with Enter
      def select_focused_date
        press_enter
        sleep 0.1
      end

      # === Waiters ===

      # Wait for a date to become selected
      #
      # @param date [Date] The date to wait for
      # @param timeout [Float] Maximum time to wait
      #
      def wait_for_date_selected(date, timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if date_selected?(date)
          if Time.now - start_time > timeout
            raise Capybara::ExpectationNotMet,
              "Date #{date} was not selected after #{timeout}s"
          end

          sleep 0.05
        end
      end

      # Wait for the calendar to navigate to a specific month
      #
      # @param month [Integer] Month number (1-12)
      # @param year [Integer] Year
      # @param timeout [Float] Maximum time to wait
      #
      def wait_for_month(month, year, timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          current = current_month_date
          return true if current.month == month && current.year == year
          if Time.now - start_time > timeout
            raise Capybara::ExpectationNotMet,
              "Calendar did not navigate to #{month}/#{year} after #{timeout}s"
          end

          sleep 0.05
        end
      end
    end
  end
end
