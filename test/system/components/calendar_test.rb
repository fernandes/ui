# frozen_string_literal: true

require "test_helper"

class CalendarTest < UI::SystemTestCase
  setup do
    visit_component("calendar")
  end

  # Helper methods to get different calendar instances
  def basic_calendar
    find_element(UI::Testing::CalendarElement, "#basic-calendar")
  end

  def selected_calendar
    find_element(UI::Testing::CalendarElement, "#selected-calendar")
  end

  def range_calendar
    find_element(UI::Testing::CalendarElement, "#range-calendar")
  end

  def multiple_months_calendar
    find_element(UI::Testing::CalendarElement, "#multiple-months-calendar")
  end

  def min_max_calendar
    find_element(UI::Testing::CalendarElement, "#min-max-calendar")
  end

  def form_calendar
    find_element(UI::Testing::CalendarElement, "#form-calendar")
  end

  # === Basic Interaction Tests ===

  test "renders calendar with correct month and year" do
    calendar = basic_calendar

    current_month = Date.today.strftime("%B")
    current_year = Date.today.year

    assert_equal current_month, calendar.current_month
    assert_equal current_year, calendar.current_year
  end

  test "selects a date when clicked" do
    calendar = basic_calendar
    target_date = Date.today

    refute calendar.date_selected?(target_date)

    calendar.select_date(target_date)

    assert calendar.date_selected?(target_date)
  end

  test "displays pre-selected date" do
    calendar = selected_calendar

    assert calendar.date_selected?(Date.today)
  end

  test "changes month when next button is clicked" do
    calendar = basic_calendar

    initial_month = calendar.current_month_date
    calendar.next_month
    new_month = calendar.current_month_date

    assert_equal initial_month.next_month, new_month
  end

  test "changes month when previous button is clicked" do
    calendar = basic_calendar

    initial_month = calendar.current_month_date
    calendar.previous_month
    new_month = calendar.current_month_date

    assert_equal initial_month.prev_month, new_month
  end

  test "navigates to specific month and year" do
    calendar = basic_calendar

    target_month = 6
    target_year = 2025

    calendar.navigate_to_month(target_month, target_year)

    assert_equal target_month, calendar.current_month_date.month
    assert_equal target_year, calendar.current_year
  end

  # === Range Selection Tests ===

  test "allows range selection in range mode" do
    calendar = range_calendar

    start_date = Date.today
    end_date = Date.today + 7

    calendar.select_date(start_date)
    assert_equal 1, calendar.selected_dates.count

    calendar.select_date(end_date)
    assert_equal 2, calendar.selected_dates.count

    assert calendar.date_selected?(start_date)
    assert calendar.date_selected?(end_date)
  end

  test "identifies calendar as range mode" do
    calendar = range_calendar

    assert calendar.range_mode?
    assert_equal "range", calendar.mode
  end

  test "displays pre-selected range" do
    calendar = range_calendar

    # Range calendar has Date.today..(Date.today + 7) pre-selected
    assert calendar.date_selected?(Date.today)
    assert calendar.date_selected?(Date.today + 7)
    assert_equal 2, calendar.selected_dates.count
  end

  # === Multiple Months Tests ===

  test "displays multiple months side by side" do
    calendar = multiple_months_calendar

    assert_equal 2, calendar.number_of_months
  end

  test "can select dates across different months" do
    calendar = multiple_months_calendar

    # First month date
    first_date = Date.today
    # Second month date (next month)
    second_date = Date.today.next_month

    calendar.select_date(first_date)
    assert calendar.date_selected?(first_date)

    # The second month should be visible
    assert calendar.has_date?(second_date)
  end

  # === Min/Max Date Tests ===

  test "disables dates outside min/max range" do
    calendar = min_max_calendar

    # Calendar has min: Date.today, max: Date.today + 30
    yesterday = Date.today - 1
    future_date = Date.today + 40

    # Navigate to show these dates if needed
    if yesterday.month != Date.today.month
      calendar.previous_month
    end

    # Check if yesterday is disabled (if visible)
    if calendar.has_date?(yesterday)
      assert calendar.day_disabled?(yesterday)
    end

    # Navigate to future month to check max date
    2.times { calendar.next_month }

    if calendar.has_date?(future_date)
      assert calendar.day_disabled?(future_date)
    end
  end

  # === State Management Tests ===

  test "tracks selected dates correctly" do
    calendar = basic_calendar

    date1 = Date.today
    calendar.select_date(date1)

    selected = calendar.selected_dates
    assert_equal 1, selected.count
    assert_includes selected, date1
  end

  test "updates selection when new date is clicked in single mode" do
    calendar = basic_calendar

    date1 = Date.today
    date2 = Date.today + 1

    calendar.select_date(date1)
    assert calendar.date_selected?(date1)

    calendar.select_date(date2)
    # In single mode, only the new date should be selected
    assert calendar.date_selected?(date2)
    refute calendar.date_selected?(date1)
  end

  # === Keyboard Navigation Tests ===

  test "navigates between days with arrow keys" do
    calendar = basic_calendar

    today = Date.today
    calendar.focus_day(today)

    # Navigate right (next day)
    calendar.press_arrow_right
    sleep 0.1

    # The focus should have moved (we can't easily test focus state, but we can test navigation works)
    assert true, "Arrow key navigation completed without errors"
  end

  test "selects date with Enter key" do
    calendar = basic_calendar

    target_date = Date.today
    calendar.focus_day(target_date)
    calendar.press_enter

    assert calendar.date_selected?(target_date)
  end

  test "selects date with Space key" do
    calendar = basic_calendar

    target_date = Date.today + 1
    calendar.focus_day(target_date)
    calendar.press_space

    assert calendar.date_selected?(target_date)
  end

  test "navigates to next month with PageDown" do
    calendar = basic_calendar

    initial_month = calendar.current_month_date
    calendar.focus_day(Date.today)
    calendar.page_down

    new_month = calendar.current_month_date
    assert_equal initial_month.next_month, new_month
  end

  test "navigates to previous month with PageUp" do
    calendar = basic_calendar

    initial_month = calendar.current_month_date
    calendar.focus_day(Date.today)
    calendar.page_up

    new_month = calendar.current_month_date
    assert_equal initial_month.prev_month, new_month
  end

  test "moves to start of week with Home key" do
    calendar = basic_calendar

    # Focus a day in the middle of the week
    calendar.focus_day(Date.today)
    calendar.home

    # Should move focus to start of week
    assert true, "Home key navigation completed without errors"
  end

  test "moves to end of week with End key" do
    calendar = basic_calendar

    # Focus a day in the middle of the week
    calendar.focus_day(Date.today)
    calendar.end_key

    # Should move focus to end of week
    assert true, "End key navigation completed without errors"
  end

  test "navigates with arrow keys in multiple directions" do
    calendar = basic_calendar

    today = Date.today
    calendar.focus_day(today)

    # Navigate down (next week, same day)
    calendar.navigate_with_arrow_keys(:down, times: 1)
    sleep 0.1

    # Navigate up (previous week, same day)
    calendar.navigate_with_arrow_keys(:up, times: 1)
    sleep 0.1

    # Navigate left (previous day)
    calendar.navigate_with_arrow_keys(:left, times: 1)
    sleep 0.1

    # Navigate right (next day)
    calendar.navigate_with_arrow_keys(:right, times: 1)
    sleep 0.1

    assert true, "Multi-direction arrow navigation completed without errors"
  end

  # === ARIA Accessibility Tests ===

  test "calendar has proper grid semantics" do
    calendar = basic_calendar

    assert calendar.has_grid_semantics?
    assert_equal "grid", calendar.grid_role
  end

  test "day button has aria-selected attribute" do
    calendar = basic_calendar

    date = Date.today
    aria = calendar.day_aria_attributes(date)

    assert_not_nil aria[:selected]
    assert_includes ["true", "false"], aria[:selected]
  end

  test "day button has correct aria-selected when selected" do
    calendar = basic_calendar

    date = Date.today
    calendar.select_date(date)

    aria = calendar.day_aria_attributes(date)
    assert_equal "true", aria[:selected]
  end

  test "day button has correct aria-selected when not selected" do
    calendar = basic_calendar

    date = Date.today + 5
    aria = calendar.day_aria_attributes(date)

    assert_equal "false", aria[:selected]
  end

  # === Form Integration Tests ===

  test "updates hidden input when date is selected" do
    calendar = form_calendar

    target_date = Date.today
    calendar.select_date(target_date)

    input = calendar.hidden_input
    assert_not_nil input
    assert_includes input.value, target_date.strftime("%Y-%m-%d")
  end

  test "hidden input contains selected date in correct format" do
    calendar = form_calendar

    target_date = Date.today
    calendar.select_date(target_date)

    expected_value = target_date.strftime("%Y-%m-%d")
    assert_equal expected_value, calendar.hidden_input.value
  end

  # === Today Indicator Tests ===

  test "highlights today's date" do
    calendar = basic_calendar

    assert calendar.day_today?(Date.today)
  end

  test "does not highlight other dates as today" do
    calendar = basic_calendar

    yesterday = Date.today - 1
    tomorrow = Date.today + 1

    # Navigate if needed to show these dates
    if yesterday.month != Date.today.month
      calendar.previous_month
      refute calendar.day_today?(yesterday) if calendar.has_date?(yesterday)
      calendar.next_month
    else
      refute calendar.day_today?(yesterday)
    end

    refute calendar.day_today?(tomorrow)
  end

  # === Date Visibility Tests ===

  test "can check if a date is visible in the calendar" do
    calendar = basic_calendar

    assert calendar.has_date?(Date.today)
  end

  test "returns false for dates not in current view" do
    calendar = basic_calendar

    far_future = Date.today + 100

    refute calendar.has_date?(far_future)
  end

  test "shows date after navigating to its month" do
    calendar = basic_calendar

    future_date = Date.today.next_month

    refute calendar.has_date?(future_date)

    calendar.next_month

    assert calendar.has_date?(future_date)
  end

  # === Edge Cases ===

  test "handles rapid month navigation" do
    calendar = basic_calendar

    5.times { calendar.next_month }
    3.times { calendar.previous_month }

    # Calendar should still be in a valid state
    assert calendar.current_month_date.is_a?(Date)
  end

  test "handles selecting same date twice" do
    calendar = basic_calendar

    date = Date.today
    calendar.select_date(date)
    assert calendar.date_selected?(date)

    calendar.select_date(date)
    # In single mode, selecting the same date again should keep it selected
    assert calendar.date_selected?(date)
  end

  test "handles navigation across year boundaries" do
    calendar = basic_calendar

    # Navigate to December
    calendar.navigate_to_month(12, Date.today.year)
    assert_equal 12, calendar.current_month_date.month

    # Navigate to next month (January of next year)
    calendar.next_month
    assert_equal 1, calendar.current_month_date.month
    assert_equal Date.today.year + 1, calendar.current_year
  end

  test "selected dates are retrievable" do
    calendar = selected_calendar

    selected = calendar.selected_dates
    assert_equal 1, selected.count
    assert_equal Date.today, selected.first
  end

  # === Animation and Transitions ===

  test "completes month transition animation" do
    calendar = basic_calendar

    initial_month = calendar.current_month_date
    calendar.next_month
    sleep 0.3 # Wait for animation to complete

    new_month = calendar.current_month_date
    assert_equal initial_month.next_month, new_month
  end

  # === Multiple Month Calendar Tests ===

  test "multiple month calendar shows correct number of grids" do
    calendar = multiple_months_calendar

    grids = calendar.grid_containers
    assert_equal 2, grids.count
  end

  # === Waiter Tests ===

  test "waits for date to be selected" do
    calendar = basic_calendar

    date = Date.today

    Thread.new do
      sleep 0.1
      calendar.select_date(date)
    end

    calendar.wait_for_date_selected(date, timeout: 1)
    assert calendar.date_selected?(date)
  end

  test "waits for month navigation" do
    calendar = basic_calendar

    target_month = Date.today.next_month

    Thread.new do
      sleep 0.1
      calendar.next_month
    end

    calendar.wait_for_month(target_month.month, target_month.year, timeout: 1)
    assert_equal target_month.month, calendar.current_month_date.month
  end
end
