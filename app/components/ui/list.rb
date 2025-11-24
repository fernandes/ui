# frozen_string_literal: true

module UI
  class List < Phlex::HTML
    def initialize(classes: nil, **attributes)
      @classes = classes
      @attributes = attributes
    end

    def view_template(&block)
      extend UI::Typography::ListBehavior
      ul(**list_html_attributes.merge(@attributes), &block)
    end
  end
end
