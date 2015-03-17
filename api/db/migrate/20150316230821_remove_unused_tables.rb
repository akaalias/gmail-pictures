class RemoveUnusedTables < ActiveRecord::Migration
  def change
    drop_table :active_admin_comments
    drop_table :admin_users

    remove_column :gifs,        "image_file_name"
    remove_column :gifs,   "image_content_type"
    remove_column :gifs,  "image_file_size"
    remove_column :gifs, "image_updated_at"

  end
end
