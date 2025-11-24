# frozen_string_literal: true

module UI
  class Muted < Phlex::HTML
    def initialize(classes: nil, **attributes)
      @classes = classes
      @attributes = attributes
    end

    def view_template(&block)
      extend UI::Typography::MutedBehavior
      p(**muted_html_attributes.merge(@attributes), &block)
    end
  end
end
