class DropdownMenuPreview < Lookbook::Preview
  def default
    render UI::DropdownMenu.new do |d|
      d.trigger do
        d.render UI::Button.new(variant: :outline) { "Open" }
      end

      d.menu_content do |m|
        m.label { "My Account" }
        m.separator
        m.group do |grp|
          grp.item("Profile", icon: :user, key: "shift.meta.p")
          grp.item("Billing", icon: :credit_card, key: "meta.b")
          grp.item("Settings", icon: :settings, key: "meta.s")
          grp.item("Keyboard Shortcuts", icon: :keyboard, key: "meta.k")
        end
        m.separator
        m.group do |grp|
          grp.item("Users", icon: :users)
          grp.submenu("Invite Users", icon: :user_plus) do |submenu|
            submenu.item("Email", icon: :mail)
            submenu.item("Message", icon: :message_square)
            submenu.separator
            submenu.item("More...", icon: :plus_circle)
          end
          grp.item("New Team", icon: :plus, key: "meta.t")
        end
        m.separator
        m.item("Github", icon: :github)
        m.item("Support", icon: :life_buoy)
        m.item("API", icon: :cloud, disabled: true)
        m.item("Logout", icon: :log_out, key: "shit.meta.q")
      end
    end
  end

  def checkboxes
    render UI::DropdownMenu.new do |d|
      d.trigger do
        d.render UI::Button.new(variant: :outline) { "Open" }
      end

      d.menu_content(class: "w-56") do |m|
        m.label { "Appearance" }
        m.separator
        m.checkbox_item(checked: true) { "Status Bar" }
        m.checkbox_item(disabled: true) { "Activity Bar" }
        m.checkbox_item(checked: false) { "Panel" }
      end
    end
  end

  def radio_group
    render UI::DropdownMenu.new do |d|
      d.trigger do
        d.render UI::Button.new(variant: :outline) { "Open" }
      end

      d.menu_content(class: "w-56") do |m|
        m.label { "Panel Position" }
        m.separator
        m.radio_group(value: "bottom") do |grp|
          grp.radio_item(value: "top") { "Top" }
          grp.radio_item(value: "bottom") { "Bottom" }
          grp.radio_item(value: "right") { "Right" }
        end
      end
    end
  end

  def multi_level
    render UI::DropdownMenu.new do |d|
      d.trigger do
        d.render UI::Button.new(variant: :outline) { "Open" }
      end

      d.menu_content(class: "w-[200px]") do |m|
        m.label { "Technologies" }
        m.group do |grp|
          grp.item("HTML")
          grp.item("CSS")
          grp.item("Javascript")
          grp.submenu("1st Other", class: "min-w-[200px]") do |submenu|
            submenu.item("Ruby")
            submenu.item("Python")
            submenu.submenu("2nd Other", class: "min-w-[200px]") do |submenu|
              submenu.item("Ada")
              submenu.item("Cobol")
            end
          end

          grp.submenu("3rd Other", class: "min-w-[200px]") do |submenu|
            submenu.item("Perl")
            submenu.item("Bash")
            submenu.submenu("4th Other", class: "min-w-[200px]") do |submenu|
              submenu.item("Pascal")
              submenu.item("Delphi")
            end
          end
        end
      end
    end
  end
end
