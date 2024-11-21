class UI::Skeleton < UI::Base
  def view_template
    div(**attrs)
  end

  def default_attrs
    {
      class: "animate-pulse rounded-md bg-muted"
    }
  end
end
