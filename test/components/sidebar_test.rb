# frozen_string_literal: true

require "test_helper"

# Sidebar is Phlex-only. Its block is rendered once, inside the desktop
# <aside>; on phones the controller moves that same content into the mobile
# sheet, so ids are unique and nested controllers connect once.
class SidebarComponentTest < ActiveSupport::TestCase
  test "the sidebar content is rendered once" do
    doc = sidebar_doc

    assert_equal 1, doc.css("a#home-link").size
    assert doc.at_css("aside [data-ui--sidebar-target='content'] a#home-link"), "content belongs to the aside"
  end

  test "the mobile sheet content sits inside the dialog container, so it stays interactive when open" do
    doc = sidebar_doc
    sheet = doc.at_css("[data-ui--sidebar-target='mobileSheet']")
    content = sheet.at_css("[role='dialog']")

    assert content, "sheet dialog missing"
    assert content.ancestors.any? { |node| node["data-ui--dialog-target"] == "container" },
      "the dialog content must be inside the container the modal session keeps interactive"
    assert_equal "mobileContent", content["data-ui--sidebar-target"]
    assert_equal "Sidebar", content.at_css("[data-ui--dialog-target='title']")&.text
  end

  private

  def sidebar_doc
    Nokogiri::HTML::DocumentFragment.parse(SidebarDemo.new.call)
  end

  class SidebarDemo < Phlex::HTML
    def view_template
      render UI::SidebarProvider.new do
        render UI::Sidebar.new do
          render UI::SidebarContent.new { a(href: "/home", id: "home-link") { "Home" } }
        end
        main { render UI::SidebarTrigger.new }
      end
    end
  end
end
