class AddRemoteUrls < ActiveRecord::Migration
  def change
    add_column :gifs, :image_url_small, :string
    add_column :gifs, :image_url_large, :string
  end
end
