class NavigationMenuPreview < Lookbook::Preview
  def default
    render UI::NavigationMenu.new
  end
end
