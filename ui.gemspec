require_relative "lib/ui/version"

Gem::Specification.new do |spec|
  spec.name        = "ui"
  spec.version     = UI::VERSION
  spec.authors     = [ "Celso Fernandes" ]
  spec.email       = [ "celso.fernandes@gmail.com" ]
  spec.homepage    = "TODO"
  spec.summary     = "TODO: Summary of UI."
  spec.description = "TODO: Description of UI."
  spec.license     = "MIT"

  # Prevent pushing this gem to RubyGems.org. To allow pushes either set the "allowed_push_host"
  # to allow pushing to a single host or delete this section to allow pushing to any host.
  spec.metadata["allowed_push_host"] = "TODO: Set to 'http://mygemserver.com'"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "TODO: Put your gem's public repo URL here."
  spec.metadata["changelog_uri"] = "TODO: Put your gem's CHANGELOG.md URL here."

  spec.files = Dir.chdir(File.expand_path(__dir__)) do
    Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]
  end

  # Core dependency - support Rails 6.0 and above
  spec.add_dependency "rails", ">= 6.0"

  # Optional dependencies for different asset pipelines
  # These will be required based on the host application's configuration

  # For Rails 8 with Propshaft (default)
  # Propshaft is included in Rails 8 by default, no need to add explicitly

  # For Rails 7/6 with Sprockets
  # Add to your Gemfile: gem 'sprockets-rails'

  # For importmap support (Rails 7+)
  # Add to your Gemfile: gem 'importmap-rails'
end
