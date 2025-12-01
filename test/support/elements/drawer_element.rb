# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the Drawer component.
    #
    # Drawer is a mobile-first component that slides in from the edge of the screen
    # with gesture-based drag-to-close functionality. Based on Vaul.
    #
    # @example Basic usage
    #   drawer = DrawerElement.new(find('[data-controller="ui--drawer"]'))
    #   drawer.open
    #   assert drawer.open?
    #   drawer.close
    #   assert drawer.closed?
    #
    # @example Testing snap points
    #   drawer = find_element(UI::TestingDrawerElement, "#drawer-snap-points")
    #   drawer.open
    #   assert_equal 3, drawer.snap_points_count
    #   drawer.snap_to(2) # Snap to third snap point
    #   assert drawer.at_snap_point?(2)
    #
    # @example Testing different directions
    #   drawer = find_element(UI::TestingDrawerElement, "#drawer-left")
    #   drawer.open
    #   assert_equal "left", drawer.direction
    #
    class DrawerElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--drawer"]'

      # === Actions ===

      # Open the drawer by clicking the trigger
      def open
        return if open?

        trigger.click
        wait_for_open
      end

      # Close the drawer by clicking the close button or using escape
      def close
        return if closed?

        if has_close_button?
          # Use JavaScript click to ensure Stimulus action fires correctly
          page.execute_script("arguments[0].click()", close_button)
        else
          press_escape
        end
        wait_for_closed
      end

      # Close the drawer using the Escape key
      def close_with_escape
        return if closed?

        press_escape
        wait_for_closed
      end

      # Close the drawer by clicking the overlay backdrop
      def close_by_overlay_click
        return if closed?

        # Click at the top-left corner of the overlay to avoid hitting the content
        overlay.click(x: 5, y: 5)
        wait_for_closed
      end

      # Drag the handle (simplified drag simulation)
      # For testing drag behavior, but note this is limited in non-touch environments
      def drag_handle
        handle.click # Simplified - actual drag would need more complex simulation
      end

      # === Snap Point Methods ===

      # Snap to a specific snap point index
      #
      # @param index [Integer] The snap point index (0-based)
      #
      def snap_to(index)
        return unless has_snap_points?

        # Use the Stimulus controller's snapTo method
        # Access the controller via Stimulus application
        page.execute_script(<<~JS)
          const element = document.getElementById('#{node[:id]}');
          const controller = Stimulus.getControllerForElementAndIdentifier(element, 'ui--drawer');
          if (controller) {
            controller.snapTo(#{index});
          }
        JS

        wait_for_snap_point(index)
      end

      # Get the count of snap points
      #
      # @return [Integer] Number of snap points
      #
      def snap_points_count
        snap_points_value = node["data-ui--drawer-snap-points-value"]
        return 0 unless snap_points_value

        JSON.parse(snap_points_value).length
      rescue JSON::ParserError
        0
      end

      # Get the snap points array
      #
      # @return [Array<Float>] Array of snap point values
      #
      def snap_points
        snap_points_value = node["data-ui--drawer-snap-points-value"]
        return [] unless snap_points_value

        JSON.parse(snap_points_value)
      rescue JSON::ParserError
        []
      end

      # Get the current active snap point index
      #
      # @return [Integer] Current snap point index (-1 if not at a snap point)
      #
      def current_snap_point
        active_value = node["data-ui--drawer-active-snap-point-value"]
        active_value ? active_value.to_i : -1
      end

      # Check if the drawer is at a specific snap point
      #
      # @param index [Integer] The snap point index to check
      # @return [Boolean]
      #
      def at_snap_point?(index)
        current_snap_point == index
      end

      # Check if the drawer has snap points configured
      #
      # @return [Boolean]
      #
      def has_snap_points?
        !snap_points.empty?
      end

      # === State Queries ===

      # Check if the drawer is open
      def open?
        container["data-state"] == "open"
      end

      # Check if the drawer is closed
      def closed?
        container["data-state"] == "closed"
      end

      # Get the drawer title text
      #
      # @return [String] The title text
      #
      def title
        # Title can be h2 or div with role="heading"
        content.find('[role="heading"], h2', match: :first).text.strip
      end

      # Get the drawer description text
      #
      # @return [String] The description text
      #
      def description
        # Find the first p element with muted foreground (description)
        content.find("p.text-muted-foreground", match: :first).text.strip
      end

      # Check if the drawer has a close button
      #
      # @return [Boolean]
      #
      def has_close_button?
        content.has_css?('button[data-action*="ui--drawer#close"]', visible: :all)
      end

      # Check if content is visible
      def content_visible?
        content["data-state"] == "open"
      end

      # Check if overlay is visible
      def overlay_visible?
        overlay.visible?
      end

      # Get the drawer direction
      #
      # @return [String] Direction (bottom, top, left, right)
      #
      def direction
        node["data-ui--drawer-direction-value"] || "bottom"
      end

      # Check if drawer is in modal mode
      #
      # @return [Boolean]
      #
      def modal?
        modal_value = node["data-ui--drawer-modal-value"]
        # nil (attribute not present) means default (true)
        # Empty string means true in Stimulus
        # "false" means not modal
        modal_value.nil? || modal_value != "false"
      end

      # Check if drawer is in handle-only mode
      #
      # @return [Boolean]
      #
      def handle_only?
        # Attribute must exist (not nil) and not be "false"
        # Empty string means true in Stimulus
        node.has_attribute?("data-ui--drawer-handle-only-value") &&
          node["data-ui--drawer-handle-only-value"] != "false"
      end

      # Check if drawer is dismissible
      #
      # @return [Boolean]
      #
      def dismissible?
        dismissible_value = node["data-ui--drawer-dismissible-value"]
        # Empty string or "true" means dismissible, only "false" means not dismissible
        dismissible_value != "false"
      end

      # === Sub-elements ===

      # Get the drawer trigger element
      #
      # @return [Capybara::Node::Element]
      #
      def trigger
        find_within('[data-action*="click->ui--drawer#open"]')
      end

      # Get the container element (wrapper that contains overlay and content)
      #
      # @return [Capybara::Node::Element]
      #
      def container
        # Container is rendered within page, use all_within to allow :all visibility
        find_within('[data-ui--drawer-target="container"]', visible: :all)
      end

      # Get the overlay backdrop element
      #
      # @return [Capybara::Node::Element]
      #
      def overlay
        # Overlay is within container
        container.find('[data-ui--drawer-target="overlay"]', visible: :all)
      end

      # Get the content element
      #
      # @return [Capybara::Node::Element]
      #
      def content
        # Content is a sibling of container, not inside it
        find_within("[data-vaul-drawer]", visible: :all)
      end

      # Get the handle element (drag indicator)
      #
      # @return [Capybara::Node::Element]
      #
      def handle
        content.find('[data-ui--drawer-target="handle"]', visible: :all)
      end

      # Get the close button element
      #
      # @return [Capybara::Node::Element]
      #
      def close_button
        # Close button is a button with the close action (not the overlay)
        content.find('button[data-action*="ui--drawer#close"]', visible: true)
      end

      # Get the title element
      #
      # @return [Capybara::Node::Element]
      #
      def title_element
        content.find('[role="heading"], h2', match: :first)
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

      # === Focus Management ===

      # Get the currently focused element within the drawer
      #
      # @return [Capybara::Node::Element, nil]
      #
      def focused_element
        page.evaluate_script("document.activeElement")
      end

      # Check if focus is trapped within the drawer content
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

      # === Waiters ===

      def wait_for_open(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if open?
          raise Capybara::ExpectationNotMet, "Drawer did not open after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      def wait_for_closed(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if closed?
          raise Capybara::ExpectationNotMet, "Drawer did not close after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      def wait_for_snap_point(index, timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if at_snap_point?(index)
          if Time.now - start_time > timeout
            raise Capybara::ExpectationNotMet,
              "Drawer did not snap to point #{index} after #{timeout}s (current: #{current_snap_point})"
          end

          sleep 0.05
        end
      end
    end
  end
end
