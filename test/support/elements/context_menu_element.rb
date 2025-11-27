# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the ContextMenu component.
    #
    # @example Basic usage
    #   menu = ContextMenuElement.new(find('[data-controller="ui--context-menu"]'))
    #   menu.open_via_right_click
    #   menu.select_item("Copy")
    #   assert menu.closed?
    #
    # @example Keyboard navigation
    #   menu.open_via_right_click
    #   menu.press_arrow_down
    #   menu.press_arrow_down
    #   menu.press_enter
    #
    class ContextMenuElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--context-menu"]'

      # === Actions ===

      # Open the context menu via right-click on the trigger
      def open_via_right_click
        return if open?

        trigger.right_click
        wait_for_open
      end

      # Open the context menu (alias for open_via_right_click)
      def open
        open_via_right_click
      end

      # Close the context menu
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
        ensure_open
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

      # Check if the context menu is open
      def open?
        node["data-ui--context-menu-open-value"] == "true"
      end

      # Check if the context menu is closed
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
        # Rails/Phlex renders data: { disabled: true } as data-disabled="" (empty string)
        # or data-disabled="true" depending on the framework
        disabled_attr = item["data-disabled"]
        aria_disabled = item["aria-disabled"]
        (disabled_attr.present? && (disabled_attr == "" || disabled_attr == "true")) ||
          aria_disabled == "true"
      end

      # Get the number of menu items
      #
      # @return [Integer]
      #
      def item_count
        ensure_open
        all_items.count
      end

      # Get disabled items
      #
      # @return [Array<String>] Array of disabled item texts
      #
      def disabled_items
        ensure_open
        all_in_page('[role="menuitem"][data-disabled], [role="menuitemcheckbox"][data-disabled], [role="menuitemradio"][data-disabled]')
          .map { |item| item.text.strip }
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

      # === Separator Queries ===

      # Get all separators in the menu
      #
      # @return [Array<Capybara::Node::Element>] Array of separator elements
      #
      def separators
        ensure_open
        content.all('[role="separator"]')
      end

      # Get the number of separators
      #
      # @return [Integer]
      #
      def separator_count
        separators.count
      end

      # === Shortcut Queries ===

      # Get the shortcut text for an item
      #
      # @param item_text [String] The item text
      # @return [String, nil] The shortcut text or nil if no shortcut
      #
      def item_shortcut(item_text)
        ensure_open
        item = find_item(item_text)
        shortcut = item.first('.text-muted-foreground.ml-auto', wait: false)
        shortcut&.text&.strip
      rescue Capybara::ElementNotFound
        nil
      end

      # === Sub-elements ===

      # Get the trigger element
      #
      # @return [Capybara::Node::Element]
      #
      def trigger
        find_within('[data-ui--context-menu-target="trigger"]')
      end

      # Get the menu content element
      #
      # @return [Capybara::Node::Element]
      #
      def content
        find_in_page('[data-ui--context-menu-target="content"]')
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
          haspopup: trigger["aria-haspopup"]
        }
      end

      # Check if content has correct role
      #
      # @return [String, nil] The role attribute
      #
      def content_role
        ensure_open
        content["role"]
      end

      # === Keyboard Navigation ===

      # Navigate to the next item with arrow down
      def navigate_down
        ensure_open
        send_keys(:down)
      end

      # Navigate to the previous item with arrow up
      def navigate_up
        ensure_open
        send_keys(:up)
      end

      # Get the currently focused item (by tabindex)
      #
      # @return [Capybara::Node::Element, nil]
      #
      def focused_item
        ensure_open
        content.first('[role="menuitem"][tabindex="0"], [role="menuitemcheckbox"][tabindex="0"], [role="menuitemradio"][tabindex="0"]', wait: false)
      end

      # Get the text of the currently focused item
      #
      # @return [String, nil]
      #
      def focused_item_text
        item = focused_item
        item&.text&.strip
      end

      # === Waiters ===

      def wait_for_open(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if open?
          raise Capybara::ExpectationNotMet, "Context menu did not open after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      def wait_for_closed(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if closed?
          raise Capybara::ExpectationNotMet, "Context menu did not close after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      private

      def ensure_open
        open_via_right_click unless open?
      end

      def find_item(text)
        # Find in page (content is portaled)
        find_in_page('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]', text: text)
      end

      def find_checkbox_item(text)
        find_in_page('[role="menuitemcheckbox"]', text: text)
      end

      def find_radio_item(text)
        find_in_page('[role="menuitemradio"]', text: text)
      end

      def all_items
        content.all('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]')
      end
    end
  end
end
