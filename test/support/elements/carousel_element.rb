# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the Carousel component.
    #
    # @example Basic usage
    #   carousel = CarouselElement.new(find('[data-controller="ui--carousel"]'))
    #   carousel.next_slide
    #   assert_equal 1, carousel.current_slide_index
    #
    # @example Keyboard navigation
    #   carousel.focus
    #   carousel.press_arrow_right
    #   assert_equal 1, carousel.current_slide_index
    #
    class CarouselElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--carousel"]'

      # === Actions ===

      # Navigate to the next slide
      def next_slide
        next_button.click if can_scroll_next?
        wait_for_slide_change
      end

      # Navigate to the previous slide
      def prev_slide
        prev_button.click if can_scroll_prev?
        wait_for_slide_change
      end

      # Navigate to a specific slide by index (0-based)
      #
      # @param index [Integer] The slide index to navigate to
      #
      def go_to_slide(index)
        raise ArgumentError, "Slide index out of range" if index < 0 || index >= slides_count

        current = current_slide_index
        return if current == index

        if index > current
          (index - current).times { next_slide }
        else
          (current - index).times { prev_slide }
        end
      end

      # === State Queries ===

      # Get the current active slide index (0-based)
      #
      # @return [Integer]
      #
      def current_slide_index
        # Access the Embla API through the Stimulus controller
        page.evaluate_script(<<~JS)
          (() => {
            const carousel = document.querySelector('##{node[:id]}');
            const controller = window.Stimulus?.controllers.find(c => c.element === carousel);
            const api = controller?.getApi();
            return api?.selectedScrollSnap() || 0;
          })()
        JS
      end

      # Get the total number of slides
      #
      # @return [Integer]
      #
      def slides_count
        slides.count
      end

      # Check if carousel can scroll to previous slide
      #
      # @return [Boolean]
      #
      def can_scroll_prev?
        has_prev_button? && !prev_button.disabled?
      end

      # Check if carousel can scroll to next slide
      #
      # @return [Boolean]
      #
      def can_scroll_next?
        has_next_button? && !next_button.disabled?
      end

      # Check if at the first slide
      #
      # @return [Boolean]
      #
      def at_first_slide?
        current_slide_index == 0
      end

      # Check if at the last slide
      #
      # @return [Boolean]
      #
      def at_last_slide?
        current_slide_index == slides_count - 1
      end

      # Get the orientation of the carousel
      #
      # @return [String] "horizontal" or "vertical"
      #
      def orientation
        node["data-ui--carousel-orientation-value"] || "horizontal"
      end

      # Check if orientation is horizontal
      #
      # @return [Boolean]
      #
      def horizontal?
        orientation == "horizontal"
      end

      # Check if orientation is vertical
      #
      # @return [Boolean]
      #
      def vertical?
        orientation == "vertical"
      end

      # Check if carousel has loop enabled
      #
      # @return [Boolean]
      #
      def loop_enabled?
        # Check if loop is in the opts
        opts = node["data-ui--carousel-opts-value"]
        return false if opts.nil? || opts.empty?

        JSON.parse(opts)["loop"] == true
      rescue JSON::ParserError
        false
      end

      # Check if autoplay is enabled
      #
      # @return [Boolean]
      #
      def autoplay_enabled?
        plugins = node["data-ui--carousel-plugins-value"]
        return false if plugins.nil? || plugins.empty?

        parsed = JSON.parse(plugins)
        parsed.any? { |p| p["name"] == "autoplay" }
      rescue JSON::ParserError
        false
      end

      # === Sub-elements ===

      # Get all slide elements
      #
      # @return [Array<Capybara::Node::Element>]
      #
      def slides
        all_within('[role="group"]')
      end

      # Get a specific slide by index (0-based)
      #
      # @param index [Integer] The slide index
      # @return [Capybara::Node::Element]
      #
      def slide(index)
        slides[index]
      end

      # Get the content of a specific slide
      #
      # @param index [Integer] The slide index
      # @return [String]
      #
      def slide_content(index)
        slide(index).text.strip
      end

      # Get the viewport element
      #
      # @return [Capybara::Node::Element]
      #
      def viewport
        find_within('[data-ui--carousel-target="viewport"]')
      end

      # Get the container element
      #
      # @return [Capybara::Node::Element]
      #
      def container
        find_within('[data-ui--carousel-target="container"]')
      end

      # Get the previous button
      #
      # @return [Capybara::Node::Element]
      #
      def prev_button
        find_within('[data-ui--carousel-target="prevButton"]')
      end

      # Get the next button
      #
      # @return [Capybara::Node::Element]
      #
      def next_button
        find_within('[data-ui--carousel-target="nextButton"]')
      end

      # Check if carousel has previous button
      #
      # @return [Boolean]
      #
      def has_prev_button?
        first_within('[data-ui--carousel-target="prevButton"]', minimum: 0).present?
      end

      # Check if carousel has next button
      #
      # @return [Boolean]
      #
      def has_next_button?
        first_within('[data-ui--carousel-target="nextButton"]', minimum: 0).present?
      end

      # === Keyboard Navigation ===

      # Navigate using keyboard based on orientation
      #
      # Horizontal: ArrowLeft/ArrowRight
      # Vertical: ArrowUp/ArrowDown
      #
      def navigate_next_with_keyboard
        node.send_keys(horizontal? ? :right : :down)
        wait_for_slide_change
      end

      def navigate_prev_with_keyboard
        node.send_keys(horizontal? ? :left : :up)
        wait_for_slide_change
      end

      # === ARIA Queries ===

      # Check if carousel has correct role
      #
      # @return [Boolean]
      #
      def has_carousel_role?
        node["role"] == "region"
      end

      # Get ARIA label
      #
      # @return [String, nil]
      #
      def aria_label
        node["aria-label"]
      end

      # Check if slides have correct role
      #
      # @return [Boolean]
      #
      def slides_have_correct_role?
        slides.all? { |slide| slide["role"] == "group" }
      end

      # Get aria-roledescription for a slide
      #
      # @param index [Integer] The slide index
      # @return [String, nil]
      #
      def slide_aria_roledescription(index)
        slide(index)["aria-roledescription"]
      end

      # === Waiters ===

      # Wait for slide change to complete
      #
      # @param timeout [Numeric] Maximum wait time in seconds
      #
      def wait_for_slide_change(timeout: Capybara.default_max_wait_time)
        # Wait a short time for Embla to update (animations are fast)
        sleep 0.2
      end

      # Wait for specific slide to be active
      #
      # @param index [Integer] Expected slide index
      # @param timeout [Numeric] Maximum wait time in seconds
      #
      def wait_for_slide(index, timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if current_slide_index == index
          if Time.now - start_time > timeout
            raise Capybara::ExpectationNotMet,
                  "Expected slide #{index} to be active, got #{current_slide_index} after #{timeout}s"
          end

          sleep 0.05
        end
      end
    end
  end
end
