class UI::Lead < UI::Base
  def view_template(&block)
    p(**attrs, &block)
  end

  def default_attrs
    {
      class: "text-xl text-muted-foreground"
    }
  end
end
