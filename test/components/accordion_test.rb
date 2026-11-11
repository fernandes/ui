# frozen_string_literal: true

require "test_helper"

# Rendering tests for Accordion in all three renderers (ERB, Phlex, ViewComponent).
#
# Ids and aria-controls / aria-labelledby are wired by the accordion controller
# on connect. Ruby used to derive them from the item value (colliding across
# accordions, or "accordion-trigger-" when the value was empty) or from
# SecureRandom (trigger and content got different random ids).
class AccordionComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: no generated ids or dangling references" do
      doc = accordion_doc(renderer)

      assert_empty doc.css("[id]").map { |node| node["id"] }
      assert_empty doc.css("[aria-controls], [aria-labelledby]").to_a
    end

    test "#{renderer}: an id passed to the content is kept" do
      doc = accordion_doc(renderer, ids: true)

      assert doc.at_css("div#my-region[role='region']"), "region id dropped"
    end

    test "#{renderer}: a disabled item disables its trigger" do
      item = accordion_doc(renderer).at_css("[data-ui--accordion-target='item'][data-value='b']")

      assert item.key?("data-disabled")
      assert item.at_css("button[data-ui--accordion-target='trigger']").key?("disabled")
    end

    test "#{renderer}: the open item can be closed by default (collapsible)" do
      root = accordion_doc(renderer).at_css("[data-controller='ui--accordion']")

      assert_equal "true", root["data-ui--accordion-collapsible-value"]
    end
  end

  private

  def accordion_doc(renderer, ids: false)
    Nokogiri::HTML::DocumentFragment.parse(send(:"render_#{renderer}", ids: ids))
  end

  def render_erb(ids:)
    content_attrs = ids ? "attributes: { id: 'my-region' }" : "attributes: {}"
    ApplicationController.render(inline: <<~ERB, layout: false)
      <%= render "ui/accordion" do %>
        <%= render "ui/accordion/item", value: "a", initial_open: true do %>
          <%= render "ui/accordion/trigger", content: "First" %>
          <%= render "ui/accordion/content", content: "One", #{content_attrs} %>
        <% end %>
        <%= render "ui/accordion/item", value: "b", disabled: true do %>
          <%= render "ui/accordion/trigger", content: "Second" %>
          <%= render "ui/accordion/content", content: "Two" %>
        <% end %>
      <% end %>
    ERB
  end

  def render_phlex(ids:)
    PhlexAccordion.new(ids: ids).call
  end

  def render_vc(ids:)
    ApplicationController.render(VcAccordion.new(ids: ids), layout: false)
  end

  class PhlexAccordion < Phlex::HTML
    def initialize(ids:)
      @ids = ids
    end

    def view_template
      render UI::Accordion.new do
        render UI::AccordionItem.new(value: "a", initial_open: true) do
          render UI::AccordionTrigger.new(initial_open: true) { "First" }
          render UI::AccordionContent.new(initial_open: true, attributes: (@ids ? {id: "my-region"} : {})) { "One" }
        end
        render UI::AccordionItem.new(value: "b", disabled: true) do
          render UI::AccordionTrigger.new(disabled: true) { "Second" }
          render UI::AccordionContent.new { "Two" }
        end
      end
    end
  end

  class VcAccordion < ViewComponent::Base
    def initialize(ids:)
      @ids = ids
    end

    def call
      render(UI::AccordionComponent.new) do
        safe_join([
          render(UI::AccordionItemComponent.new(value: "a", initial_open: true)) do
            safe_join([
              render(UI::AccordionTriggerComponent.new(initial_open: true)) { "First" },
              render(UI::AccordionContentComponent.new(initial_open: true, attributes: (@ids ? {id: "my-region"} : {}))) { "One" }
            ])
          end,
          render(UI::AccordionItemComponent.new(value: "b", disabled: true)) do
            safe_join([
              render(UI::AccordionTriggerComponent.new(disabled: true)) { "Second" },
              render(UI::AccordionContentComponent.new) { "Two" }
            ])
          end
        ])
      end
    end
  end
end
