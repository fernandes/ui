class UI::Large < UI::Base
  def view_template(&block)
    div(**attrs, &block)
  end

  def default_attrs
    {
      class: "text-lg font-semibold"
    }
  end
end
