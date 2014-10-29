#encoding: utf-8

class MainController < ApplicationController
  
  def index
	#UserMailer.welcome_email("kys48@mediopia.co.kr","메일발송테스트","메일메일~날라가~!").deliver
  	#sleep 2
    cmenu = params[:cmenu]||"1"
    cmenu_sub = params[:cmenu_sub]||"1"
    params[:cmenu] = cmenu
    params[:cmenu_sub] = cmenu_sub
    
    @session_user_id = session[:user_id]||""
    @item_type = params[:type]||""
    @style_type = params[:style_type]||""
    @store_type = params[:store_type]||""
    params[:per_page] = 15
    #params[:order] = " RAND() "
    #params[:order] = " created_at DESC "
    params[:order] = " hit DESC "
    
    # 추천 스토어 list
    search_params = Hash.new
    search_params[:page] = 1
    search_params[:per_page] = 10
    search_params[:rank_type] = "recommend"
    search_params[:store_type] = "FB"
    
    @store_list0 = UserRank.storeList(search_params)
    
    search_params[:store_type] = "OM"
    @store_list1 = UserRank.storeList(search_params)
    
    search_params[:store_type] = "WF"
    @store_list2 = UserRank.storeList(search_params)
    
    search_params[:store_type] = "AK"
    @store_list3 = UserRank.storeList(search_params)
    
    search_params[:store_type] = "BH"
    @store_list4 = UserRank.storeList(search_params)
    
    @currency_usd = 0
    @currency_jpy = 0
    @currency_eur = 0
    @currency_gbp = 0
    @currency_cny = 0

	if @item_type!="C"
=begin
		#느리다... 
		xmlurl = "http://www.webservicex.net/CurrencyConvertor.asmx/ConversionRate?FromCurrency=USD&ToCurrency=KRW"
		xml = Nokogiri::XML(open(URI.parse(xmlurl)))
		@currency_usd = xml.search("double").inner_html.to_s
		
		xmlurl = "http://www.webservicex.net/CurrencyConvertor.asmx/ConversionRate?FromCurrency=JPY&ToCurrency=KRW"
		xml = Nokogiri::XML(open(URI.parse(xmlurl)))
		@currency_jpy = xml.search("double").inner_html.to_s
		
		xmlurl = "http://www.webservicex.net/CurrencyConvertor.asmx/ConversionRate?FromCurrency=EUR&ToCurrency=KRW"
		xml = Nokogiri::XML(open(URI.parse(xmlurl)))
		@currency_eur = xml.search("double").inner_html.to_s
		
		xmlurl = "http://www.webservicex.net/CurrencyConvertor.asmx/ConversionRate?FromCurrency=GBP&ToCurrency=KRW"
		xml = Nokogiri::XML(open(URI.parse(xmlurl)))
		@currency_gbp = xml.search("double").inner_html.to_s
		
		xmlurl = "http://www.webservicex.net/CurrencyConvertor.asmx/ConversionRate?FromCurrency=CNY&ToCurrency=KRW"
		xml = Nokogiri::XML(open(URI.parse(xmlurl)))
		@currency_cny = xml.search("double").inner_html.to_s

    	
      @currency_usd = GoogCurrency.usd_to_krw(1).to_i
      @currency_jpy = GoogCurrency.jpy_to_krw(1).to_i
      @currency_eur = GoogCurrency.eur_to_krw(1).to_i
      @currency_gbp = GoogCurrency.gbp_to_krw(1).to_i
      @currency_cny = GoogCurrency.cny_to_krw(1).to_i
=end
		# 환율정보를 가져온다
		sysconfigs = Sysconfig.where(config_type: "currency", use_yn: "Y")
		sysconfigs.each do |sysconfig|
			if sysconfig.config_key=="USD"
				@currency_usd = sysconfig.config_value 
			elsif sysconfig.config_key=="JPY"
				@currency_jpy = sysconfig.config_value
			elsif sysconfig.config_key=="EUR"
				@currency_eur = sysconfig.config_value
			elsif sysconfig.config_key=="GBP"
				@currency_gbp = sysconfig.config_value
			elsif sysconfig.config_key=="CNY"
				@currency_cny = sysconfig.config_value
			end
		end

    end

    # 찜한 상품, 콜렉션
    params[:session_user_id] = @session_user_id
    
    if params[:cmenu_sub]=="2" || params[:cmenu_sub]=="3" || params[:cmenu_sub]=="4"
    	params[:limit_hit] = 0  # hit수가 0이상인 상품만 뿌려준다
    else
    	params[:limit_hit] = 2  # hit수가 2이상인 상품만 뿌려준다
    end
    
    @limit_hit = params[:limit_hit]
    params[:use_yn] = "Y"
    params[:order] = " A.hit DESC "
    @collections = Collection.mainItemList(params)
    @collectionSize = @collections.size
    @cateList = Cate.all()

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @collections }
    end
  end
  
  # 메인페이지 ajax
  def itemListCallback
    params[:session_user_id] = session[:user_id]
    page = params[:page]||1
    item_type = params[:type]||"P"
    params[:per_page] = 16

    # 찜한 상품, 콜렉션
    collectionList = Collection.mainItemList(params)

    respond_to do |format|
      format.json { render :json => { status: true, collections: collectionList }.to_json }
    end
  end
  
	# 통합검색
	def search
		@search_key = params[:search_key]
		@session_user_id = session[:user_id]||""
    
		@currency_usd = 0
		@currency_jpy = 0
		@currency_eur = 0
		@currency_gbp = 0
		@currency_cny = 0

		# 환율정보를 가져온다
		sysconfigs = Sysconfig.where(config_type: "currency", use_yn: "Y")
		sysconfigs.each do |sysconfig|
			if sysconfig.config_key=="USD"
				@currency_usd = sysconfig.config_value 
			elsif sysconfig.config_key=="JPY"
				@currency_jpy = sysconfig.config_value
			elsif sysconfig.config_key=="EUR"
				@currency_eur = sysconfig.config_value
			elsif sysconfig.config_key=="GBP"
				@currency_gbp = sysconfig.config_value
			elsif sysconfig.config_key=="CNY"
				@currency_cny = sysconfig.config_value
			end
		end
    
		@cateList = Cate.all()
    
		respond_to do |format|
			format.html # index.html.erb
			format.json { render json: @collections }
		end
	end
  
  
end
