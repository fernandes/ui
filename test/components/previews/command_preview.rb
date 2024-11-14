class CommandPreview < Lookbook::Preview
  def default
    render UI::Command.new(key: "ctrl+j", open: true) do |cmd|
      cmd.search
      cmd.group("Suggestions") do |grp|
        grp.item("Calendar", icon: :calendar)
        grp.item("Search Emoji", icon: :smile)
        grp.item("Calculator", icon: :calculator)
      end

      cmd.group("Settings") do |grp|
        grp.item("Profile", icon: :user, key: "meta.p")
        grp.item("Billing", icon: :credit_card, key: "meta.b")
        grp.item("Settings", icon: :settings, key: "meta.s")
      end
    end
  end

  def button_to_open
    render ButtonToOpen.new
    
  end

  class ButtonToOpen < UI::Base
    def view_template
      p(class: "text-sm text-muted-foreground") do
        plain "Press "
        kbd(
          class:
            "pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
        ) do
          span(class: "text-xs") { "⌘" }
          plain "J"
        end
      end
      render UI::Command.new(key: "ctrl+j", open: false) do |cmd|
        cmd.search
        cmd.group("Suggestions") do |grp|
          grp.item("Calendar", icon: :calendar)
          grp.item("Search Emoji", icon: :smile)
          grp.item("Calculator", icon: :calculator)
        end

        cmd.group("Settings") do |grp|
          grp.item("Profile", icon: :user, key: "meta.p")
          grp.item("Billing", icon: :credit_card, key: "meta.b")
          grp.item("Settings", icon: :settings, key: "meta.s")
        end
      end
    end
  end
end
