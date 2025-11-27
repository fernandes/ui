# frozen_string_literal: true

module UI
  # Helper methods for testing accessibility (ARIA) attributes and behaviors.
  #
  # @example Usage in tests
  #   class DialogTest < UI::SystemTestCase
  #     test "dialog has correct ARIA attributes" do
  #       dialog = find_element(DialogElement)
  #       dialog.open
  #
  #       assert_aria_attributes(dialog.content,
  #         role: "dialog",
  #         modal: true,
  #         labelledby: "dialog-title"
  #       )
  #     end
  #   end
  #
  module AccessibilityHelper
    # Assert multiple ARIA attributes at once
    #
    # @param element [BaseElement, Capybara::Node::Element] The element to check
    # @param expected [Hash] Hash of attribute => expected_value
    #
    # @example
    #   assert_aria_attributes(button, expanded: true, haspopup: "listbox")
    #
    def assert_aria_attributes(element, **expected)
      node = element.respond_to?(:node) ? element.node : element

      expected.each do |attr, value|
        actual = node["aria-#{attr}"]
        expected_str = value.to_s

        assert_equal expected_str, actual,
          "Expected aria-#{attr}='#{expected_str}', got '#{actual}'"
      end
    end

    # Assert an element does NOT have certain ARIA attributes
    #
    # @param element [BaseElement, Capybara::Node::Element] The element to check
    # @param attributes [Array<Symbol, String>] Attributes that should be absent
    #
    def refute_aria_attributes(element, *attributes)
      node = element.respond_to?(:node) ? element.node : element

      attributes.each do |attr|
        actual = node["aria-#{attr}"]
        assert_nil actual, "Expected aria-#{attr} to be absent, got '#{actual}'"
      end
    end

    # Assert element has specific role
    #
    # @param element [BaseElement, Capybara::Node::Element] The element to check
    # @param expected_role [String, Symbol] The expected role value
    #
    def assert_role(element, expected_role)
      node = element.respond_to?(:node) ? element.node : element
      actual_role = node["role"]

      assert_equal expected_role.to_s, actual_role,
        "Expected role='#{expected_role}', got '#{actual_role}'"
    end

    # Assert element is focusable (either natively or via tabindex)
    #
    # @param element [BaseElement, Capybara::Node::Element] The element to check
    #
    def assert_focusable(element)
      node = element.respond_to?(:node) ? element.node : element
      tag_name = node.tag_name.downcase
      tab_index = node["tabindex"]

      natively_focusable = %w[a button input select textarea].include?(tag_name)
      tabindex_focusable = tab_index && tab_index.to_i >= 0

      assert natively_focusable || tabindex_focusable,
        "Expected element <#{tag_name}> to be focusable (tabindex=#{tab_index.inspect})"
    end

    # Assert element is NOT focusable
    #
    # @param element [BaseElement, Capybara::Node::Element] The element to check
    #
    def refute_focusable(element)
      node = element.respond_to?(:node) ? element.node : element
      tab_index = node["tabindex"]

      refute tab_index && tab_index.to_i >= 0,
        "Expected element to not be focusable (tabindex=#{tab_index})"
    end

    # Assert that aria-controls points to an existing element
    #
    # @param element [BaseElement, Capybara::Node::Element] The element with aria-controls
    #
    def assert_aria_controls_exists(element)
      node = element.respond_to?(:node) ? element.node : element
      controls_id = node["aria-controls"]

      return if controls_id.nil?

      assert page.has_css?("##{controls_id}", visible: :all),
        "aria-controls='#{controls_id}' references non-existent element"
    end

    # Assert that aria-labelledby points to an existing element
    #
    # @param element [BaseElement, Capybara::Node::Element] The element with aria-labelledby
    #
    def assert_aria_labelledby_exists(element)
      node = element.respond_to?(:node) ? element.node : element
      labelledby_id = node["aria-labelledby"]

      return if labelledby_id.nil?

      assert page.has_css?("##{labelledby_id}", visible: :all),
        "aria-labelledby='#{labelledby_id}' references non-existent element"
    end

    # Assert that aria-describedby points to an existing element
    #
    # @param element [BaseElement, Capybara::Node::Element] The element with aria-describedby
    #
    def assert_aria_describedby_exists(element)
      node = element.respond_to?(:node) ? element.node : element
      describedby_id = node["aria-describedby"]

      return if describedby_id.nil?

      assert page.has_css?("##{describedby_id}", visible: :all),
        "aria-describedby='#{describedby_id}' references non-existent element"
    end

    # Assert focus is trapped within a container (for modals)
    #
    # @param container [BaseElement, Capybara::Node::Element] The container element
    # @param tab_count [Integer] Number of Tab presses to test (default: 10)
    #
    def assert_focus_trapped(container, tab_count: 10)
      node = container.respond_to?(:node) ? container.node : container

      tab_count.times do |i|
        page.send_keys(:tab)
        sleep 0.05 # Allow focus to move

        focused_in_container = page.evaluate_script(<<~JS)
          (function() {
            var container = document.evaluate(
              '#{node.path}',
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            ).singleNodeValue;
            return container && container.contains(document.activeElement);
          })()
        JS

        assert focused_in_container,
          "Focus escaped container after #{i + 1} Tab presses"
      end
    end

    # Assert focus returns to a specific element
    #
    # @param element [BaseElement, Capybara::Node::Element] The element that should have focus
    #
    def assert_focus_on(element)
      node = element.respond_to?(:node) ? element.node : element

      is_focused = page.evaluate_script(<<~JS)
        (function() {
          var target = document.evaluate(
            '#{node.path}',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;
          return target === document.activeElement;
        })()
      JS

      assert is_focused, "Expected element to have focus"
    end

    # Assert element has accessible name (via aria-label, aria-labelledby, or content)
    #
    # @param element [BaseElement, Capybara::Node::Element] The element to check
    # @param expected_name [String, nil] Optional expected name (if nil, just checks existence)
    #
    def assert_accessible_name(element, expected_name = nil)
      node = element.respond_to?(:node) ? element.node : element

      aria_label = node["aria-label"]
      aria_labelledby = node["aria-labelledby"]
      text_content = node.text.strip

      has_name = aria_label.present? ||
                 aria_labelledby.present? ||
                 text_content.present?

      assert has_name, "Element should have an accessible name"

      if expected_name
        actual_name = aria_label || text_content
        if aria_labelledby
          label_element = page.find("##{aria_labelledby}", visible: :all)
          actual_name = label_element.text
        end

        assert_equal expected_name, actual_name,
          "Expected accessible name '#{expected_name}', got '#{actual_name}'"
      end
    end

    # Get the currently focused element
    #
    # @return [Capybara::Node::Element, nil] The focused element
    #
    def focused_element
      page.evaluate_script("document.activeElement.outerHTML")
    end

    # Assert element is properly hidden from assistive technology
    #
    # @param element [BaseElement, Capybara::Node::Element] The element to check
    #
    def assert_hidden_from_at(element)
      node = element.respond_to?(:node) ? element.node : element

      aria_hidden = node["aria-hidden"] == "true"
      inert = node["inert"].present?
      hidden = node["hidden"].present?

      assert aria_hidden || inert || hidden,
        "Element should be hidden from assistive technology (aria-hidden, inert, or hidden)"
    end
  end
end
