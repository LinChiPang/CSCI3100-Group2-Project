ENV["RAILS_ENV"] ||= "test"
ENV['JWT_SECRET'] = 'test_secret_key_for_jwt'

require_relative "../../config/environment"
require "cucumber/rails"
require "database_cleaner/active_record"

Capybara.default_driver = :rack_test
Capybara.javascript_driver = :selenium_chrome_headless

DatabaseCleaner.allow_remote_database_url = true

DatabaseCleaner.strategy = :transaction

Before do
  DatabaseCleaner.start
end

After do
  DatabaseCleaner.clean
end
