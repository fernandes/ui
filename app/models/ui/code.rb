class UI::Code < UI::Base
  def view_template(&block)
    code(**attrs, &block)
  end

  def default_attrs
    {
      class: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
    }
  end
end
