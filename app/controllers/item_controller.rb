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

    #@products = Product.getApi(params)
    
    respond_to do |format|
      format.html # getProductApi.html.erb
      format.json { render json: @products }
    end
  end
  
  
  # product API ajax
  def getProductApiCallback
    params[:per_page] = params[:per_page]||16

    # 찜한 상품, 콜렉션
    @products = Product.getApi(params)
   
    respond_to do |format|
      #format.json { render json: @products.to_json }
      format.json { render :json => { status: true, products: @products }.to_json }
    end
  end
  
  
  
  
  
end
