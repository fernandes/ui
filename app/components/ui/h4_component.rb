# frozen_string_literal: true

module UI
  class H4Component < ViewComponent::Base
    def initialize(classes: nil, **attributes)
      @classes = classes
      @attributes = attributes
    end

    def call
      extend UI::Typography::H4Behavior
      attrs = h4_html_attributes
      content_tag :h4, **attrs.merge(@attributes) do
        content
      end
    end
  end
end
