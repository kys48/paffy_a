#encoding: utf-8

module ApplicationHelper
	def pageless(total_pages, url=nil, container=nil)
		opts = {
			:totalPages => total_pages,
			:url        => url,
			:loaderMsg  => 'Loading more pages',
			:loaderImage => image_path("load.gif")
		}
		container && opts[:container] ||= container

		javascript_tag("$('#products').pageless(#{opts.to_json});")
	end
  
  
  
	def randomize_file_name
		return ActiveSupport::Deprecation::DeprecatedConstantProxy.new('ActiveSupport::SecureRandom', ::SecureRandom).hex(16)
	end
  
	# 썸네일 이미지 사이즈,left,top 구하기 (이미지 가로세로 비율 맞춰서)
	def get_resize_fit(rsize,iwidth,iheight)
		isize = [] 
		iw = rsize
		ih = rsize
		if iwidth > iheight
			iw = rsize
			ih = (iheight*rsize)/iwidth
		elsif iwidth < iheight
			iw = (iwidth*rsize)/iheight
			ih = rsize
		end
		isize[0] = iw
		isize[1] = ih
		isize[2] = (rsize-isize[0].to_i)/2  # 정사각형 이미지배경에서 위치될 썸네일 left
		isize[3] = (rsize-isize[1].to_i)/2  # 정사각형 이미지배경에서 위치될 썸네일 top

		return isize
	end

	# 원본 이미지의 색상표이미지를 만든다
	def sort_by_decreasing_frequency(img)
		hist = img.color_histogram
		# sort by decreasing frequency
		sorted = hist.keys.sort_by {|p| -hist[p]}
		new_img = Magick::Image.new(hist.size, 1)
		 
		new_img.store_pixels(0, 0, hist.size, 1, sorted)
	end
   
	# 색상표이미지에서 두번째 색상hex값을 넘겨준다
	def get_pix(img)
		pixels = img.get_pixels(0, 0, img.columns, 1)
		color = ""
		if pixels.size<2
			color = pixels.first.to_color(Magick::AllCompliance, false, 8, true)
		else
			color = pixels.second.to_color(Magick::AllCompliance, false, 8, true)
		end
=begin
    # 첫번째 색상이 ffffff면 두번째 색상을 가져옴(기본적으로 첫번째 색상)
    color_hex=""
    pixels.each_with_index do |p,i|
      if i<2
        hex = p.to_color(Magick::AllCompliance, false, 8, true)
        puts hex
        if i==0 && hex!="#ffffff"
          color_hex = hex
        end
          
        if i>0 && color_hex==""
          color_hex = hex
        end
        
      end
    end
