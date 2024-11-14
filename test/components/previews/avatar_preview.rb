class AvatarPreview < Lookbook::Preview
  def default
    render UI::Avatar.new do |avatar|
      avatar.image src: "https://avatars.githubusercontent.com/u/517743?v=4"
      avatar.fallback { "FS" }
    end
  end

  def fallback
    render UI::Avatar.new do |avatar|
      # url does not exist
      avatar.image src: "https://avatars.githubusercontent.co/u/517743?v=4"
      avatar.fallback { "FS" }
    end
  end
end
