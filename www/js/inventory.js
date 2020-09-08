var $ajax_request = {};
var $available_stocks=0;
var $inventory_allow_negative_order=0;

ons.ready(function() {
	 $( document ).on( "click", ".radio-button--inv_price__input", function() {	 	
	 	getStocks( $(this).val() );
	 });
	 
	 $( document ).on( "click", ".inv_qty_plus", function() {					
		if ((typeof $(this).attr("disabled") !== "undefined") && ($(this).attr("disabled") !== null)) {			
			return;
		}
		$qty = parseFloat( $("#qty").val())+1;	
		InvSetQuantity( $qty )	;
	});
	
	$( document ).on( "click", ".inv_qty_minus", function() {
		if ((typeof $(this).attr("disabled") !== "undefined") && ($(this).attr("disabled") !== null)) {			
			return;
		}
		$qty = parseFloat( $("#qty").val())-1;				
		InvSetQuantity( $qty )	;	
	});
	
});
/*end ready*/

initStocks = function(){
	inv_price = $('.radio-button--inv_price__input:checked').val();
	getStocks(inv_price);
};

getStocks = function(price){	
	
	inventory_enabled = getStorage("inventory_enabled");
	if(inventory_enabled!=1){
		return;
	}
	
	merchant_id = getActiveMerchantID();
	with_size = $(".with_size").val();
	
	data = "price="+ price ;
	data+="&item_id="+  $("input[name=item_id]").val();	
	data+="&with_size="+ with_size;
	data+="&merchant_id="+  merchant_id;
	
	var $timenow = 1;
	endpoint = ajax_url+"/getStocks";
	data+=requestParams("getStocks");
	
	$ajax_request[$timenow] = $.ajax({
	   url: endpoint ,
	   method: "POST" ,
	   data: data ,
	   dataType: "json",
	   timeout: ajax_timeout ,
	   crossDomain: true,
	   beforeSend: function( xhr ) {
	   	  if($ajax_request[$timenow] != null) {	
	   	  	$ajax_request[$timenow].abort(); 
	   	  } else { 
	   	  	//showLoader(true);
	   	  	$("#item_details ons-button").attr("disabled",true);
	   	  } 
	   }		
	});
	
	$ajax_request[$timenow].done(function( data ) {
		dump("inventory ajax done"); 
		dump(data);
		$(".remaining_stock").html( '' );		
		$("#item_details ons-button").attr("disabled",false);
		
		if ( data.code==1){
			switch (data.details.next_action){
				case "display_stocks":
				
				$inventory_allow_negative_order = data.details.allow_negative_stock;
     			if($inventory_allow_negative_order){
     			   return;
     			}
     			
     			$(".remaining_stock").html( data.details.message );
     			$available_stocks = parseFloat(data.details.available_stocks);     			  
     			if(data.details.available_stocks<=0){
     			   $(".remaining_stock").addClass("out_of_stock");
     			} else {
     			   $(".remaining_stock").removeClass("out_of_stock");
     			}
     			
     			initial_qty = parseFloat($("#qty").val());      	
     			if (isNaN(initial_qty)) {
     			   InvSetQuantity(1);
     			} else {     			  	
     			   InvSetQuantity(initial_qty);
     			}     			  
				
				break;
			}
		} else {
			dump("failed inventory");
     		switch (data.details.next_action){
     			case "item_not_available":
     			case "item_info_not_available":     
     			  $(".remaining_stock").addClass("out_of_stock");			  
     			  $(".remaining_stock").html( data.msg );
     			  
     			  $(".inv_qty_minus").attr("disabled", true);
		          $(".inv_qty_plus").attr("disabled",true);
		          $(".add_to_cart").attr("disabled",true);
		          $("#qty").val(1);
     			break;
     		}
		}
	});
	/*end done*/
	
	$ajax_request[$timenow].always(function() {    	
        dump("inventory ajax always");               
        //showLoader(false) ;
        $ajax_request[$timenow]=null;         
    });
          
    $ajax_request[$timenow].fail(function( jqXHR, textStatus ) {        	
        dump("inventory failed "+ textStatus);
    }); 
	
};
/*end getstocks*/

InvSetQuantity = function($qty){
	
	inventory_enabled = getStorage("inventory_enabled");
	if(inventory_enabled!=1){		
		if($qty<=1){
		   $qty = 1;
		}
		$("#qty").val($qty);
		return;
	}
		
	
	if($inventory_allow_negative_order){		
		if($qty<=1){
		   $qty = 1;
		}
		$("#qty").val($qty);
		return;
	}
	
	if($available_stocks<=0){			
		$(".inv_qty_minus").attr("disabled", true);
		$(".inv_qty_plus").attr("disabled",true);
		$(".add_to_cart").attr("disabled",true);
		return;
	}
	
	if($qty<=1){
		$qty = 1;
		$(".inv_qty_minus").attr("disabled", true);
	} else {
		$(".inv_qty_minus").attr("disabled", false);
	}
	
	if($qty>=$available_stocks){		
		$("#qty").val($available_stocks);
		$(".inv_qty_plus").attr("disabled",true);
		return;
	} else {
		$(".inv_qty_plus").attr("disabled",false);
	}
	
	$("#qty").val($qty);
};