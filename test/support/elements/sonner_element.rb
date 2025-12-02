# frozen_string_literal: true

module UI
  module Testing
    # Component Object Model for Sonner (Toast) component
    #
    # @example Basic usage
    #   sonner = find_element(SonnerElement)
    #   sonner.trigger("#success-toast-btn")
    #   assert_equal 1, sonner.toast_count
    #   assert_equal "Profile updated", sonner.toast_title
    #
    class SonnerElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--sonner"]'

      # Trigger a toast by clicking a button
      #
      # @param button_selector [String] CSS selector for the trigger button
      # @return [void]
      def trigger(button_selector)
        page.find(button_selector).click
        wait_for_toast_to_appear
      end

      # Get all visible toasts (ordered newest to oldest)
      #
      # @return [Array<Capybara::Node::Element>] Array of toast elements
      def toasts
        all_within('[data-sonner-toast][data-visible="true"]').to_a.reverse
      end

      # Get all toasts (visible and hidden)
      #
      # @return [Array<Capybara::Node::Element>] Array of all toast elements
      def all_toasts
        all_within("[data-sonner-toast]", minimum: 0)
      end

      # Get the number of visible toasts
      #
      # @return [Integer] Number of visible toasts
      def toast_count
        toasts.count
      end

      # Get the title of the first (most recent) visible toast
      #
      # @return [String, nil] Toast title text or nil if no toasts
      def toast_title
        first_toast = toasts.first
        return nil unless first_toast

        first_toast.find("[data-title]", wait: 1).text
      end

      # Get the description of the first (most recent) visible toast
      #
      # @return [String, nil] Toast description text or nil if no description
      def toast_description
        first_toast = toasts.first
        return nil unless first_toast

        desc = first_toast.first("[data-description]", minimum: 0, wait: 1)
        desc&.text
      end

      # Get the type of the first (most recent) visible toast
      #
      # @return [String, nil] Toast type (success, error, info, warning) or nil
      def toast_type
        first_toast = toasts.first
        return nil unless first_toast

        first_toast["data-type"]
      end

      # Get the title of a specific toast by index (0 = most recent)
      #
      # @param index [Integer] Toast index
      # @return [String, nil] Toast title text or nil
      def toast_title_at(index)
        toast = toasts[index]
        return nil unless toast

        title = toast.first("[data-title]", minimum: 0, wait: 1)
        title&.text
      end

      # Get the description of a specific toast by index
      #
      # @param index [Integer] Toast index
      # @return [String, nil] Toast description text or nil
      def toast_description_at(index)
        toast = toasts[index]
        return nil unless toast

        desc = toast.first("[data-description]", minimum: 0, wait: 1)
        desc&.text
      end

      # Get the type of a specific toast by index
      #
      # @param index [Integer] Toast index
      # @return [String, nil] Toast type or nil
      def toast_type_at(index)
        toast = toasts[index]
        return nil unless toast

        toast["data-type"]
      end

      # Dismiss a toast by clicking its close button
      #
      # @param index [Integer] Toast index (0 = most recent)
      # @return [void]
      def dismiss_toast(index = 0)
        toast = toasts[index]
        return unless toast

        close_button = toast.find("[data-close-button]", wait: 1)
        close_button.click
        wait_for_toast_to_disappear
      end

      # Get the action button within the first toast
      #
      # @return [Capybara::Node::Element, nil] Action button element or nil
      def action_button
        first_toast = toasts.first
        return nil unless first_toast

        first_toast.first("[data-button]", minimum: 0, wait: 1)
      end

      # Click the action button in the first toast
      #
      # @return [void]
      def click_action_button
        btn = action_button
        return unless btn

        initial_count = toast_count
        btn.click

        # Wait for toast count to decrease
        start_time = Time.now
        loop do
          return true if toast_count < initial_count

          if Time.now - start_time > 2
            raise Capybara::ExpectationNotMet, "Toast did not dismiss after action button click"
          end

          sleep 0.05
        end
      end

      # Check if toast has an action button
      #
      # @param index [Integer] Toast index
      # @return [Boolean] True if toast has an action button
      def has_action_button?(index = 0)
        toast = toasts[index]
        return false unless toast

        toast.has_css?("[data-button]", wait: 1)
      end

      # Check if toast has a close button
      #
      # @param index [Integer] Toast index
      # @return [Boolean] True if toast has a close button
      def has_close_button?(index = 0)
        toast = toasts[index]
        return false unless toast

        toast.has_css?("[data-close-button]", wait: 1)
      end

      # Wait for a toast to appear
      #
      # @param timeout [Integer] Timeout in seconds
      # @return [Boolean] True if toast appeared
      def wait_for_toast_to_appear(timeout: 2)
        start_time = Time.now
        loop do
          return true if toast_count > 0

          if Time.now - start_time > timeout
            raise Capybara::ExpectationNotMet, "Toast did not appear after #{timeout}s"
          end

          sleep 0.05
        end
      end

      # Wait for a toast to disappear (after dismiss or auto-dismiss)
      #
      # @param timeout [Integer] Timeout in seconds
      # @return [Boolean] True if toast disappeared
      def wait_for_toast_to_disappear(timeout: 2)
        initial_count = toast_count
        start_time = Time.now

        loop do
          current_count = toast_count
          return true if current_count < initial_count

          if Time.now - start_time > timeout
            raise Capybara::ExpectationNotMet, "Toast did not disappear after #{timeout}s"
          end

          sleep 0.05
        end
      end

      # Wait for a specific number of visible toasts
      #
      # @param count [Integer] Expected number of toasts
      # @param timeout [Integer] Timeout in seconds
      # @return [Boolean] True if count matches
      def wait_for_toast_count(count, timeout: 2)
        start_time = Time.now
        loop do
          return true if toast_count >= count

          if Time.now - start_time > timeout
            raise Capybara::ExpectationNotMet,
              "Expected #{count} toasts, but found #{toast_count} after #{timeout}s"
          end

          sleep 0.05
        end
      end

      # Wait for all toasts to auto-dismiss
      #
      # @param timeout [Integer] Timeout in seconds
      # @return [Boolean] True if all toasts dismissed
      def wait_for_all_toasts_to_dismiss(timeout: 12)
        start_time = Time.now

        loop do
          return true if toast_count == 0

          if Time.now - start_time > timeout
            raise Capybara::ExpectationNotMet,
              "Toasts still visible after #{timeout}s (count: #{toast_count})"
          end

          sleep 0.1
        end
      end

      # Check if a toast is mounted (animation completed)
      #
      # @param index [Integer] Toast index
      # @return [Boolean] True if toast is mounted
      def toast_mounted?(index = 0)
        toast = toasts[index]
        return false unless toast

        toast["data-mounted"] == "true"
      end

      # Check if a toast is expanded (hover state)
      #
      # @param index [Integer] Toast index
      # @return [Boolean] True if toast is expanded
      def toast_expanded?(index = 0)
        toast = toasts[index]
        return false unless toast

        toast["data-expanded"] == "true"
      end

      # Get the position attribute of the toaster
      #
      # @return [String] Position (e.g., "bottom-right", "top-center")
      def position
        y_pos = node["data-y-position"]
        x_pos = node["data-x-position"]
        "#{y_pos}-#{x_pos}"
      end

      # Get the theme attribute of the toaster
      #
      # @return [String] Theme (light, dark)
      def theme
        node["data-sonner-theme"]
      end

      # Hover over the toaster to expand toasts
      #
      # @return [void]
      def hover
        node.hover
        sleep 0.1 # Wait for expand animation
      end

      # Move mouse away from toaster to collapse toasts
      #
      # @return [void]
      def unhover
        # Move mouse to body to trigger mouseleave
        page.find("body").hover
        sleep 0.1 # Wait for collapse animation
      end
    end
  end
end
