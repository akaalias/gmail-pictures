# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :gif do
    uuid "MyString"
    image { File.new("#{Rails.root}/spec/support/gif.gif") } 
  end
end
