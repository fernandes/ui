# frozen_string_literal: true

module UI
  module Testing
    # Element class for interacting with a Radio Group (a group of radio buttons).
    # Radio Group represents a collection of radio buttons with the same name attribute.
    #
    # @example Basic usage
    #   radio_group = RadioGroupElement.new(find('[role="radiogroup"]'))
    #   radio_group.select_option("pro")
    #   assert_equal "pro", radio_group.selected_value
    #
    # @example Keyboard navigation
    #   radio_group.press_arrow_down
    #   assert radio_group.selected?("free")
    #
    class RadioGroupElement < BaseElement
      DEFAULT_SELECTOR = '[role="radiogroup"]'

      # === Actions ===

      # Select a radio option by value
      #
      # @param value [String] The value of the radio button to select
      #
      def select_option(value)
        option = find_option_by_value(value)
        raise "Radio option with value '#{value}' not found" unless option

        # Click the radio button to select it
        option.click
        wait_for_selected(value)
      end

      # Select a radio option by label text
      #
      # @param label_text [String] The label text of the radio button to select
      #
      def select_by_label(label_text)
        option = find_option_by_label(label_text)
        raise "Radio option with label '#{label_text}' not found" unless option

        option.click
      end

      # === State Queries ===

      # Get the currently selected value
      #
      # @return [String, nil] The value of the selected radio button
      #
      def selected_value
        selected_option&.[]("value")
      end

      # Get the currently selected radio button element
      #
      # @return [Capybara::Node::Element, nil]
      #
      def selected_option
        all_options.find { |opt| opt.checked? }
      end

      # Check if a specific value is selected
      #
      # @param value [String] The value to check
      # @return [Boolean]
      #
      def selected?(value)
        selected_value == value
      end

      # Check if a specific option is disabled
      #
      # @param value [String] The value to check
      # @return [Boolean]
      #
      def disabled?(value)
        option = find_option_by_value(value)
        return false unless option

        option.disabled?
      end

      # Get all radio button elements in the group
      #
      # @return [Array<Capybara::Node::Element>]
      #
      def all_options
        node.all('input[type="radio"]', visible: :all)
      end

      # Get all radio button values
      #
      # @return [Array<String>]
      #
      def options
        all_options.map { |opt| opt["value"] }.compact
      end

      # Get all radio button label texts
      #
      # @return [Array<String>]
      #
      def option_labels
        all_options.map do |opt|
          label_for_option(opt)&.text&.strip
        end.compact
      end

      # Get number of options in the group
      #
      # @return [Integer]
      #
      def option_count
        all_options.count
      end

      # === ARIA Queries ===

      # Check if radio group has correct ARIA role
      #
      # @return [Boolean]
      #
      def has_radiogroup_role?
        role == "radiogroup"
      end

      # Get aria-labelledby value
      #
      # @return [String, nil]
      #
      def aria_labelledby
        aria("labelledby")
      end

      # Get aria-describedby value
      #
      # @return [String, nil]
      #
      def aria_describedby
        aria("describedby")
      end

      # === Keyboard Navigation ===

      # Navigate to next option with arrow key
      def select_next
        press_arrow_down
      end

      # Navigate to previous option with arrow key
      def select_previous
        press_arrow_up
      end

      # === Helper Methods ===

      # Find a radio option by its value attribute
      #
      # @param value [String]
      # @return [Capybara::Node::Element, nil]
      #
      def find_option_by_value(value)
        all_options.find { |opt| opt["value"] == value }
      end

      # Find a radio option by its label text
      #
      # @param label_text [String]
      # @return [Capybara::Node::Element, nil]
      #
      def find_option_by_label(label_text)
        all_options.find do |opt|
          label = label_for_option(opt)
          label&.text&.strip == label_text
        end
      end

      # Get the label element for a radio option
      #
      # @param option [Capybara::Node::Element]
      # @return [Capybara::Node::Element, nil]
      #
      def label_for_option(option)
        option_id = option["id"]
        return nil unless option_id

        page.first("label[for='#{option_id}']")
      end

      # Get the indicator (dot) for a radio option
      #
      # @param value [String]
      # @return [Capybara::Node::Element, nil]
      #
      def indicator_for(value)
        option = find_option_by_value(value)
        return nil unless option

        # The indicator is the SVG sibling
        parent = option.find(:xpath, "..")
        parent.first('svg[data-slot="radio-group-indicator"]', visible: :all)
      end

      # Check if indicator is visible for a specific option
      #
      # @param value [String]
      # @return [Boolean]
      #
      def indicator_visible?(value)
        indicator = indicator_for(value)
        return false unless indicator

        # Check if the radio is checked (indicator should be visible)
        selected?(value) && indicator[:class].include?("peer-checked:opacity-100")
      end

      # === Waiters ===

      # Wait for a specific value to be selected
      #
      # @param value [String]
      # @param timeout [Numeric]
      #
      def wait_for_selected(value, timeout: Capybara.default_max_wait_time)
        start_time = Time.now
        loop do
          return true if selected?(value)
          if Time.now - start_time > timeout
            raise Capybara::ExpectationNotMet,
              "Radio option '#{value}' not selected after #{timeout}s. Current: #{selected_value}"
          end

          sleep 0.05
        end
      end
    end
  end
end
