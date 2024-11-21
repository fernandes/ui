require "test_helper"

class UI::CalendarCalculatorTest < ActiveSupport::TestCase
  class November24Test < ActiveSupport::TestCase
    setup do
      @calendar = UI::CalendarCalculator.new(month: 11, year: 2024)
    end

    test "it has 5 weeks" do
      assert_equal 5, @calendar.total_weeks
    end

    test "calendar first week days" do
      expected_days = {
        su: {day: 27, role: :outside},
        mo: {day: 28, role: :outside},
        tu: {day: 29, role: :outside},
        we: {day: 30, role: :outside},
        th: {day: 31, role: :outside},
        fr: {day: 1, role: :inside},
        sa: {day: 2, role: :inside},
      }
      assert_equal expected_days, @calendar.first_week
    end

    test "calendar last week days" do
      expected_days = {
        su: {day: 24, role: :inside},
        mo: {day: 25, role: :inside},
        tu: {day: 26, role: :inside},
        we: {day: 27, role: :inside},
        th: {day: 28, role: :inside},
        fr: {day: 29, role: :inside},
        sa: {day: 30, role: :inside},
      }
      assert_equal expected_days, @calendar.last_week
    end

    test "calendar marks today" do
      expected_days = {
        su: {day: 24, role: :inside},
        mo: {day: 25, role: :inside},
        tu: {day: 26, role: :inside},
        we: {day: 27, role: :today},
        th: {day: 28, role: :inside},
        fr: {day: 29, role: :inside},
        sa: {day: 30, role: :inside},
      }
      travel_to(Time.find_zone("UTC").parse("2024-11-27T15:00")) do
        assert_equal expected_days, @calendar.last_week
      end
    end
  end
end
