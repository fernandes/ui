# frozen_string_literal: true

require "test_helper"

# Rendering tests for Command in all three renderers (ERB, Phlex, ViewComponent).
#
# Item ids, aria-activedescendant, aria-controls and the group's
# aria-labelledby are wired by the Stimulus controller on connect, so the
# markup carries no generated ids, only the parts the controller links.
class CommandComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: disabled item is marked for the controller and AT" do
      item = command_doc(renderer).at_css("[data-value='emoji']")

      assert item.key?("data-disabled"), "data-disabled missing"
      assert_equal "true", item["aria-disabled"]
    end

    test "#{renderer}: hovering an item moves the highlight" do
      item = command_doc(renderer).at_css("[data-value='calendar']")

      assert_includes item["data-action"], "pointermove->ui--command#highlight"
      assert_includes item["data-action"], "click->ui--command#select"
    end

    test "#{renderer}: empty state is a polite live region" do
      empty = command_doc(renderer).at_css("[data-slot='command-empty']")

      assert_equal "status", empty["role"]
      assert_equal "polite", empty["aria-live"]
    end

    test "#{renderer}: group heading is a part the controller links" do
      group = command_doc(renderer).at_css("[role='group']")

      assert_equal "Suggestions", group.at_css("[data-slot='command-group-heading']")&.text&.strip
    end

    test "#{renderer}: no generated ids in the markup" do
      assert_empty command_doc(renderer).css("[id]").map { |node| node["id"] }
    end
  end

  private

  def command_doc(renderer)
    Nokogiri::HTML::DocumentFragment.parse(send(:"render_#{renderer}"))
  end

  def render_erb
    ApplicationController.render(inline: <<~ERB, layout: false)
      <%= render "ui/command" do %>
        <%= render "ui/command/input", placeholder: "Search..." %>
        <%= render "ui/command/list" do %>
          <%= render "ui/command/empty" do %>No results found.<% end %>
          <%= render "ui/command/group", heading: "Suggestions" do %>
            <%= render "ui/command/item", value: "calendar" do %>Calendar<% end %>
            <%= render "ui/command/item", value: "emoji", disabled: true do %>Search Emoji<% end %>
          <% end %>
        <% end %>
      <% end %>
    ERB
  end

  def render_phlex
    PhlexCommand.new.call
  end

  def render_vc
    ApplicationController.render(VcCommand.new, layout: false)
  end

  class PhlexCommand < Phlex::HTML
    def view_template
      render UI::Command.new do
        render UI::CommandInput.new(placeholder: "Search...")
        render UI::CommandList.new do
          render UI::CommandEmpty.new { "No results found." }
          render UI::CommandGroup.new(heading: "Suggestions") do
            render UI::CommandItem.new(value: "calendar") { "Calendar" }
            render UI::CommandItem.new(value: "emoji", disabled: true) { "Search Emoji" }
          end
        end
      end
    end
  end

  class VcCommand < ViewComponent::Base
    def call
      render(UI::CommandComponent.new) do
        safe_join([
          render(UI::CommandInputComponent.new(placeholder: "Search...")),
          render(UI::CommandListComponent.new) do
            safe_join([
              render(UI::CommandEmptyComponent.new) { "No results found." },
              render(UI::CommandGroupComponent.new(heading: "Suggestions")) do
                safe_join([
                  render(UI::CommandItemComponent.new(value: "calendar")) { "Calendar" },
                  render(UI::CommandItemComponent.new(value: "emoji", disabled: true)) { "Search Emoji" }
                ])
              end
            ])
          end
        ])
      end
    end
  end
end
