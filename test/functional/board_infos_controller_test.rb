require 'test_helper'

class BoardInfosControllerTest < ActionController::TestCase
  setup do
    @board_info = board_infos(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:board_infos)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create board_info" do
    assert_difference('BoardInfo.count') do
      post :create, board_info: { bbs_name: @board_info.bbs_name, bbs_type: @board_info.bbs_type, file_yn: @board_info.file_yn, subject: @board_info.subject }
    end

    assert_redirected_to board_info_path(assigns(:board_info))
  end

  test "should show board_info" do
    get :show, id: @board_info
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @board_info
    assert_response :success
  end

  test "should update board_info" do
    put :update, id: @board_info, board_info: { bbs_name: @board_info.bbs_name, bbs_type: @board_info.bbs_type, file_yn: @board_info.file_yn, subject: @board_info.subject }
    assert_redirected_to board_info_path(assigns(:board_info))
  end

  test "should destroy board_info" do
    assert_difference('BoardInfo.count', -1) do
      delete :destroy, id: @board_info
    end

    assert_redirected_to board_infos_path
  end
end
