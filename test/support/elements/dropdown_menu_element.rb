# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the DropdownMenu component.
    #
    # @example Basic usage
    #   menu = DropdownMenuElement.new(find('[data-controller="dropdown"]'))
    #   menu.open
    #   menu.select_item("Profile")
    #   assert menu.closed?
    #
    # @example Keyboard navigation
    #   menu.open
    #   menu.press_arrow_down
    #   menu.press_arrow_down
    #   menu.press_enter
    #
    class DropdownMenuElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--dropdown"]'

      # === Actions ===

      # Open the dropdown menu
      def open
        return if open?

        trigger.click
        wait_for_open
      end

      # Close the dropdown menu
      def close
        return if closed?

        press_escape
        wait_for_closed
      end

      # Select a menu item by its visible text
      # Note: Does NOT wait for close - use select_item_and_close for items that close the menu
      #
      # @param item_text [String] The text of the item to select
      #
      def select_item(item_text)
        open
        item = find_item(item_text)
        item.click
      end

      # Select a menu item and wait for the menu to close
      # Use this for regular menu items that close the menu on click
      #
      # @param item_text [String] The text of the item to select
      #
      def select_item_and_close(item_text)
        select_item(item_text)
        wait_for_closed
      end

      # Hover over a menu item
      #
      # @param item_text [String] The text of the item to hover
      #
      def hover_item(item_text)
        ensure_open
        item = find_item(item_text)
        item.hover
      end

      # === State Queries ===

      # Check if the dropdown is open
      def open?
        node["data-ui--dropdown-open-value"] == "true"
      end

      # Check if the dropdown is closed
      def closed?
        !open?
      end

      # === Items Queries ===

      # Get all menu item texts
      #
      # @return [Array<String>] Array of item texts
      #
      def items
        ensure_open
        all_items.map { |item| item.text.strip }
      end

      # Check if a menu item exists
      #
      # @param text [String] The item text to check
      # @return [Boolean]
      #
      def has_item?(text)
        ensure_open
        content.has_css?('[role="menuitem"]', text: text) ||
          content.has_css?('[role="menuitemcheckbox"]', text: text) ||
          content.has_css?('[role="menuitemradio"]', text: text)
      end

      # Check if an item is disabled
      #
      # @param text [String] The item text
      # @return [Boolean]
      #
      def item_disabled?(text)
        ensure_open
        item = find_item(text)
        item["data-disabled"] == "true" || item["aria-disabled"] == "true"
      end

      # Get the number of menu items
      #
      # @return [Integer]
      #
      def item_count
        ensure_open
        all_items.count
      end

      # === Checkbox Items ===

      # Check if a checkbox item is checked
      #
      # @param text [String] The checkbox item text
      # @return [Boolean]
      #
      def checkbox_checked?(text)
        ensure_open
        item = find_checkbox_item(text)
        item["data-state"] == "checked" && item["aria-checked"] == "true"
      end

      # Toggle a checkbox item
      #
      # @param text [String] The checkbox item text
      #
      def toggle_checkbox(text)
        ensure_open
        item = find_checkbox_item(text)
        item.click
      end

      # === Radio Items ===

      # Check if a radio item is selected
      #
      # @param text [String] The radio item text
      # @return [Boolean]
      #
      def radio_selected?(text)
        ensure_open
        item = find_radio_item(text)
        item["data-state"] == "checked" && item["aria-checked"] == "true"
      end

      # Select a radio item
      #
      # @param text [String] The radio item text
      #
      def select_radio(text)
        ensure_open
        item = find_radio_item(text)
        item.click
      end

      # === Submenu Support ===

      # Check if a menu item has a submenu
      #
      # @param text [String] The item text
      # @return [Boolean]
      #
      def has_submenu?(text)
        ensure_open
        item = find_item(text)
        # Check if there's a submenu sibling
        submenu = item.find(:xpath, 'following-sibling::*[@role="menu"]', wait: false)
        submenu.present?
      rescue Capybara::ElementNotFound
        false
      end

      # Open a submenu
      #
      # @param trigger_text [String] The submenu trigger text
      #
      def open_submenu(trigger_text)
        ensure_open
        trigger = find_item(trigger_text)
        trigger.hover
        # Wait for submenu to open
        sleep 0.2
      end

      # === Sub-elements ===

      # Get the trigger button element
      #
      # @return [Capybara::Node::Element]
      #
      def trigger
        find_within('[data-ui--dropdown-target="trigger"]')
      end

      # Get the menu content element
      #
      # @return [Capybara::Node::Element]
      #
      def content
        find_within('[data-ui--dropdown-target="content"]')
      end

      # Get a specific menu item element
      #
      # @param text [String] The item text
      # @return [Capybara::Node::Element]
      #
      def item(text)
        find_item(text)
      end

      # === ARIA Queries ===

      # Check if trigger has correct ARIA attributes
      #
      # @return [Hash] Hash of ARIA attribute values
      #
      def trigger_aria_attributes
        {
          expanded: trigger["aria-expanded"],
          haspopup: trigger["aria-haspopup"]
        }
      end

      # Check if content has correct role
      #
      # @return [String, nil] The role attribute
      #
      def content_role
        content["role"]
      end

      # === Waiters ===

      def wait_for_open(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if open?
          raise Capybara::ExpectationNotMet, "Dropdown menu did not open after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      def wait_for_closed(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if closed?
          raise Capybara::ExpectationNotMet, "Dropdown menu did not close after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      private

      def ensure_open
        open unless open?
      end

      def find_item(text)
        # Try to find regular menuitem first
        content.find('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]', text: text)
      end

      def find_checkbox_item(text)
        content.find('[role="menuitemcheckbox"]', text: text)
      end

      def find_radio_item(text)
        content.find('[role="menuitemradio"]', text: text)
      end

      def all_items
        content.all('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]')
      end
    end
  end
end
