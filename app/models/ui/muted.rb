class UI::Muted < UI::Base
  def view_template(&block)
    p(**attrs, &block)
  end

  def default_attrs
    {
      class: "text-sm text-muted-foreground"
    }
  end
end
