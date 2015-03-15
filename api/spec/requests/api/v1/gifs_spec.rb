require 'rails_helper'

describe 'Gifs API', type: :request do

  before do
    @gif1 = FactoryGirl.create(:gif)
    @gif2 = FactoryGirl.create(:gif)
    @gif3 = FactoryGirl.create(:gif)
  end

  describe "GET /gifs/" do
    context "without any parameters" do
      it 'sends a list of gifs' do
        get "/api/v1/gifs/"
        expect(response).to have_http_status(:success)
        json = JSON.parse(response.body)
        expect(json[0]['id']).to eq @gif1.id
        expect(json[1]['id']).to eq @gif2.id
        expect(json[2]['id']).to eq @gif3.id
      end
    end

    context "with length parameter" do
      it 'sends a list of gifs' do
        get "/api/v1/gifs/?limit=1"
        expect(response).to have_http_status(:success)
        json = JSON.parse(response.body)
        expect(json.length).to eq 1
      end
    end
    
    context "with random query parameter" do
      it 'sends a list of gifs' do
        get "/api/v1/gifs/?order=random&limit=10"
        expect(response).to have_http_status(:success)
        json = JSON.parse(response.body)
        expect(json.length).to eq 3
      end
    end
    
  end
  
  describe "GET /gifs/:id" do
    context "getting a single one" do
      it 'sends an individual gif' do
        get "/api/v1/gifs/#{@gif1.id}"
        expect(response).to have_http_status(:success)
        json = JSON.parse(response.body)
        expect(json['id']).to eq @gif1.id
        expect(json['image_url_small']).to eq @gif1.image_url_small
        expect(json['image_url_large']).to eq @gif1.image_url_large
      end
    end
  end
end
