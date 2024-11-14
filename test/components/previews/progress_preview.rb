class ProgressPreview < Lookbook::Preview
  def default
    render UI::Progress.new
  end
end
