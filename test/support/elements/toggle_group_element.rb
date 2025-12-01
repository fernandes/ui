# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the Toggle Group component.
    #
    # @example Basic usage
    #   toggle_group = ToggleGroupElement.new(find('[data-controller="ui--toggle-group"]'))
    #   toggle_group.select_item("left")
    #   assert_equal ["left"], toggle_group.selected_items
    #
    # @example Multiple selection
    #   toggle_group.toggle_item("bold")
    #   toggle_group.toggle_item("italic")
    #   assert_equal ["bold", "italic"], toggle_group.selected_items
    #
    # @example State queries
    #   assert toggle_group.selected?("left")
    #   assert_not toggle_group.selected?("right")
    #
    class ToggleGroupElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--toggle-group"]'

      # === Actions ===

      # Select an item by its value (single selection mode)
      # In single mode, this will deselect any other selected item
      #
      # @param value [String] The data-value of the item to select
      #
      def select_item(value)
        item = find_item_by_value(value)
        item.click
        wait_for_selected(value)
      end

      # Toggle an item on or off
      # In single mode, toggles the item (deselecting if already selected)
      # In multiple mode, adds or removes from selection
      #
      # @param value [String] The data-value of the item to toggle
      #
      def toggle_item(value)
        item = find_item_by_value(value)
        item.click
        sleep 0.1 # Allow state to update
      end

      # === State Queries ===

      # Get the currently selected item(s)
      #
      # @return [Array<String>] Array of selected item values
      #
      def selected_items
        items.select { |item| item["data-state"] == "on" }
          .map { |item| item["data-value"] }
      end

      # Get the first selected item (useful for single selection mode)
      #
      # @return [String, nil] The data-value of the selected item, or nil
      #
      def selected_item
        selected_items.first
      end

      # Check if an item is currently selected
      #
      # @param value [String] The item value to check
      # @return [Boolean]
      #
      def selected?(value)
        item = find_item_by_value(value)
        item["data-state"] == "on"
      end

      # Get the selection type (single or multiple)
      #
      # @return [String] "single" or "multiple"
      #
      def type
        node["data-ui--toggle-group-type-value"] || "single"
      end

      # Check if this is a single selection toggle group
      #
      # @return [Boolean]
      #
      def single_selection?
        type == "single"
      end

      # Check if this is a multiple selection toggle group
      #
      # @return [Boolean]
      #
      def multiple_selection?
        type == "multiple"
      end

      # Get the role of the toggle group
      #
      # @return [String] "radiogroup" for single, "group" for multiple
      #
      def group_role
        node["role"]
      end

      # Get the number of items in the group
      #
      # @return [Integer]
      #
      def item_count
        items.count
      end

      # Get all item values
      #
      # @return [Array<String>] Array of all item data-values
      #
      def item_values
        items.map { |item| item["data-value"] }
      end

      # Check if an item is disabled
      #
      # @param value [String] The item value
      # @return [Boolean]
      #
      def item_disabled?(value)
        item = find_item_by_value(value)
        item.disabled? || item["aria-disabled"] == "true"
      end

      # === Sub-elements ===

      # Get a specific item by value
      #
      # @param value [String] The data-value of the item
      # @return [Capybara::Node::Element]
      #
      def item(value)
        find_item_by_value(value)
      end

      # === Keyboard Navigation ===

      # Navigate to next item (right arrow in horizontal, down arrow in vertical)
      def navigate_next
        orientation = node["data-orientation"] || "horizontal"
        (orientation == "horizontal") ? press_arrow_right : press_arrow_down
      end

      # Navigate to previous item (left arrow in horizontal, up arrow in vertical)
      def navigate_previous
        orientation = node["data-orientation"] || "horizontal"
        (orientation == "horizontal") ? press_arrow_left : press_arrow_up
      end

      # === ARIA Queries ===

      # Get ARIA attributes for the group
      #
      # @return [Hash] Hash of ARIA attribute values
      #
      def group_aria_attributes
        {
          role: group_role,
          orientation: node["data-orientation"]
        }
      end

      # Get ARIA attributes for a specific item
      #
      # @param value [String] The item value
      # @return [Hash] Hash of ARIA attribute values
      #
      def item_aria_attributes(value)
        item = find_item_by_value(value)
        attrs = {
          disabled: item["aria-disabled"],
          role: single_selection? ? "radio" : nil
        }

        # Add appropriate checked/pressed attribute based on type
        if single_selection?
          attrs[:checked] = item["aria-checked"]
        else
          attrs[:pressed] = item["aria-pressed"]
        end

        attrs.compact
      end

      # === Waiters ===

      def wait_for_selected(value, timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if selected?(value)
          if Time.now - start_time > timeout
            raise Capybara::ExpectationNotMet,
              "Expected item '#{value}' to be selected after #{timeout}s"
          end

          sleep 0.05
        end
      end

      def wait_for_not_selected(value, timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true unless selected?(value)
          if Time.now - start_time > timeout
            raise Capybara::ExpectationNotMet,
              "Expected item '#{value}' to not be selected after #{timeout}s"
          end

          sleep 0.05
        end
      end

      private

      def items
        all_within('[data-ui--toggle-group-target="item"]')
      end

      def find_item_by_value(value)
        find_within("[data-ui--toggle-group-target='item'][data-value='#{value}']")
      end
    end
  end
end
