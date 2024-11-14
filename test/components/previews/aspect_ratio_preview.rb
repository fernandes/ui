class AspectRatioPreview < Lookbook::Preview
  def default
    render UI::AspectRatio.new(aspect_ratio: "16/9", class: "rounded-md overflow-hidden border shadow-sm") do |ar|
      ar.img(
        alt: "Placeholder",
        loading: "lazy",
        src: "https://placehold.co/600x400/EEE/31343C"
      )
    end
  end

  def banner_ratio
    render UI::AspectRatio.new(aspect_ratio: "16/3", class: "rounded-md overflow-hidden border shadow-sm") do |ar|
      ar.img(
        alt: "Placeholder",
        loading: "lazy",
        src: "https://placehold.co/600x400/EEE/31343C"
      )
    end
  end
end
