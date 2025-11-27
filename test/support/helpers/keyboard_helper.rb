# frozen_string_literal: true

module UI
  # Helper methods for testing keyboard navigation and interactions.
  #
  # @example Usage in tests
  #   class TabsTest < UI::SystemTestCase
  #     test "keyboard navigation between tabs" do
  #       visit_component("tabs")
  #       tabs = find_element(TabsElement)
  #
  #       tabs.focus_first_tab
  #       assert_keyboard_navigation(
  #         key: :right,
  #         expected_sequence: ["Tab 1", "Tab 2", "Tab 3"]
  #       )
  #     end
  #   end
  #
  module KeyboardHelper
    # Common keyboard shortcuts map
    KEYS = {
      enter: :enter,
      space: :space,
      escape: :escape,
      tab: :tab,
      shift_tab: [ :shift, :tab ],
      arrow_up: :up,
      arrow_down: :down,
      arrow_left: :left,
      arrow_right: :right,
      home: :home,
      end: :end,
      page_up: :page_up,
      page_down: :page_down,
      backspace: :backspace,
      delete: :delete
    }.freeze

    # Press a key on the currently focused element
    #
    # @param key [Symbol, String, Array] The key to press (from KEYS or raw)
    #
    def press_key(key)
      actual_key = KEYS[key.to_sym] || key
      page.send_keys(actual_key)
    end

    # Press multiple keys in sequence
    #
    # @param keys [Array<Symbol, String>] Keys to press in order
    # @param delay [Float] Delay between key presses in seconds
    #
    def press_keys(*keys, delay: 0.05)
      keys.each do |key|
        press_key(key)
        sleep delay
      end
    end

    # Press a key with modifier(s)
    #
    # @param key [Symbol, String] The key to press
    # @param modifiers [Array<Symbol>] Modifier keys (:control, :alt, :shift, :meta)
    #
    def press_key_with_modifiers(key, *modifiers)
      combo = modifiers + [ key ]
      page.send_keys(combo)
    end

    # Type text character by character
    #
    # @param text [String] Text to type
    # @param delay [Float] Delay between characters in seconds
    #
    def type_text(text, delay: 0.02)
      text.each_char do |char|
        page.send_keys(char)
        sleep delay
      end
    end

    # Assert that pressing a key moves focus to expected element
    #
    # @param key [Symbol] The key to press
    # @param expected_text [String] Text that should be in the newly focused element
    # @param within_element [BaseElement, nil] Optional container to scope the check
    #
    def assert_key_moves_focus_to(key:, expected_text:, within_element: nil)
      press_key(key)
      sleep 0.05 # Allow focus to move

      focused_text = page.evaluate_script("document.activeElement.textContent")

      assert_includes focused_text, expected_text,
        "Expected focus on element with '#{expected_text}', got '#{focused_text}'"
    end

    # Assert keyboard navigation through a sequence of elements
    #
    # @param key [Symbol] The key to press for navigation
    # @param expected_sequence [Array<String>] Expected text in each focused element
    # @param wrap [Boolean] Whether navigation should wrap around
    #
    def assert_keyboard_navigation(key:, expected_sequence:, wrap: false)
      expected_sequence.each_with_index do |expected_text, index|
        if index > 0
          press_key(key)
          sleep 0.05
        end

        focused_text = page.evaluate_script("document.activeElement.textContent")

        assert_includes focused_text, expected_text,
          "Step #{index + 1}: Expected focus on '#{expected_text}', got '#{focused_text}'"
      end

      # Test wrap-around if enabled
      if wrap
        press_key(key)
        sleep 0.05

        focused_text = page.evaluate_script("document.activeElement.textContent")
        assert_includes focused_text, expected_sequence.first,
          "Wrap: Expected focus back on '#{expected_sequence.first}', got '#{focused_text}'"
      end
    end

    # Assert that Escape key closes/dismisses an element
    #
    # @param element [BaseElement] Element that should be closed
    # @param state_method [Symbol] Method to check state (default: :closed?)
    #
    def assert_escape_closes(element, state_method: :closed?)
      press_key(:escape)
      sleep 0.1

      assert element.send(state_method),
        "Expected Escape to close element"
    end

    # Assert that Enter or Space activates an element
    #
    # @param element [BaseElement] Element to activate
    # @param key [Symbol] Key to use (:enter or :space)
    # @param expected_action [Proc] Block that should return true after activation
    #
    def assert_activation_key(element, key: :enter, &expected_action)
      element.focus
      press_key(key)
      sleep 0.1

      assert yield, "Expected #{key} to activate element"
    end

    # Focus an element and verify it received focus
    #
    # @param element [BaseElement, Capybara::Node::Element] Element to focus
    # @return [Boolean] Whether focus was successful
    #
    def focus_and_verify(element)
      node = element.respond_to?(:node) ? element.node : element
      node.send_keys([]) # Focus

      sleep 0.05

      is_focused = page.evaluate_script(<<~JS)
        document.activeElement === document.evaluate(
          '#{node.path}',
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue
      JS

      is_focused
    end

    # Get information about the currently focused element
    #
    # @return [Hash] Hash with :tag, :text, :id, :class keys
    #
    def focused_element_info
      page.evaluate_script(<<~JS)
        (function() {
          var el = document.activeElement;
          return {
            tag: el.tagName.toLowerCase(),
            text: el.textContent.trim().substring(0, 100),
            id: el.id,
            class: el.className,
            role: el.getAttribute('role'),
            ariaLabel: el.getAttribute('aria-label')
          };
        })()
      JS
    end

    # Assert tab order matches expected sequence
    #
    # @param expected_ids [Array<String>] Expected element IDs in tab order
    #
    def assert_tab_order(*expected_ids)
      expected_ids.each_with_index do |expected_id, index|
        press_key(:tab) if index > 0
        sleep 0.05

        focused_id = page.evaluate_script("document.activeElement.id")

        assert_equal expected_id, focused_id,
          "Tab #{index + 1}: Expected focus on ##{expected_id}, got ##{focused_id}"
      end
    end

    # Assert reverse tab order (Shift+Tab)
    #
    # @param expected_ids [Array<String>] Expected element IDs in reverse tab order
    #
    def assert_reverse_tab_order(*expected_ids)
      expected_ids.each_with_index do |expected_id, index|
        press_key(:shift_tab) if index > 0
        sleep 0.05

        focused_id = page.evaluate_script("document.activeElement.id")

        assert_equal expected_id, focused_id,
          "Shift+Tab #{index + 1}: Expected focus on ##{expected_id}, got ##{focused_id}"
      end
    end

    # Simulate typing in a search/filter field and wait for results
    #
    # @param text [String] Text to type
    # @param wait_for [String, nil] CSS selector to wait for after typing
    # @param debounce [Float] Time to wait for debounce (default: 0.3s)
    #
    def type_and_wait(text, wait_for: nil, debounce: 0.3)
      type_text(text)
      sleep debounce

      if wait_for
        assert page.has_css?(wait_for, wait: 2),
          "Expected to find '#{wait_for}' after typing '#{text}'"
      end
    end

    # Clear input and type new value
    #
    # @param text [String] New text to type
    #
    def clear_and_type(text)
      # Select all and delete
      press_key_with_modifiers("a", :control)
      press_key(:backspace)
      type_text(text)
    end
  end
end
