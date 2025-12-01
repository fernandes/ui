# frozen_string_literal: true

module UI
  class UI::Muted < Phlex::HTML
    def initialize(classes: nil, **attributes)
      @classes = classes
      @attributes = attributes
    end

    def view_template(&block)
      extend UI::MutedBehavior

      p(**muted_html_attributes.merge(@attributes), &block)
    end
  end
end
