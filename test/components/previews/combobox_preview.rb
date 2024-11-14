class ComboboxPreview < Lookbook::Preview
  def default
    render UI::Combobox.new do |combobox|
      combobox.trigger do
        combobox.render UI::Button.new(class: "text-primary text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-[200px] justify-between") do
          combobox.plain "Select framework.."
          combobox.render UI::Icon.new(:chevrons_up_down, class: "ml-2 h-4 w-4 shrink-0 opacity-50")
        end
      end
      combobox.search placeholder: "Search framework.."
      combobox.option(id: "hanami", label: "Hanami")
      combobox.option(id: "rails", label: "Rails")
      combobox.option(id: "sinatra", label: "Sinatra")
    end
  end

  def option_selected
    render UI::Combobox.new do |combobox|
      combobox.trigger do
        combobox.render UI::Button.new(class: "text-primary text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-[200px] justify-between") do
          combobox.plain "Select framework.."
          combobox.render UI::Icon.new(:chevrons_up_down, class: "ml-2 h-4 w-4 shrink-0 opacity-50")
        end
      end
      combobox.search placeholder: "Search framework.."
      combobox.option(id: "hanami", label: "Hanami")
      combobox.option(id: "rails", label: "Rails", selected: true)
      combobox.option(id: "sinatra", label: "Sinatra")
    end
  end

  def icons
    render UI::Combobox.new do |combobox|
      combobox.trigger do
        combobox.render UI::Button.new(class: "text-primary text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-[200px] justify-between") do
          combobox.plain "+ Set Status"
        end
      end
      combobox.search placeholder: "Change status..."
      combobox.option(id: "backlog", label: "Backlog", icon: :circle_help)
      combobox.option(id: "todo", label: "Todo", icon: :circle)
      combobox.option(id: "in-progress", label: "In Progress", icon: :circle_arrow_up)
      combobox.option(id: "done", label: "Done", icon: :circle_check)
      combobox.option(id: "canceled", label: "Canceled", icon: :circle_x)
    end
  end

  def icons_with_selected
    render UI::Combobox.new do |combobox|
      combobox.trigger do
        combobox.render UI::Button.new(class: "text-primary text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-[200px] justify-between") do
          combobox.plain "+ Set Status"
        end
      end
      combobox.search placeholder: "Change status..."
      combobox.option(id: "backlog", label: "Backlog", icon: :circle_help)
      combobox.option(id: "todo", label: "Todo", icon: :circle)
      combobox.option(id: "in-progress", label: "In Progress", icon: :circle_arrow_up, selected: true)
      combobox.option(id: "done", label: "Done", icon: :circle_check)
      combobox.option(id: "canceled", label: "Canceled", icon: :circle_x)
    end
  end

  def dropdown_menu
    render DropdownMenu.new
  end

  class DropdownMenu < UI::Base
    def view_template
      div(
        class:
          "flex w-full flex-col items-start justify-between rounded-md border px-4 py-3 sm:flex-row sm:items-center"
      ) do
        p(class: "text-sm font-medium leading-none") do
          span(
            class:
              "mr-2 rounded-lg bg-primary px-2 py-1 text-xs text-primary-foreground"
          ) { "feature" }
          span(class: "text-muted-foreground") { "Create a new project" }
        end
        render UI::Popover.new do |pop|
          pop.trigger do
            button(
              class:
                "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3",
              type: "button",
              id: "radix-:r1sf:",
              aria_haspopup: "menu",
              aria_expanded: "false",
              data_state: "closed"
            ) do
              pop.render UI::Icon.new(:ellipsis)
            end
          end
          pop.content(class: "p-1 w-[200px]") do
            pop.render DropdownMenu::Menu.new
          end
        end
      end
    end

    class Menu < UI::Base
      def view_template
        div(class: "px-2 py-1.5 text-sm font-semibold") { "Actions" }

        div(role: "group") do
          div(
            role: "menuitem",
            class:
              "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            tabindex: "-1",
            data_orientation: "vertical",
            data_radix_collection_item: ""
          ) do
            render UI::Icon.new(:user, class: "mr-2 h-4 w-4")
            plain "Assign to..."
          end
          div(
            role: "menuitem",
            class:
              "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            tabindex: "-1",
            data_orientation: "vertical",
            data_radix_collection_item: ""
          ) do
            render UI::Icon.new(:calendar, class: "mr-2 h-4 w-4")
            plain "Set due date..."
          end
          div(
            role: "separator",
            aria_orientation: "horizontal",
            class: "-mx-1 my-1 h-px bg-muted"
          )
          div(
            role: "menuitem",
            id: "radix-:r1tk:",
            aria_haspopup: "menu",
            aria_expanded: "false",
            aria_controls: "radix-:r1tj:",
            data_state: "closed",
            class:
              "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
            tabindex: "-1",
            data_orientation: "vertical",
            data_radix_collection_item: ""
          ) do
            render UI::Icon.new(:tags, class: "mr-2 h-4 w-4")
            plain "Apply label"
            render UI::Combobox.new(class: "ml-auto") do |combobox|
              combobox.trigger do
                combobox.render UI::Icon.new(:chevron_right, class: "ml-auto h-4 w-4")
              end
              combobox.search placeholder: "Filter label..."
              combobox.option(id: "feature", label: "feature")
              combobox.option(id: "bug", label: "bug")
              combobox.option(id: "enhancement", label: "enhancement")
              combobox.option(id: "documentation", label: "documentation")
              combobox.option(id: "design", label: "design")
              combobox.option(id: "question", label: "question")
              combobox.option(id: "maintenance", label: "maintenance")
            end
          end
          div(
            role: "separator",
            aria_orientation: "horizontal",
            class: "-mx-1 my-1 h-px bg-muted"
          )
          div(
            role: "menuitem",
            class:
              "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-600",
            tabindex: "-1",
            data_orientation: "vertical",
            data_radix_collection_item: ""
          ) do
            render UI::Icon.new(:trash, class: "mr-2 h-4 w-4")
            plain "Delete"
            span(class: "ml-auto text-xs tracking-widest opacity-60") { "⌘⌫" }
          end
        end
      end
    end
  end
end

