# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the Accordion component.
    #
    # @example Basic usage
    #   accordion = AccordionElement.new(find('[data-controller="ui--accordion"]'))
    #   accordion.expand("item-1")
    #   assert accordion.expanded?("item-1")
    #
    # @example Keyboard navigation
    #   accordion.focus_trigger("item-1")
    #   accordion.press_enter
    #   assert accordion.expanded?("item-1")
    #
    class AccordionElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--accordion"]'

      # === Actions ===

      # Expand an accordion item by its value
      #
      # @param value [String] The data-value of the item
      #
      def expand(value)
        return if expanded?(value)

        trigger(value).click
        wait_for_expanded(value)
      end

      # Collapse an accordion item by its value
      #
      # @param value [String] The data-value of the item
      #
      def collapse(value)
        return if collapsed?(value)

        trigger(value).click
        wait_for_collapsed(value)
      end

      # Toggle an accordion item by its value
      #
      # @param value [String] The data-value of the item
      #
      def toggle(value)
        trigger(value).click
        sleep 0.1 # Wait for animation to start
      end

      # Expand an item using keyboard
      #
      # @param value [String] The data-value of the item
      #
      def expand_with_keyboard(value)
        focus_trigger(value)
        press_enter
        wait_for_expanded(value)
      end

      # Collapse an item using keyboard
      #
      # @param value [String] The data-value of the item
      #
      def collapse_with_keyboard(value)
        focus_trigger(value)
        press_enter
        wait_for_collapsed(value)
      end

      # === State Queries ===

      # Check if an item is expanded
      #
      # @param value [String] The data-value of the item
      # @return [Boolean]
      #
      def expanded?(value)
        item(value)["data-state"] == "open"
      end

      # Check if an item is collapsed
      #
      # @param value [String] The data-value of the item
      # @return [Boolean]
      #
      def collapsed?(value)
        item(value)["data-state"] == "closed"
      end

      # Get the total number of items
      #
      # @return [Integer]
      #
      def item_count
        all_items.count
      end

      # Get all expanded item values
      #
      # @return [Array<String>] Array of expanded item values
      #
      def expanded_items
        all_items.select { |i| i["data-state"] == "open" }.map { |i| i["data-value"] }
      end

      # Get all collapsed item values
      #
      # @return [Array<String>] Array of collapsed item values
      #
      def collapsed_items
        all_items.select { |i| i["data-state"] == "closed" }.map { |i| i["data-value"] }
      end

      # Get the accordion type (single or multiple)
      #
      # @return [String] "single" or "multiple"
      #
      def accordion_type
        node["data-ui--accordion-type-value"] || "single"
      end

      # Check if accordion is collapsible (for single type)
      #
      # @return [Boolean]
      #
      def collapsible?
        node["data-ui--accordion-collapsible-value"] == "true"
      end

      # Get the content text of an item
      #
      # @param value [String] The data-value of the item
      # @return [String] The content text
      #
      def content_text(value)
        content(value).text.strip
      end

      # Get the trigger text of an item
      #
      # @param value [String] The data-value of the item
      # @return [String] The trigger text (without icon)
      #
      def trigger_text(value)
        # Get text without the SVG caret icon
        trigger(value).text.strip
      end

      # === Sub-elements ===

      # Get an accordion item element by value
      #
      # @param value [String] The data-value of the item
      # @return [Capybara::Node::Element]
      #
      def item(value)
        find_within("[data-ui--accordion-target='item'][data-value='#{value}']")
      end

      # Get the trigger button for an item
      #
      # @param value [String] The data-value of the item
      # @return [Capybara::Node::Element]
      #
      def trigger(value)
        item_element = item(value)
        item_element.find("button[data-ui--accordion-target='trigger']")
      end

      # Get the content element for an item
      #
      # @param value [String] The data-value of the item
      # @return [Capybara::Node::Element]
      #
      def content(value)
        item_element = item(value)
        item_element.find("[data-ui--accordion-target='content']", visible: :all)
      end

      # Get the h3 wrapper for an item's trigger
      #
      # @param value [String] The data-value of the item
      # @return [Capybara::Node::Element]
      #
      def trigger_wrapper(value)
        item_element = item(value)
        item_element.find("h3")
      end

      # === Keyboard Navigation ===

      # Focus a trigger button
      #
      # @param value [String] The data-value of the item
      #
      def focus_trigger(value)
        trigger(value).native.focus
        sleep 0.05 # Wait for focus
      end

      # Navigate to next trigger with Tab
      def tab_to_next
        press_tab
      end

      # Navigate to previous trigger with Shift+Tab
      def tab_to_previous
        press_shift_tab
      end

      # Send key using Playwright's keyboard API (more reliable than send_keys)
      def press_key_via_keyboard(key)
        page.driver.with_playwright_page do |pw_page|
          pw_page.keyboard.press(key)
        end
      end

      # Navigate to next trigger with Arrow Down
      def arrow_down
        press_key_via_keyboard("ArrowDown")
      end

      # Navigate to previous trigger with Arrow Up
      def arrow_up
        press_key_via_keyboard("ArrowUp")
      end

      # Jump to first trigger with Home
      def go_home
        press_key_via_keyboard("Home")
      end

      # Jump to last trigger with End
      def go_end
        press_key_via_keyboard("End")
      end

      # Get the currently focused element
      def focused_element
        page.evaluate_script("document.activeElement")
      end

      # Check if a specific trigger has focus
      def trigger_focused?(value)
        trigger(value).native == page.driver.browser.evaluate("document.activeElement")
      rescue
        # Fallback: compare via id
        trigger_id = trigger(value)["id"]
        focused_id = page.evaluate_script("document.activeElement?.id")
        trigger_id == focused_id
      end

      # Get the value of the currently focused trigger
      def focused_trigger_value
        focused_id = page.evaluate_script("document.activeElement?.id")
        return nil unless focused_id

        # Find the trigger with this id and get its parent item's value
        all_trigger_elements.each_with_index do |trigger_el, index|
          if trigger_el["id"] == focused_id
            return all_items[index]["data-value"]
          end
        end
        nil
      end

      # Get all trigger elements
      def all_trigger_elements
        node.all("button[data-ui--accordion-target='trigger']")
      end

      # === ARIA Queries ===

      # Get ARIA attributes for a trigger
      #
      # @param value [String] The data-value of the item
      # @return [Hash] Hash of ARIA attribute values
      #
      def trigger_aria_attributes(value)
        trigger_element = trigger(value)
        {
          expanded: trigger_element["aria-expanded"],
          controls: trigger_element["aria-controls"]
        }
      end

      # Get ARIA attributes for content
      #
      # @param value [String] The data-value of the item
      # @return [Hash] Hash of ARIA attribute values
      #
      def content_aria_attributes(value)
        content_element = content(value)
        {
          role: content_element["role"],
          labelledby: content_element["aria-labelledby"],
          hidden: content_element["hidden"]
        }
      end

      # Check if trigger has correct ARIA controls relationship
      #
      # @param value [String] The data-value of the item
      # @return [Boolean]
      #
      def aria_controls_valid?(value)
        trigger_element = trigger(value)
        content_element = content(value)
        trigger_element["aria-controls"] == content_element["id"]
      end

      # === Waiters ===

      def wait_for_expanded(value, timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if expanded?(value)
          raise Capybara::ExpectationNotMet, "Item #{value} did not expand after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      def wait_for_collapsed(value, timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if collapsed?(value)
          raise Capybara::ExpectationNotMet, "Item #{value} did not collapse after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      private

      def all_items
        node.all("[data-ui--accordion-target='item']")
      end
    end
  end
end
