# frozen_string_literal: true

module UI
  class UI::BlockquoteComponent < ViewComponent::Base
    def initialize(classes: nil, **attributes)
      @classes = classes
      @attributes = attributes
    end

    def call
      extend UI::BlockquoteBehavior

      attrs = blockquote_html_attributes
      content_tag :blockquote, **attrs.merge(@attributes) do
        content
      end
    end
  end
end
