class UI::DropdownMenu < UI::Base
  class Trigger < UI::Base
    def view_template(&block)
      div(**attrs, &block)
    end
  end
end
