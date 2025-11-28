# frozen_string_literal: true

module UI
  class UI::MutedComponent < ViewComponent::Base
    def initialize(classes: nil, **attributes)
      @classes = classes
      @attributes = attributes
    end

    def call
      extend UI::MutedBehavior
      attrs = muted_html_attributes
      content_tag :p, **attrs.merge(@attributes) do
        content
      end
    end
  end
end
