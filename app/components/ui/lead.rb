# frozen_string_literal: true

module UI
  class Lead < Phlex::HTML
    def initialize(classes: nil, **attributes)
      @classes = classes
      @attributes = attributes
    end

    def view_template(&block)
      extend UI::Typography::LeadBehavior
      p(**lead_html_attributes.merge(@attributes), &block)
    end
  end
end
