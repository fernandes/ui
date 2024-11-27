class UI::H4 < UI::Base
  def view_template(&block)
    h4(**attrs, &block)
  end

  def default_attrs
    {
      class: "scroll-m-20 text-xl font-semibold tracking-tight"
    }
  end
end
