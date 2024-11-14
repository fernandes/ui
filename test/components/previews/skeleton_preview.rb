class SkeletonPreview < Lookbook::Preview
  def default
    render UI::Skeleton.new
  end
end
