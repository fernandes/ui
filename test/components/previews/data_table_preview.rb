class DataTablePreview < Lookbook::Preview
  def default
    render UI::DataTable.new
  end
end
