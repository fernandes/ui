class UI::H1 < UI::Base
  def view_template(&block)
    h1(**attrs, &block)
  end

  def default_attrs
    {
      class: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
    }
  end
end
