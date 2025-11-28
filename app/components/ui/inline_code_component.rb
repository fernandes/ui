# frozen_string_literal: true

module UI
  class UI::InlineCodeComponent < ViewComponent::Base
    def initialize(classes: nil, **attributes)
      @classes = classes
      @attributes = attributes
    end

    def call
      extend UI::InlineCodeBehavior
      attrs = inline_code_html_attributes
      content_tag :code, **attrs.merge(@attributes) do
        content
      end
    end
  end
end
