class UI::Blockquote < UI::Base
  def view_template(&block)
    blockquote(**attrs, &block)
  end

  def default_attrs
    {
      class: "mt-6 border-l-2 pl-6 italic"
    }
  end
end
