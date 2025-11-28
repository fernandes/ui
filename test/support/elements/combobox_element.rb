# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the Combobox component.
    #
    # Combobox is a composition pattern using Popover/Drawer + Command + Button.
    # The combobox controller manages selection state and updates the trigger text.
    #
    # @example Basic usage
    #   combobox = ComboboxElement.new(find('[data-controller~="ui--combobox"]'))
    #   combobox.search("Next")
    #   combobox.select_option("Next.js")
    #   assert_equal "Next.js", combobox.selected_text
    #
    # @example Keyboard navigation
    #   combobox.open
    #   combobox.search("svelte")
    #   combobox.press_arrow_down
    #   combobox.press_enter
    #
    class ComboboxElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller~="ui--combobox"]'

      # === Actions ===

      # Open the combobox (triggers Popover/Drawer)
      def open
        return if open?

        trigger.click
        wait_for_open
      end

      # Close the combobox
      def close
        return if closed?

        press_escape
        wait_for_closed
      end

      # Search for options by typing in the Command input
      #
      # @param query [String] The search query
      #
      def search(query)
        ensure_open
        search_input.click
        search_input.fill_in(with: query)
      end

      # Clear the search input
      def clear_search
        ensure_open
        search_input.fill_in(with: "")
      end

      # Select an option by its visible text
      #
      # @param text [String] The text of the option to select
      #
      def select_option(text)
        ensure_open
        option = find_option(text)
        option.click
        wait_for_closed
      end

      # Select an option using keyboard navigation
      #
      # @param text [String] The text of the option to select
      #
      def select_with_keyboard(text)
        ensure_open

        # Find the index of the option
        current_options = visible_options
        target_index = current_options.index(text)

        return unless target_index

        # Clear any existing navigation state
        search_input.click

        # Navigate to the option
        target_index.times { press_arrow_down }

        # Select it
        press_enter
        wait_for_closed
      end

      # === State Queries ===

      # Check if the combobox is open
      def open?
        # Check if popover/drawer/dropdown is open based on content visibility
        if popover_content
          popover_content["data-state"] == "open"
        elsif drawer_content
          drawer_content["data-state"] == "open"
        elsif dropdown_content
          # Dropdown uses data-ui--dropdown-open-value
          dropdown_container.node["data-ui--dropdown-open-value"] == "true" if dropdown_container
        else
          false
        end
      end

      # Check if the combobox is closed
      def closed?
        !open?
      end

      # Get the currently selected option text (from the trigger button)
      #
      # @return [String] The text displayed in the trigger
      #
      def selected_text
        text_target&.text&.strip || trigger.text.strip
      end

      # Get the currently selected value
      #
      # @return [String, nil] The data-value of the selected option
      #
      def selected_value
        node["data-ui--combobox-value-value"]
      end

      # Get the current search query
      #
      # @return [String] The value in the search input
      #
      def search_query
        ensure_open
        search_input.value
      end

      # === Options Queries ===

      # Get all available option texts (including filtered)
      #
      # @return [Array<String>] Array of option texts
      #
      def options
        ensure_open
        all_items.map { |item| item.text.strip }
      end

      # Get currently visible options (after search filtering)
      #
      # @return [Array<String>] Array of visible option texts
      #
      def visible_options
        ensure_open
        visible_items.map { |item| item.text.strip }
      end

      # Get the number of visible options
      #
      # @return [Integer]
      #
      def option_count
        ensure_open
        visible_items.count
      end

      # Check if an option with the given text exists and is visible
      #
      # @param text [String] The option text to check
      # @return [Boolean]
      #
      def has_option?(text)
        ensure_open
        command_list.has_css?('[role="option"]', text: text, visible: true)
      end

      # Check if the "empty" message is shown (no results)
      #
      # @return [Boolean]
      #
      def empty_message_visible?
        ensure_open
        # Empty message is in the command list
        command_list.has_css?('[data-slot="command-empty"]', text: /No.*found/i, visible: true)
      end

      # Get the empty message text
      #
      # @return [String, nil]
      #
      def empty_message
        ensure_open
        empty = command_list.first('[data-slot="command-empty"]', text: /No.*found/i)
        empty&.text&.strip
      end

      # === Sub-elements ===

      # Get the trigger button element
      #
      # @return [Capybara::Node::Element]
      #
      def trigger
        # The trigger is typically a Button inside the Popover/Drawer trigger
        # Try to find button with role first, then any button
        begin
          find_within('button[role="combobox"]')
        rescue Capybara::ElementNotFound
          find_within('button')
        end
      end

      # Get the text target (span showing selected value)
      #
      # @return [Capybara::Node::Element, nil]
      #
      def text_target
        first_within('[data-ui--combobox-target="text"]')
      end

      # Get the search input element (Command Input)
      #
      # @return [Capybara::Node::Element]
      #
      def search_input
        # Command input is rendered in the content area - wait for it to be visible
        if popover_container
          popover_container.node.find('[data-ui--popover-target="content"] input[role="combobox"]', visible: true)
        elsif drawer_container
          drawer_container.node.find('[data-ui--drawer-target="content"] input[role="combobox"]', visible: true)
        elsif dropdown_container
          dropdown_container.node.find('[data-ui--dropdown-target="content"] input[role="combobox"]', visible: true)
        else
          find_in_page('input[role="combobox"]')
        end
      end

      # Get the command list container
      #
      # @return [Capybara::Node::Element]
      #
      def command_list
        # Wait for listbox to be visible
        if popover_container
          popover_container.node.find('[data-ui--popover-target="content"] [role="listbox"]', visible: true)
        elsif drawer_container
          drawer_container.node.find('[data-ui--drawer-target="content"] [role="listbox"]', visible: true)
        elsif dropdown_container
          dropdown_container.node.find('[data-ui--dropdown-target="content"] [role="listbox"]', visible: true)
        else
          find_in_page('[role="listbox"]')
        end
      end

      # === Container Helpers ===

      # Get the Popover container (if using Popover)
      #
      # @return [UI::TestingBaseElement, nil]
      #
      def popover_container
        return @popover_container if defined?(@popover_container)

        popover_node = if node.matches_css?('[data-controller~="ui--popover"]')
          node
        else
          begin
            first_within('[data-controller~="ui--popover"]')
          rescue Capybara::ExpectationNotMet, Capybara::ElementNotFound
            nil
          end
        end

        @popover_container = popover_node ? UI::TestingBaseElement.new(popover_node) : nil
      end

      # Get the Drawer container (if using Drawer)
      #
      # @return [Capybara::Node::Element, nil]
      #
      def drawer_container
        return @drawer_container if defined?(@drawer_container)

        # Check if drawer exists without raising error
        drawer = nil
        begin
          drawer = first_within('[data-controller~="ui--drawer"]')
        rescue Capybara::ExpectationNotMet, Capybara::ElementNotFound
          # No drawer found, that's OK
        end

        @drawer_container = drawer ? UI::TestingBaseElement.new(drawer) : nil
      end

      # Get the DropdownMenu container (if using DropdownMenu)
      #
      # @return [UI::TestingBaseElement, nil]
      #
      def dropdown_container
        return @dropdown_container if defined?(@dropdown_container)

        dropdown_node = if node.matches_css?('[data-controller~="ui--dropdown"]')
          node
        else
          begin
            first_within('[data-controller~="ui--dropdown"]')
          rescue Capybara::ExpectationNotMet, Capybara::ElementNotFound
            nil
          end
        end

        @dropdown_container = dropdown_node ? UI::TestingBaseElement.new(dropdown_node) : nil
      end

      # Get the Popover content element
      #
      # @return [Capybara::Node::Element, nil]
      #
      def popover_content
        return nil unless popover_container

        # Don't wait for visibility - we need this to check if it's open
        begin
          popover_container.node.find('[data-ui--popover-target="content"]', visible: :all)
        rescue Capybara::ElementNotFound
          nil
        end
      end

      # Get the Drawer content element
      #
      # @return [Capybara::Node::Element, nil]
      #
      def drawer_content
        return nil unless drawer_container

        # Don't wait for visibility - we need this to check if it's open
        begin
          drawer_container.node.find('[data-ui--drawer-target="content"]', visible: :all, minimum: 0)
        rescue Capybara::ElementNotFound
          nil
        end
      end

      # Get the DropdownMenu content element
      #
      # @return [Capybara::Node::Element, nil]
      #
      def dropdown_content
        return nil unless dropdown_container

        # Don't wait for visibility - we need this to check if it's open
        begin
          dropdown_container.node.find('[data-ui--dropdown-target="content"]', visible: :all, minimum: 0)
        rescue Capybara::ElementNotFound
          nil
        end
      end

      # === ARIA Queries ===

      # Check if trigger has correct ARIA attributes
      #
      # @return [Hash] Hash of ARIA attribute values
      #
      def trigger_aria_attributes
        {
          expanded: trigger["aria-expanded"],
          haspopup: trigger["aria-haspopup"],
          role: trigger["role"]
        }
      end

      # Check if search input has correct ARIA role
      #
      # @return [String, nil] The role attribute
      #
      def search_input_role
        ensure_open
        search_input["role"]
      end

      # === Keyboard Navigation ===

      # Navigate to next option
      def navigate_down
        press_arrow_down
      end

      # Navigate to previous option
      def navigate_up
        press_arrow_up
      end

      # Select the currently highlighted option
      def confirm_selection
        press_enter
      end

      # === Waiters ===

      def wait_for_open(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if open?
          raise Capybara::ExpectationNotMet, "Combobox did not open after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      def wait_for_closed(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if closed?
          raise Capybara::ExpectationNotMet, "Combobox did not close after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      private

      def ensure_open
        open unless open?
      end

      def find_option(text)
        command_list.find('[role="option"]', text: text, visible: true)
      end

      def all_items
        command_list.all('[role="option"]', minimum: 0)
      end

      def visible_items
        command_list.all('[role="option"]', visible: true, minimum: 0)
      end
    end
  end
end
