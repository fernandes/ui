# frozen_string_literal: true

module Ui
  class InstallGenerator < Rails::Generators::Base
    source_root File.expand_path("install/templates", __dir__)

    def detect_asset_pipeline
      @asset_pipeline = if defined?(Propshaft)
        :propshaft
      elsif defined?(Sprockets)
        :sprockets
      else
        :unknown
      end

      @js_bundler = if File.exist?(Rails.root.join("config/importmap.rb"))
        :importmap
      elsif File.exist?(Rails.root.join("package.json"))
        :node
      else
        :none
      end
    end

    def show_asset_pipeline_info
      say "\nDetecting your setup...\n", :yellow
      say "  Asset pipeline: #{@asset_pipeline}", :green
      say "  JavaScript bundler: #{@js_bundler}", :green
      say "\n"
    end

    def install_tailwind_css
      say "Installing Tailwind CSS 4...\n", :yellow

      # Create Tailwind CSS config file
      template "application.tailwind.css", Rails.root.join("app/assets/stylesheets/application.tailwind.css")

      # Create builds directory
      create_file Rails.root.join("app/assets/builds/.keep")

      # Add to gitignore
      append_to_file Rails.root.join(".gitignore"), "\n# Compiled CSS\n/app/assets/builds/**/*.css\n"

      say "  Created app/assets/stylesheets/application.tailwind.css", :green
      say "  Created app/assets/builds directory", :green
    end

    def install_package_json
      if @js_bundler == :node || !File.exist?(Rails.root.join("package.json"))
        say "\nSetting up package.json...\n", :yellow
        template "package.json", Rails.root.join("package.json")
        say "  Created package.json with Tailwind CLI", :green
      else
        say "\nUpdating existing package.json...\n", :yellow
        say "  Please add Tailwind scripts to your package.json manually", :yellow
      end
    end

    def install_procfile
      if !File.exist?(Rails.root.join("Procfile.dev"))
        say "\nSetting up Procfile.dev...\n", :yellow
        template "Procfile.dev", Rails.root.join("Procfile.dev")
        say "  Created Procfile.dev", :green
      else
        say "\n  Procfile.dev already exists, skipping", :yellow
      end
    end

    def install_javascript
      case @js_bundler
      when :importmap
        install_importmap_javascript
      when :node
        install_node_javascript
      else
        say "\nNo JavaScript bundler detected", :yellow
      end
    end

    def show_next_steps
      say "\n"
      say "=" * 60, :green
      say "UI Engine installed successfully!", :green
      say "=" * 60, :green
      say "\n"
      say "Next steps:\n", :yellow
      say "\n"

      say "  1. Install dependencies:", :cyan
      say "     $ bun install\n", :white
      say "\n"

      say "  2. Build Tailwind CSS:", :cyan
      say "     $ bun run build:css\n", :white
      say "\n"

      say "  3. Update your layout file to include:", :cyan
      say "     <%= stylesheet_link_tag 'application' %>\n", :white
      say "\n"

      if @js_bundler == :importmap
        say "  4. Import UI Engine in your JavaScript:", :cyan
        say "     import UI from 'ui'\n", :white
        say "     UI.init()\n", :white
        say "\n"
      end

      say "  5. Start development with:", :cyan
      say "     $ bin/dev\n", :white
      say "\n"

      say "=" * 60, :green
      say "Documentation: https://github.com/your-repo/ui", :cyan
      say "=" * 60, :green
      say "\n"
    end

    private

    def install_importmap_javascript
      say "\nConfiguring importmap...\n", :yellow

      # Add UI engine pin to the host app's importmap
      if File.exist?(Rails.root.join("config/importmap.rb"))
        append_to_file Rails.root.join("config/importmap.rb"), <<~RUBY

          # UI Engine
          pin "ui", to: "ui/index.js"
        RUBY
        say "  Added 'ui' pin to config/importmap.rb", :green
      end
    end

    def install_node_javascript
      say "\nNode.js setup detected\n", :yellow
      say "  UI Engine JavaScript is available in the gem", :cyan
      say "  Import it in your JavaScript bundle as needed", :cyan
    end
  end
end
