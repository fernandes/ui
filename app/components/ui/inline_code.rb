# frozen_string_literal: true

module UI
  class InlineCode < Phlex::HTML
    def initialize(classes: nil, **attributes)
      @classes = classes
      @attributes = attributes
    end

    def view_template(&block)
      extend UI::Typography::InlineCodeBehavior
      code(**inline_code_html_attributes.merge(@attributes), &block)
    end
  end
end
