class ContextMenuPreview < Lookbook::Preview
  def default
    render UI::ContextMenu.new do |ctx|
      ctx.trigger(class: "flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm ", popover_class: "focus-visible:rounded-md focus-visible:ring-inset") do |trigger|
        trigger.plain "Right click here"
      end

      ctx.content do |c|
        c.item("Back", key: "meta.[")
        c.item("Forward", key: "meta.]", disabled: true)
        c.item("Reload", key: "meta.R")

        c.submenu("More Tools") do |submenu|
          submenu.item("Save Page As..", key: "shift.meta.S")
          submenu.item("Create Shortcut..")
          submenu.item("Name Window..")
          submenu.separator
          submenu.item("Developer Tools")
        end

        c.separator
        c.checkbox(value: "show_bookmarks", checked: true) { "Show Bookmarks Bar" }
        c.checkbox(value: "show_urls", checked: false) { "Show Fulls URLs" }

        c.separator
        c.label { "People" }
        c.separator

        c.radio_group(value: "pedro_duarte") do |grp|
          grp.radio(value: "pedro_duarte") { "Pedro Duarte" }
          grp.radio(value: "colm tuite") { "Colm Tuite" }
        end
      end
    end
  end
end
