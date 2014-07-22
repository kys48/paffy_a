require 'test_helper'

class BoardContentsControllerTest < ActionController::TestCase
  setup do
    @board_content = board_contents(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:board_contents)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create board_content" do
    assert_difference('BoardContent.count') do
      post :create, board_content: { contents: @board_content.contents, hit_no: @board_content.hit_no, reg_id: @board_content.reg_id, reg_name: @board_content.reg_name, reg_passwd: @board_content.reg_passwd, subject: @board_content.subject }
    end

    assert_redirected_to board_content_path(assigns(:board_content))
  end

  test "should show board_content" do
    get :show, id: @board_content
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @board_content
    assert_response :success
  end

  test "should update board_content" do
    put :update, id: @board_content, board_content: { contents: @board_content.contents, hit_no: @board_content.hit_no, reg_id: @board_content.reg_id, reg_name: @board_content.reg_name, reg_passwd: @board_content.reg_passwd, subject: @board_content.subject }
    assert_redirected_to board_content_path(assigns(:board_content))
  end

  test "should destroy board_content" do
    assert_difference('BoardContent.count', -1) do
      delete :destroy, id: @board_content
    end

    assert_redirected_to board_contents_path
  end
end
