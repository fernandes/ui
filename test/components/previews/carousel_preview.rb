class CarouselPreview < Lookbook::Preview
  class CarouselContent < UI::Base
    attr_reader :index

    def initialize(index)
      @index = index
    end

    def view_template
      div(class: "p-1") do
        render UI::Card.new do |card|
          card.content(class: "flex aspect-square items-center justify-center p-6") do |content|
            span(class: "text-4xl font-semibold") { "#{index}" }
          end
        end
      end
    end
  end

  def default
    render UI::Carousel.new(class: "w-full max-w-xs") do |c|
      1.upto(6) do |n|
        c.item do
          c.render CarouselContent.new(n)
        end
      end
    end
  end
end
