class BreadcrumbPreview < Lookbook::Preview
  def default
    render UI::Breadcrumb.new do |b|
      b.item(href: "/home") { "Home" }
      b.item(href: "/components") { "Components" }
      b.item { "Breadcrumb" }
    end
  end

  def separator_icon
    render UI::Breadcrumb.new(separator: :slash) do |b|
      b.item(href: "/home") { "Home" }
      b.item(href: "/components") { "Components" }
      b.item { "Breadcrumb" }
    end
  end
end
