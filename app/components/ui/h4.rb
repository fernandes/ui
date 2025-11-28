# frozen_string_literal: true

module UI
  class H4 < Phlex::HTML
    def initialize(classes: nil, **attributes)
      @classes = classes
      @attributes = attributes
    end

    def view_template(&block)
      extend UI::H4Behavior
      h4(**h4_html_attributes.merge(@attributes), &block)
    end
  end
end
