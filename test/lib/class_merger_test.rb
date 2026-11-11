# frozen_string_literal: true

require "test_helper"

class ClassMergerTest < ActiveSupport::TestCase
  test "resolves conflicting tailwind classes, last one wins" do
    assert_equal "w-full px-4", UI::ClassMerger.merge("px-2 w-full px-4")
  end

  test "reuses one merger within a thread" do
    assert_same UI::ClassMerger.merger, UI::ClassMerger.merger
  end

  test "reuses the merger across fibers of the same thread" do
    main = UI::ClassMerger.merger
    assert_same main, Fiber.new { UI::ClassMerger.merger }.resume
  end

  # The merger's LRU cache is not thread-safe, so threads must not share it.
  test "gives each thread its own merger" do
    main = UI::ClassMerger.merger
    other = Thread.new { UI::ClassMerger.merger }.value

    refute_same main, other
  end
end
