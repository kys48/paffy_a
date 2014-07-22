class CollectionProduct < ActiveRecord::Base
  attr_accessible :id, :collection_id, :product_id, :cssleft, :csstop, 
                  :flip, :flop, :height, :left, :rotate,
                  :top, :white_bck, :zindex, :caption,
                  :subject, :price, :price_type, :url,
                  :img_file_name
                  
  belongs_to :collection
  belongs_to :product
  
  has_attached_file :img,
                :styles => {
                  :medium => "220x220>", 
                  :thumb => "220x220>" 
                },
                :default_url => "/imgs/:style/missing.png",
                #:path => ":rails_root/public/:attachment/:id/:style/:basename.:extension",
                #:url => "/:attachment/:id/:style/:basename.:extension"
                :path => ":rails_root/public/data/product/:style/:basename.:extension",
                :url => "/data/product/:style/:basename.:extension"
end
