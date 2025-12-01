# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the Menubar component.
    #
    # @example Basic usage
    #   menubar = MenubarElement.new(find('[data-controller="ui--menubar"]'))
    #   menubar.open_menu("File")
    #   menubar.select_item("File", "New Tab")
    #   assert menubar.menu_closed?("File")
    #
    # @example Keyboard navigation
    #   menubar.open_menu("File")
    #   menubar.navigate_menu_item(:down)
    #   menubar.navigate_menu_item(:down)
    #   menubar.press_enter
    #
    class MenubarElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--menubar"]'

      # === Actions ===

      # Open a menu by its trigger text
      #
      # @param menu_name [String] The text of the menu trigger
      #
      def open_menu(menu_name)
        return if menu_open?(menu_name)

        # Close any other open menus first
        if any_menu_open? && active_menu != menu_name
          close_menu
        end

        trigger = find_trigger(menu_name)
        trigger.click
        wait_for_menu_open(menu_name)
      end

      # Close the currently open menu
      def close_menu
        press_escape
        wait_for_all_closed
      end

      # Select a menu item by menu name and item text
      # Note: Does NOT wait for close - use select_item_and_close for items that close the menu
      #
      # @param menu_name [String] The menu trigger text
      # @param item_text [String] The text of the item to select
      #
      def select_item(menu_name, item_text)
        open_menu(menu_name)
        content = find_content(menu_name)
        item = find_item_in_content(content, item_text)
        item.click
      end

      # Select a menu item and wait for the menu to close
      # Use this for regular menu items that close the menu on click
      #
      # @param menu_name [String] The menu trigger text
      # @param item_text [String] The text of the item to select
      #
      def select_item_and_close(menu_name, item_text)
        select_item(menu_name, item_text)
        wait_for_all_closed
      end

      # Hover over a menu item
      #
      # @param menu_name [String] The menu trigger text
      # @param item_text [String] The text of the item to hover
      #
      def hover_item(menu_name, item_text)
        open_menu(menu_name)
        content = find_content(menu_name)
        item = find_item_in_content(content, item_text)
        item.hover
      end

      # === State Queries ===

      # Check if a specific menu is open
      #
      # @param menu_name [String] The menu trigger text
      # @return [Boolean]
      #
      def menu_open?(menu_name)
        trigger = find_trigger(menu_name)
        trigger["data-state"] == "open" && trigger["aria-expanded"] == "true"
      end

      # Check if a specific menu is closed
      #
      # @param menu_name [String] The menu trigger text
      # @return [Boolean]
      #
      def menu_closed?(menu_name)
        !menu_open?(menu_name)
      end

      # Check if any menu is open
      #
      # @return [Boolean]
      #
      def any_menu_open?
        triggers.any? { |trigger| trigger["data-state"] == "open" }
      end

      # Get the currently active menu name (if any)
      #
      # @return [String, nil] The active menu trigger text or nil
      #
      def active_menu
        active_trigger = triggers.find { |trigger| trigger["data-state"] == "open" }
        active_trigger&.text&.strip
      end

      # === Menu Queries ===

      # Get all menu names (trigger texts)
      #
      # @return [Array<String>] Array of menu trigger texts
      #
      def menus
        triggers.map { |trigger| trigger.text.strip }
      end

      # Get the number of menus in the menubar
      #
      # @return [Integer]
      #
      def menu_count
        triggers.count
      end

      # === Items Queries ===

      # Get all menu item texts for a specific menu
      #
      # @param menu_name [String] The menu trigger text
      # @return [Array<String>] Array of item texts
      #
      def menu_items(menu_name)
        open_menu(menu_name)
        content = find_content(menu_name)
        all_items_in_content(content).map do |item|
          # Extract just the text without shortcuts
          # Shortcuts are in a separate span with text-xs class
          text = item.text.strip
          # Remove shortcut text (like "⌘T", "⌘N", etc.) from the end
          text.split("\n").first.strip
        end
      end

      # Check if a menu item exists in a specific menu
      #
      # @param menu_name [String] The menu trigger text
      # @param item_text [String] The item text to check
      # @return [Boolean]
      #
      def has_menu_item?(menu_name, item_text)
        open_menu(menu_name)
        content = find_content(menu_name)
        content.has_css?('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]', text: item_text)
      end

      # Check if an item is disabled
      #
      # @param menu_name [String] The menu trigger text
      # @param item_text [String] The item text
      # @return [Boolean]
      #
      def item_disabled?(menu_name, item_text)
        open_menu(menu_name)
        content = find_content(menu_name)
        item = find_item_in_content(content, item_text)
        # data-disabled can be "" (empty string) or "true"
        !item["data-disabled"].nil? || item["aria-disabled"] == "true"
      end

      # === Checkbox Items ===

      # Check if a checkbox item is checked
      #
      # @param menu_name [String] The menu trigger text
      # @param item_text [String] The checkbox item text
      # @return [Boolean]
      #
      def checkbox_checked?(menu_name, item_text)
        # Don't reopen if already open
        open_menu(menu_name) unless menu_open?(menu_name)
        content = find_content(menu_name)
        item = find_checkbox_item_in_content(content, item_text)
        item["data-state"] == "checked" && item["aria-checked"] == "true"
      end

      # Toggle a checkbox item
      #
      # @param menu_name [String] The menu trigger text
      # @param item_text [String] The checkbox item text
      #
      def toggle_checkbox(menu_name, item_text)
        open_menu(menu_name) unless menu_open?(menu_name)
        content = find_content(menu_name)
        item = find_checkbox_item_in_content(content, item_text)
        item["data-state"]
        item.click
        # Wait for state to actually change
        sleep 0.3
      end

      # === Radio Items ===

      # Check if a radio item is selected
      #
      # @param menu_name [String] The menu trigger text
      # @param item_text [String] The radio item text
      # @return [Boolean]
      #
      def radio_selected?(menu_name, item_text)
        open_menu(menu_name) unless menu_open?(menu_name)
        content = find_content(menu_name)
        item = find_radio_item_in_content(content, item_text)
        item["data-state"] == "checked" && item["aria-checked"] == "true"
      end

      # Select a radio item
      #
      # @param menu_name [String] The menu trigger text
      # @param item_text [String] The radio item text
      #
      def select_radio(menu_name, item_text)
        open_menu(menu_name) unless menu_open?(menu_name)
        content = find_content(menu_name)
        item = find_radio_item_in_content(content, item_text)
        item.click
        sleep 0.3 # Wait for state update
      end

      # === Submenu Support ===

      # Check if a menu item has a submenu
      #
      # @param menu_name [String] The menu trigger text
      # @param item_text [String] The item text
      # @return [Boolean]
      #
      def has_submenu?(menu_name, item_text)
        open_menu(menu_name) unless menu_open?(menu_name)
        content = find_content(menu_name)

        # Find the wrapper div that contains both trigger and submenu
        # Structure: div.relative > [role="menuitem"] + [role="menu"]
        wrappers = content.all(".relative", visible: :all, minimum: 0)
        wrapper = wrappers.find do |div|
          # Match exact text (first line only, without shortcuts)
          div.has_css?('[role="menuitem"]', exact_text: item_text, wait: false)
        end

        return false if wrapper.nil?

        # Check if there's a submenu in the wrapper
        wrapper.has_css?('[role="menu"]', visible: :all, wait: false)
      rescue Capybara::ElementNotFound
        false
      end

      # Open a submenu by hovering over its trigger
      #
      # @param parent_item [String] The submenu trigger text
      #
      def open_submenu(menu_name, parent_item)
        open_menu(menu_name)
        content = find_content(menu_name)
        trigger = find_item_in_content(content, parent_item)
        trigger.hover
        # Wait for submenu to open
        sleep 0.2
      end

      # Get items from a submenu
      #
      # @param menu_name [String] The menu trigger text
      # @param parent_item [String] The submenu trigger text
      # @return [Array<String>] Array of submenu item texts
      #
      def submenu_items(menu_name, parent_item)
        open_submenu(menu_name, parent_item)
        content = find_content(menu_name)
        trigger = find_item_in_content(content, parent_item)
        submenu = trigger.find(:xpath, 'following-sibling::*[@role="menu"]')
        all_items_in_content(submenu).map do |item|
          text = item.text.strip
          text.split("\n").first.strip
        end
      end

      # === Keyboard Navigation ===

      # Navigate between menu triggers (when menu is closed)
      #
      # @param direction [Symbol] :left or :right
      #
      def navigate_to_menu(direction)
        case direction
        when :left
          press_arrow_left
        when :right
          press_arrow_right
        else
          raise ArgumentError, "Invalid direction: #{direction}. Use :left or :right"
        end
      end

      # Navigate between menu items (when menu is open)
      #
      # @param direction [Symbol] :up or :down
      #
      def navigate_menu_item(direction)
        case direction
        when :up
          press_arrow_up
        when :down
          press_arrow_down
        else
          raise ArgumentError, "Invalid direction: #{direction}. Use :up or :down"
        end
      end

      # === Sub-elements ===

      # Get all trigger elements
      #
      # @return [Array<Capybara::Node::Element>]
      #
      def triggers
        all_within('[data-ui--menubar-target="trigger"]')
      end

      # Get a specific trigger element by menu name
      #
      # @param menu_name [String] The menu trigger text
      # @return [Capybara::Node::Element]
      #
      def trigger(menu_name)
        find_trigger(menu_name)
      end

      # Get a specific menu content element by menu name
      #
      # @param menu_name [String] The menu trigger text
      # @return [Capybara::Node::Element]
      #
      def content(menu_name)
        find_content(menu_name)
      end

      # === ARIA Queries ===

      # Check if menubar has correct role
      #
      # @return [String, nil] The role attribute
      #
      def menubar_role
        node["role"]
      end

      # Check if a trigger has correct ARIA attributes
      #
      # @param menu_name [String] The menu trigger text
      # @return [Hash] Hash of ARIA attribute values
      #
      def trigger_aria_attributes(menu_name)
        trigger = find_trigger(menu_name)
        {
          expanded: trigger["aria-expanded"],
          haspopup: trigger["aria-haspopup"]
        }
      end

      # Check if content has correct role
      #
      # @param menu_name [String] The menu trigger text
      # @return [String, nil] The role attribute
      #
      def content_role(menu_name)
        open_menu(menu_name)
        content = find_content(menu_name)
        content["role"]
      end

      # === Waiters ===

      def wait_for_menu_open(menu_name, timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if menu_open?(menu_name)
          raise Capybara::ExpectationNotMet, "Menu '#{menu_name}' did not open after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      def wait_for_menu_closed(menu_name, timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if menu_closed?(menu_name)
          raise Capybara::ExpectationNotMet, "Menu '#{menu_name}' did not close after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      def wait_for_all_closed(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true unless any_menu_open?
          raise Capybara::ExpectationNotMet, "Menus did not close after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      private

      def find_trigger(menu_name)
        triggers.find { |trigger| trigger.text.strip == menu_name } ||
          raise(Capybara::ElementNotFound, "Could not find menu trigger with text '#{menu_name}'")
      end

      def find_content(menu_name)
        trigger = find_trigger(menu_name)
        trigger_index = triggers.index(trigger)
        # Find all content elements including hidden ones
        contents = all_within('[data-ui--menubar-target="content"]', visible: :all, minimum: 1)
        content = contents[trigger_index]
        raise Capybara::ElementNotFound, "Could not find content for menu '#{menu_name}' (index: #{trigger_index}, found: #{contents.count} contents)" if content.nil?

        content
      end

      def find_item_in_content(content, text)
        content.find('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]', text: text)
      end

      def find_checkbox_item_in_content(content, text)
        content.find('[role="menuitemcheckbox"]', text: text)
      end

      def find_radio_item_in_content(content, text)
        content.find('[role="menuitemradio"]', text: text)
      end

      def all_items_in_content(content)
        return [] if content.nil?

        content.all('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]', minimum: 0)
      end
    end
  end
end
