class TablePreview < Lookbook::Preview
  def default
    render UI::Table.new
  end
end
