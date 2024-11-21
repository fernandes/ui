class ProgressPreview < Lookbook::Preview
  # @param percentage range { min: 0, max: 100, step: 1 }
  def default(percentage: 30)
    render UI::Progress.new(percentage, class: "w-[60%]")
  end
end
