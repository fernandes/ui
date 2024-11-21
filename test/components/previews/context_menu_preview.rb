class ContextMenuPreview < Lookbook::Preview
  def default
    render UI::ContextMenu.new do |ctx|
      ctx.item(text: "Back", key: "meta.[")
      ctx.item(text: "Forward", key: "meta.]", disabled: true)
      ctx.item(text: "Reload", key: "meta.R")

      ctx.menu(text: "More Tools") do |menu|
      end

      ctx.separator

      ctx.checkbox(text: "Show Bookmarks Bar", key: "meta.shift.B", checked: true)
      ctx.checkbox(text: "Show Fulls URLs", checked: false)

      ctx.separator

      ctx.radio_group("People") do
        ctx.radio(text: "Pedro Duarte", selected: true)
        ctx.radio(text: "Colm Tuite")
      end
    end
  end
end
