class UI::H3 < UI::Base
  def view_template(&block)
    h3(**attrs, &block)
  end

  def default_attrs
    {
      class: "scroll-m-20 text-2xl font-semibold tracking-tight"
    }
  end
end
