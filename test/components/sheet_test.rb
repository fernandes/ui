# frozen_string_literal: true

require "test_helper"

# Sheet is driven by the ui--dialog controller, so its parts carry the same
# targets and trigger ARIA as Dialog's (see dialog_test.rb).
class SheetComponentTest < ActiveSupport::TestCase
  %i[erb phlex vc].each do |renderer|
    test "#{renderer}: trigger, title and description are wired for the dialog controller" do
      doc = Nokogiri::HTML::DocumentFragment.parse(send(:"render_#{renderer}"))

      trigger = doc.at_css("[data-ui--dialog-target='trigger']")
      assert trigger, "trigger target missing"
      assert_equal "dialog", trigger["aria-haspopup"]
      assert_equal "false", trigger["aria-expanded"]
      assert_includes trigger["data-action"], "click->ui--dialog#open"

      assert doc.at_css("h2#sheet-title[data-ui--dialog-target='title']"), "title target/id missing"
      assert doc.at_css("p[data-ui--dialog-target='description']"), "description target missing"
    end
  end

  private

  def render_erb
    ApplicationController.render(inline: <<~ERB, layout: false)
      <%= render "ui/sheet" do %>
        <%= render "ui/sheet/trigger" do %>Open<% end %>
        <%= render "ui/sheet/overlay" do %>
          <%= render "ui/sheet/content" do %>
            <%= render "ui/sheet/title", attributes: { id: "sheet-title" } do %>Edit profile<% end %>
            <%= render "ui/sheet/description" do %>Make changes here.<% end %>
          <% end %>
        <% end %>
      <% end %>
    ERB
  end

  def render_phlex
    PhlexSheet.new.call
  end

  def render_vc
    ApplicationController.render(VcSheet.new, layout: false)
  end

  class PhlexSheet < Phlex::HTML
    def view_template
      render UI::Sheet.new do
        render UI::SheetTrigger.new { "Open" }
        render UI::SheetOverlay.new do
          render UI::SheetContent.new do
            render UI::SheetTitle.new(id: "sheet-title") { "Edit profile" }
            render UI::SheetDescription.new { "Make changes here." }
          end
        end
      end
    end
  end

  class VcSheet < ViewComponent::Base
    def call
      render(UI::SheetComponent.new) do
        safe_join([
          render(UI::SheetTriggerComponent.new) { "Open" },
          render(UI::SheetOverlayComponent.new) do
            render(UI::SheetContentComponent.new) do
              safe_join([
                render(UI::SheetTitleComponent.new(id: "sheet-title")) { "Edit profile" },
                render(UI::SheetDescriptionComponent.new) { "Make changes here." }
              ])
            end
          end
        ])
      end
    end
  end
end
