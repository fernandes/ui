class ToastPreview < Lookbook::Preview
  def default
    render UI::Toast.new do |toast|
      toast.title { "Uh oh! Something went wrong." }
      toast.content do
        toast.plain "There was a problem with your request."
      end
      toast.action(label: "Try Again", to: "/trigger_action")
    end
  end

  def no_link
    render UI::Toast.new do |toast|
      toast.title { "Uh oh! Something went wrong." }
      toast.content do
        toast.plain "There was a problem with your request."
      end
      toast.action(label: "Try Again")
    end
  end

  def destructive
    render UI::Toast.new(variant: :destructive) do |toast|
      toast.title { "Uh oh! Something went wrong." }
      toast.content do
        toast.plain "There was a problem with your request."
      end
      toast.action(label: "Try Again")
    end
  end
end
