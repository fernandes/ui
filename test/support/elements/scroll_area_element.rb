# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the Scroll Area component.
    #
    # @example Basic usage
    #   scroll_area = ScrollAreaElement.new(find('[data-controller="ui--scroll-area"]'))
    #   scroll_area.scroll_to_bottom
    #   assert scroll_area.at_bottom?
    #
    # @example Checking scroll position
    #   scroll_area.scroll_to(100)
    #   assert_equal 100, scroll_area.scroll_top
    #
    class ScrollAreaElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--scroll-area"]'

      # === Viewport ===

      # Get the viewport element (scrollable container)
      #
      # @return [Capybara::Node::Element]
      #
      def viewport
        find_within('[data-ui--scroll-area-target="viewport"]')
      end

      # Get the content element (inside viewport)
      #
      # @return [Capybara::Node::Element]
      #
      def content
        viewport.find('div[style*="display: table"]')
      end

      # === Scrollbar Elements ===

      # Get all scrollbar elements
      #
      # @return [Array<Capybara::Node::Element>]
      #
      def scrollbars
        all_within('[data-ui--scroll-area-target="scrollbar"]')
      end

      # Get the vertical scrollbar element
      #
      # @return [Capybara::Node::Element, nil]
      #
      def vertical_scrollbar
        first_within('[data-ui--scroll-area-target="scrollbar"][data-orientation="vertical"]', visible: :all)
      end

      # Get the horizontal scrollbar element
      #
      # @return [Capybara::Node::Element, nil]
      #
      def horizontal_scrollbar
        first_within('[data-ui--scroll-area-target="scrollbar"][data-orientation="horizontal"]', visible: :all)
      end

      # Get all thumb elements
      #
      # @return [Array<Capybara::Node::Element>]
      #
      def thumbs
        all_within('[data-ui--scroll-area-target="thumb"]')
      end

      # Get the vertical scrollbar thumb
      #
      # @return [Capybara::Node::Element, nil]
      #
      def vertical_thumb
        return nil unless vertical_scrollbar

        vertical_scrollbar.find('[data-ui--scroll-area-target="thumb"]', visible: :all)
      end

      # Get the horizontal scrollbar thumb
      #
      # @return [Capybara::Node::Element, nil]
      #
      def horizontal_thumb
        return nil unless horizontal_scrollbar

        horizontal_scrollbar.find('[data-ui--scroll-area-target="thumb"]', visible: :all)
      end

      # === Scroll Position Queries ===

      # Get current vertical scroll position
      #
      # @return [Integer] The scrollTop value in pixels
      #
      def scroll_top
        evaluate_script("document.querySelector('##{node[:id]} [data-ui--scroll-area-target=\"viewport\"]').scrollTop")
      end

      # Get current horizontal scroll position
      #
      # @return [Integer] The scrollLeft value in pixels
      #
      def scroll_left
        evaluate_script("document.querySelector('##{node[:id]} [data-ui--scroll-area-target=\"viewport\"]').scrollLeft")
      end

      # Get maximum vertical scroll position
      #
      # @return [Integer] The max scrollTop value in pixels
      #
      def max_scroll_top
        evaluate_script("document.querySelector('##{node[:id]} [data-ui--scroll-area-target=\"viewport\"]').scrollHeight - document.querySelector('##{node[:id]} [data-ui--scroll-area-target=\"viewport\"]').clientHeight")
      end

      # Get maximum horizontal scroll position
      #
      # @return [Integer] The max scrollLeft value in pixels
      #
      def max_scroll_left
        evaluate_script("document.querySelector('##{node[:id]} [data-ui--scroll-area-target=\"viewport\"]').scrollWidth - document.querySelector('##{node[:id]} [data-ui--scroll-area-target=\"viewport\"]').clientWidth")
      end

      # Check if scrolled to the top
      #
      # @return [Boolean]
      #
      def at_top?
        scroll_top <= 1 # Allow 1px tolerance
      end

      # Check if scrolled to the bottom
      #
      # @return [Boolean]
      #
      def at_bottom?
        (scroll_top - max_scroll_top).abs <= 1 # Allow 1px tolerance
      end

      # Check if scrolled to the left edge
      #
      # @return [Boolean]
      #
      def at_left?
        scroll_left <= 1 # Allow 1px tolerance
      end

      # Check if scrolled to the right edge
      #
      # @return [Boolean]
      #
      def at_right?
        (scroll_left - max_scroll_left).abs <= 1 # Allow 1px tolerance
      end

      # === Overflow Queries ===

      # Check if content has vertical overflow (scrollable)
      #
      # @return [Boolean]
      #
      def has_vertical_overflow?
        evaluate_script("document.querySelector('##{node[:id]} [data-ui--scroll-area-target=\"viewport\"]').scrollHeight > document.querySelector('##{node[:id]} [data-ui--scroll-area-target=\"viewport\"]').clientHeight")
      end

      # Check if content has horizontal overflow (scrollable)
      #
      # @return [Boolean]
      #
      def has_horizontal_overflow?
        evaluate_script("document.querySelector('##{node[:id]} [data-ui--scroll-area-target=\"viewport\"]').scrollWidth > document.querySelector('##{node[:id]} [data-ui--scroll-area-target=\"viewport\"]').clientWidth")
      end

      # === Scrollbar Visibility ===

      # Check if vertical scrollbar is visible
      #
      # @return [Boolean]
      #
      def vertical_scrollbar_visible?
        return false unless vertical_scrollbar

        vertical_scrollbar["data-state"] == "visible"
      end

      # Check if horizontal scrollbar is visible
      #
      # @return [Boolean]
      #
      def horizontal_scrollbar_visible?
        return false unless horizontal_scrollbar

        horizontal_scrollbar["data-state"] == "visible"
      end

      # === Scroll Actions ===

      # Scroll to the top
      def scroll_to_top
        page.execute_script("document.querySelector('##{node[:id]} [data-ui--scroll-area-target=\"viewport\"]').scrollTop = 0")
        wait_for_scroll_position(0, :vertical)
      end

      # Scroll to the bottom
      def scroll_to_bottom
        max = max_scroll_top
        page.execute_script("document.querySelector('##{node[:id]} [data-ui--scroll-area-target=\"viewport\"]').scrollTop = #{max}")
        wait_for_scroll_position(max, :vertical)
      end

      # Scroll to the left edge
      def scroll_to_left
        page.execute_script("document.querySelector('##{node[:id]} [data-ui--scroll-area-target=\"viewport\"]').scrollLeft = 0")
        wait_for_scroll_position(0, :horizontal)
      end

      # Scroll to the right edge
      def scroll_to_right
        max = max_scroll_left
        page.execute_script("document.querySelector('##{node[:id]} [data-ui--scroll-area-target=\"viewport\"]').scrollLeft = #{max}")
        wait_for_scroll_position(max, :horizontal)
      end

      # Scroll to a specific vertical position
      #
      # @param position [Integer] The scrollTop value in pixels
      #
      def scroll_to(position)
        page.execute_script("document.querySelector('##{node[:id]} [data-ui--scroll-area-target=\"viewport\"]').scrollTop = #{position}")
        wait_for_scroll_position(position, :vertical)
      end

      # Scroll to a specific horizontal position
      #
      # @param position [Integer] The scrollLeft value in pixels
      #
      def scroll_to_x(position)
        page.execute_script("document.querySelector('##{node[:id]} [data-ui--scroll-area-target=\"viewport\"]').scrollLeft = #{position}")
        wait_for_scroll_position(position, :horizontal)
      end

      # Scroll by a specific amount (positive = down/right, negative = up/left)
      #
      # @param delta_y [Integer] Vertical scroll delta in pixels
      # @param delta_x [Integer] Horizontal scroll delta in pixels (default: 0)
      #
      def scroll_by(delta_y, delta_x = 0)
        page.execute_script("document.querySelector('##{node[:id]} [data-ui--scroll-area-target=\"viewport\"]').scrollBy(#{delta_x}, #{delta_y})")
        sleep 0.1 # Wait for scroll to settle
      end

      # Simulate mouse wheel scrolling
      #
      # @param delta_y [Integer] Vertical wheel delta (positive = scroll down)
      # @param delta_x [Integer] Horizontal wheel delta (positive = scroll right)
      #
      def wheel_scroll(delta_y = 100, delta_x = 0)
        page.execute_script(<<~JS)
          const viewport = document.querySelector('##{node[:id]} [data-ui--scroll-area-target="viewport"]');
          const wheelEvent = new WheelEvent('wheel', {
            deltaY: #{delta_y},
            deltaX: #{delta_x},
            bubbles: true,
            cancelable: true
          });
          viewport.dispatchEvent(wheelEvent);
          viewport.scrollBy(#{delta_x}, #{delta_y});
        JS
        sleep 0.1 # Wait for scroll to settle
      end

      # === Keyboard Scrolling ===

      # Scroll using Page Down key
      def press_page_down
        viewport.send_keys(:page_down)
        sleep 0.1
      end

      # Scroll using Page Up key
      def press_page_up
        viewport.send_keys(:page_up)
        sleep 0.1
      end

      # Scroll down using Arrow Down key
      def scroll_down_with_arrow
        viewport.send_keys(:down)
        sleep 0.05
      end

      # Scroll up using Arrow Up key
      def scroll_up_with_arrow
        viewport.send_keys(:up)
        sleep 0.05
      end

      # Scroll right using Arrow Right key
      def scroll_right_with_arrow
        viewport.send_keys(:right)
        sleep 0.05
      end

      # Scroll left using Arrow Left key
      def scroll_left_with_arrow
        viewport.send_keys(:left)
        sleep 0.05
      end

      # Scroll to top using Home key
      def scroll_to_top_with_home
        viewport.send_keys(:home)
        sleep 0.1
      end

      # Scroll to bottom using End key
      def scroll_to_bottom_with_end
        viewport.send_keys(:end)
        sleep 0.1
      end

      # === Thumb Interaction ===

      # Drag the vertical scrollbar thumb by a specific pixel amount
      #
      # @param delta_y [Integer] Pixels to drag (positive = down, negative = up)
      #
      def drag_vertical_thumb(delta_y)
        return unless vertical_thumb

        # Use JavaScript to simulate drag as Playwright mouse API is private
        page.execute_script(<<~JS, delta_y)
          (function(deltaY) {
            const container = document.querySelector('##{node[:id]}');
            const viewport = container.querySelector('[data-ui--scroll-area-target="viewport"]');
            const scrollbar = container.querySelector('[data-ui--scroll-area-target="scrollbar"][data-orientation="vertical"]');
            const thumb = scrollbar.querySelector('[data-ui--scroll-area-target="thumb"]');

            if (!thumb || !viewport) return;

            // Calculate scroll based on thumb drag delta
            const scrollbarHeight = scrollbar.clientHeight;
            const contentHeight = viewport.scrollHeight;
            const viewportHeight = viewport.clientHeight;
            const scrollableHeight = contentHeight - viewportHeight;

            const thumbHeight = parseFloat(thumb.style.height) || 18;
            const maxThumbTop = scrollbarHeight - 2 - thumbHeight; // 2px padding

            // Convert thumb delta to scroll delta
            const scrollDelta = maxThumbTop > 0 ? (deltaY / maxThumbTop) * scrollableHeight : 0;
            viewport.scrollTop += scrollDelta;
          })(arguments[0])
        JS

        sleep 0.1 # Wait for scroll to settle
      end

      # Drag the horizontal scrollbar thumb by a specific pixel amount
      #
      # @param delta_x [Integer] Pixels to drag (positive = right, negative = left)
      #
      def drag_horizontal_thumb(delta_x)
        return unless horizontal_thumb

        # Use JavaScript to simulate drag as Playwright mouse API is private
        page.execute_script(<<~JS, delta_x)
          (function(deltaX) {
            const container = document.querySelector('##{node[:id]}');
            const viewport = container.querySelector('[data-ui--scroll-area-target="viewport"]');
            const scrollbar = container.querySelector('[data-ui--scroll-area-target="scrollbar"][data-orientation="horizontal"]');
            const thumb = scrollbar.querySelector('[data-ui--scroll-area-target="thumb"]');

            if (!thumb || !viewport) return;

            // Calculate scroll based on thumb drag delta
            const scrollbarWidth = scrollbar.clientWidth;
            const contentWidth = viewport.scrollWidth;
            const viewportWidth = viewport.clientWidth;
            const scrollableWidth = contentWidth - viewportWidth;

            const thumbWidth = parseFloat(thumb.style.width) || 18;
            const maxThumbLeft = scrollbarWidth - 2 - thumbWidth; // 2px padding

            // Convert thumb delta to scroll delta
            const scrollDelta = maxThumbLeft > 0 ? (deltaX / maxThumbLeft) * scrollableWidth : 0;
            viewport.scrollLeft += scrollDelta;
          })(arguments[0])
        JS

        sleep 0.1 # Wait for scroll to settle
      end

      # Click on the vertical scrollbar track at a specific position
      #
      # @param ratio [Float] Position ratio (0.0 = top, 1.0 = bottom)
      #
      def click_vertical_scrollbar_at(ratio)
        return unless vertical_scrollbar

        # Use JavaScript to simulate click as Playwright mouse API is private
        page.execute_script(<<~JS, ratio)
          (function(ratio) {
            const container = document.querySelector('##{node[:id]}');
            const viewport = container.querySelector('[data-ui--scroll-area-target="viewport"]');
            const scrollbar = container.querySelector('[data-ui--scroll-area-target="scrollbar"][data-orientation="vertical"]');

            if (!scrollbar || !viewport) return;

            const contentHeight = viewport.scrollHeight;
            const viewportHeight = viewport.clientHeight;
            const scrollableHeight = contentHeight - viewportHeight;

            // Scroll to position based on ratio
            viewport.scrollTop = ratio * scrollableHeight;
          })(arguments[0])
        JS

        sleep 0.1 # Wait for scroll to settle
      end

      # Click on the horizontal scrollbar track at a specific position
      #
      # @param ratio [Float] Position ratio (0.0 = left, 1.0 = right)
      #
      def click_horizontal_scrollbar_at(ratio)
        return unless horizontal_scrollbar

        # Use JavaScript to simulate click as Playwright mouse API is private
        page.execute_script(<<~JS, ratio)
          (function(ratio) {
            const container = document.querySelector('##{node[:id]}');
            const viewport = container.querySelector('[data-ui--scroll-area-target="viewport"]');
            const scrollbar = container.querySelector('[data-ui--scroll-area-target="scrollbar"][data-orientation="horizontal"]');

            if (!scrollbar || !viewport) return;

            const contentWidth = viewport.scrollWidth;
            const viewportWidth = viewport.clientWidth;
            const scrollableWidth = contentWidth - viewportWidth;

            // Scroll to position based on ratio
            viewport.scrollLeft = ratio * scrollableWidth;
          })(arguments[0])
        JS

        sleep 0.1 # Wait for scroll to settle
      end

      # === Thumb Position Queries ===

      # Get the vertical thumb position as a ratio (0.0 = top, 1.0 = bottom)
      #
      # @return [Float]
      #
      def vertical_thumb_position_ratio
        return 0.0 unless has_vertical_overflow?
        return 0.0 if max_scroll_top.zero?

        scroll_top.to_f / max_scroll_top
      end

      # Get the horizontal thumb position as a ratio (0.0 = left, 1.0 = right)
      #
      # @return [Float]
      #
      def horizontal_thumb_position_ratio
        return 0.0 unless has_horizontal_overflow?
        return 0.0 if max_scroll_left.zero?

        scroll_left.to_f / max_scroll_left
      end

      # === Focus Helpers ===

      # Focus the viewport element
      def focus_viewport
        viewport.click
        sleep 0.05
      end

      # Check if viewport is currently focused
      #
      # @return [Boolean]
      #
      def viewport_focused?
        page.evaluate_script(<<~JS)
          document.activeElement === document.querySelector('##{node[:id]} [data-ui--scroll-area-target="viewport"]')
        JS
      end

      # Remove focus from viewport by clicking outside
      def blur_viewport
        # Find the page title or body to click outside
        page.find('h1').click
        sleep 0.05
      end

      # === Waiters ===

      # Wait for scroll position to reach a specific value
      #
      # @param position [Integer] Expected scroll position
      # @param orientation [Symbol] :vertical or :horizontal
      # @param timeout [Float] Maximum wait time in seconds
      #
      def wait_for_scroll_position(position, orientation, timeout: 2.0)
        start_time = Time.now
        loop do
          current = orientation == :vertical ? scroll_top : scroll_left
          return true if (current - position).abs <= 1 # Allow 1px tolerance

          if Time.now - start_time > timeout
            raise Capybara::ExpectationNotMet,
                  "Expected scroll position #{position}, got #{current} after #{timeout}s"
          end

          sleep 0.05
        end
      end

      # Wait for scrollbar to become visible
      #
      # @param orientation [Symbol] :vertical or :horizontal
      # @param timeout [Float] Maximum wait time in seconds
      #
      def wait_for_scrollbar_visible(orientation, timeout: 2.0)
        start_time = Time.now
        loop do
          scrollbar = orientation == :vertical ? vertical_scrollbar : horizontal_scrollbar
          return true if scrollbar && scrollbar["data-state"] == "visible"

          if Time.now - start_time > timeout
            raise Capybara::ExpectationNotMet,
                  "Expected #{orientation} scrollbar to be visible after #{timeout}s"
          end

          sleep 0.05
        end
      end

      # Wait for scrollbar to become hidden
      #
      # @param orientation [Symbol] :vertical or :horizontal
      # @param timeout [Float] Maximum wait time in seconds
      #
      def wait_for_scrollbar_hidden(orientation, timeout: 2.0)
        start_time = Time.now
        loop do
          scrollbar = orientation == :vertical ? vertical_scrollbar : horizontal_scrollbar
          return true if scrollbar && scrollbar["data-state"] == "hidden"

          if Time.now - start_time > timeout
            raise Capybara::ExpectationNotMet,
                  "Expected #{orientation} scrollbar to be hidden after #{timeout}s"
          end

          sleep 0.05
        end
      end
    end
  end
end
