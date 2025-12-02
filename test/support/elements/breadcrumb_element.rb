# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the Breadcrumb component.
    #
    # @example Basic usage
    #   breadcrumb = BreadcrumbElement.new(find('nav[aria-label="breadcrumb"]'))
    #   assert breadcrumb.has_link?("Home")
    #   breadcrumb.click_link("Components")
    #
    # @example With dropdown
    #   breadcrumb = BreadcrumbElement.new(find('#dropdown-breadcrumb nav'))
    #   breadcrumb.open_dropdown
    #   assert breadcrumb.dropdown_open?
    #
    class BreadcrumbElement < BaseElement
      DEFAULT_SELECTOR = 'nav[aria-label="breadcrumb"]'

      # === Navigation ===

      # Get all breadcrumb links
      #
      # @return [Array<Capybara::Node::Element>]
      #
      def links
        all_within("a")
      end

      # Get link texts
      #
      # @return [Array<String>]
      #
      def link_texts
        links.map { |link| link.text.strip }
      end

      # Check if breadcrumb has a link with text
      #
      # @param text [String] The link text
      # @return [Boolean]
      #
      def has_link?(text)
        node.has_link?(text)
      end

      # Click a breadcrumb link
      #
      # @param text [String] The link text
      #
      def click_link(text)
        node.click_link(text)
      end

      # Get the current page element (last item, usually not a link)
      #
      # @return [Capybara::Node::Element, nil]
      #
      def current_page
        # The current page is typically a span with aria-current="page" or just text without link
        find_within('[aria-current="page"]')
      rescue Capybara::ElementNotFound
        # Fallback: find the last item that's not a link
        items = all_within("li")
        items.last
      end

      # === Dropdown Support ===

      # Check if breadcrumb has a dropdown trigger
      #
      # @return [Boolean]
      #
      def has_dropdown?
        node.has_css?('[data-ui--dropdown-target="trigger"]')
      end

      # Get the dropdown trigger element
      #
      # @return [Capybara::Node::Element]
      #
      def dropdown_trigger
        find_within('[data-ui--dropdown-target="trigger"]')
      end

      # Check if dropdown is open
      #
      # @return [Boolean]
      #
      def dropdown_open?
        return false unless has_dropdown?

        dropdown_container = find_within('[data-controller="ui--dropdown"]')
        dropdown_container["data-ui--dropdown-open-value"] == "true"
      end

      # Check if dropdown is closed
      #
      # @return [Boolean]
      #
      def dropdown_closed?
        !dropdown_open?
      end

      # Open the dropdown by clicking
      #
      def open_dropdown
        return if dropdown_open?

        dropdown_trigger.click
        wait_for_dropdown_open
      end

      # Close the dropdown
      #
      def close_dropdown
        return if dropdown_closed?

        press_escape_on_dropdown
        wait_for_dropdown_closed
      end

      # Get dropdown menu items
      #
      # @return [Array<String>] Array of item texts
      #
      def dropdown_items
        return [] unless dropdown_open?

        content = find_within('[data-ui--dropdown-target="content"]')
        content.all('[role="menuitem"]').map { |item| item.text.strip }
      end

      # Select a dropdown item
      #
      # @param text [String] The item text
      #
      def select_dropdown_item(text)
        open_dropdown
        content = find_within('[data-ui--dropdown-target="content"]')
        content.find('[role="menuitem"]', text: text).click
      end

      # === Keyboard Navigation ===

      # Focus the dropdown trigger
      #
      def focus_dropdown_trigger
        # Use JavaScript to focus the element (works with Playwright)
        trigger = dropdown_trigger
        page.execute_script("arguments[0].focus()", trigger)
        sleep 0.05
      end

      # Open dropdown with Enter key
      #
      def open_dropdown_with_keyboard
        focus_dropdown_trigger
        sleep 0.1 # Give focus time to settle
        press_key_via_keyboard("Enter")
        wait_for_dropdown_open
      end

      # Open dropdown with Space key
      #
      def open_dropdown_with_space
        focus_dropdown_trigger
        press_key_via_keyboard("Space")
        wait_for_dropdown_open
      end

      # Close dropdown with Escape and verify focus returns to trigger
      #
      def close_dropdown_with_escape
        press_key_via_keyboard("Escape")
        wait_for_dropdown_closed
      end

      # Navigate to next item in dropdown
      #
      def dropdown_arrow_down
        press_key_via_keyboard("ArrowDown")
      end

      # Navigate to previous item in dropdown
      #
      def dropdown_arrow_up
        press_key_via_keyboard("ArrowUp")
      end

      # Select current item in dropdown
      #
      def dropdown_press_enter
        press_key_via_keyboard("Enter")
      end

      # Press Escape on dropdown
      #
      def press_escape_on_dropdown
        press_key_via_keyboard("Escape")
      end

      # Send key using Playwright's keyboard API
      #
      def press_key_via_keyboard(key)
        page.driver.with_playwright_page do |pw_page|
          pw_page.keyboard.press(key)
        end
      end

      # Get the currently focused element ID
      #
      # @return [String, nil]
      #
      def focused_element_id
        page.evaluate_script("document.activeElement?.id")
      end

      # Get the currently focused element
      #
      # @return [Hash] Info about focused element
      #
      def focused_element_info
        page.evaluate_script(<<~JS)
          (function() {
            const el = document.activeElement;
            return {
              tagName: el?.tagName,
              role: el?.getAttribute('role'),
              text: el?.textContent?.trim().substring(0, 50),
              isDropdownTrigger: el?.hasAttribute('data-ui--dropdown-target')
            };
          })()
        JS
      end

      # Check if dropdown trigger has focus
      #
      # @return [Boolean]
      #
      def dropdown_trigger_focused?
        info = focused_element_info
        info && info["isDropdownTrigger"] == true
      end

      # === ARIA Queries ===

      # Get ARIA attributes for dropdown trigger
      #
      # @return [Hash]
      #
      def dropdown_trigger_aria
        trigger = dropdown_trigger
        {
          role: trigger["role"],
          haspopup: trigger["aria-haspopup"],
          tabindex: trigger["tabindex"]
        }
      end

      # Check if link has proper focus styles (ring)
      #
      # @param link_element [Capybara::Node::Element]
      # @return [Boolean]
      #
      def link_has_focus_classes?(link_element)
        classes = link_element[:class] || ""
        classes.include?("focus-visible:ring")
      end

      # === Waiters ===

      def wait_for_dropdown_open(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if dropdown_open?
          raise Capybara::ExpectationNotMet, "Dropdown did not open after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      def wait_for_dropdown_closed(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if dropdown_closed?
          raise Capybara::ExpectationNotMet, "Dropdown did not close after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end
    end
  end
end
