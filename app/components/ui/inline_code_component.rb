# frozen_string_literal: true

module UI
  class InlineCodeComponent < ViewComponent::Base
    def initialize(classes: nil, **attributes)
      @classes = classes
      @attributes = attributes
    end

    def call
      extend UI::Typography::InlineCodeBehavior
      attrs = inline_code_html_attributes
      content_tag :code, **attrs.merge(@attributes) do
        content
      end
    end
  end
end
