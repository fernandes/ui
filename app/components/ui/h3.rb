# frozen_string_literal: true

module UI
  class H3 < Phlex::HTML
    def initialize(classes: nil, **attributes)
      @classes = classes
      @attributes = attributes
    end

    def view_template(&block)
      extend UI::Typography::H3Behavior
      h3(**h3_html_attributes.merge(@attributes), &block)
    end
  end
end
