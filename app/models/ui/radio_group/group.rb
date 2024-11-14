class UI::RadioGroup::Group < UI::Base
  ui_attribute :label
  attr_reader :selected_value

  def initialize(selected_value: nil, **attrs)
    @selected_value = selected_value
    super
  end

  def view_template(&block)
    div(**attrs) do
      render(@item)
      render(@label) if @label
    end
  end

  def item(**attrs, &block)
    selected = (attrs[:value].to_sym == @selected_value.to_sym)
    @item = Item.new(selected, **attrs, &block)
  end

  def default_attrs
    {
      class: "flex items-center space-x-2"
    }
  end
end
