class UI::Backdrop < UI::Base
  def view_template
    div(**attrs)
  end

  private
  def default_attrs
    {
      data_state: "open",
      class:
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      style: "pointer-events:auto",
      data_aria_hidden: "true",
      aria_hidden: "true"
    }
  end
end
