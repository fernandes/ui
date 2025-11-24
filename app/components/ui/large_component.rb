# frozen_string_literal: true

module UI
  class LargeComponent < ViewComponent::Base
    def initialize(classes: nil, **attributes)
      @classes = classes
      @attributes = attributes
    end

    def call
      extend UI::Typography::LargeBehavior
      attrs = large_html_attributes
      content_tag :div, **attrs.merge(@attributes) do
        content
      end
    end
  end
end
