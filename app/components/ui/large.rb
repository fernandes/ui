# frozen_string_literal: true

module UI
  class Large < Phlex::HTML
    def initialize(classes: nil, **attributes)
      @classes = classes
      @attributes = attributes
    end

    def view_template(&block)
      extend UI::Typography::LargeBehavior
      div(**large_html_attributes.merge(@attributes), &block)
    end
  end
end
