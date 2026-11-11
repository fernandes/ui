# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the AlertDialog component.
    #
    # @example Basic usage
    #   alert_dialog = AlertDialogElement.new(find('[data-controller="ui--alert-dialog"]'))
    #   alert_dialog.open
    #   assert alert_dialog.open?
    #   alert_dialog.confirm
    #   assert alert_dialog.closed?
    #
    # @example Using triggers and buttons
    #   alert_dialog.trigger.click
    #   assert_equal "Are you absolutely sure?", alert_dialog.title
    #   alert_dialog.cancel_button.click
    #
    class AlertDialogElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--alert-dialog"]'

      # === Actions ===

      # Open the alert dialog by clicking the trigger
      def open
        return if open?

        trigger.click
        wait_for_open
      end

      # Cancel the alert dialog by clicking the cancel button
      def cancel
        return if closed?

        cancel_button.click
        wait_for_closed
      end

      # Confirm the alert dialog by clicking the action button
      def confirm
        return if closed?

        action_button.click
        wait_for_closed
      end

      # Close the alert dialog using the Escape key
      def close_with_escape
        return if closed?

        press_escape
        wait_for_closed
      end

      # === State Queries ===

      # Check if the alert dialog is open
      def open?
        container["data-state"] == "open"
      end

      # Check if the alert dialog is closed
      def closed?
        container["data-state"] == "closed"
      end

      # Get the alert dialog title text
      #
      # @return [String] The title text
      #
      def title
        # Find h2 element within content (title is rendered as h2)
        content.find("h2", match: :first).text.strip
      end

      # Get the alert dialog description text
      #
      # @return [String] The description text
      #
      def description
        # Find the first p element with muted foreground (description)
        content.find("p.text-muted-foreground", match: :first).text.strip
      end

      # Check if the alert dialog has a cancel button
      #
      # @return [Boolean]
      #
      def has_cancel_button?
        content.has_css?('[data-action*="click->ui--alert-dialog#close"]', visible: :all) &&
          content.all('[data-action*="click->ui--alert-dialog#close"]', visible: :all).count >= 1
      end

      # Check if the alert dialog has an action/confirm button
      #
      # @return [Boolean]
      #
      def has_action_button?
        content.has_css?('[data-action*="click->ui--alert-dialog#close"]', visible: :all) &&
          content.all('[data-action*="click->ui--alert-dialog#close"]', visible: :all).count >= 1
      end

      # Alias for consistency
      alias_method :has_confirm_button?, :has_action_button?

      # Check if content is visible
      def content_visible?
        content.visible?
      end

      # Check if overlay is visible
      def overlay_visible?
        overlay.visible?
      end

      # === Sub-elements ===

      # Get the alert dialog trigger element
      #
      # @return [Capybara::Node::Element]
      #
      def trigger
        # Trigger can be deep in the node structure, so find it anywhere within
        node.find('[data-action*="click->ui--alert-dialog#open"]', match: :first)
      end

      # Get the container element (wrapper that contains overlay and content)
      #
      # @return [Capybara::Node::Element]
      #
      def container
        # Container can be deep in the node structure, find it anywhere within
        node.find('[data-ui--alert-dialog-target="container"]', visible: :all, match: :first)
      end

      # Get the overlay backdrop element
      #
      # @return [Capybara::Node::Element]
      #
      def overlay
        # Overlay is within container
        container.find('[data-ui--alert-dialog-target="overlay"]', visible: :all)
      end

      # Get the content element
      #
      # @return [Capybara::Node::Element]
      #
      def content
        # Content is within container
        container.find('[data-ui--alert-dialog-target="content"]', visible: :all)
      end

      # Get the cancel button element
      #
      # @return [Capybara::Node::Element]
      #
      def cancel_button
        # The Cancel component is the `cancel` target; fall back to the first close button
        content.first('[data-ui--alert-dialog-target="cancel"]', visible: :all, minimum: 0) ||
          content.all('[data-action*="click->ui--alert-dialog#close"]', visible: :all).first
      end

      # Get the action/confirm button element
      #
      # @return [Capybara::Node::Element]
      #
      def action_button
        # Find the second button with close action (typically Continue/Confirm)
        buttons = content.all('[data-action*="click->ui--alert-dialog#close"]', visible: :all)
        buttons.last
      end

      # Alias for consistency
      alias_method :confirm_button, :action_button

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

      # Check if aria-modal is set to true
      #
      # @return [Boolean]
      #
      def aria_modal?
        content_aria_modal == "true"
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

      # Get the currently focused element within the alert dialog
      #
      # @return [Capybara::Node::Element, nil]
      #
      def focused_element
        page.evaluate_script("document.activeElement")
      end

      # Check if focus is trapped within the alert dialog content
      #
      # @return [Boolean]
      #
      def focus_trapped?
        return false unless open?

        # Try to find the active element within content
        begin
          content.has_css?("*:focus", wait: 0)
        rescue
          false
        end
      end

      # The element that carries the trigger ARIA: the wrapper's button, or
      # the as_child element itself
      def trigger_button
        trigger.matches_css?("button, a") ? trigger : trigger.find("button, a", match: :first)
      end

      # Text (or aria-label) of the element that has focus, anywhere on the page
      def focused_label
        page.evaluate_script(<<~JS).to_s.strip
          (() => {
            const el = document.activeElement
            return el.getAttribute("aria-label") || el.textContent || el.tagName
          })()
        JS
      end

      # Whether focus is inside this alert dialog's content
      def focus_inside?
        page.evaluate_script(<<~JS)
          document.querySelector(#{content_selector.to_json}).contains(document.activeElement)
        JS
      end

      # Whether the trigger button has focus
      def trigger_focused?
        page.evaluate_script(<<~JS)
          (() => {
            const trigger = document.querySelector(#{(root_selector + " [data-ui--alert-dialog-target='trigger']").to_json})
            return trigger === document.activeElement || trigger.contains(document.activeElement)
          })()
        JS
      end

      # Whether a page element outside the dialog is inert (unreachable)
      def inert?(selector)
        page.evaluate_script("!!document.querySelector(#{selector.to_json})?.closest('[inert]')")
      end

      # Press keys on whatever has focus
      def keyboard(*keys)
        page.send_keys(*keys)
      end

      def wait_for_focus_inside(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if focus_inside?
          raise Capybara::ExpectationNotMet, "Focus did not move into the alert dialog after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      # === Waiters ===

      def wait_for_open(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if open?
          raise Capybara::ExpectationNotMet, "AlertDialog did not open after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      def wait_for_closed(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if closed?
          raise Capybara::ExpectationNotMet, "AlertDialog did not close after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      private

      def root_selector
        id = node[:id]
        raise ArgumentError, "focus helpers need the alert dialog root to have an id" if id.blank?

        "##{id}"
      end

      def content_selector
        "#{root_selector} [data-ui--alert-dialog-target='content']"
      end
    end
  end
end
