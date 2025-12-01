# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the Hover Card component.
    #
    # @example Basic usage
    #   hover_card = HoverCardElement.new(find('[data-controller="ui--hover-card"]'))
    #   hover_card.show
    #   assert hover_card.visible?
    #   assert_equal "@nextjs", hover_card.content_text
    #
    # @example Keeping card open
    #   hover_card.show
    #   hover_card.hover_content # Keep open while hovering content
    #   assert hover_card.visible?
    #
    class HoverCardElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--hover-card"]'

      # === Actions ===

      # Show the hover card by hovering over the trigger
      def show
        return if visible?

        trigger.hover
        wait_for_visible_content
      end

      # Hide the hover card by moving mouse away from trigger
      def hide
        return if hidden?

        # Move mouse to body (away from hover card)
        page.find("body").hover
        wait_for_hidden_content
      end

      # Hover over the content to keep it open
      def hover_content
        content.hover
      end

      # === State Queries ===

      # Check if the hover card content is visible
      #
      # @return [Boolean]
      #
      def visible?
        content.visible? && content["data-state"] == "open"
      end

      # Check if the hover card content is hidden
      #
      # @return [Boolean]
      #
      def hidden?
        !visible?
      end

      # Get the hover card content text
      #
      # @return [String]
      #
      def content_text
        content.text.strip
      end

      # Get the hover card trigger text
      #
      # @return [String]
      #
      def trigger_text
        trigger.text.strip
      end

      # Get the hover card placement side
      #
      # @return [String] One of: "top", "bottom"
      #
      def side
        content["data-side"]
      end

      # Get the hover card alignment
      #
      # @return [String] One of: "center", "start", "end"
      #
      def align
        content["data-align"]
      end

      # Check if hover card content is open (via data-state)
      #
      # @return [Boolean]
      #
      def open?
        content["data-state"] == "open"
      end

      # Check if hover card content is closed (via data-state)
      #
      # @return [Boolean]
      #
      def closed?
        state = content["data-state"]
        state.nil? || state == "closed"
      end

      # === Sub-elements ===

      # Get the trigger element
      #
      # @return [Capybara::Node::Element]
      #
      def trigger
        find_within('[data-ui--hover-card-target="trigger"]')
      end

      # Get the content element
      #
      # @return [Capybara::Node::Element]
      #
      def content
        # The content element is positioned as fixed and may be rendered outside the container
        # We need to find it using the Stimulus controller
        find_within('[data-ui--hover-card-target="content"]', visible: :all)
      end

      # === Waiters ===

      # Wait for hover card content to become visible
      #
      # @param timeout [Float] Maximum time to wait in seconds
      #
      def wait_for_visible_content(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if visible?
          raise Capybara::ExpectationNotMet, "Hover card content not visible after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      # Wait for hover card content to become hidden
      #
      # @param timeout [Float] Maximum time to wait in seconds
      #
      def wait_for_hidden_content(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if hidden?
          raise Capybara::ExpectationNotMet, "Hover card content still visible after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      # Wait for hover card to have a specific data-state
      #
      # @param expected_state [String] Expected state ("open" or "closed")
      # @param timeout [Float] Maximum time to wait in seconds
      #
      def wait_for_content_state(expected_state, timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if content["data-state"] == expected_state
          if Time.now - start_time > timeout
            raise Capybara::ExpectationNotMet,
              "Expected content data-state='#{expected_state}', got '#{content["data-state"]}' after #{timeout}s"
          end

          sleep 0.05
        end
      end
    end
  end
end
