# frozen_string_literal: true

require "test_helper"

# Rendering tests for the Combobox wrapper in all three renderers (ERB, Phlex,
# ViewComponent). The wrapper yields the attributes that turn a Popover into a
# combobox; it used to raise NameError (unqualified `ComboboxBehavior`).
class ComboboxComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: wrapper yields the combobox controller and value" do
      root = Nokogiri::HTML::DocumentFragment.parse(send(:"render_#{renderer}")).at_css("[data-testid='combobox']")

      assert root, "wrapper did not yield its attributes"
      assert_equal "ui--combobox", root["data-controller"]
      assert_equal "next", root["data-ui--combobox-value-value"]
    end
  end

  test "the behavior is namespaced and not shadowed by an empty file" do
    assert_kind_of Module, UI::ComboboxBehavior
    assert UI::ComboboxBehavior.method_defined?(:combobox_html_attributes)
  end

  private

  def render_erb
    ApplicationController.render(inline: <<~ERB, layout: false)
      <%= render "ui/combobox/wrapper", value: "next" do |attrs| %>
        <%= content_tag :div, "", **attrs, "data-testid": "combobox" %>
      <% end %>
    ERB
  end

  def render_phlex
    PhlexCombobox.new.call
  end

  def render_vc
    ApplicationController.render(VcCombobox.new, layout: false)
  end

  class PhlexCombobox < Phlex::HTML
    def view_template
      render UI::ComboboxWrapper.new(value: "next") do |attrs|
        div(**attrs, data_testid: "combobox")
      end
    end
  end

  class VcCombobox < ViewComponent::Base
    def call
      render(UI::ComboboxWrapperComponent.new(value: "next")) do |wrapper|
        content_tag(:div, "", **wrapper.combobox_attrs, "data-testid": "combobox")
      end
    end
  end
end
