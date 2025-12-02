# frozen_string_literal: true

module UI
  class Base < Phlex::HTML
    # Register lucide_icon as an output helper (returns HTML)
    register_output_helper :lucide_icon
  end
end
