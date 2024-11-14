class ContextMenuPreview < Lookbook::Preview
  def default
    render UI::ContextMenu.new
  end
end
