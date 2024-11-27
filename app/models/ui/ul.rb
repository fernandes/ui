class UI::Ul < UI::Base
  def view_template(&block)
    ul(**attrs, &block)
  end

  def li(**attrs, &block)
    render UI::Li.new(**attrs, &block)
  end

  def default_attrs
    {
      class: "my-6 ml-6 list-disc [&>li]:mt-2"
    }
  end
end
