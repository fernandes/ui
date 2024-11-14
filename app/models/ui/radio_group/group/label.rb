class UI::RadioGroup::Group::Label < UI::Base
  def view_template(&block)
    render UI::Label.new(**attrs, &block)
  end
end
