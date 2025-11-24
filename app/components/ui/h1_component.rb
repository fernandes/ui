# frozen_string_literal: true

module UI
  class H1Component < ViewComponent::Base
    # @param classes [String] Additional CSS classes
    def initialize(classes: nil, **attributes)
      @classes = classes
      @attributes = attributes
    end

    def call
      extend UI::Typography::H1Behavior

      attrs = h1_html_attributes

      content_tag :h1, **attrs.merge(@attributes) do
        content
      end
    end
  end
end
