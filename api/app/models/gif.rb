class Gif < ActiveRecord::Base
  
  def image_url_small
    if Rails.env == "development"
      "http://localhost:3000" + self.image.url(:static_squared_50)
    else
      self.image.url(:static_squared_50)
    end
  end

  def image_url_large
    if Rails.env == "development"
      "http://localhost:3000" + self.image.url()
    else
      self.image.url()
    end
  end

  has_attached_file :image, :styles => { 
    :static_squared_50 => ["50x50#", :png],
  }
  
  validates_attachment :image, :size => { :in => 0..2.megabytes }
  validates_attachment_content_type :image, :content_type => ['image/gif']
end
