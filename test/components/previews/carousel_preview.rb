class CarouselPreview < Lookbook::Preview
  def default
    render UI::Carousel.new
  end
end
