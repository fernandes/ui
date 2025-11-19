# frozen_string_literal: true

require "test_helper"

module UI
  module Accordion
    class AccordionConsistencyTest < ActiveSupport::TestCase
      include Phlex::Testing::Nokogiri

      def setup
        @test_value = "test-item"
        @test_title = "Test Title"
        @test_content = "Test Content"
      end

      # === Main Consistency Tests ===

      test "all implementations generate consistent data attributes for accordion container" do
        vc_attrs = render_view_component_accordion_attrs
        phlex_attrs = render_phlex_accordion_attrs
        erb_attrs = render_erb_accordion_attrs

        # All should have accordion controller
        assert_includes vc_attrs, "data-controller=\"accordion\""
        assert_includes phlex_attrs, "data-controller=\"accordion\""
        assert_includes erb_attrs, "data-controller=\"accordion\""

        # All should have type value
        assert_includes vc_attrs, "data-accordion-type-value=\"single\""
        assert_includes phlex_attrs, "data-accordion-type-value=\"single\""
        assert_includes erb_attrs, "data-accordion-type-value=\"single\""
      end

      test "all implementations generate consistent classes for accordion item" do
        vc_classes = extract_item_classes(render_view_component_item)
        phlex_classes = extract_item_classes(render_phlex_item)
        erb_classes = extract_item_classes(render_erb_item)

        assert_equal vc_classes.sort, phlex_classes.sort,
          "ViewComponent and Phlex should have identical item classes"
        assert_equal vc_classes.sort, erb_classes.sort,
          "ViewComponent and ERB should have identical item classes"

        # All should have border-b class
        assert_includes vc_classes, "border-b"
        assert_includes phlex_classes, "border-b"
        assert_includes erb_classes, "border-b"
      end

      test "all implementations generate consistent classes for trigger button" do
        vc_classes = extract_trigger_classes(render_view_component_trigger)
        phlex_classes = extract_trigger_classes(render_phlex_trigger)
        erb_classes = extract_trigger_classes(render_erb_trigger)

        assert_equal vc_classes.sort, phlex_classes.sort,
          "ViewComponent and Phlex should have identical trigger classes"
        assert_equal vc_classes.sort, erb_classes.sort,
          "ViewComponent and ERB should have identical trigger classes"

        # All should have key classes
        assert_includes vc_classes, "flex"
        assert_includes vc_classes, "items-center"
        assert_includes vc_classes, "justify-between"
      end

      test "all implementations generate consistent classes for content area" do
        vc_classes = extract_content_classes(render_view_component_content)
        phlex_classes = extract_content_classes(render_phlex_content)
        erb_classes = extract_content_classes(render_erb_content)

        assert_equal vc_classes.sort, phlex_classes.sort,
          "ViewComponent and Phlex should have identical content classes"
        assert_equal vc_classes.sort, erb_classes.sort,
          "ViewComponent and ERB should have identical content classes"

        # All should have animation classes
        assert_includes vc_classes, "overflow-hidden"
        assert vc_classes.any? { |c| c.include?("animate-accordion") }
      end

      test "all implementations generate consistent ARIA attributes" do
        vc_trigger = render_view_component_trigger
        phlex_trigger = render_phlex_trigger
        erb_trigger = render_erb_trigger

        # All should have aria-expanded
        assert_includes vc_trigger, "aria-expanded=\"false\""
        assert_includes phlex_trigger, "aria-expanded=\"false\""
        assert_includes erb_trigger, "aria-expanded=\"false\""

        # All should have aria-controls with same pattern
        assert_match(/aria-controls="accordion-content-/, vc_trigger)
        assert_match(/aria-controls="accordion-content-/, phlex_trigger)
        assert_match(/aria-controls="accordion-content-/, erb_trigger)
      end

      test "all implementations respect initial_open state consistently" do
        vc_item = render_view_component_item(initial_open: true)
        phlex_item = render_phlex_item(initial_open: true)
        erb_item = render_erb_item(initial_open: true)

        # All should have data-state="open"
        assert_includes vc_item, 'data-state="open"'
        assert_includes phlex_item, 'data-state="open"'
        assert_includes erb_item, 'data-state="open"'
      end

      test "all implementations handle custom classes consistently" do
        custom_class = "custom-test-class"

        vc_item = render_view_component_item(classes: custom_class)
        phlex_item = render_phlex_item(classes: custom_class)
        erb_item = render_erb_item(classes: custom_class)

        # All should include custom class
        assert_includes vc_item, custom_class
        assert_includes phlex_item, custom_class
        assert_includes erb_item, custom_class
      end

      # === Behavior Concern Tests ===

      test "AccordionBehavior generates correct data attributes" do
        behavior = create_accordion_behavior("multiple", true)
        attrs = behavior.accordion_data_attributes

        assert_equal "accordion", attrs[:controller]
        assert_equal "multiple", attrs[:accordion_type_value]
        assert_equal true, attrs[:accordion_collapsible_value]
      end

      test "AccordionItemBehavior generates correct classes" do
        behavior = create_item_behavior(@test_value, false, "extra-class")
        classes = behavior.item_classes

        assert_includes classes, "border-b"
        assert_includes classes, "extra-class"
      end

      test "AccordionTriggerBehavior generates correct IDs" do
        behavior = create_trigger_behavior(@test_value, false)

        assert_equal "accordion-trigger-#{@test_value}", behavior.trigger_id
        assert_equal "accordion-content-#{@test_value}", behavior.content_id
      end

      test "AccordionContentBehavior applies closed state style" do
        behavior = create_content_behavior(@test_value, false)
        attrs = behavior.content_html_attributes

        assert_equal "height: 0;", attrs[:style]
      end

      test "AccordionContentBehavior does not apply style for open state" do
        behavior = create_content_behavior(@test_value, true)
        attrs = behavior.content_html_attributes

        assert_nil attrs[:style]
      end

      private

      # === ViewComponent Renderers ===

      def render_view_component_accordion_attrs
        html = render_inline(AccordionComponent.new) { "content" }.to_html
        extract_root_element_attrs(html)
      end

      def render_view_component_item(initial_open: false, classes: "")
        render_inline(
          AccordionItemComponent.new(value: @test_value, initial_open: initial_open, classes: classes)
        ) { "content" }.to_html
      end

      def render_view_component_trigger(initial_open: false)
        render_inline(
          AccordionTriggerComponent.new(item_value: @test_value, initial_open: initial_open)
        ) { @test_title }.to_html
      end

      def render_view_component_content(initial_open: false)
        render_inline(
          AccordionContentComponent.new(item_value: @test_value, initial_open: initial_open)
        ) { @test_content }.to_html
      end

      # === Phlex Renderers ===

      def render_phlex_accordion_attrs
        html = render(Accordion.new) { "content" }
        extract_root_element_attrs(html)
      end

      def render_phlex_item(initial_open: false, classes: "")
        render(Item.new(value: @test_value, initial_open: initial_open, classes: classes)) { "content" }
      end

      def render_phlex_trigger(initial_open: false)
        render(Trigger.new(item_value: @test_value, initial_open: initial_open)) { @test_title }
      end

      def render_phlex_content(initial_open: false)
        render(Content.new(item_value: @test_value, initial_open: initial_open)) { @test_content }
      end

      # === ERB Renderers ===

      def render_erb_accordion_attrs
        html = UI::Engine.root.join("app/views/ui/accordion").instance_eval do
          ApplicationController.render(
            partial: "ui/accordion/accordion",
            locals: { content: "content" }
          )
        end
        extract_root_element_attrs(html)
      end

      def render_erb_item(initial_open: false, classes: "")
        ApplicationController.render(
          partial: "ui/accordion/accordion_item",
          locals: { value: @test_value, initial_open: initial_open, classes: classes, content: "content" }
        )
      end

      def render_erb_trigger(initial_open: false)
        # Need to simulate parent context
        controller = ApplicationController.new
        controller.instance_variable_set(:@_accordion_item_value, @test_value)
        controller.instance_variable_set(:@_accordion_item_initial_open, initial_open)

        controller.render_to_string(
          partial: "ui/accordion/accordion_trigger",
          locals: { content: @test_title }
        )
      end

      def render_erb_content(initial_open: false)
        # Need to simulate parent context
        controller = ApplicationController.new
        controller.instance_variable_set(:@_accordion_item_value, @test_value)
        controller.instance_variable_set(:@_accordion_item_initial_open, initial_open)

        controller.render_to_string(
          partial: "ui/accordion/accordion_content",
          locals: { content: @test_content }
        )
      end

      # === Helper Methods ===

      def extract_root_element_attrs(html)
        # Extract attributes from root element
        html[/<div[^>]*>/]
      end

      def extract_item_classes(html)
        extract_classes(html)
      end

      def extract_trigger_classes(html)
        extract_classes(html)
      end

      def extract_content_classes(html)
        extract_classes(html)
      end

      def extract_classes(html)
        match = html.match(/class="([^"]*)"/)
        return [] unless match

        match[1].split(/\s+/).reject(&:empty?)
      end

      # === Behavior Helper Methods ===

      def create_accordion_behavior(type, collapsible)
        Class.new do
          include UI::Accordion::AccordionBehavior
          def initialize(type, collapsible)
            @type = type
            @collapsible = collapsible
            @attributes = {}
          end
        end.new(type, collapsible)
      end

      def create_item_behavior(value, initial_open, classes = "")
        Class.new do
          include UI::Accordion::AccordionItemBehavior
          def initialize(value, initial_open, classes)
            @value = value
            @initial_open = initial_open
            @classes = classes
            @attributes = {}
          end
        end.new(value, initial_open, classes)
      end

      def create_trigger_behavior(item_value, initial_open)
        Class.new do
          include UI::Accordion::AccordionTriggerBehavior
          def initialize(item_value, initial_open)
            @item_value = item_value
            @initial_open = initial_open
            @classes = ""
            @attributes = {}
          end
        end.new(item_value, initial_open)
      end

      def create_content_behavior(item_value, initial_open)
        Class.new do
          include UI::Accordion::AccordionContentBehavior
          def initialize(item_value, initial_open)
            @item_value = item_value
            @initial_open = initial_open
            @classes = ""
            @attributes = {}
          end
        end.new(item_value, initial_open)
      end
    end
  end
end
