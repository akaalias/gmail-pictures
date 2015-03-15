class GifsController < ApplicationController
  def index
    
    length = params[:limit] || 20

    order = "id asc"
    
    if params[:order] == 'random'
      order = "RANDOM()"
    end
    
    gifs = Gif.order(order).limit(length)
    render json: gifs.as_json(methods: [:image_url_small, :image_url_large])
  end
  def show
    gif = Gif.find(params[:id])
    render json: gif.as_json(methods: [:image_url_small, :image_url_large])
  end
end
