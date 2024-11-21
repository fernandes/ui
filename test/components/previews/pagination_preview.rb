class PaginationPreview < Lookbook::Preview
  def default
    render UI::Pagination.new do |pag|
      pag.previous to: "/page/1"
      pag.link "1", to: "/page/1"
      pag.link "2", to: "/page/2", active: true
      pag.link "3", to: "/page/3"
      pag.ellipsis
      pag.next to: "/page/3"
    end
  end
end
