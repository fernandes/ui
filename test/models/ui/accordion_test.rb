require "test_helper"

class IconStubber
  def self.lucide_icon(name, **args)
    "icon".html_safe
  end
end
class UI::AccordionTest < ActiveSupport::TestCase
  include Phlex::Testing::Nokogiri

  test "aria-expanded is false by default" do
    output = render_fragment UI::Accordion.new(id: "ui-acc") do |accordion|
      accordion.item(id: "ui-item") do |item|
        item.title "Is it accessible?"
        item.content do
          "Yes. It adheres to the WAI-ARIA design pattern."
        end
      end
    end
    assert_equal "false", output.at_css("button#ui-item-button")["aria-expanded"]
  end

  test "aria-expanded is true when open" do
    output = render_fragment UI::Accordion.new(id: "ui-acc") do |accordion|
      accordion.item(open: true, id: "ui-item") do |item|
        item.title "Is it accessible?"
        item.content do
          "Yes. It adheres to the WAI-ARIA design pattern."
        end
      end
    end
    assert_equal "true", output.at_css("button#ui-item-button")["aria-expanded"]
  end

  def view_context
    IconStubber
  end
end
