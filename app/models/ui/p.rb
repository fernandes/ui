class UI::P < UI::Base
  def view_template(&block)
    p(**attrs, &block)
  end

  def default_attrs
    {
      class: "leading-7 [&:not(:first-child)]:mt-6"
    }
  end
end
