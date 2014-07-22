require 'test_helper'

class CollectionProductsControllerTest < ActionController::TestCase
  setup do
    @collection_product = collection_products(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:collection_products)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create collection_product" do
    assert_difference('CollectionProduct.count') do
      post :create, collection_product: { collection_id: @collection_product.collection_id, cssleft: @collection_product.cssleft, csstop: @collection_product.csstop, flip: @collection_product.flip, flop: @collection_product.flop, height: @collection_product.height, left: @collection_product.left, product_id: @collection_product.product_id, rotate: @collection_product.rotate, top: @collection_product.top, white_bck: @collection_product.white_bck, zindex: @collection_product.zindex }
    end

    assert_redirected_to collection_product_path(assigns(:collection_product))
  end

  test "should show collection_product" do
    get :show, id: @collection_product
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @collection_product
    assert_response :success
  end

  test "should update collection_product" do
    put :update, id: @collection_product, collection_product: { collection_id: @collection_product.collection_id, cssleft: @collection_product.cssleft, csstop: @collection_product.csstop, flip: @collection_product.flip, flop: @collection_product.flop, height: @collection_product.height, left: @collection_product.left, product_id: @collection_product.product_id, rotate: @collection_product.rotate, top: @collection_product.top, white_bck: @collection_product.white_bck, zindex: @collection_product.zindex }
    assert_redirected_to collection_product_path(assigns(:collection_product))
  end

  test "should destroy collection_product" do
    assert_difference('CollectionProduct.count', -1) do
      delete :destroy, id: @collection_product
    end

    assert_redirected_to collection_products_path
  end
end
