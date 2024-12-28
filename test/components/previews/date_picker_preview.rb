class DatePickerPreview < Lookbook::Preview
  def default
    render UI::DatePicker.new(class: "relative -top-20")
  end
end
