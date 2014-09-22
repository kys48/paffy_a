PaffyA::Application.routes.draw do

  match 'comments/deleteCallback', to: 'board_comments#deleteCallback'
  match 'comments/commentListCallback', to: 'board_comments#commentListCallback'
  match 'comments/writeCallback', to: 'board_comments#writeCallback'
  match 'admin/setColorCallback', to: 'admin#setColorCallback'
  match 'admin/removeBgColorCallback', to: 'admin#removeBgColorCallback'
  match 'admin/removeBgCallback', to: 'admin#removeBgCallback'
  match 'admin/productList', to: 'admin#productList'
  match 'admin/productListCallback', to: 'admin#productListCallback'
  match 'admin/updateProductCallback', to: 'admin#updateProductCallback'
  match 'admin/insertImglistCallback', to: 'admin#insertImglistCallback'
  

  #get 'store/topstore'
  match 'store/topstore', to: 'store#topstore'
  match 'store/storeListCallback', to: 'store#storeListCallback'
  
  #get 'follows/put'
  match 'follows/put', to: 'follows#put'

  #get 'mypage/myfeed'
  match 'mypage/myfeed', to: 'mypage#myfeed'
  match 'mypage/setting', to: 'mypage#setting'
  match 'mypage/checkValidCallback', to: 'mypage#checkValidCallback'
  match 'mypage/editProfile', to: 'mypage#editProfile'
  
  #get 'admin/getNaverShopApi'
  match 'getNaverShopApi', to: 'admin#getNaverShopApi'
  
  #get 'products/myProductListCallback'
  match 'products/myProductListCallback', to: 'products#myProductListCallback'
  
  #get 'products/productListCallback'
  match 'products/productListCallback', to: 'products#productListCallback'
  
  #get 'mypage/index'
  match 'mypage', to: 'mypage#index'
  
  #get 'mypage/itemListCallback'
  match 'mypage/itemListCallback', to: 'mypage#itemListCallback'
  
  #get 'mypage' => 'mypage#index', :as => 'mypage'
  #get 'mypage/itemListCallback' => 'mypage#itemListCallback', :as => 'mypage/itemListCallback'

  get 'admin/getLookUrl'
  match 'getLookUrl', to: 'admin#getLookUrl'
  
  get 'admin/getLinkpriceUrl'
  match 'getLinkpriceUrl', to: 'admin#getLinkpriceUrl'

  get 'item/getProductList'
  match 'item/getProductList', to: 'item#getProductList'
  
  get 'item/getShopStyleCallback'
  match 'getShopStyleCallback', to: 'item#getShopStyleCallback'
  
  get 'item/removeItemCallback'
  match 'item/removeItemCallback', to: 'item#removeItemCallback'
  
  get 'products/post'
  match 'products/post', to: 'products#post'
  
  get 'products/postCallback'
  match 'products/postCallback', to: 'products#postCallback'
  
  
  get 'admin/importProduct'
  match 'impProduct', to: 'admin#importProduct'
  
  get 'admin/importProductExcelProcess'
  match 'impProductProcess', to: 'admin#importProductExcelProcess'
  
  get 'collections/pshow'
  match 'collections/pshow/:id', to: 'collections#pshow'
  
  match 'search', to: 'main#search'
  
  get 'main' => 'main#index', :as => 'main'
  match 'main/itemListCallback', to: 'main#itemListCallback'

  get 'clip/post'
  match 'clip/post', to: 'clip#post'
  
  get 'clip/new'
  match 'clip', to: 'clip#new'
  
  get 'wishes/put'
  match 'wishes/put', to: 'wishes#put'
  
  get 'gets/put'
  match 'gets/put', to: 'gets#put'

  get 'collections/publish'
  match 'collections/publish', to: 'collections#publish'
  
  get 'collections/set'
  match 'collections/set', to: 'collections#set'
  
  get 'collections/collect'
  match 'collections/collect', to: 'collections#collect'

  get 'sessions/createpop'
  match 'sessions/createpop', to: 'sessions#createpop'
  
  get 'sessions/login'
  
  get 'log_out' => 'sessions#destroy', :as => 'log_out'
  get 'log_in' => 'sessions#login', :as => 'log_in'
  get 'login_pop' => 'sessions#login_pop', :as => 'login_pop'
  get 'sign_up' => 'sessions#sign_up', :as => 'sign_up'
  post 'sign_up_complete' => 'sessions#sign_up_complete', :as => 'sign_up_complete'
  
  match 'auth/:provider/callback', to: 'sessions#fcreate'
  match 'auth/failure', to: redirect('/')
  match '/', to: 'main#index'
  
  get 'sessions/kcreate'
  match 'auth/kakao', to: 'sessions#kcreate'
  
  resources :sessions
  
  resources :products do
    collection {post :import}
  end
  
  resources :users
  resources :board_contents
  resources :collections
  resources :gets
  resources :wishes
  resources :collection_products
  resources :mypage
  resources :user_items
  resources :cates
  resources :follows
  resources :user_ranks
  resources :board_comments
  
  # scope '(:locale)' do
    # root :to => 'products#index', as: 'products'
  # end
  
  root :to=>'main#index'

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => 'welcome#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
