# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the Tabs component.
    #
    # @example Basic usage
    #   tabs = TabsElement.new(find('[data-controller="ui--tabs"]'))
    #   tabs.select_tab("Account")
    #   assert_equal "Account", tabs.active_tab
    #
    # @example Keyboard navigation
    #   tabs.focus_tab("Account")
    #   tabs.press_arrow_right
    #   tabs.press_enter
    #
    class TabsElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--tabs"]'

      # === Actions ===

      # Select a tab by its visible text
      #
      # @param tab_text [String] The text of the tab to select
      #
      def select_tab(tab_text)
        tab = find_tab_by_text(tab_text)
        tab.click
        wait_for_active_tab(tab_text)
      end

      # Select a tab by its data-value attribute
      #
      # @param value [String] The data-value of the tab
      #
      def select_tab_by_value(value)
        tab = find_tab_by_value(value)
        tab.click
        wait_for_active_panel(value)
      end

      # Focus a specific tab (without activating it)
      # Useful for testing manual activation mode
      #
      # @param tab_text [String] The text of the tab to focus
      #
      def focus_tab(tab_text)
        tab = find_tab_by_text(tab_text)
        tab.native.focus # Focus without triggering click
      end

      # === State Queries ===

      # Get the currently active tab text
      #
      # @return [String] The text of the active tab
      #
      def active_tab
        active = tab_triggers.find { |t| t["data-state"] == "active" }
        active&.text&.strip
      end

      # Get the currently active tab value
      #
      # @return [String, nil] The data-value of the active tab
      #
      def active_tab_value
        active = tab_triggers.find { |t| t["data-state"] == "active" }
        active&.[]("data-value")
      end

      # Get the text of all tabs
      #
      # @return [Array<String>] Array of tab texts
      #
      def tabs
        tab_triggers.map { |t| t.text.strip }
      end

      # Get the data-values of all tabs
      #
      # @return [Array<String>] Array of tab data-values
      #
      def tab_values
        tab_triggers.map { |t| t["data-value"] }
      end

      # Get the number of tabs
      #
      # @return [Integer]
      #
      def tab_count
        tab_triggers.count
      end

      # Check if a tab with the given text exists
      #
      # @param text [String] The tab text to check
      # @return [Boolean]
      #
      def has_tab?(text)
        tabs.include?(text)
      end

      # Check if a tab is disabled
      #
      # @param text [String] The tab text
      # @return [Boolean]
      #
      def tab_disabled?(text)
        tab = find_tab_by_text(text)
        tab.disabled? || tab["aria-disabled"] == "true"
      end

      # Check if a tab is currently active/selected
      #
      # @param text [String] The tab text
      # @return [Boolean]
      #
      def tab_active?(text)
        tab = find_tab_by_text(text)
        tab["data-state"] == "active" && tab["aria-selected"] == "true"
      end

      # Get the content of the currently active panel
      #
      # @return [String] The text content of the active panel
      #
      def panel_content
        active_panel = tab_panels.find { |p| p["data-state"] == "active" }
        active_panel&.text&.strip
      end

      # Check if a panel with the given value is visible
      #
      # @param value [String] The data-value of the panel
      # @return [Boolean]
      #
      def panel_visible?(value)
        panel = find_panel_by_value(value)
        panel["data-state"] == "active" && !panel[:hidden]
      end

      # Check if a panel with the given value is hidden
      #
      # @param value [String] The data-value of the panel
      # @return [Boolean]
      #
      def panel_hidden?(value)
        panel = first_panel_by_value(value)
        return true if panel.nil?

        panel["data-state"] == "inactive" || panel[:hidden]
      end

      # === Sub-elements ===

      # Get the tab list element
      #
      # @return [Capybara::Node::Element]
      #
      def tab_list
        find_within('[role="tablist"]')
      end

      # Get a specific tab trigger by value
      #
      # @param value [String] The data-value of the tab
      # @return [Capybara::Node::Element]
      #
      def tab(value)
        find_tab_by_value(value)
      end

      # Get a specific panel by value
      #
      # @param value [String] The data-value of the panel
      # @return [Capybara::Node::Element]
      #
      def panel(value)
        find_panel_by_value(value)
      end

      # === Keyboard Navigation ===

      # Navigate to next tab (right arrow in horizontal, down arrow in vertical)
      def navigate_next
        orientation = node["data-ui--tabs-orientation-value"] || "horizontal"
        orientation == "horizontal" ? press_arrow_right : press_arrow_down
      end

      # Navigate to previous tab (left arrow in horizontal, up arrow in vertical)
      def navigate_previous
        orientation = node["data-ui--tabs-orientation-value"] || "horizontal"
        orientation == "horizontal" ? press_arrow_left : press_arrow_up
      end

      # Navigate to first tab
      def navigate_to_first
        press_home
      end

      # Navigate to last tab
      def navigate_to_last
        press_end
      end

      # === ARIA Queries ===

      # Get ARIA attributes for the tab list
      #
      # @return [Hash] Hash of ARIA attribute values
      #
      def tab_list_aria_attributes
        {
          role: tab_list["role"],
          orientation: tab_list["aria-orientation"]
        }
      end

      # Get ARIA attributes for a specific tab
      #
      # @param text [String] The tab text
      # @return [Hash] Hash of ARIA attribute values
      #
      def tab_aria_attributes(text)
        tab = find_tab_by_text(text)
        {
          role: tab["role"],
          selected: tab["aria-selected"],
          controls: tab["aria-controls"],
          disabled: tab["aria-disabled"]
        }
      end

      # Get ARIA attributes for a specific panel
      #
      # @param value [String] The panel data-value
      # @return [Hash] Hash of ARIA attribute values
      #
      def panel_aria_attributes(value)
        panel = find_panel_by_value(value)
        {
          role: panel["role"],
          labelledby: panel["aria-labelledby"]
        }
      end

      # === Waiters ===

      def wait_for_active_tab(text, timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if active_tab == text
          if Time.now - start_time > timeout
            raise Capybara::ExpectationNotMet,
                  "Expected tab '#{text}' to be active, got '#{active_tab}' after #{timeout}s"
          end

          sleep 0.05
        end
      end

      def wait_for_active_panel(value, timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if panel_visible?(value)
          if Time.now - start_time > timeout
            raise Capybara::ExpectationNotMet,
                  "Expected panel '#{value}' to be visible after #{timeout}s"
          end

          sleep 0.05
        end
      end

      private

      def tab_triggers
        all_within('[data-ui--tabs-target="trigger"]')
      end

      def tab_panels
        all_within('[data-ui--tabs-target="content"]')
      end

      def find_tab_by_text(text)
        find_within('[role="tab"]', text: text)
      end

      def find_tab_by_value(value)
        find_within("[role='tab'][data-value='#{value}']")
      end

      def find_panel_by_value(value)
        find_within("[role='tabpanel'][data-value='#{value}']")
      end

      def first_panel_by_value(value)
        first_within("[role='tabpanel'][data-value='#{value}']", minimum: 0)
      end
    end
  end
end
