class UI::H2 < UI::Base
  def view_template(&block)
    h2(**attrs, &block)
  end

  def default_attrs
    {
      class: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
    }
  end
end
