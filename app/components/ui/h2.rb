# frozen_string_literal: true

module UI
  class H2 < Phlex::HTML
    def initialize(classes: nil, **attributes)
      @classes = classes
      @attributes = attributes
    end

    def view_template(&block)
      extend UI::H2Behavior
      h2(**h2_html_attributes.merge(@attributes), &block)
    end
  end
end
