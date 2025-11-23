# frozen_string_literal: true

module UI
  module Drawer
    # Shared behavior for Drawer Close component
    # Closes drawer on click
    module DrawerCloseBehavior
      # Data attributes for close button
      def drawer_close_data_attributes
        { data: { action: "click->ui--drawer#close" } }
      end
    end
  end
end
