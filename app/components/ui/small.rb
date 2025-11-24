# frozen_string_literal: true

module UI
  class Small < Phlex::HTML
    def initialize(classes: nil, **attributes)
      @classes = classes
      @attributes = attributes
    end

    def view_template(&block)
      extend UI::Typography::SmallBehavior
      small(**small_html_attributes.merge(@attributes), &block)
    end
  end
end
