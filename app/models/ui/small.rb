class UI::Small < UI::Base
  def view_template(&block)
    small(**attrs, &block)
  end

  def default_attrs
    {
      class: "text-sm font-medium leading-none"
    }
  end
end
