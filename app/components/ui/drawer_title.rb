# frozen_string_literal: true

class UI::DrawerTitle < Phlex::HTML
  include UI::DrawerTitleBehavior

  def initialize(classes: nil, **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    h2(**drawer_title_html_attributes) do
      yield if block_given?
    end
  end
end
