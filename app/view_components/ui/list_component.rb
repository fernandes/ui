# frozen_string_literal: true

module UI
  class UI::ListComponent < ViewComponent::Base
    def initialize(classes: nil, **attributes)
      @classes = classes
      @attributes = attributes
    end

    def call
      extend UI::ListBehavior

      attrs = list_html_attributes
      content_tag :ul, **attrs.merge(@attributes) do
        content
      end
    end
  end
end
