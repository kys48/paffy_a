require 'test_helper'

class BoardCommentsControllerTest < ActionController::TestCase
  setup do
    @board_comment = board_comments(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:board_comments)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create board_comment" do
    assert_difference('BoardComment.count') do
      post :create, board_comment: { comment_type: @board_comment.comment_type, contents: @board_comment.contents, ref_id: @board_comment.ref_id, reg_id: @board_comment.reg_id }
    end

    assert_redirected_to board_comment_path(assigns(:board_comment))
  end

  test "should show board_comment" do
    get :show, id: @board_comment
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @board_comment
    assert_response :success
  end

  test "should update board_comment" do
    put :update, id: @board_comment, board_comment: { comment_type: @board_comment.comment_type, contents: @board_comment.contents, ref_id: @board_comment.ref_id, reg_id: @board_comment.reg_id }
    assert_redirected_to board_comment_path(assigns(:board_comment))
  end

  test "should destroy board_comment" do
    assert_difference('BoardComment.count', -1) do
      delete :destroy, id: @board_comment
    end

    assert_redirected_to board_comments_path
  end
end
