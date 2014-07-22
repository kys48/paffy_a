require 'test_helper'

class UserRanksControllerTest < ActionController::TestCase
  setup do
    @user_rank = user_ranks(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:user_ranks)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create user_rank" do
    assert_difference('UserRank.count') do
      post :create, user_rank: { follow_count: @user_rank.follow_count, product_count: @user_rank.product_count, rank: @user_rank.rank, store_type: @user_rank.store_type, user_id: @user_rank.user_id, user_type: @user_rank.user_type }
    end

    assert_redirected_to user_rank_path(assigns(:user_rank))
  end

  test "should show user_rank" do
    get :show, id: @user_rank
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @user_rank
    assert_response :success
  end

  test "should update user_rank" do
    put :update, id: @user_rank, user_rank: { follow_count: @user_rank.follow_count, product_count: @user_rank.product_count, rank: @user_rank.rank, store_type: @user_rank.store_type, user_id: @user_rank.user_id, user_type: @user_rank.user_type }
    assert_redirected_to user_rank_path(assigns(:user_rank))
  end

  test "should destroy user_rank" do
    assert_difference('UserRank.count', -1) do
      delete :destroy, id: @user_rank
    end

    assert_redirected_to user_ranks_path
  end
end
