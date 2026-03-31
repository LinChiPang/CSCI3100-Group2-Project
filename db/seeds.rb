# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

Community.find_or_create_by!(slug: "shaw-college") do |c|
    c.name = "Shaw College"
  end

  Community.find_or_create_by!(slug: "new-asia-college") do |c|
    c.name = "New Asia College"
  end

  Community.find_or_create_by!(slug: "united-college") do |c|
    c.name = "United College"
  end

# Add more as needed
