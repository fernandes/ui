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

  def dropdown
    render UI::Breadcrumb.new(separator: :slash) do |b|
      b.item(href: "/home") { "Home" }
      b.dropdown do |d|
        d.item(href: "/documentation") { "Documentation" }
        d.item(href: "/themes") { "Themes" }
        d.item(href: "/github") { "Github" }
      end
      b.item(href: "/components") { "Components" }
      b.item { "Breadcrumb" }
    end
  end
end
