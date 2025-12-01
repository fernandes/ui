# frozen_string_literal: true

class UI::DrawerHeader < Phlex::HTML
  include UI::DrawerHeaderBehavior

  def initialize(classes: nil, **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**drawer_header_html_attributes) do
      yield if block_given?
    end
  end
end
