class UI::DropdownMenu < UI::Base
  class Separator < UI::Base
    def view_template
      div(
        role: "separator",
        aria_orientation: "horizontal",
        class: "-mx-1 my-1 h-px bg-muted"
      )
    end
  end
end
