class UI::Label < UI::Base
  def view_template(&block)
    label(**attrs, &block)
  end

  def default_attrs
    {
      class: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    }
  end
end
