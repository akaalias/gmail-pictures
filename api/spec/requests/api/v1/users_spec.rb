require 'rails_helper'

describe 'Users API', type: :request do

  describe "CREATE /users/" do
    
    context "with valid attributes" do
      it 'creates a new user' do
        post "/api/v1/users/", user: {email: "test@email.com", password: "password" }
        expect(response).to have_http_status(:success)
        puts response.body
        json = JSON.parse(response.body)
        expect(json['id']).not_to eq nil
      end
    end
  end
end
