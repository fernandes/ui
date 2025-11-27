# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the Command component.
    #
    # @example Basic usage
    #   command = CommandElement.new(find('[data-controller="ui--command"]'))
    #   command.search("calendar")
    #   assert_equal 1, command.visible_items.count
    #
    # @example Keyboard navigation
    #   command.search("settings")
    #   command.press_arrow_down
    #   command.press_enter
    #
    class CommandElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--command"]'

      # === Actions ===

      # Get the search input element
      #
      # @return [Capybara::Node::Element]
      #
      def input
        find_within('[data-ui--command-target="input"]')
      end

      # Type a search query into the input
      #
      # @param query [String] The search query
      #
      def search(query)
        input.fill_in with: query
        # Give filtering time to complete
        sleep 0.1
      end

      # Clear the search input
      def clear_search
        input.fill_in with: ""
        sleep 0.1
      end

      # Type text into the input (for progressive typing tests)
      #
      # @param text [String] The text to type
      #
      def type(text)
        input.send_keys(text)
        sleep 0.05
      end

      # Get the list element
      #
      # @return [Capybara::Node::Element]
      #
      def list
        find_within('[data-ui--command-target="list"]')
      end

      # Get the empty state element
      #
      # @return [Capybara::Node::Element, nil]
      #
      def empty_element
        first_within('[data-ui--command-target="empty"]', visible: false)
      end

      # === State Queries ===

      # Get all item elements (visible and hidden)
      #
      # @return [Array<Capybara::Node::Element>]
      #
      def all_items
        all_within('[data-ui--command-target="item"]')
      end

      # Get all visible items (not hidden)
      #
      # @return [Array<Capybara::Node::Element>]
      #
      def visible_items
        all_items.reject { |item| item[:hidden] || item["hidden"] == "true" }
      end

      # Get all hidden items
      #
      # @return [Array<Capybara::Node::Element>]
      #
      def hidden_items
        all_items.select { |item| item[:hidden] || item["hidden"] == "true" }
      end

      # Get visible item texts (without shortcuts)
      #
      # @return [Array<String>]
      #
      def visible_item_texts
        visible_items.map { |item| extract_item_text(item) }
      end

      # Get all item texts (including hidden, without shortcuts)
      #
      # @return [Array<String>]
      #
      def all_item_texts
        all_items.map { |item| extract_item_text(item) }
      end

      # Get the count of visible items
      #
      # @return [Integer]
      #
      def visible_item_count
        visible_items.count
      end

      # Check if empty state is visible
      #
      # @return [Boolean]
      #
      def empty_visible?
        return false unless empty_element

        !empty_element[:class].to_s.include?("hidden")
      end

      # Get the empty state text
      #
      # @return [String, nil]
      #
      def empty_text
        empty_element&.text&.strip
      end

      # === Group Queries ===

      # Get all group elements
      #
      # @return [Array<Capybara::Node::Element>]
      #
      def all_groups
        all_within('[data-ui--command-target="group"]')
      end

      # Get visible groups (not hidden)
      #
      # @return [Array<Capybara::Node::Element>]
      #
      def visible_groups
        all_groups.reject { |group| group[:hidden] || group["hidden"] == "true" }
      end

      # Get group headings
      #
      # @return [Array<String>]
      #
      def group_headings
        visible_groups.map do |group|
          # The heading div has an id like "command-group-xxxx" and aria-labelledby on the group
          aria_labelledby = group["aria-labelledby"]
          if aria_labelledby
            begin
              heading = group.first("[id='#{aria_labelledby}']", visible: false, wait: 0.1)
              heading&.text&.strip
            rescue Capybara::ElementNotFound
              nil
            end
          else
            nil
          end
        end.compact.reject(&:empty?)
      end

      # === Selection Queries ===

      # Get the currently selected (highlighted) item
      #
      # @return [Capybara::Node::Element, nil]
      #
      def selected_item
        first_within('[data-ui--command-target="item"][data-selected="true"]', visible: false)
      end

      # Get the selected item text (without shortcut)
      #
      # @return [String, nil]
      #
      def selected_item_text
        item = selected_item
        item ? extract_item_text(item) : nil
      end

      # Check if an item is selected
      #
      # @param text [String] The item text
      # @return [Boolean]
      #
      def item_selected?(text)
        item = find_item_by_text(text)
        item && item["data-selected"] == "true"
      end

      # === Item Actions ===

      # Find an item by its text content
      #
      # @param text [String] The item text to find
      # @return [Capybara::Node::Element]
      #
      def find_item_by_text(text)
        all_items.find { |item| extract_item_text(item).include?(text) }
      end

      # Find an item by its data-value
      #
      # @param value [String] The data-value to find
      # @return [Capybara::Node::Element]
      #
      def find_item_by_value(value)
        find_within("[data-ui--command-target='item'][data-value='#{value}']")
      end

      # Click an item to select it
      #
      # @param text [String] The item text
      #
      def select_item(text)
        item = find_item_by_text(text)
        item.click
        sleep 0.1
      end

      # Select an item using keyboard (assumes item is already highlighted)
      def select_with_enter
        press_enter
        sleep 0.1
      end

      # Check if an item is disabled
      #
      # @param text [String] The item text
      # @return [Boolean]
      #
      def item_disabled?(text)
        item = find_item_by_text(text)
        return false unless item

        # Check both data-disabled (can be empty string or "true") and aria-disabled
        disabled_attr = item["data-disabled"]
        aria_disabled = item["aria-disabled"]

        # data-disabled="" (empty string) or data-disabled="true" both mean disabled
        (disabled_attr == "" || disabled_attr == "true") || aria_disabled == "true"
      end

      # === Keyboard Navigation ===

      # Focus the input
      def focus_input
        input.click
        sleep 0.05
      end

      # Navigate down through items
      def navigate_down
        press_arrow_down
        sleep 0.05
      end

      # Navigate up through items
      def navigate_up
        press_arrow_up
        sleep 0.05
      end

      # Navigate to first item
      def navigate_to_first
        press_home
        sleep 0.05
      end

      # Navigate to last item
      def navigate_to_last
        press_end
        sleep 0.05
      end

      # === Shortcut Queries ===

      # Get all shortcut elements
      #
      # @return [Array<Capybara::Node::Element>]
      #
      def shortcuts
        all_within('[data-slot="command-shortcut"]')
      end

      # Check if an item has a shortcut
      #
      # @param item_text [String] The item text
      # @return [Boolean]
      #
      def item_has_shortcut?(item_text)
        item = find_item_by_text(item_text)
        return false unless item

        item.has_css?('[data-slot="command-shortcut"]')
      end

      # Get the shortcut text for an item
      #
      # @param item_text [String] The item text
      # @return [String, nil]
      #
      def item_shortcut(item_text)
        item = find_item_by_text(item_text)
        return nil unless item

        begin
          shortcut = item.first('[data-slot="command-shortcut"]', visible: false, wait: 0.1)
          shortcut&.text&.strip
        rescue Capybara::ElementNotFound
          nil
        end
      end

      # === ARIA Queries ===

      # Check if input has correct role
      #
      # @return [String, nil]
      #
      def input_role
        input["role"]
      end

      # Check if list has correct role
      #
      # @return [String, nil]
      #
      def list_role
        list["role"]
      end

      # Get aria-selected attribute of an item
      #
      # @param text [String] The item text
      # @return [String, nil]
      #
      def item_aria_selected(text)
        item = find_item_by_text(text)
        item&.[]("aria-selected")
      end

      private

      # Extract item text without shortcut
      #
      # @param item [Capybara::Node::Element] The item element
      # @return [String] The item text without shortcut
      #
      def extract_item_text(item)
        full_text = item.text.strip
        # Remove shortcut text if present (shortcut is typically at the end)
        # Use a synchronize with minimal wait time to avoid waiting when shortcut doesn't exist
        begin
          shortcut = item.first('[data-slot="command-shortcut"]', visible: false, wait: 0.1)
          if shortcut
            shortcut_text = shortcut.text.strip
            full_text = full_text.gsub(shortcut_text, "").strip
          end
        rescue Capybara::ElementNotFound
          # No shortcut found, that's okay
        end
        full_text
      end
    end
  end
end
