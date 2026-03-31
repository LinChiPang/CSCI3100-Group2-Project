if ENV["COVERAGE"] == "true"
  require "simplecov"
  SimpleCov.start "rails" do
    minimum_coverage 80
  end
end

RSpec.configure do |config|
  config.disable_monkey_patching!
  config.expect_with :rspec do |c|
    c.syntax = :expect
  end
end
