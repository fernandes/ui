# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the Popover component.
    #
    # @example Basic usage
    #   popover = PopoverElement.new(find('[data-controller="ui--popover"]'))
    #   popover.open
    #   assert popover.open?
    #   popover.close
    #   assert popover.closed?
    #
    # @example Using triggers and content
    #   popover.trigger.click
    #   assert_equal "Dimensions", popover.content_text
    #   popover.close_with_escape
    #
    class PopoverElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--popover"]'

      # === Actions ===

      # Open the popover by clicking the trigger
      def open
        return if open?

        trigger.click
        wait_for_open
      end

      # Close the popover by clicking outside
      def close
        return if closed?

        # Click outside the popover to close it
        # Use JavaScript to click outside to avoid issues with overlays
        page.evaluate_script("document.body.click()")
        wait_for_closed
      end

      # Close the popover using the Escape key
      def close_with_escape
        return if closed?

        press_escape
        wait_for_closed
      end

      # Toggle the popover state
      def toggle
        if open?
          close
        else
          open
        end
      end

      # === State Queries ===

      # Check if the popover is open
      def open?
        content["data-state"] == "open"
      end

      # Check if the popover is closed
      def closed?
        content["data-state"] == "closed"
      end

      # Get the popover content text
      #
      # @return [String] The content text
      #
      def content_text
        content.text.strip
      end

      # Check if content is visible
      def content_visible?
        # Content uses invisible class, so check data-state instead
        open? && content["data-state"] == "open"
      end

      # Check if content is hidden (invisible)
      def content_hidden?
        # Content uses invisible class, so check data-state instead
        closed? || content["data-state"] == "closed"
      end

      # Get the placement value
      #
      # @return [String, nil] The placement value (e.g., "bottom", "top", "left", "right")
      #
      def placement
        node["data-ui--popover-placement-value"]
      end

      # Get the offset value
      #
      # @return [String, nil] The offset value in pixels
      #
      def offset
        node["data-ui--popover-offset-value"]
      end

      # Get the trigger mode (click or hover)
      #
      # @return [String, nil] The trigger mode
      #
      def trigger_mode
        node["data-ui--popover-trigger-value"]
      end

      # Get the data-side attribute (actual position after flip/shift)
      #
      # @return [String, nil] The side where content is positioned
      #
      def content_side
        content["data-side"]
      end

      # === Sub-elements ===

      # Get the popover trigger element
      #
      # @return [Capybara::Node::Element]
      #
      def trigger
        find_within('[data-ui--popover-target="trigger"]')
      end

      # Get the content element
      #
      # @return [Capybara::Node::Element]
      #
      def content
        find_within('[data-ui--popover-target="content"]', visible: :all)
      end

      # === Positioning Queries ===

      # Get the computed left position of the content
      #
      # @return [Float] The left position in pixels
      #
      def content_left
        evaluate_script("document.querySelector('[data-ui--popover-target=\"content\"]').style.left").to_f
      end

      # Get the computed top position of the content
      #
      # @return [Float] The top position in pixels
      #
      def content_top
        evaluate_script("document.querySelector('[data-ui--popover-target=\"content\"]').style.top").to_f
      end

      # Check if the content is positioned (has left/top styles)
      #
      # @return [Boolean]
      #
      def content_positioned?
        left = content["style"]&.include?("left")
        top = content["style"]&.include?("top")
        left && top
      end

      # === Waiters ===

      def wait_for_open(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if open?
          raise Capybara::ExpectationNotMet, "Popover did not open after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      def wait_for_closed(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if closed?
          raise Capybara::ExpectationNotMet, "Popover did not close after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      def wait_for_positioned(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          # Check if the content has been positioned
          # Floating UI sets left and top styles when it positions the content
          left_style = content["style"]&.include?("left")
          top_style = content["style"]&.include?("top")

          return true if left_style && top_style

          if Time.now - start_time > timeout
            raise Capybara::ExpectationNotMet, "Popover content not positioned after #{timeout}s"
          end

          sleep 0.05
        end
      end
    end
  end
end
