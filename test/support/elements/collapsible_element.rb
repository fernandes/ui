# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the Collapsible component.
    #
    # @example Basic usage
    #   collapsible = CollapsibleElement.new(find('[data-controller="ui--collapsible"]'))
    #   collapsible.expand
    #   assert collapsible.expanded?
    #
    # @example Keyboard navigation
    #   collapsible.focus_trigger
    #   collapsible.press_enter
    #   assert collapsible.expanded?
    #
    class CollapsibleElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--collapsible"]'

      # === Actions ===

      # Expand the collapsible
      def expand
        return if expanded?

        trigger.click
        wait_for_expanded
      end

      # Collapse the collapsible
      def collapse
        return if collapsed?

        trigger.click
        wait_for_collapsed
      end

      # Toggle the collapsible
      def toggle
        trigger.click
        sleep 0.1 # Wait for animation to start
      end

      # Expand using keyboard
      def expand_with_keyboard
        focus_trigger
        press_enter
        wait_for_expanded
      end

      # Collapse using keyboard
      def collapse_with_keyboard
        focus_trigger
        press_enter
        wait_for_collapsed
      end

      # === State Queries ===

      # Check if collapsible is expanded
      #
      # @return [Boolean]
      #
      def expanded?
        data_state == "open"
      end

      # Check if collapsible is collapsed
      #
      # @return [Boolean]
      #
      def collapsed?
        data_state == "closed"
      end

      # Check if collapsible is disabled
      #
      # @return [Boolean]
      #
      def disabled?
        node["data-ui--collapsible-disabled-value"] == "true"
      end

      # Get the content text
      #
      # @return [String]
      #
      def content_text
        content.text.strip
      end

      # Check if content is visible (not hidden)
      #
      # @return [Boolean]
      #
      def content_visible?
        !content["hidden"].present?
      end

      # === Sub-elements ===

      # Get the trigger button
      #
      # @return [Capybara::Node::Element]
      #
      def trigger
        find_within("button[data-ui--collapsible-target='trigger']")
      end

      # Get the content element
      #
      # @return [Capybara::Node::Element]
      #
      def content
        find_within("[data-ui--collapsible-target='content']", visible: :all)
      end

      # === Keyboard Navigation ===

      # Focus the trigger button
      def focus_trigger
        trigger.native.focus
        sleep 0.05 # Wait for focus
      end

      # === ARIA Queries ===

      # Get ARIA attributes for the trigger
      #
      # @return [Hash] Hash of ARIA attribute values
      #
      def trigger_aria_attributes
        trigger_element = trigger
        {
          expanded: trigger_element["aria-expanded"],
          controls: trigger_element["aria-controls"]
        }
      end

      # Get ARIA attributes for content
      #
      # @return [Hash] Hash of ARIA attribute values
      #
      def content_aria_attributes
        content_element = content
        {
          hidden: content_element["hidden"]
        }
      end

      # Check if trigger has correct ARIA controls relationship
      #
      # @return [Boolean]
      #
      def aria_controls_valid?
        trigger_element = trigger
        content_element = content
        trigger_element["aria-controls"] == content_element["id"]
      end

      # === Waiters ===

      def wait_for_expanded(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if expanded?
          raise Capybara::ExpectationNotMet, "Collapsible did not expand after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      def wait_for_collapsed(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if collapsed?
          raise Capybara::ExpectationNotMet, "Collapsible did not collapse after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end
    end
  end
end
