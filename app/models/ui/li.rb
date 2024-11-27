class UI::Li < UI::Base
  def view_template(&block)
    li(**attrs, &block)
  end
end
