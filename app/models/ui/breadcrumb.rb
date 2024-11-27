class UI::Breadcrumb < UI::Base
  include Phlex::DeferredRender

  def initialize(**user_attrs)
    @items = []
    @separator = user_attrs.delete(:separator) || :chevron_right
  end

  def item(href: nil, **attrs, &block)
    item = Item.new(href: href, **attrs, &block)
    @items << item
    item
  end

  def view_template
    nav(aria_label: "breadcrumb") do
      ol(
        class: "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5"
      ) do
        @items.each_with_index do |item, ix|
          render(item)
          separator unless last_item?(ix)
        end
      end
    end
  end

  def last_item?(ix)
    @items_total ||= @items.size
    @items_total == ix + 1
  end

  def separator
    li(
      role: "presentation",
      aria_hidden: "true",
      class: "[&>svg]:size-3.5"
    ) do
      render UI::Icon.new(@separator)
    end
  end

  class Item < UI::Base
    def initialize(href: nil, **attrs)
      @href = href
      super(**attrs)
    end

    def view_template(&block)
      li(class: "inline-flex items-center gap-1.5") do
        if @href.present?
          a(class: "transition-colors hover:text-foreground", href: @href) do
            yield
          end
        else
          div(class: "transition-colors") do
            yield
          end
        end
      end
    end
  end
end
