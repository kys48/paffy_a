#encoding: utf-8

require 'nokogiri'
require 'uri'
require 'erb'
include ERB::Util

class ItemController < ApplicationController
  
  # product API 이용
  def getProductApi
    @search_key = params[:search_key]||""
    params[:page] = params[:page]||1
    params[:per_page] = params[:per_page]||16
    params[:cmenu] = "2"

    respond_to do |format|
      format.html # getProductApi.html.erb
      #format.json { render json: @search_key }
    end
  end
  
  
  # shopstyle API ajax
  def getShopStyleCallback
    params[:per_page] = params[:per_page]||16
    params[:save_yn] = "Y"
    
puts params
    
puts("start{#{params[:page]}} : #{Time.zone.now}")

    # 찜한 상품, 콜렉션
    productList = Product.getItemListApi(params)
   
puts("end : #{Time.zone.now}")   
   
    respond_to do |format|
      #format.json { render json: productList.to_json }
      format.json { render :json => { status: true, products: productList }.to_json }
    end
  end
  
  
end
