class UI::Accordion < UI::Base
  include Phlex::DeferredRender

  def initialize(**user_attrs)
    @items = []
    super
  end

  def item(open: false, **user_attrs, &block)
    item = Item.new(open, **user_attrs)
    block.yield(item)
    @items << item
	end

  def view_template
    div(id: id, class: "w-full", data_orientation: "vertical") do
      @items.each do |item|
        render(item)
      end
    end
  end
end
