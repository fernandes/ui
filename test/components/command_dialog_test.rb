# frozen_string_literal: true

require "test_helper"

# Rendering tests for Command Dialog in all three renderers.
#
# Like shadcn, the palette carries a visually hidden title and description;
# they are Dialog title/description targets, so the Dialog controller points
# the content's aria-labelledby/aria-describedby at them.
class CommandDialogComponentTest < ActiveSupport::TestCase
  RENDERERS = %i[erb phlex vc].freeze

  RENDERERS.each do |renderer|
    test "#{renderer}: renders an sr-only title and description by default" do
      content = doc(renderer).at_css("[role='dialog']")

      header = content.at_css(".sr-only")
      assert header, "sr-only header missing"
      assert_equal "Command Palette", header.at_css("h2[data-ui--dialog-target='title']")&.text&.strip
      assert_equal "Search for a command to run...", header.at_css("p[data-ui--dialog-target='description']")&.text&.strip
    end

    test "#{renderer}: title and description can be customised" do
      content = doc(renderer, title: "Jump to", description: "Find a page").at_css("[role='dialog']")

      assert_equal "Jump to", content.at_css("[data-ui--dialog-target='title']").text.strip
      assert_equal "Find a page", content.at_css("[data-ui--dialog-target='description']").text.strip
    end

    test "#{renderer}: wires the shortcut and keeps caller attributes" do
      root = doc(renderer).at_css("[data-controller='ui--command-dialog']")

      assert_equal "palette", root["id"]
      assert_includes root["data-action"], "keydown.meta+j@document->ui--command-dialog#toggle"
      assert root.at_css("[data-controller='ui--dialog'] [data-controller='ui--command'] input[data-ui--command-target='input']")
    end
  end

  private

  def doc(renderer, **options)
    Nokogiri::HTML::DocumentFragment.parse(send(:"render_#{renderer}", **options))
  end

  def render_erb(**options)
    ApplicationController.render(inline: <<~ERB, layout: false, locals: {options: options})
      <%= render "ui/command/dialog", **options, attributes: { id: "palette" } do %>
        <%= render "ui/command/input", placeholder: "Type a command..." %>
      <% end %>
    ERB
  end

  def render_phlex(**options)
    PhlexCd.new(options).call
  end

  def render_vc(**options)
    ApplicationController.render(VcCd.new(options), layout: false)
  end

  class PhlexCd < Phlex::HTML
    def initialize(options)
      @options = options
    end

    def view_template
      render UI::CommandDialog.new(id: "palette", **@options) do
        render UI::CommandInput.new(placeholder: "Type a command...")
      end
    end
  end

  class VcCd < ViewComponent::Base
    def initialize(options)
      @options = options
    end

    def call
      render(UI::CommandDialogComponent.new(id: "palette", **@options)) do
        render(UI::CommandInputComponent.new(placeholder: "Type a command..."))
      end
    end
  end
end
