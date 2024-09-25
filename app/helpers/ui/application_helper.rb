module UI
  module ApplicationHelper
    def ui_form_for(record, options = {}, &block)
      options[:builder] = UI::FormBuilder
      form_for(record, options, &block)
    end
  end
end
