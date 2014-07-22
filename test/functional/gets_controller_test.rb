require 'test_helper'

class GetsControllerTest < ActionController::TestCase
  setup do
    @get = gets(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:gets)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create get" do
    assert_difference('Get.count') do
      post :create, get: { get_type: @get.get_type, item_type: @get.item_type, ref_id: @get.ref_id, user_id: @get.user_id }
    end

    assert_redirected_to get_path(assigns(:get))
  end

  test "should show get" do
    get :show, id: @get
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @get
    assert_response :success
  end

  test "should update get" do
    put :update, id: @get, get: { get_type: @get.get_type, item_type: @get.item_type, ref_id: @get.ref_id, user_id: @get.user_id }
    assert_redirected_to get_path(assigns(:get))
  end

  test "should destroy get" do
    assert_difference('Get.count', -1) do
      delete :destroy, id: @get
    end

    assert_redirected_to gets_path
  end
end
