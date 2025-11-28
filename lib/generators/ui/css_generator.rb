# frozen_string_literal: true

module Ui
  class CssGenerator < Rails::Generators::Base
    desc "Copies UI Engine CSS to app/assets/tailwind/ui.css for use with cssbundling-rails/tailwindcss-rails"

    def copy_css
      gem_css_path = UI::Engine.root.join("app/assets/stylesheets/ui/application.css")

      unless gem_css_path.exist?
        say "Error: Could not find UI Engine CSS at #{gem_css_path}", :red
        return
      end

      destination = Rails.root.join("app/assets/tailwind/ui.css")

      # Create directory if it doesn't exist
      FileUtils.mkdir_p(destination.dirname)

      # Copy the file
      FileUtils.cp(gem_css_path, destination)

      say "Copied UI Engine CSS to #{destination}", :green
    end

    def add_import_to_application_css
      application_css = Rails.root.join("app/assets/tailwind/application.css")

      unless application_css.exist?
        say "Warning: #{application_css} not found, skipping import", :yellow
        return
      end

      content = File.read(application_css)

      if content.include?('@import "./ui.css"')
        say "Import already exists in #{application_css}", :yellow
        return
      end

      # Add import after tailwindcss import
      import_line = '@import "./ui.css";'
      if content.include?('@import "tailwindcss"')
        new_content = content.sub('@import "tailwindcss";', "@import \"tailwindcss\";\n#{import_line}")
      elsif content.include?("@import 'tailwindcss'")
        new_content = content.sub("@import 'tailwindcss';", "@import 'tailwindcss';\n#{import_line}")
      else
        # Fallback: add at the end if tailwindcss import not found
        new_content = "#{content.rstrip}\n#{import_line}\n"
        say "Warning: @import \"tailwindcss\" not found, added import at the end", :yellow
      end

      File.write(application_css, new_content)

      say "Added @import \"./ui.css\" to #{application_css}", :green
    end
  end
end
