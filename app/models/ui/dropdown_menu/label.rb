class UI::DropdownMenu < UI::Base
  class Label < UI::Base
    def initialize(margin_left: false, **attrs)
      @margin_left = margin_left
      super(**attrs)
    end

    def view_template(&block)
      div(**attrs, &block)
    end

    def default_attrs
      {
        class: [
          "px-2 py-1.5 text-sm font-semibold",
          ("pl-8" if @margin_left)
        ],

      }
    end
  end
end
