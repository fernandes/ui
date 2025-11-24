# frozen_string_literal: true

module UI
  class P < Phlex::HTML
    def initialize(classes: nil, **attributes)
      @classes = classes
      @attributes = attributes
    end

    def view_template(&block)
      extend UI::Typography::PBehavior
      p(**p_html_attributes.merge(@attributes), &block)
    end
  end
end
