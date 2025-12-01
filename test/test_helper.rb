# Configure Rails Environment
ENV["RAILS_ENV"] = "test"

require_relative "../test/dummy/config/environment"
ActiveRecord::Migrator.migrations_paths = [File.expand_path("../test/dummy/db/migrate", __dir__)]
ActiveRecord::Migrator.migrations_paths << File.expand_path("../db/migrate", __dir__)
require "rails/test_help"

# Load fixtures from the engine
if ActiveSupport::TestCase.respond_to?(:fixture_paths=)
  ActiveSupport::TestCase.fixture_paths = [File.expand_path("fixtures", __dir__)]
  ActionDispatch::IntegrationTest.fixture_paths = ActiveSupport::TestCase.fixture_paths
  ActiveSupport::TestCase.file_fixture_path = File.expand_path("fixtures", __dir__) + "/files"
  ActiveSupport::TestCase.fixtures :all
end

# Load COM (Component Object Model) support files
Dir[File.expand_path("support/helpers/**/*.rb", __dir__)].each { |f| require f }

# Load base_element first, then other elements
require_relative "support/elements/base_element" if File.exist?(File.expand_path("support/elements/base_element.rb", __dir__))
Dir[File.expand_path("support/elements/**/*.rb", __dir__)].each { |f| require f unless f.end_with?("base_element.rb") }

require_relative "support/system_test_case" if File.exist?(File.expand_path("support/system_test_case.rb", __dir__))
