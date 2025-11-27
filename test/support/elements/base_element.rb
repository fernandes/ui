# frozen_string_literal: true

module UI
  module Testing
    # Base class for all Component Object Model (COM) elements.
    # Provides common functionality for interacting with UI components.
    #
    # @example Creating a custom element
    #   class ButtonElement < BaseElement
    #     def click
    #       node.click
    #     end
    #
    #     def disabled?
    #       node.disabled? || node["aria-disabled"] == "true"
    #     end
    #   end
    #
    # @example Using an element in a test
    #   button = ButtonElement.new(find('[data-controller="ui--button"]'))
    #   button.click
    #   assert button.disabled?
    #
    class BaseElement
      attr_reader :node

      # @param node [Capybara::Node::Element] The Capybara node to wrap
      def initialize(node)
        @node = node
      end

      # === Delegations to Capybara Node ===

      def text
        node.text
      end

      def visible?
        node.visible?
      end

      def click(**options)
        node.click(**options)
      end

      def [](attribute)
        node[attribute]
      end

      def tag_name
        node.tag_name
      end

      # === Common Queries ===

      def has_text?(content, **options)
        node.has_text?(content, **options)
      end

      def has_no_text?(content, **options)
        node.has_no_text?(content, **options)
      end

      def has_css?(selector, **options)
        node.has_css?(selector, **options)
      end

      def has_no_css?(selector, **options)
        node.has_no_css?(selector, **options)
      end

      def has_class?(class_name)
        classes = node[:class]&.split(/\s+/) || []
        classes.include?(class_name)
      end

      # Returns the data-state attribute value
      def data_state
        node["data-state"]
      end

      # === ARIA Attribute Helpers ===

      def aria(attribute)
        node["aria-#{attribute}"]
      end

      def aria_expanded?
        aria("expanded") == "true"
      end

      def aria_selected?
        aria("selected") == "true"
      end

      def aria_checked?
        value = aria("checked")
        value == "true" || value == "mixed"
      end

      def aria_disabled?
        aria("disabled") == "true"
      end

      def aria_hidden?
        aria("hidden") == "true"
      end

      def aria_pressed?
        aria("pressed") == "true"
      end

      def role
        node["role"]
      end

      # Generic disabled check (native + ARIA)
      def disabled?
        node.disabled? || aria_disabled?
      end

      # === State Helpers ===

      def open?
        data_state == "open"
      end

      def closed?
        data_state == "closed"
      end

      def active?
        data_state == "active"
      end

      def checked?
        data_state == "checked" || aria_checked?
      end

      # === Waiters ===

      def wait_for_visible(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if node.visible?
          raise Capybara::ElementNotFound, "Element not visible after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      def wait_for_hidden(timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true unless node.visible?
          raise Capybara::ExpectationNotMet, "Element still visible after #{timeout}s" if Time.now - start_time > timeout

          sleep 0.05
        end
      end

      def wait_for_state(expected_state, timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if data_state == expected_state
          if Time.now - start_time > timeout
            raise Capybara::ExpectationNotMet,
                  "Expected state '#{expected_state}', got '#{data_state}' after #{timeout}s"
          end

          sleep 0.05
        end
      end

      def wait_for_aria(attribute, value, timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if aria(attribute) == value.to_s
          if Time.now - start_time > timeout
            raise Capybara::ExpectationNotMet,
                  "Expected aria-#{attribute}='#{value}', got '#{aria(attribute)}' after #{timeout}s"
          end

          sleep 0.05
        end
      end

      # === Keyboard Interaction ===

      def focus
        node.send_keys([]) # Focuses the element
      end

      def send_keys(*keys)
        node.send_keys(*keys)
      end

      def press_enter
        send_keys(:enter)
      end

      def press_escape
        send_keys(:escape)
      end

      def press_space
        send_keys(:space)
      end

      def press_tab(shift: false)
        shift ? send_keys([ :shift, :tab ]) : send_keys(:tab)
      end

      def press_arrow(direction)
        key = case direction.to_sym
        when :up then :up
        when :down then :down
        when :left then :left
        when :right then :right
        else raise ArgumentError, "Invalid direction: #{direction}"
        end
        send_keys(key)
      end

      def press_arrow_down
        press_arrow(:down)
      end

      def press_arrow_up
        press_arrow(:up)
      end

      def press_arrow_left
        press_arrow(:left)
      end

      def press_arrow_right
        press_arrow(:right)
      end

      def press_home
        send_keys(:home)
      end

      def press_end
        send_keys(:end)
      end

      # === Playwright Access (for special cases) ===

      def page
        Capybara.current_session
      end

      def playwright_page
        page.driver.browser
      end

      # Evaluate JavaScript in the context of this element
      def evaluate_script(script)
        page.evaluate_script(script)
      end

      # === Protected Helpers ===

      protected

      def within_node(&block)
        page.within(node, &block)
      end

      def find_within(selector, **options)
        node.find(selector, **options)
      end

      def all_within(selector, **options)
        node.all(selector, **options)
      end

      def first_within(selector, **options)
        node.first(selector, **options)
      end

      # Find element in page (for portals/overlays rendered outside node)
      def find_in_page(selector, **options)
        page.find(selector, **options)
      end

      def all_in_page(selector, **options)
        page.all(selector, **options)
      end
    end
  end
end
