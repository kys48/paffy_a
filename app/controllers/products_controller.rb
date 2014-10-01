#encoding: utf-8

require 'open-uri'
require 'uri'
include ApplicationHelper

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
    
    respond_to do |format|
      format.html # new.html.erb
    end

#respond_to do |format|
#    format.html { redirect_to "/log_in", notice: '로그인 후 이용하세요' }
#  end  


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
    
    result = @product.save
    
    if @product.img_file_name && @product.img_file_name!=''
      product_file_name = @product.img_file_name[0..@product.img_file_name.rindex(".")-1]+".png"
      @product.img_content_type = "image/png"

      dataFilePath = "/public/data/product/"
      tmpimg = Magick::Image.read(RAILS_ROOT+dataFilePath+"original/"+@product.img_file_name).first
        
      if tmpimg
        
        
        thumbSize = 650
        # 원본 이미지가 썸네일 이미지 사이즈보다 작을경우 원본이미지 사이즈 기준
        if tmpimg.columns>tmpimg.rows
          if thumbSize>tmpimg.columns
            thumbSize = tmpimg.columns
          end
        elsif tmpimg.columns<tmpimg.rows
          if thumbSize>tmpimg.rows
            thumbSize = tmpimg.rows
          end
        else
          if thumbSize>tmpimg.columns
            thumbSize = tmpimg.columns
          end
        end
        
        # 썸네일 이미지 사이즈,left,top 구하기 (이미지 가로세로 비율 맞춰서)
        ipos = Product.get_resize_fit(thumbSize,tmpimg.columns,tmpimg.rows)
        thumb = tmpimg.resize!(ipos[0],ipos[1])
        bg = Magick::Image.new(thumbSize, thumbSize){
          self.background_color = 'white'
          self.format = 'PNG'
        }
        bg.composite!(thumb, ipos[2], ipos[3], Magick::OverCompositeOp)
        bg.write(RAILS_ROOT+dataFilePath+'original/'+product_file_name)
    
        bg.resize!(220,220)
        bg.write(RAILS_ROOT+dataFilePath+'medium/'+product_file_name)
    
        bg.resize!(75,75)
        bg.write(RAILS_ROOT+dataFilePath+'thumb/'+product_file_name)
  
        # 이미지 배경제거 (remove_bg.bat 원본디렉토리 원본이미지 target디렉토리 배경제거비율)
        #%x{remove_bg.bat #{RAILS_ROOT+dataFilePath}original/ #{product_file_name} #{RAILS_ROOT+dataFilePath}removebg/ 7}
        #system "remove_bg.bat #{RAILS_ROOT+dataFilePath}original/ #{product_file_name} #{RAILS_ROOT+dataFilePath}removebg/ 7" 
        #system "rm -f #{RAILS_ROOT+dataFilePath}original/#{@product.img_file_name}"
        %x{sh remove_bg #{RAILS_ROOT+dataFilePath}original/ #{product_file_name} #{RAILS_ROOT+dataFilePath}removebg/ 7}
        %x{rm -f #{RAILS_ROOT+dataFilePath}original/#{@product.img_file_name}}

        @product.img_file_name = product_file_name
        @product.save!
        
      end
      
    end
    

    respond_to do |format|
      if result #@product.save
        format.html { redirect_to '/products/new', notice: '상품이 등록되었습니다.' }
        #format.html { render action: "new", notice: '상품이 등록되었습니다.' }
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
		per_page = params[:per_page]||25
		
		products = Product.productList(params)
		total_count = Product.productListCount(params)
		
		page_str = getPagging("goPage",total_count.to_i,page.to_i,per_page.to_i,5)
		
		respond_to do |format|
			#format.json { render json: @collections.to_json }
			format.json { render :json => { status: true, products: products, total_count: total_count, page_str: page_str }.to_json }
		end
	end
  
	# 마이페이지 ajax
	def myProductListCallback
		profile_id = session[:profile_id]
		page = params[:page]||1
		item_type = params[:type]
		#user = User.where(profile_id: @profile_id).first
		
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
