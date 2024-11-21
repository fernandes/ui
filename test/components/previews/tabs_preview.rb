class TabsPreview < Lookbook::Preview
  class AccountContent < UI::Base
    def view_template
      render UI::Card.new(class: "w-full") do |card|
        card.header do |header|
          header.title { "Account" }
          header.description { "Make changes to your account here. Click save when you're done." }
        end

        card.content do |content|
          div(class: "space-y-1") do
            render UI::Label.new(htmlFor: "name") { "Name" }
            render UI::Input.new(id: "name", value: "Pedro Duarte")
          end

          div(class: "space-y-1") do
            render UI::Label.new(htmlFor: "username") { "Username" }
            render UI::Input.new(id: "username", value: "@peduarte")
          end
        end

        card.footer do |footer|
          footer.render UI::Button.new(variant: :secondary) { "Cancel" }
          footer.render UI::Button.new { "Deploy" }
        end
      end
    end
  end

  class PasswordContent < UI::Base
    def view_template
      render UI::Card.new(class: "w-full") do |card|
        card.header do |header|
          header.title { "Password" }
          header.description { "Change your password here. After saving, you'll be logged out." }
        end

        card.content do |content|
          div(class: "space-y-1") do
            render UI::Label.new(htmlFor: "current") { "Current password" }
            render UI::Input.new(id: "current", type: :password)
          end

          div(class: "space-y-1") do
            render UI::Label.new(htmlFor: "new") { "New password" }
            render UI::Input.new(id: "new", type: :password)
          end
        end

        card.footer do |footer|
          footer.render UI::Button.new { "Save password" }
        end
      end
    end
  end

  def default
    render UI::Tabs.new(active: "Account", class: "w-[400px]") do |tab|
      tab.list do
        tab.trigger_for "Account"
        tab.trigger_for "Password"
      end

      tab.content_for "Account" do
        tab.render AccountContent
      end

      tab.content_for "Password" do
        tab.render PasswordContent
      end
    end
  end
end
