# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :gif do
    uuid "MyString"
    image_url_small "http://s3.amazonaws.com/imlikestorage01/production/expressions/images/259/69f4c9066a1ed07783e841f61dc2ac607eca59f5_static_squared_80.png?1344293795"
    image_url_large "http://s3.amazonaws.com/imlikestorage01/production/expressions/images/259/09f4e9abcc648ea3e8eb1724b1ef28bfec519073_original.gif?1344293795"
  end
end
