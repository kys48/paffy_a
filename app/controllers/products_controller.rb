#encoding: utf-8

require 'open-uri'
require 'uri'

class ProductsController < ApplicationController
  before_filter :set_product, only: [:show, :edit, :update, :destroy]
  skip_before_filter :authorize
  
  # GET /products
  # GET /products.json
  def index
    @products = Product.paginate(page: params[:page], per_page: 32).order('created_at DESC')

    if request.xhr?
      sleep(1)
      render :partial => @products
    else
      respond_to do |format|
        format.html # index.html.erb
        format.json { render json: @products }
      end
    end

    
  end

  # GET /products/1
  # GET /products/1.json
  def show
    #@product = Product.find(params[:id]) #하단에서 미리 선언
    redirect_to "/collections/pshow/"+params[:id]
=begin
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @product }
    end
=end
  end

  # 상품 url 포스팅하기
  def post
    params[:cmenu] = "5"
    params[:cmenu_sub] = "1"
    
    if session[:user_id]
      respond_to do |format|
        format.html # new.html.erb
      end
    else
      respond_to do |format|
        format.html { redirect_to "/log_in", notice: '로그인 후 이용하세요' }
      end  
    end
  end
  
  # 상품 url 포스팅하기
  def postCallback
    product_url = params[:url]
    uri = URI(product_url)
    product_domain = uri.host
    item_title = ""
    item_img = ""

    #scrap = Grabbit.url(product_url)
    scrap = MetaInspector.new(product_url)
    
    #item_title = scrap.title
    
    scrap.images.each do |imgsrc|
      if !imgsrc.index(".gif")
        item_img += '<img src="'+imgsrc+'">'
      end
    end

    respond_to do |format|
      format.json { render :json => { status: true, url: product_url, domain: product_domain, item_img: item_img, item_title: item_title }.to_json }
    end
  end

  # GET /products/new
  # GET /products/new.json
  def new
    @product = Product.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @product }
    end
  end

  # GET /products/1/edit
  def edit
    #@product = Product.find(params[:id]) #하단에서 미리 선언
  end

  # POST /products
  # POST /products.json
  def create
    @product = Product.new(params[:product])

    respond_to do |format|
      if @product.save
        format.html { redirect_to @product, notice: '상품이 등록되었습니다.' }
        format.json { render :show, status: :created, location: @product }
      else
        format.html { render action: "new" }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /products/1
  # PUT /products/1.json
  def update
    #@product = Product.find(params[:id]) #하단에서 미리 선언

    respond_to do |format|
      if @product.update_attributes(params[:product])
        format.html { redirect_to @product, notice: '상품이 수정되었습니다.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /products/1
  # DELETE /products/1.json
  def destroy
    #@product = Product.find(params[:id]) #하단에서 미리 선언
    @product.destroy

    respond_to do |format|
      format.html { redirect_to products_url }
      format.json { head :no_content }
    end
  end
  
  # 상품 리스트 ajax
  def productListCallback
    page = params[:page]||1

    products = Product.productList(params)

    respond_to do |format|
      #format.json { render json: @collections.to_json }
      format.json { render :json => { status: true, products: products }.to_json }
    end
  end
  
  # 마이페이지 ajax
  def myProductListCallback
    profile_id = session[:profile_id]
    page = params[:page]||1
    item_type = params[:type]
    #user = User.where(profile_id: @profile_id).first
puts params[:myfeed]
    # 찜한 상품, 콜렉션
    collections = Collection.new
    if profile_id
      params[:id] = profile_id
      params[:myfeed] = "Y"
      collections = Collection.itemList(params)
    end
    
    respond_to do |format|
      #format.json { render json: @collections.to_json }
      format.json { render :json => { status: true, products: collections }.to_json }
    end
  end

  
  private

  # Use callbacks to share common setup or constraints between actions.
  def set_product
    @product = Product.find(params[:id])
  end
    
end
