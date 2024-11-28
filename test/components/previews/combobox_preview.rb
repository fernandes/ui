class ComboboxPreview < Lookbook::Preview
  def default
    render UI::Combobox.new do |combobox|
      combobox.trigger do |trigger|
        trigger.button("Select framework..")
      end
      combobox.search placeholder: "Search framework.."
      combobox.option(id: "hanami", label: "Hanami")
      combobox.option(id: "rails", label: "Rails")
      combobox.option(id: "sinatra", label: "Sinatra")
    end
  end

  def no_search
    render UI::Combobox.new do |combobox|
      combobox.trigger do |trigger|
        trigger.button("Select framework..")
      end
      # combobox.search placeholder: "Search framework.."
      combobox.option(id: "hanami", label: "Hanami")
      combobox.option(id: "rails", label: "Rails")
      combobox.option(id: "sinatra", label: "Sinatra")
    end
  end

  def option_selected
    render UI::Combobox.new do |combobox|
      combobox.trigger do |trigger|
        trigger.button("Select framework..")
      end
      combobox.search placeholder: "Search framework.."
      combobox.option(id: "hanami", label: "Hanami")
      combobox.option(id: "rails", label: "Rails", selected: true)
      combobox.option(id: "sinatra", label: "Sinatra")
    end
  end

  def icons
    render UI::Combobox.new do |combobox|
      combobox.trigger do |trigger|
        trigger.button("+ Set Status")
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
      combobox.render UI::Button.new(class: "text-primary text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-[200px] justify-between") do
        combobox.plain "+ Set Status"
      end
      combobox.trigger do |trigger|
        trigger.button("+ Set Status")
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
      div(class: "flex justify-start flex-grow") do
        div(
          class:
            "flex flex-col items-start justify-between rounded-md border px-4 py-3 sm:flex-row sm:items-center w-[600px]"
        ) do
          p(class: "text-sm font-medium leading-none") do
            span(
              class:
                "mr-2 rounded-lg bg-primary px-2 py-1 text-xs text-primary-foreground"
            ) { "feature" }
            span(class: "text-muted-foreground") { "Create a new project" }
          end
          render UI::DropdownMenu.new do |d|
            d.trigger do
              d.render UI::Button.new(variant: :ghost) { render UI::Icon.new(:ellipsis) }
            end

            d.menu_content(class: "w-[200px]") do |m|
              m.label { "Actions" }
              m.group do |grp|
                grp.item("Assign to...", icon: :user)
                grp.item("Set due date..", icon: :calendar)
                m.separator
                grp.submenu("Apply label", icon: :tags) do |submenu|
                  render UI::Combobox.new(hide_check_marks: true, class: "ml-auto") do |combobox|
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
                m.separator
                grp.item("Delete", icon: :trash, key: "meta.enter", variant: :destructive)
              end
            end
          end
        end
      end
    end
  end
end
