# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with the Sidebar component.
    #
    # @example Basic usage
    #   sidebar = SidebarElement.new(find('[data-controller="ui--sidebar"]'))
    #   sidebar.collapse
    #   assert sidebar.collapsed?
    #
    # @example Mobile usage
    #   sidebar = SidebarElement.new(find('[data-controller="ui--sidebar"]'))
    #   sidebar.open_mobile
    #   assert sidebar.mobile_open?
    #
    # @example Submenu interaction
    #   sidebar = SidebarElement.new(find('[data-controller="ui--sidebar"]'))
    #   sidebar.expand_submenu("Playground")
    #   assert sidebar.submenu_expanded?("Playground")
    #
    class SidebarElement < BaseElement
      DEFAULT_SELECTOR = '[data-controller="ui--sidebar"]'

      # === Actions ===

      # Toggle the sidebar (desktop or mobile based on viewport)
      def toggle
        trigger.click
        sleep 0.1 # Wait for animation to start
      end

      # Expand the sidebar (desktop)
      def expand
        return if expanded?

        trigger.click
        wait_for_expanded
      end

      # Collapse the sidebar (desktop)
      def collapse
        return if collapsed?

        trigger.click
        wait_for_collapsed
      end

      # Toggle using keyboard shortcut (Cmd/Ctrl + B)
      def toggle_with_keyboard
        page.send_keys([:control, "b"])
        sleep 0.1 # Wait for animation to start
      end

      # === Mobile Actions ===

      # Open the sidebar in mobile mode
      def open_mobile
        return unless is_mobile?

        trigger.click
        sleep 0.1
      end

      # Close the sidebar in mobile mode
      def close_mobile
        return unless is_mobile?
        return unless mobile_open?

        # Click overlay or close button
        if has_overlay?
          overlay.click
        else
          trigger.click
        end
        sleep 0.1
      end

      # === Submenu Actions ===

      # Expand a collapsible submenu by name
      #
      # @param name [String] The submenu name (e.g., "Playground", "Models")
      #
      def expand_submenu(name)
        # Find the collapsible containing a span with this exact text
        collapsibles = desktop_sidebar.all('[data-controller="ui--collapsible"]', visible: :all)
        target_collapsible = collapsibles.find do |c|
          c.has_selector?('span', text: name, exact_text: true, visible: :all)
        end

        return unless target_collapsible

        # Check if already expanded
        return if target_collapsible["data-state"] == "open"

        # Find and click the trigger button within this collapsible
        trigger = target_collapsible.find('[data-ui--collapsible-target="trigger"]', visible: :all)
        trigger.click
        sleep 0.1
      end

      # Collapse a collapsible submenu by name
      #
      # @param name [String] The submenu name
      #
      def collapse_submenu(name)
        # Find the collapsible containing a span with this exact text
        collapsibles = desktop_sidebar.all('[data-controller="ui--collapsible"]', visible: :all)
        target_collapsible = collapsibles.find do |c|
          c.has_selector?('span', text: name, exact_text: true, visible: :all)
        end

        return unless target_collapsible

        # Check if already collapsed
        return if target_collapsible["data-state"] == "closed"

        # Find and click the trigger button within this collapsible
        trigger = target_collapsible.find('[data-ui--collapsible-target="trigger"]', visible: :all)
        trigger.click
        sleep 0.1
      end

      # === State Queries ===

      # Check if sidebar is expanded (desktop)
      #
      # @return [Boolean]
      #
      def expanded?
        data_state == "expanded"
      end

      # Check if sidebar is collapsed (desktop)
      #
      # @return [Boolean]
      #
      def collapsed?
        data_state == "collapsed"
      end

      # Check if sidebar is open in mobile mode
      #
      # @return [Boolean]
      #
      def mobile_open?
        return false unless is_mobile?

        # Check if mobile sheet/drawer is visible
        if has_mobile_sheet?
          mobile_sheet["data-state"] == "open"
        elsif has_mobile_drawer?
          mobile_drawer["data-state"] == "open"
        else
          false
        end
      end

      # Check if sidebar is closed in mobile mode
      #
      # @return [Boolean]
      #
      def mobile_closed?
        !mobile_open?
      end

      # Check if we're in mobile viewport
      #
      # @return [Boolean]
      #
      def is_mobile?
        page.evaluate_script("window.innerWidth < 768")
      end

      # Check if a submenu is expanded
      #
      # @param name [String] The submenu name
      # @return [Boolean]
      #
      def submenu_expanded?(name)
        # Find the collapsible containing a span with this exact text
        collapsibles = desktop_sidebar.all('[data-controller="ui--collapsible"]', visible: :all)
        target_collapsible = collapsibles.find do |c|
          c.has_selector?('span', text: name, exact_text: true, visible: :all)
        end

        return false unless target_collapsible

        target_collapsible["data-state"] == "open"
      end

      # Check if a submenu is collapsed
      #
      # @param name [String] The submenu name
      # @return [Boolean]
      #
      def submenu_collapsed?(name)
        !submenu_expanded?(name)
      end

      # === Content Queries ===

      # Check if sidebar has a menu item with specific text
      #
      # @param text [String] The text to search for
      # @return [Boolean]
      #
      def has_menu_item?(text)
        menu.has_text?(text)
      end

      # Get all menu items (non-submenu items)
      #
      # @return [Array<String>] Array of menu item texts
      #
      def menu_items
        desktop_sidebar.all('[data-slot="sidebar-menu-button"]', visible: :visible).map(&:text)
      end

      # Get the active menu item (if any)
      #
      # @return [String, nil] Text of active menu item
      #
      def active_menu_item
        active = desktop_sidebar.first('[data-slot="sidebar-menu-button"][data-active="true"]', visible: :visible)
        active&.text
      end

      # === Sub-elements ===

      # Get the trigger button
      #
      # @return [Capybara::Node::Element]
      #
      def trigger
        find_in_page("[data-ui--sidebar-target='trigger']", match: :first)
      end

      # Get the desktop sidebar element (to avoid matching mobile sheet)
      #
      # @return [Capybara::Node::Element]
      #
      def desktop_sidebar
        # The desktop sidebar is the <aside> element with data-slot="sidebar"
        # The mobile one is inside a Sheet (dialog)
        find_in_page("aside[data-slot='sidebar']")
      end

      # Get the sidebar content element (desktop only)
      #
      # @return [Capybara::Node::Element]
      #
      def content
        desktop_sidebar.find("[data-slot='sidebar-content']", visible: :all)
      end

      # Get the sidebar rail element
      #
      # @return [Capybara::Node::Element, nil]
      #
      def rail
        desktop_sidebar.first("[data-slot='sidebar-rail']", visible: :all)
      end

      # Get the sidebar menu element (first visible menu)
      #
      # @return [Capybara::Node::Element]
      #
      def menu
        desktop_sidebar.find("[data-slot='sidebar-menu']", match: :first)
      end

      # Get the sidebar header element
      #
      # @return [Capybara::Node::Element, nil]
      #
      def header
        desktop_sidebar.first("[data-slot='sidebar-header']", visible: :all)
      end

      # Get the sidebar footer element
      #
      # @return [Capybara::Node::Element, nil]
      #
      def footer
        desktop_sidebar.first("[data-slot='sidebar-footer']", visible: :all)
      end

      # Get the mobile sheet/drawer element
      #
      # @return [Capybara::Node::Element, nil]
      #
      def mobile_sheet
        find_in_page("[data-ui--sidebar-target='mobileSheet']", visible: :all)
      rescue Capybara::ElementNotFound
        nil
      end

      # Get the mobile drawer element (fallback)
      #
      # @return [Capybara::Node::Element, nil]
      #
      def mobile_drawer
        find_in_page("[data-ui--sidebar-target='mobileDrawer']", visible: :all)
      rescue Capybara::ElementNotFound
        nil
      end

      # Get the overlay element (for mobile)
      #
      # @return [Capybara::Node::Element, nil]
      #
      def overlay
        find_in_page("[data-slot='overlay']", visible: :visible)
      rescue Capybara::ElementNotFound
        nil
      end

      # === ARIA Queries ===

      # Get ARIA attributes for the trigger
      #
      # @return [Hash] Hash of ARIA attribute values
      #
      def trigger_aria_attributes
        trigger_element = trigger
        {
          expanded: trigger_element["aria-expanded"],
          controls: trigger_element["aria-controls"],
          label: trigger_element["aria-label"]
        }
      end

      # Get ARIA attributes for the sidebar element
      #
      # @return [Hash] Hash of ARIA attribute values
      #
      def sidebar_aria_attributes
        {
          label: node["aria-label"],
          orientation: node["aria-orientation"]
        }
      end

      # === Waiters ===

      def wait_for_expanded(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if expanded?
          raise Capybara::ExpectationNotMet, "Sidebar did not expand after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      def wait_for_collapsed(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if collapsed?
          raise Capybara::ExpectationNotMet, "Sidebar did not collapse after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      private

      # Find a submenu trigger by name
      #
      # @param name [String] The submenu name
      # @return [Capybara::Node::Element, nil]
      #
      def find_submenu_trigger(name)
        desktop_sidebar.all('[data-slot="sidebar-menu-button"]', visible: :all).find { |btn| btn.text.include?(name) }
      end

      # Check if mobile sheet target exists
      def has_mobile_sheet?
        !mobile_sheet.nil?
      end

      # Check if mobile drawer target exists
      def has_mobile_drawer?
        !mobile_drawer.nil?
      end

      # Check if overlay exists
      def has_overlay?
        !overlay.nil?
      end
    end
  end
end
