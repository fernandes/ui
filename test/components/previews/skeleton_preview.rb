class SkeletonPreview < Lookbook::Preview
  class SkeletonDefault < UI::Base
    def view_template
      div(class: "flex items-center space-x-4") do
        whitespace
        render UI::Skeleton.new(class: "h-12 w-12 rounded-full")
        div(class: "space-y-2") do
          whitespace
          render UI::Skeleton.new(class: "h-4 w-[250px]")
          whitespace
          render UI::Skeleton.new(class: "h-4 w-[200px]")
        end
      end
    end
  end

  def default
    render SkeletonDefault.new
  end

  class SkeletonCard < UI::Base
    def view_template
      div(class: "flex flex-col space-y-3") do
        whitespace
        render UI::Skeleton.new(class: "h-[125px] w-[250px] rounded-xl")
        div(class: "space-y-2") do
          whitespace
          render UI::Skeleton.new(class: "h-4 w-[250px]")
          whitespace
          render UI::Skeleton.new(class: "h-4 w-[200px]")
        end
      end
    end
  end

  def card
    render SkeletonCard.new
  end
end
