# frozen_string_literal: true

    # Shared behavior for Drawer Close component
    # Closes drawer on click
    module UI::DrawerCloseBehavior
      # Data attributes for close button
      def drawer_close_data_attributes
        { data: { action: "click->ui--drawer#close" } }
      end
    end
