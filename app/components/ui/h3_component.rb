# frozen_string_literal: true

module UI
  class H3Component < ViewComponent::Base
    def initialize(classes: nil, **attributes)
      @classes = classes
      @attributes = attributes
    end

    def call
      extend UI::Typography::H3Behavior
      attrs = h3_html_attributes
      content_tag :h3, **attrs.merge(@attributes) do
        content
      end
    end
  end
end
