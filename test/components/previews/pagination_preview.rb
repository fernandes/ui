class PaginationPreview < Lookbook::Preview
  def default
    render UI::Pagination.new
  end
end
