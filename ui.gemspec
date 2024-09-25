require_relative "lib/ui/version"

Gem::Specification.new do |spec|
  spec.name        = "ui"
  spec.version     = UI::VERSION
  spec.authors     = ["Celso Fernandes"]
  spec.email       = ["celso.fernandes@gmail.com"]
  spec.homepage    = "https://github.com/fernandes/ui"
  spec.summary     = "UI"
  spec.description = "UI"
  spec.license     = "MIT"

  # Prevent pushing this gem to RubyGems.org. To allow pushes either set the "allowed_push_host"
  # to allow pushing to a single host or delete this section to allow pushing to any host.
  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "https://github.com/fernandes/ui"
  spec.metadata["changelog_uri"] = "https://github.com/fernandes/ui-old/blob/main/CHANGELOG.md"

  spec.files = Dir.chdir(File.expand_path(__dir__)) do
    Dir["CHANGELOG.md", "MIT-LICENSE", "Rakefile", "README.md", "lib/**/*", "app/assets/javascripts/*.js"]
  end

  spec.add_dependency "rails", ">= 7.1.3.2"
  spec.add_dependency "phlex", ">= 2.0.0.beta2"
  spec.add_dependency "phlex-rails", ">= 2.0.0.beta2"
  spec.add_dependency "tailwind_merge", '~> 0.13.0'
end
