# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the Dialog component.
    #
    # @example Basic usage
    #   dialog = DialogElement.new(find('[data-controller="ui--dialog"]'))
    #   dialog.open
    #   assert dialog.open?
    #   dialog.close
    #   assert dialog.closed?
    #
    # @example Using triggers and close button
    #   dialog.trigger.click
    #   assert_equal "Edit profile", dialog.title
    #   dialog.close_button.click
    #
    class DialogElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--dialog"]'

      # === Actions ===

      # Open the dialog by clicking the trigger
      def open
        return if open?

        trigger.click
        wait_for_open
      end

      # Close the dialog by clicking the close button
      def close
        return if closed?

        close_button.click
        wait_for_closed
      end

      # Close the dialog using the Escape key
      def close_with_escape
        return if closed?

        press_escape
        wait_for_closed
      end

      # Close the dialog by clicking the overlay backdrop
      def close_by_overlay_click
        return if closed?

        # Click at the top-left corner of the overlay to avoid hitting the content
        # which is centered and would intercept the click
        overlay.click(x: 5, y: 5)
        wait_for_closed
      end

      # === State Queries ===

      # Check if the dialog is open
      def open?
        container["data-state"] == "open"
      end

      # Check if the dialog is closed
      def closed?
        container["data-state"] == "closed"
      end

      # Get the dialog title text
      #
      # @return [String] The title text
      #
      def title
        # Find h2 element within content (title is rendered as h2)
        content.find("h2", match: :first).text.strip
      end

      # Get the dialog description text
      #
      # @return [String] The description text
      #
      def description
        # Find the first p element with muted foreground (description)
        content.find("p.text-muted-foreground", match: :first).text.strip
      end

      # Check if the dialog has a close button
      #
      # @return [Boolean]
      #
      def has_close_button?
        content.has_css?('[data-action*="click->ui--dialog#close"]', visible: :all)
      end

      # Check if content is visible
      def content_visible?
        content.visible?
      end

      # Check if overlay is visible
      def overlay_visible?
        overlay.visible?
      end

      # === Sub-elements ===

      # Get the dialog trigger element
      #
      # @return [Capybara::Node::Element]
      #
      def trigger
        find_within('[data-action*="click->ui--dialog#open"]')
      end

      # Get the container element (wrapper that contains overlay and content)
      #
      # @return [Capybara::Node::Element]
      #
      def container
        # Container is rendered within page, use all_within to allow :all visibility
        find_within('[data-ui--dialog-target="container"]', visible: :all)
      end

      # Get the overlay backdrop element
      #
      # @return [Capybara::Node::Element]
      #
      def overlay
        # Overlay is within container
        container.find('[data-ui--dialog-target="overlay"]', visible: :all)
      end

      # Get the content element
      #
      # @return [Capybara::Node::Element]
      #
      def content
        # Content is within container
        container.find('[data-ui--dialog-target="content"]', visible: :all)
      end

      # Get the close button element
      #
      # @return [Capybara::Node::Element]
      #
      def close_button
        content.find('[data-action*="click->ui--dialog#close"]')
      end

      # Get the title element
      #
      # @return [Capybara::Node::Element]
      #
      def title_element
        content.find("h2", match: :first)
      end

      # Get the description element
      #
      # @return [Capybara::Node::Element]
      #
      def description_element
        content.find("p.text-muted-foreground", match: :first)
      end

      # === ARIA Queries ===

      # Get the content role
      #
      # @return [String, nil] The role attribute
      #
      def content_role
        content["role"]
      end

      # Get the content aria-labelledby attribute
      #
      # @return [String, nil] The aria-labelledby attribute
      #
      def content_aria_labelledby
        content["aria-labelledby"]
      end

      # Get the content aria-describedby attribute
      #
      # @return [String, nil] The aria-describedby attribute
      #
      def content_aria_describedby
        content["aria-describedby"]
      end

      # Get the title ID (if present)
      #
      # @return [String, nil] The ID attribute of the title
      #
      def title_id
        title_element["id"]
      end

      # Get the description ID (if present)
      #
      # @return [String, nil] The ID attribute of the description
      #
      def description_id
        description_element["id"]
      end

      # Check if ARIA labeling is properly configured
      # Note: This requires IDs to be set on title and description
      #
      # @return [Boolean]
      #
      def aria_labeled_correctly?
        return false if title_id.nil? || description_id.nil?

        content_aria_labelledby == title_id &&
          content_aria_describedby == description_id
      end

      # === Focus Management ===

      # Get the currently focused element within the dialog
      #
      # @return [Capybara::Node::Element, nil]
      #
      def focused_element
        page.evaluate_script("document.activeElement")
      end

      # Check if focus is trapped within the dialog content
      #
      # @return [Boolean]
      #
      def focus_trapped?
        return false unless open?

        # Try to find the active element within content
        begin
          content.has_css?("*:focus", wait: 0)
        rescue StandardError
          false
        end
      end

      # === Waiters ===

      def wait_for_open(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if open?
          raise Capybara::ExpectationNotMet, "Dialog did not open after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      def wait_for_closed(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if closed?
          raise Capybara::ExpectationNotMet, "Dialog did not close after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end
    end
  end
end
