require_relative "lib/ui/version"

Gem::Specification.new do |spec|
  spec.name = "fernandes-ui"
  spec.version = UI::VERSION
  spec.authors = ["Celso Fernandes"]
  spec.email = ["fernandes@coding.com.br"]
  spec.homepage = "https://ui.coding.com.br"
  spec.summary = "A Rails UI component library with ERB, Phlex, and ViewComponent support"
  spec.description = "A comprehensive UI component library for Rails applications. Provides reusable components in three formats: ERB partials, Phlex components, and ViewComponents. Built with Tailwind CSS 4 and Stimulus.js."
  spec.license = "MIT"

  spec.required_ruby_version = ">= 3.0"

  spec.metadata = {
    "homepage_uri" => "https://ui.coding.com.br",
    "source_code_uri" => "https://github.com/fernandes/ui",
    "changelog_uri" => "https://github.com/fernandes/ui/blob/main/CHANGELOG.md",
    "bug_tracker_uri" => "https://github.com/fernandes/ui/issues",
    "rubygems_mfa_required" => "true"
  }

  spec.files = Dir.chdir(File.expand_path(__dir__)) do
    Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]
  end
  spec.files += Dir["docs/components/**/*"]

  # Core dependency - support Rails 6.0 through 8.x
  spec.add_dependency "rails", ">= 6.0", "< 9.0"
  spec.add_dependency "tailwind_merge", "~> 0.13"
  spec.add_dependency "lucide-rails", "~> 0.1"

  # Optional dependencies for different asset pipelines
  # These will be required based on the host application's configuration

  # For Rails 8 with Propshaft (default)
  # Propshaft is included in Rails 8 by default, no need to add explicitly

  # For Rails 7/6 with Sprockets
  # Add to your Gemfile: gem 'sprockets-rails'

  # For importmap support (Rails 7+)
  # Add to your Gemfile: gem 'importmap-rails'

  # Development dependencies for component libraries
  spec.add_development_dependency "phlex-rails", "~> 2.0"
  spec.add_development_dependency "view_component", "~> 4.0"
end
