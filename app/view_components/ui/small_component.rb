# frozen_string_literal: true

module UI
  class UI::SmallComponent < ViewComponent::Base
    def initialize(classes: nil, **attributes)
      @classes = classes
      @attributes = attributes
    end

    def call
      extend UI::SmallBehavior

      attrs = small_html_attributes
      content_tag :small, **attrs.merge(@attributes) do
        content
      end
    end
  end
end
