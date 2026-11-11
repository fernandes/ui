# frozen_string_literal: true

require "test_helper"

# Rendering tests for Select in all three renderers (ERB, Phlex, ViewComponent).
#
# Option ids, aria-controls and the group's aria-labelledby are wired by the
# Stimulus controller on connect; the markup carries the static ARIA, the
# trigger's keyboard action and any id the caller passes.
class SelectComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: an id passed to the trigger is kept, so <label for> works" do
      trigger = select_doc(renderer).at_css("[data-ui--select-target='trigger']")

      assert_equal "fruit", trigger["id"]
    end

    test "#{renderer}: trigger is a collapsed combobox that opens a listbox" do
      trigger = select_doc(renderer).at_css("[data-ui--select-target='trigger']")

      assert_equal "combobox", trigger["role"]
      assert_equal "listbox", trigger["aria-haspopup"]
      assert_equal "false", trigger["aria-expanded"]
    end

    test "#{renderer}: trigger handles its own keys (open with arrows, typeahead)" do
      trigger = select_doc(renderer).at_css("[data-ui--select-target='trigger']")

      assert_includes trigger["data-action"], "click->ui--select#toggle"
      assert_includes trigger["data-action"], "keydown->ui--select#handleTriggerKeydown"
    end

    test "#{renderer}: group and its label are parts the controller links" do
      group = select_doc(renderer).at_css("[role='group'][data-slot='select-group']")

      assert_equal "Fruits", group.at_css("[data-slot='select-label']")&.text&.strip
    end

    test "#{renderer}: disabled option is exposed as disabled" do
      option = select_doc(renderer).at_css("[role='option'][data-value='blueberry']")

      assert_equal "true", option["aria-disabled"]
    end

    test "#{renderer}: no generated ids besides the caller's" do
      assert_equal ["fruit"], select_doc(renderer).css("[id]").map { |node| node["id"] }
    end
  end

  private

  def select_doc(renderer)
    Nokogiri::HTML::DocumentFragment.parse(send(:"render_#{renderer}"))
  end

  def render_erb
    ApplicationController.render(inline: <<~ERB, layout: false)
      <%= render "ui/select", value: "apple" do %>
        <%= render "ui/select/trigger", id: "fruit", placeholder: "Select a fruit" %>
        <%= render "ui/select/content" do %>
          <%= render "ui/select/group" do %>
            <%= render "ui/select/label" do %>Fruits<% end %>
            <%= render "ui/select/item", value: "apple" do %>Apple<% end %>
            <%= render "ui/select/item", value: "blueberry", disabled: true do %>Blueberry<% end %>
          <% end %>
        <% end %>
      <% end %>
    ERB
  end

  def render_phlex
    PhlexSelect.new.call
  end

  def render_vc
    ApplicationController.render(VcSelect.new, layout: false)
  end

  class PhlexSelect < Phlex::HTML
    def view_template
      render UI::Select.new(value: "apple") do
        render UI::SelectTrigger.new(id: "fruit", placeholder: "Select a fruit")
        render UI::SelectContent.new do
          render UI::SelectGroup.new do
            render UI::SelectLabel.new { "Fruits" }
            render UI::SelectItem.new(value: "apple") { "Apple" }
            render UI::SelectItem.new(value: "blueberry", disabled: true) { "Blueberry" }
          end
        end
      end
    end
  end

  class VcSelect < ViewComponent::Base
    def call
      render(UI::SelectComponent.new(value: "apple")) do
        safe_join([
          render(UI::SelectTriggerComponent.new(id: "fruit", placeholder: "Select a fruit")),
          render(UI::SelectContentComponent.new) do
            render(UI::SelectGroupComponent.new) do
              safe_join([
                render(UI::SelectLabelComponent.new) { "Fruits" },
                render(UI::SelectItemComponent.new(value: "apple")) { "Apple" },
                render(UI::SelectItemComponent.new(value: "blueberry", disabled: true)) { "Blueberry" }
              ])
            end
          end
        ])
      end
    end
  end
end
