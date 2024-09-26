class AlertPreview < Lookbook::Preview
  def default
    render UI::Alert.new do |alert|
      alert.icon :terminal
      alert.title { "Heads up!" }
      alert.body { "You can add components to your app using the cli." }
    end
  end

  def success
    render UI::Alert.new(variant: :success) do |alert|
      alert.icon :terminal
      alert.title { "Heads up!" }
      alert.body { "You can add components to your app using the cli." }
    end
  end

  def warning
    render UI::Alert.new(variant: :warning) do |alert|
      alert.icon :terminal
      alert.title { "Heads up!" }
      alert.body { "You can add components to your app using the cli." }
    end
  end

  def destructive
    render UI::Alert.new(variant: :destructive) do |alert|
      alert.icon :circle_alert
      alert.title { "Error" }
      alert.body { "Your session has expired. Please log in again." }
    end
  end

  def overwrite_elements_classes
    render UI::Alert.new do |alert|
      alert.icon :terminal, class: "w-8 h-8"
      alert.title(id: :title, class: "text-2xl") { "Heads up!" }
      alert.body(class: "bg-red-500") { "You can add components to your app using the cli." }
    end
  end
end
