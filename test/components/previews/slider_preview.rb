class SliderPreview < Lookbook::Preview
  # @param value range { min: 0, max: 100, step: 1 }
  def default(value: 30)
    render UI::Slider.new(value, class: "w-[60%]")
  end
end
