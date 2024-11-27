class UI::DropdownMenu < UI::Base
  class Label < UI::Base
    def view_template(&block)
      div(**attrs, &block)
    end

    def default_attrs
      {
        class: "px-2 py-1.5 text-sm font-semibold"
      }
    end
  end
end
