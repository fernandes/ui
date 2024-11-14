class DrawerPreview < Lookbook::Preview
  def default
    render UI::Drawer.new
  end
end
