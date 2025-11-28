# frozen_string_literal: true

require "test_helper"

class CarouselTest < UI::SystemTestCase
  setup do
    visit_component("carousel")
  end

  # Helper methods for different carousels
  def basic_carousel
    find_element(UI::TestingCarouselElement, "#erb-basic-carousel")
  end

  def sizes_carousel
    find_element(UI::TestingCarouselElement, "#erb-sizes-carousel")
  end

  def spacing_carousel
    find_element(UI::TestingCarouselElement, "#erb-spacing-carousel")
  end

  def orientation_carousel
    find_element(UI::TestingCarouselElement, "#erb-orientation-carousel")
  end

  def autoplay_carousel
    find_element(UI::TestingCarouselElement, "#erb-autoplay-carousel")
  end

  # === Basic Navigation Tests ===

  test "displays the first slide initially" do
    carousel = basic_carousel

    assert_equal 0, carousel.current_slide_index
    assert carousel.at_first_slide?
    refute carousel.at_last_slide?
  end

  test "navigates to next slide when next button is clicked" do
    carousel = basic_carousel

    carousel.next_slide

    assert_equal 1, carousel.current_slide_index
  end

  test "navigates to previous slide when previous button is clicked" do
    carousel = basic_carousel

    # First go to slide 2
    carousel.next_slide
    carousel.next_slide
    assert_equal 2, carousel.current_slide_index

    # Then go back
    carousel.prev_slide

    assert_equal 1, carousel.current_slide_index
  end

  test "navigates through all slides" do
    carousel = basic_carousel
    total_slides = carousel.slides_count

    assert_equal 5, total_slides

    # Navigate forward through all slides
    (total_slides - 1).times do |i|
      carousel.next_slide
      assert_equal i + 1, carousel.current_slide_index
    end

    assert carousel.at_last_slide?
  end

  test "go_to_slide navigates to specific slide" do
    carousel = basic_carousel

    carousel.go_to_slide(3)

    assert_equal 3, carousel.current_slide_index
    assert_equal "4", carousel.slide_content(3)
  end

  # === Button State Tests ===

  test "previous button is disabled at first slide" do
    carousel = basic_carousel

    assert carousel.at_first_slide?
    refute carousel.can_scroll_prev?
  end

  test "next button is disabled at last slide" do
    carousel = basic_carousel

    # Navigate to last slide
    carousel.go_to_slide(4)

    assert carousel.at_last_slide?
    refute carousel.can_scroll_next?
  end

  test "both buttons are enabled in the middle" do
    carousel = basic_carousel

    carousel.next_slide
    carousel.next_slide

    assert carousel.can_scroll_prev?
    assert carousel.can_scroll_next?
  end

  # === Slides Count Tests ===

  test "counts total slides correctly" do
    carousel = basic_carousel

    assert_equal 5, carousel.slides_count
  end

  test "retrieves slide content correctly" do
    carousel = basic_carousel

    assert_equal "1", carousel.slide_content(0)
    assert_equal "2", carousel.slide_content(1)
    assert_equal "3", carousel.slide_content(2)
    assert_equal "4", carousel.slide_content(3)
    assert_equal "5", carousel.slide_content(4)
  end

  # === Orientation Tests ===

  test "horizontal carousel has correct orientation" do
    carousel = basic_carousel

    assert_equal "horizontal", carousel.orientation
    assert carousel.horizontal?
    refute carousel.vertical?
  end

  test "vertical carousel has correct orientation" do
    carousel = orientation_carousel

    assert_equal "vertical", carousel.orientation
    assert carousel.vertical?
    refute carousel.horizontal?
  end

  test "vertical carousel navigation works" do
    carousel = orientation_carousel

    assert_equal 0, carousel.current_slide_index

    carousel.next_slide
    assert_equal 1, carousel.current_slide_index

    carousel.prev_slide
    assert_equal 0, carousel.current_slide_index
  end

  # === Keyboard Navigation Tests ===
  # Note: Keyboard navigation is handled by the carousel controller's keydown action
  # These tests verify the helper methods exist and orientation detection works

  test "carousel detects horizontal orientation for keyboard" do
    carousel = basic_carousel

    assert carousel.horizontal?
    refute carousel.vertical?
  end

  test "carousel detects vertical orientation for keyboard" do
    carousel = orientation_carousel

    assert carousel.vertical?
    refute carousel.horizontal?
  end

  # === Loop Behavior Tests ===

  test "carousel without loop disables navigation at boundaries" do
    carousel = basic_carousel

    refute carousel.loop_enabled?

    # At first slide
    assert carousel.at_first_slide?
    refute carousel.can_scroll_prev?

    # At last slide
    carousel.go_to_slide(4)
    assert carousel.at_last_slide?
    refute carousel.can_scroll_next?
  end

  test "carousel with loop and autoplay configuration" do
    carousel = autoplay_carousel

    assert carousel.loop_enabled?
    assert carousel.autoplay_enabled?

    # Carousel should have all slides
    assert_equal 5, carousel.slides_count

    # Should be able to navigate normally
    carousel.next_slide
    assert_equal 1, carousel.current_slide_index

    carousel.prev_slide
    assert_equal 0, carousel.current_slide_index
  end

  # === Autoplay Tests ===

  test "detects autoplay configuration" do
    carousel = autoplay_carousel

    assert carousel.autoplay_enabled?
  end

  test "carousel without autoplay is not auto-playing" do
    carousel = basic_carousel

    refute carousel.autoplay_enabled?
  end

  test "autoplay carousel automatically advances slides" do
    carousel = autoplay_carousel
    initial_index = carousel.current_slide_index

    # Wait for autoplay to advance (delay is 2000ms)
    sleep 2.5

    assert carousel.current_slide_index > initial_index ||
           (carousel.loop_enabled? && carousel.current_slide_index == 0),
           "Autoplay should advance slides"
  end

  # === ARIA Accessibility Tests ===

  test "carousel has correct role" do
    carousel = basic_carousel

    assert carousel.has_carousel_role?
  end

  test "slides have correct role" do
    carousel = basic_carousel

    assert carousel.slides_have_correct_role?
  end

  test "slides have aria-roledescription" do
    carousel = basic_carousel

    # Check first slide
    roledesc = carousel.slide_aria_roledescription(0)
    assert roledesc.present?, "Slide should have aria-roledescription"
  end

  # === Sub-element Tests ===

  test "has viewport element" do
    carousel = basic_carousel

    viewport = carousel.viewport
    assert viewport.present?
  end

  test "has container element" do
    carousel = basic_carousel

    container = carousel.container
    assert container.present?
  end

  test "has navigation buttons" do
    carousel = basic_carousel

    assert carousel.has_prev_button?
    assert carousel.has_next_button?
  end

  test "retrieves individual slides" do
    carousel = basic_carousel

    slide = carousel.slide(0)
    assert slide.present?
    assert_equal "1", slide.text.strip
  end

  # === Different Configurations Tests ===

  test "sizes carousel works correctly" do
    carousel = sizes_carousel

    assert_equal 5, carousel.slides_count
    assert_equal 0, carousel.current_slide_index

    carousel.next_slide
    assert_equal 1, carousel.current_slide_index
  end

  test "spacing carousel works correctly" do
    carousel = spacing_carousel

    assert_equal 5, carousel.slides_count
    carousel.next_slide
    assert_equal 1, carousel.current_slide_index
  end

  # === Edge Cases ===

  test "attempting to navigate before first slide does nothing" do
    carousel = basic_carousel

    assert carousel.at_first_slide?

    # Try to go previous from first slide
    initial_index = carousel.current_slide_index
    carousel.prev_slide if carousel.can_scroll_prev?

    assert_equal initial_index, carousel.current_slide_index
  end

  test "attempting to navigate after last slide does nothing" do
    carousel = basic_carousel

    carousel.go_to_slide(4)
    assert carousel.at_last_slide?

    # Try to go next from last slide
    initial_index = carousel.current_slide_index
    carousel.next_slide if carousel.can_scroll_next?

    assert_equal initial_index, carousel.current_slide_index
  end

  test "go_to_slide handles out of range gracefully" do
    carousel = basic_carousel

    assert_raises(ArgumentError) do
      carousel.go_to_slide(-1)
    end

    assert_raises(ArgumentError) do
      carousel.go_to_slide(10)
    end
  end

  test "go_to_slide does nothing when already at target slide" do
    carousel = basic_carousel

    carousel.go_to_slide(2)
    assert_equal 2, carousel.current_slide_index

    # Go to same slide again
    carousel.go_to_slide(2)
    assert_equal 2, carousel.current_slide_index
  end

  # === Rapid Interaction Tests ===

  test "handles rapid navigation without errors" do
    carousel = basic_carousel

    # Rapidly click next
    3.times do
      carousel.next_slide if carousel.can_scroll_next?
      sleep 0.05
    end

    # Should be at a valid slide
    assert carousel.current_slide_index >= 0
    assert carousel.current_slide_index < carousel.slides_count
  end

  # === State Consistency Tests ===

  test "button states are consistent with current position" do
    carousel = basic_carousel

    # At first slide
    assert carousel.at_first_slide?
    refute carousel.can_scroll_prev?
    assert carousel.can_scroll_next?

    # Navigate to middle
    carousel.go_to_slide(2)
    assert carousel.can_scroll_prev?
    assert carousel.can_scroll_next?

    # Navigate to last
    carousel.go_to_slide(4)
    assert carousel.can_scroll_prev?
    refute carousel.can_scroll_next?
  end
end
