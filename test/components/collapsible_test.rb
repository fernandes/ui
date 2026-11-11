# frozen_string_literal: true

require "test_helper"

# Rendering tests for Collapsible in all three renderers (ERB, Phlex, ViewComponent).
#
# ERB partials read the root's open / disabled state from context; Phlex and
# ViewComponent children take `open:` explicitly (the controller also syncs
# both on connect). aria-controls and the content id are wired by the
# controller.
class CollapsibleComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: closed by default, trigger says so, content hidden" do
      doc = collapsible_doc(renderer, open: false)

      assert_equal "false", trigger(doc)["aria-expanded"]
      assert content(doc).key?("hidden")
      assert_equal "closed", content(doc)["data-state"]
      assert_empty doc.css("[id]").to_a
    end

    test "#{renderer}: open renders the content open" do
      doc = collapsible_doc(renderer, open: true)

      assert_equal "true", trigger(doc)["aria-expanded"]
      refute content(doc).key?("hidden")
      assert_equal "open", content(doc)["data-state"]
    end

    test "#{renderer}: disabled is on the root" do
      doc = collapsible_doc(renderer, disabled: true)
      root = doc.at_css("[data-controller='ui--collapsible']")

      assert_equal "true", root["data-ui--collapsible-disabled-value"]
      assert root.key?("data-disabled")
    end
  end

  test "erb: disabled renders a disabled trigger" do
    doc = collapsible_doc(:erb, disabled: true)

    assert trigger(doc).key?("disabled")
  end

  private

  def trigger(doc) = doc.at_css("button[data-ui--collapsible-target='trigger']")

  def content(doc) = doc.at_css("[data-ui--collapsible-target='content']")

  def collapsible_doc(renderer, open: false, disabled: false)
    Nokogiri::HTML::DocumentFragment.parse(send(:"render_#{renderer}", open: open, disabled: disabled))
  end

  def render_erb(open:, disabled:)
    ApplicationController.render(inline: <<~ERB, layout: false)
      <%= render "ui/collapsible", open: #{open}, disabled: #{disabled} do %>
        <%= render "ui/collapsible/trigger" do %>Toggle<% end %>
        <%= render "ui/collapsible/content" do %>Body<% end %>
      <% end %>
    ERB
  end

  def render_phlex(open:, disabled:)
    PhlexCollapsible.new(open: open, disabled: disabled).call
  end

  def render_vc(open:, disabled:)
    ApplicationController.render(VcCollapsible.new(open: open, disabled: disabled), layout: false)
  end

  class PhlexCollapsible < Phlex::HTML
    def initialize(open:, disabled:)
      @open = open
      @disabled = disabled
    end

    def view_template
      render UI::Collapsible.new(open: @open, disabled: @disabled) do
        render UI::CollapsibleTrigger.new(open: @open) { "Toggle" }
        render UI::CollapsibleContent.new(open: @open) { "Body" }
      end
    end
  end

  class VcCollapsible < ViewComponent::Base
    def initialize(open:, disabled:)
      @open = open
      @disabled = disabled
    end

    def call
      render(UI::CollapsibleComponent.new(open: @open, disabled: @disabled)) do
        safe_join([
          render(UI::CollapsibleTriggerComponent.new(open: @open)) { "Toggle" },
          render(UI::CollapsibleContentComponent.new(open: @open)) { "Body" }
        ])
      end
    end
  end
end
