ENV["RAILS_ENV"] ||= "test"

require_relative "../../config/environment"
require "cucumber/rails"
require "database_cleaner/active_record"

Capybara.default_driver = :rack_test

DatabaseCleaner.allow_remote_database_url = true

DatabaseCleaner.strategy = :transaction

Before do
  DatabaseCleaner.start
end

After do
  DatabaseCleaner.clean
end

