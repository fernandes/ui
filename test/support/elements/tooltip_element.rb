# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the Tooltip component.
    #
    # @example Basic usage
    #   tooltip = TooltipElement.new(find('[data-controller="ui--tooltip"]'))
    #   tooltip.show
    #   assert tooltip.visible?
    #   assert_equal "Add to library", tooltip.content_text
    #
    # @example Keyboard interaction
    #   tooltip.show
    #   tooltip.press_escape
    #   assert tooltip.hidden?
    #
    class TooltipElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--tooltip"]'

      # === Actions ===

      # Show the tooltip by hovering over the trigger
      def show
        return if visible?

        trigger.hover
        wait_for_visible_content
      end

      # Hide the tooltip by moving mouse away from trigger
      def hide
        return if hidden?

        # Move mouse to body (away from tooltip)
        page.find('body').hover
        wait_for_hidden_content
      end

      # === State Queries ===

      # Check if the tooltip content is visible
      #
      # @return [Boolean]
      #
      def visible?
        content.visible? && content["data-state"] == "open"
      end

      # Check if the tooltip content is hidden
      #
      # @return [Boolean]
      #
      def hidden?
        !visible?
      end

      # Get the tooltip content text
      #
      # @return [String]
      #
      def content_text
        content.text.strip
      end

      # Get the tooltip trigger text
      #
      # @return [String]
      #
      def trigger_text
        trigger.text.strip
      end

      # Get the tooltip placement side
      #
      # @return [String] One of: "top", "right", "bottom", "left"
      #
      def side
        content["data-side"]
      end

      # Get the tooltip alignment
      #
      # @return [String] One of: "center", "start", "end"
      #
      def align
        content["data-align"]
      end

      # Check if tooltip content is open (via data-state)
      #
      # @return [Boolean]
      #
      def open?
        content["data-state"] == "open"
      end

      # Check if tooltip content is closed (via data-state)
      #
      # @return [Boolean]
      #
      def closed?
        content["data-state"] == "closed"
      end

      # === Sub-elements ===

      # Get the trigger element
      #
      # @return [Capybara::Node::Element]
      #
      def trigger
        find_within('[data-ui--tooltip-target="trigger"]')
      end

      # Get the content element (may be rendered in document.body)
      #
      # @return [Capybara::Node::Element]
      #
      def content
        # The content element is moved to document.body by the controller.
        # We need to access it via the Stimulus controller to get the correct element.
        # Cache the element reference for subsequent calls.
        @content_element ||= begin
          # Use JavaScript to get the content element from the Stimulus controller
          page.execute_script(<<~JS, node)
            const tooltip = arguments[0];
            const controller = Stimulus.getControllerForElementAndIdentifier(tooltip, 'ui--tooltip');
            if (controller && controller.content) {
              // Mark the content element for identification
              controller.content.setAttribute('data-tooltip-test-id', '#{node['id'] || object_id}');
            }
          JS

          # Now find the marked content element
          find_in_page("[data-tooltip-test-id='#{node['id'] || object_id}']", visible: :all)
        end
      end

      # === ARIA Queries ===

      # Get the role attribute from the content
      #
      # @return [String, nil]
      #
      def content_role
        content["role"]
      end

      # Get the describedby attribute from the trigger
      #
      # @return [String, nil]
      #
      def trigger_describedby
        trigger["aria-describedby"]
      end

      # === Waiters ===

      # Wait for tooltip content to become visible
      #
      # @param timeout [Float] Maximum time to wait in seconds
      #
      def wait_for_visible_content(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if visible?
          raise Capybara::ExpectationNotMet, "Tooltip content not visible after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      # Wait for tooltip content to become hidden
      #
      # @param timeout [Float] Maximum time to wait in seconds
      #
      def wait_for_hidden_content(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if hidden?
          raise Capybara::ExpectationNotMet, "Tooltip content still visible after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      # Wait for tooltip to have a specific data-state
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
