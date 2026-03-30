ENV['RAILS_ENV'] ||= 'test'

require "simplecov"

SimpleCov.start "rails" do
  add_filter "/spec/"
  add_filter "/config/"
  minimum_coverage 80
end

RSpec.configure do |config|
  config.disable_monkey_patching!

  config.expect_with :rspec do |c|
    c.syntax = :expect
  end
end
