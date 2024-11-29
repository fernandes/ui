class ContextMenuPreview < Lookbook::Preview
  def default
    render UI::ContextMenu.new do |ctx|
      ctx.trigger(class: "flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm") do |trigger|
        trigger.plain "Right click here"
      end

      ctx.content do |c|
        c.item(text: "Back", key: "meta.[")
        c.item(text: "Forward", key: "meta.]", disabled: true)
        c.item(text: "Reload", key: "meta.R")

        c.menu(text: "More Tools") do |menu|
        end

        c.separator

        c.checkbox(text: "Show Bookmarks Bar", key: "meta.shift.B", checked: true)
        c.checkbox(text: "Show Fulls URLs", checked: false)

        c.separator

        c.radio_group("People") do
          c.radio(text: "Pedro Duarte", selected: true)
          c.radio(text: "Colm Tuite")
        end
      end
    end
  end
end
