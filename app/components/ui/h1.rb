# frozen_string_literal: true

module UI
  class H1 < Phlex::HTML
    def initialize(classes: nil, **attributes)
      @classes = classes
      @attributes = attributes
    end

    def view_template(&block)
      extend UI::Typography::H1Behavior
      h1(**h1_html_attributes.merge(@attributes), &block)
    end
  end
end
