# frozen_string_literal: true

module UI
  class UI::PComponent < ViewComponent::Base
    def initialize(classes: nil, **attributes)
      @classes = classes
      @attributes = attributes
    end

    def call
      extend UI::PBehavior
      attrs = p_html_attributes
      content_tag :p, **attrs.merge(@attributes) do
        content
      end
    end
  end
end
