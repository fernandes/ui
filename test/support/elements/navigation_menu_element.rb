# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the NavigationMenu component.
    #
    # @example Basic usage
    #   nav_menu = NavigationMenuElement.new(find('[data-controller="ui--navigation-menu"]'))
    #   nav_menu.open_menu("Home")
    #   nav_menu.click_link("Introduction")
    #   assert nav_menu.all_menus_closed?
    #
    # @example Keyboard navigation
    #   nav_menu.focus_trigger("Home")
    #   nav_menu.navigate_to_trigger(:right)
    #   nav_menu.press_arrow_down
    #
    class NavigationMenuElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--navigation-menu"]'

      # === Actions ===

      # Open a menu by clicking or hovering its trigger
      #
      # @param trigger_text [String] The text of the menu trigger
      #
      def open_menu(trigger_text)
        return if menu_open?(trigger_text)

        trigger = find_trigger(trigger_text)
        # Try hovering first (navigation menu opens on hover)
        trigger.hover
        sleep 0.25 # Wait for hover delay

        # If still not open, try clicking
        unless menu_open?(trigger_text)
          trigger.click
          wait_for_menu_open(trigger_text)
        end
      end

      # Hover over a trigger to open its menu
      #
      # @param trigger_text [String] The text of the menu trigger
      #
      def hover_trigger(trigger_text)
        trigger = find_trigger(trigger_text)
        trigger.hover
        # Wait for hover delay
        sleep 0.25
      end

      # Close the currently open menu
      def close_menu
        # Navigation menu closes on escape OR click outside
        # Let's try clicking outside which is more reliable
        # Find an element outside the navigation menu and click it
        page.find("h1").click
        sleep 0.3 # Wait for close animation
      end

      # Click a link within the currently open menu content
      #
      # @param link_text [String] The text of the link (can be partial match)
      #
      def click_link(link_text)
        active_content = find_active_content
        link = active_content.find("a", text: link_text)
        link.click
      end

      # Click outside the navigation menu to close it
      def click_outside
        # Find an element outside the navigation menu and click it
        # Use the h1 heading which is outside the nav element
        page.find("h1").click
        sleep 0.2 # Wait for event to process
        wait_for_all_closed
      end

      # === State Queries ===

      # Check if a specific menu is open
      #
      # @param trigger_text [String] The menu trigger text
      # @return [Boolean]
      #
      def menu_open?(trigger_text)
        trigger = find_trigger(trigger_text)
        trigger["data-state"] == "open" && trigger["aria-expanded"] == "true"
      end

      # Check if a specific menu is closed
      #
      # @param trigger_text [String] The menu trigger text
      # @return [Boolean]
      #
      def menu_closed?(trigger_text)
        !menu_open?(trigger_text)
      end

      # Check if any menu is currently open
      #
      # @return [Boolean]
      #
      def any_menu_open?
        triggers.any? { |trigger| trigger["data-state"] == "open" }
      end

      # Check if all menus are closed
      #
      # @return [Boolean]
      #
      def all_menus_closed?
        !any_menu_open?
      end

      # Get the currently active menu trigger text (if any)
      #
      # @return [String, nil] The active menu trigger text or nil
      #
      def active_menu
        active_trigger = triggers.find { |trigger| trigger["data-state"] == "open" }
        active_trigger&.text&.strip
      end

      # === Menu Queries ===

      # Get all menu trigger texts
      #
      # @return [Array<String>] Array of menu trigger texts
      #
      def menus
        triggers.map { |trigger| trigger.text.strip }
      end

      # Get the number of menu triggers
      #
      # @return [Integer]
      #
      def menu_count
        triggers.count
      end

      # === Content Queries ===

      # Get all links within the currently open menu
      #
      # @return [Array<String>] Array of link texts
      #
      def content_links
        return [] unless any_menu_open?

        active_content = find_active_content
        active_content.all("a", minimum: 0).map { |link| link.text.strip }
      end

      # Check if content has a specific link
      #
      # @param link_text [String] The link text to check
      # @return [Boolean]
      #
      def has_content_link?(link_text)
        return false unless any_menu_open?

        active_content = find_active_content
        active_content.has_css?("a", text: link_text)
      end

      # === Viewport Queries ===

      # Check if viewport is being used
      #
      # @return [Boolean]
      #
      def viewport_enabled?
        has_viewport_target?
      end

      # Check if viewport is open
      #
      # @return [Boolean]
      #
      def viewport_open?
        return false unless viewport_enabled?

        viewport["data-state"] == "open"
      end

      # === Indicator Queries ===

      # Get the indicator element if it exists
      #
      # @return [Capybara::Node::Element, nil]
      #
      def indicator
        # Indicator would be a visual element showing active menu
        # In navigation menu, this might be an underline or highlight
        node.first('[data-ui--navigation-menu-target="indicator"]', visible: :all, minimum: 0)
      end

      # Check if indicator is visible
      #
      # @return [Boolean]
      #
      def indicator_visible?
        indicator&.visible? || false
      end

      # === Keyboard Navigation ===

      # Navigate between triggers using arrow keys
      #
      # @param direction [Symbol] :left or :right
      #
      def navigate_to_trigger(direction)
        case direction
        when :left
          press_arrow_left
        when :right
          press_arrow_right
        else
          raise ArgumentError, "Invalid direction: #{direction}. Use :left or :right"
        end
      end

      # Navigate within content using arrow keys
      #
      # @param direction [Symbol] :up or :down
      #
      def navigate_in_content(direction)
        case direction
        when :up
          press_arrow_up
        when :down
          press_arrow_down
        else
          raise ArgumentError, "Invalid direction: #{direction}. Use :up or :down"
        end
      end

      # Focus a specific trigger
      #
      # @param trigger_text [String] The trigger text
      #
      def focus_trigger(trigger_text)
        trigger = find_trigger(trigger_text)
        # Use execute_script to focus the element
        page.execute_script("arguments[0].focus()", trigger)
      end

      # === Sub-elements ===

      # Get all trigger elements
      #
      # @return [Array<Capybara::Node::Element>]
      #
      def triggers
        all_within('[data-ui--navigation-menu-target="trigger"]')
      end

      # Get a specific trigger element
      #
      # @param trigger_text [String] The trigger text
      # @return [Capybara::Node::Element]
      #
      def trigger(trigger_text)
        find_trigger(trigger_text)
      end

      # Get all content elements
      #
      # @return [Array<Capybara::Node::Element>]
      #
      def contents
        all_within('[data-ui--navigation-menu-target="content"]', visible: :all, minimum: 0)
      end

      # Get the viewport element (if viewport is enabled)
      #
      # @return [Capybara::Node::Element, nil]
      #
      def viewport
        first_within('[data-ui--navigation-menu-target="viewport"]', visible: :all, minimum: 0)
      end

      # === ARIA Queries ===

      # Check if navigation menu has correct role
      #
      # @return [String, nil] The role attribute
      #
      def nav_role
        node["role"]
      end

      # Check trigger ARIA attributes
      #
      # @param trigger_text [String] The trigger text
      # @return [Hash] Hash of ARIA attribute values
      #
      def trigger_aria_attributes(trigger_text)
        trigger = find_trigger(trigger_text)
        {
          expanded: trigger["aria-expanded"],
          haspopup: trigger["aria-haspopup"]
        }
      end

      # Check content ARIA attributes
      #
      # @return [Hash] Hash of ARIA attribute values
      #
      def content_aria_attributes
        return {} unless any_menu_open?

        content = find_active_content
        {
          role: content["role"],
          orientation: content["aria-orientation"]
        }
      end

      # === Waiters ===

      def wait_for_menu_open(trigger_text, timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if menu_open?(trigger_text)
          raise Capybara::ExpectationNotMet, "Menu '#{trigger_text}' did not open after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      def wait_for_menu_closed(trigger_text, timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if menu_closed?(trigger_text)
          raise Capybara::ExpectationNotMet, "Menu '#{trigger_text}' did not close after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      def wait_for_all_closed(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if all_menus_closed?
          raise Capybara::ExpectationNotMet, "Menus did not close after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      private

      def find_trigger(trigger_text)
        triggers.find { |trigger| trigger.text.strip == trigger_text } ||
          raise(Capybara::ElementNotFound, "Could not find menu trigger with text '#{trigger_text}'")
      end

      def find_content(trigger_text)
        trigger = find_trigger(trigger_text)
        trigger_index = triggers.index(trigger)
        # Find all content elements including hidden ones
        all_contents = contents
        content = all_contents[trigger_index]
        raise Capybara::ElementNotFound, "Could not find content for menu '#{trigger_text}' (index: #{trigger_index}, found: #{all_contents.count} contents)" if content.nil?

        content
      end

      def find_active_content
        active_trigger_text = active_menu
        raise Capybara::ElementNotFound, "No menu is currently open" if active_trigger_text.nil?

        find_content(active_trigger_text)
      end

      def has_viewport_target?
        !viewport.nil?
      end
    end
  end
end
