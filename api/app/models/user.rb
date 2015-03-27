class User < ActiveRecord::Base

  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :trackable, :validatable

  after_create :register_with_mailchimp

  def register_with_mailchimp
    unless Rails.env == "test" or Rails.env == "development"
      gb = Gibbon::API.new(Rails.application.secrets.mailchimp_api_key)
      gb.lists.subscribe({:id => "ef87dfc9a8", :email => {:email => self.email}, :merge_vars => {}, :double_optin => false})
    end
  end
end