=end
		return color.gsub(/#/,'')
	end
  
	# 이미지의 대표 색상표와 가까운 값을 가져온다
	def get_product_color(img_file_name)
		colors = {}
      
      begin
			dataFilePath = "/public/data/product/"
			original = Magick::Image.read(RAILS_ROOT+dataFilePath+"removebg/"+img_file_name).first
        
			if original
				bg = Magick::Image.new(original.columns, original.rows){
					#self.background_color = '3366ff'
					self.background_color = 'transparent'
					self.format = 'PNG'
				}
           
				# reduce number of colors
				quantized = original.quantize(10, Magick::RGBColorspace)
				
				bg.composite!(quantized, 0, 0, Magick::OverCompositeOp)
				#bg.write(RAILS_ROOT+dataFilePath+"tmp.png")
				 
				# Create an image that has 1 pixel for each of the top_n colors.
				normal = Product.sort_by_decreasing_frequency(bg)
				#normal.write(RAILS_ROOT+dataFilePath+"tmp2.png")
				color_hex = Product.get_pix(normal)

=begin  
          # polyvore
          base_palette = [
          "660000", "de6318", "d3d100", "8c8c00", "293206", "34e3e5", "205260", "1c0946", "46008c", "33151a", "e30e5c", "3d1f00", "5e1800", "000000",
          "980000", "ff7f00", "ffff00", "88ba41", "006700", "65f3c9", "318c8c", "31318c", "5e318c", "520f41", "ff59ac", "8c5e31", "8c4600", "505050",
          "ff0000", "ffa000", "eed54f", "778c62", "00ae00", "77f6a7", "628c8c", "4a73bd", "77628c", "840e47", "ef8cae", "8e7032", "d1b45b", "828283",
          "e32636", "ffc549", "ffff6d", "8c8c62", "00ff00", "b2ffff", "62778c", "589ad5", "ac59ff", "8c6277", "ead0cd", "8c7762", "e2db9a", "b5b5b6",
          "fa624d", "ffc898", "ffffae", "96d28a", "a9ff00", "d8ffb2", "bdd6bd", "a1c4e9", "a297e9", "c6a5b6", "ffdfef", "c69c7b", "ffffff", "e7e7e7"
          ]
    
          # polyvore - lite
          base_palette = ["660000", "34e3e5", "46008c", "000000", "ffff00",
                          "88ba41", "006700", "318c8c", "31318c", "ff59ac",
                          "8c5e31", "8c4600", "ff0000", "ffa000", "840e47",
                          "00ff00", "ac59ff", "b5b5b6","ffffff"]
                          
                          
          # naver
          base_palette = ["ee1919", "f4aa24", "f4d324", "f3f424", "a5dd0c", "37b300",
                          "97d0e8", "3232ff", "1e2d87", "ffffff", "c6c6c6", "000000"]
  
=end
  
				base_palette = ["ff0000", "f49024", "ffff00", "a5dd0c", "009900",  
									"08d6d8", "3232ff", "31318c", "8d1bff", "8d0647",  
									"ff59ac", "772a00", "ffffff", "b5b5b5", "000000"]

				color1 = Paleta::Color.new(:hex, color_hex)
				pal = Array.new(base_palette.size) {Array.new(2,nil)}
				
				base_palette.each_with_index do |base_hex,i|
					color2 = Paleta::Color.new(:hex, base_hex)
					score = color1.similarity(color2)
					pal[i][0] = score
					pal[i][1] = base_hex
				end

				# 가장 근접한 색상코드로 정렬
				palette_sort = pal.sort_by{|x| x[0]}
				colors[0] = color_hex.to_s  # 이미지에서 추출한 대표색상코드
				colors[1] = palette_sort.first.second.to_s  # 기본 색상표랑 가장 근접한 색상코드
			end

		rescue
			puts("error file : #{img_file_name}")
		end

		return colors
	end

	# domain 명 추출
	def domain_name(url)
		domain = url.split(".")
		chk_www = url.index("www.")||-1
		retVal = ""
		if chk_www.to_i>-1
			retVal = domain[1]
		else
			domain_names = domain[0].split("/")
			retVal	= domain_names[domain_names.count-1]
		end
		
		retVal = retVal.gsub(/\'/,'’') 
		retVal = retVal.gsub(/&/,'＆')
		retVal = retVal.gsub(/\./,'·')
		return retVal
	end

	# 페이징
	def getPagging(func_name,total_count,cpage,per_page,page_cnt)
		total_page_count = (total_count / per_page) + 1
		
		cpage_cnt = (cpage.to_f / page_cnt.to_f).ceil
		
		next_page = (cpage_cnt * page_cnt) + 1
		
		if next_page>total_page_count
			next_page = total_page_count
		end
		
		spage = (cpage_cnt-1)*page_cnt + 1
		epage = (cpage_cnt*page_cnt)
		if epage>total_page_count
			epage = total_page_count
		end
		
		prev_page = spage - 1
		if prev_page<1
			prev_page = 1
		end

=begin		
		page_str  = '<div class="btn-toolbar" style="text-align:center">'
		page_str += '	<div class="btn-group">'
		page_str += '		<a class="btn" href="javascript:'+func_name+'('+prev_page.to_s+');">&nbsp;<i class="icon-chevron-left"></i>&nbsp;</a>'
		
		(spage..epage).each do |i|
			if cpage.to_i==i
				page_str += '		<a class="btn btn-warning" href="javascript:'+func_name+'('+i.to_s+');">'+i.to_s+'</a>'
			else
				page_str += '		<a class="btn" href="javascript:'+func_name+'('+i.to_s+');">'+i.to_s+'</a>'
			end
		end
		
		page_str += '		<a class="btn" href="javascript:'+func_name+'('+next_page.to_s+');">&nbsp;<i class="icon-chevron-right"></i>&nbsp;</a>'
		page_str += '	</div>'
		page_str += '</div>'
=end
		
		page_str  = '<div class="pagination pagination-small pagination-centered">'
		page_str += '	<ul>'
		page_str += '		<li><a href="javascript:'+func_name+'(1);">&nbsp;<i class="icon-backward"></i>&nbsp;</a></li>'
		page_str += '		<li><a href="javascript:'+func_name+'('+prev_page.to_s+');">&nbsp;<i class="icon-chevron-left"></i>&nbsp;</a></li>'
		
		(spage..epage).each do |i|
			if cpage.to_i==i
				page_str += '		<li><a class="btn-warning" href="javascript:'+func_name+'('+i.to_s+');">'+i.to_s+'</a></li>'
			else
				page_str += '		<li><a href="javascript:'+func_name+'('+i.to_s+');">'+i.to_s+'</a></li>'
			end
		end
		
		page_str += '		<li><a href="javascript:'+func_name+'('+next_page.to_s+');">&nbsp;<i class="icon-chevron-right"></i>&nbsp;</a></li>'
		page_str += '		<li><a href="javascript:'+func_name+'('+total_page_count.to_s+');">&nbsp;<i class="icon-forward"></i>&nbsp;</a></li>'
		page_str += '	</ul>'
		page_str += '</div>'
		
		return page_str
	end
  
end
