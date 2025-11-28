# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the Sheet component.
    #
    # Sheet is a variant of Dialog that slides in from a specific side (top, right, bottom, left).
    # It reuses the ui--dialog Stimulus controller.
    #
    # @example Basic usage
    #   sheet = SheetElement.new(find('[data-controller="ui--dialog"]'))
    #   sheet.open
    #   assert sheet.open?
    #   sheet.close
    #   assert sheet.closed?
    #
    # @example Using triggers and close button
    #   sheet.trigger.click
    #   assert_equal "Edit profile", sheet.title
    #   sheet.close_button.click
    #
    # @example Testing different sides
    #   sheet = find_element(UI::TestingSheetElement, "#sheet-top")
    #   sheet.open
    #   assert sheet.slide_from?(:top)
    #
    class SheetElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--dialog"]'

      # === Actions ===

      # Open the sheet by clicking the trigger
      def open
        return if open?

        trigger.click
        wait_for_open
      end

      # Close the sheet by clicking the close button
      def close
        return if closed?

        close_button.click
        wait_for_closed
      end

      # Close the sheet using the Escape key
      def close_with_escape
        return if closed?

        press_escape
        wait_for_closed
      end

      # Close the sheet by clicking the overlay backdrop
      def close_by_overlay_click
        return if closed?

        # Click at the top-left corner of the overlay to avoid hitting the content
        overlay.click(x: 5, y: 5)
        wait_for_closed
      end

      # === State Queries ===

      # Check if the sheet is open
      def open?
        container["data-state"] == "open"
      end

      # Check if the sheet is closed
      def closed?
        container["data-state"] == "closed"
      end

      # Get the sheet title text
      #
      # @return [String] The title text
      #
      def title
        # Find h2 element within content (title is rendered as h2)
        content.find("h2", match: :first).text.strip
      end

      # Get the sheet description text
      #
      # @return [String] The description text
      #
      def description
        # Find the first p element with muted foreground (description)
        content.find("p.text-muted-foreground", match: :first).text.strip
      end

      # Check if the sheet has a close button
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

      # Check if sheet slides from a specific side
      #
      # @param side [Symbol, String] The side to check (:top, :right, :bottom, :left)
      # @return [Boolean]
      #
      def slide_from?(side)
        side_str = side.to_s
        classes = content[:class]

        case side_str
        when "top"
          classes.include?("slide-in-from-top")
        when "right"
          classes.include?("slide-in-from-right")
        when "bottom"
          classes.include?("slide-in-from-bottom")
        when "left"
          classes.include?("slide-in-from-left")
        else
          false
        end
      end

      # === Sub-elements ===

      # Get the sheet trigger element
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

      # Get the close button element (X button in corner)
      #
      # @return [Capybara::Node::Element]
      #
      def close_button
        # Target the X button specifically (absolute positioned, top-4 right-4)
        content.find('button.absolute.top-4.right-4[data-action*="click->ui--dialog#close"]')
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

      # Get the content aria-modal attribute
      #
      # @return [String, nil] The aria-modal attribute
      #
      def content_aria_modal
        content["aria-modal"]
      end

      # === Focus Management ===

      # Get the currently focused element within the sheet
      #
      # @return [Capybara::Node::Element, nil]
      #
      def focused_element
        page.evaluate_script("document.activeElement")
      end

      # Check if focus is trapped within the sheet content
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
          raise Capybara::ExpectationNotMet, "Sheet did not open after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      def wait_for_closed(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if closed?
          raise Capybara::ExpectationNotMet, "Sheet did not close after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end
    end
  end
end
