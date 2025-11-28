# frozen_string_literal: true

module UI
  class H2Component < ViewComponent::Base
    # @param classes [String] Additional CSS classes
    def initialize(classes: nil, **attributes)
      @classes = classes
      @attributes = attributes
    end

    def call
      extend UI::H2Behavior

      attrs = h2_html_attributes

      content_tag :h2, **attrs.merge(@attributes) do
        content
      end
    end
  end
end
