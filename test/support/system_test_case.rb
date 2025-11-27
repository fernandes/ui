# frozen_string_literal: true

require "test_helper"
require "capybara-playwright-driver"

module UI
  # Base class for all UI Engine system tests.
  # Provides Playwright integration and COM (Component Object Model) helpers.
  #
  # @example Basic usage
  #   class SelectTest < UI::SystemTestCase
  #     test "selects an option" do
  #       visit_component("select")
  #       select = find_element(SelectElement)
  #       select.select("Apple")
  #       assert_equal "Apple", select.selected
  #     end
  #   end
  #
  class SystemTestCase < ActionDispatch::SystemTestCase
    parallelize(workers: :number_of_processors)

    # Register Playwright driver
    Capybara.register_driver(:playwright) do |app|
      Capybara::Playwright::Driver.new(app,
        browser_type: :chromium,
        headless: ENV["HEADLESS"] != "false",
        timeout: 30,
        args: [
          "--disable-dev-shm-usage",
          "--no-sandbox"
        ]
      )
    end

    driven_by :playwright

    # Global Capybara configuration
    Capybara.default_max_wait_time = 5
    Capybara.save_path = Rails.root.join("tmp/capybara")
    Capybara.automatic_reload = true

    # Include helpers
    include UI::AccessibilityHelper if defined?(UI::AccessibilityHelper)
    include UI::KeyboardHelper if defined?(UI::KeyboardHelper)

    # === Navigation Helpers ===

    # Visit the components index page
    def visit_components
      visit "/components"
    end

    # Visit a specific component's showcase page
    #
    # @param name [String, Symbol] The component name (e.g., "select", :accordion)
    def visit_component(name)
      visit "/components/#{name}"
    end

    # === Element Helpers ===

    # Find and wrap a DOM element with an Element class
    #
    # @param klass [Class] The Element class to instantiate
    # @param selector [String, nil] CSS selector (uses klass::DEFAULT_SELECTOR if nil)
    # @param options [Hash] Additional options passed to Capybara's find
    # @return [BaseElement] An instance of the Element class
    #
    # @example With explicit selector
    #   select = find_element(SelectElement, "#fruits-select")
    #
    # @example With default selector
    #   select = find_element(SelectElement) # Uses SelectElement::DEFAULT_SELECTOR
    #
    def find_element(klass, selector = nil, **options)
      selector ||= default_selector_for(klass)
      klass.new(find(selector, **options))
    end

    # Find all matching elements and wrap with an Element class
    #
    # @param klass [Class] The Element class to instantiate
    # @param selector [String, nil] CSS selector
    # @param options [Hash] Additional options passed to Capybara's all
    # @return [Array<BaseElement>] Array of Element instances
    #
    def all_elements(klass, selector = nil, **options)
      selector ||= default_selector_for(klass)
      all(selector, **options).map { |node| klass.new(node) }
    end

    # Find first matching element and wrap with an Element class
    #
    # @param klass [Class] The Element class to instantiate
    # @param selector [String, nil] CSS selector
    # @param options [Hash] Additional options passed to Capybara's first
    # @return [BaseElement, nil] An Element instance or nil
    #
    def first_element(klass, selector = nil, **options)
      selector ||= default_selector_for(klass)
      node = first(selector, **options)
      node ? klass.new(node) : nil
    end

    # === Assertion Helpers ===

    # Assert that an element is visible on the page
    def assert_element_visible(element, message = nil)
      assert element.visible?, message || "Expected element to be visible"
    end

    # Assert that an element is hidden
    def assert_element_hidden(element, message = nil)
      refute element.visible?, message || "Expected element to be hidden"
    end

    # Assert element has specific data-state
    def assert_element_state(element, expected_state, message = nil)
      assert_equal expected_state, element.data_state,
        message || "Expected data-state='#{expected_state}', got '#{element.data_state}'"
    end

    # Assert element is open (data-state="open")
    def assert_element_open(element, message = nil)
      assert element.open?, message || "Expected element to be open"
    end

    # Assert element is closed (data-state="closed")
    def assert_element_closed(element, message = nil)
      assert element.closed?, message || "Expected element to be closed"
    end

    # === Screenshot Helpers ===

    # Take a screenshot with a descriptive name
    #
    # @param name [String] Name for the screenshot file
    # @return [String] Path to the screenshot
    #
    def save_debug_screenshot(name)
      path = Rails.root.join("tmp/capybara/#{name}-#{Time.now.to_i}.png")
      page.save_screenshot(path)
      path
    end

    private

    def default_selector_for(klass)
      if klass.const_defined?(:DEFAULT_SELECTOR)
        klass::DEFAULT_SELECTOR
      else
        raise ArgumentError, "No selector provided and #{klass} doesn't define DEFAULT_SELECTOR"
      end
    end
  end
end
