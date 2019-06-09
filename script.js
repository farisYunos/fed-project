var default_content="";

$(document).ready(function(){

	checkURL();
	$('ul li a').click(function (e){
			checkURL(this.hash);
	});

	//filling in the default content
	default_content = $('#pageContent').html();


	setInterval("checkURL()",750);

});

var lasturl="";

function checkURL(hash)
{
	if(!hash) hash=window.location.hash;

	if(hash != lasturl)
	{
		lasturl=hash;
		// FIX - if we've used the history buttons to return to the homepage,
		// fill the pageContent with the default_content
		if(hash=="")
		$('#pageContent').html(default_content);

		else{
		 if(hash=="#products")
			 loadProducts();
			else if(hash.includes("#product_")){
				loadProdDetail(hash);
			}
		 else{	 
				loadPage(hash);
		 }
		  
		}
	}
}


function loadPage(url)
{
	url=url.replace('#page','');

	$('#loading').css('visibility','visible');

	$.ajax({
		type: "POST",
		url: "load_page.jsp",
		data: 'page='+url,
		dataType: "html",
		success: function(msg){

			if(parseInt(msg)!=0)
			{
				$('#pageContent').html(msg);
				$('#loading').css('visibility','hidden');
			}
		}

	});

}
//loading of course page
function loadProducts() {
	$('#loading').css('visibility','visible');
	var jsonURL = "products.json";
	$.getJSON(jsonURL, function (json)
	{
	  var imgList= "<ul class=\"products\">";
	  $.each(json.products, function () {
		imgList += '<li><a href="#product_' + this.id + '"> <img src= "' + this.imgPath + '"><h3>' + this.name + '</h3></a></li>';
	  });
	  imgList+='</ul>';
	 $('#pageContent').html(imgList);
	 $('#loading').css('visibility','hidden');
	});
	}


//load course details
function loadProdDetail(hash){
	var data = "products.json";
	var data2 = "currencies.json";
	var price = 0;
	var currency = $('#currencyview').val();
	var myid = hash.replace("#product_", "");
	var str = '<ul class="prodDetails">' + '<li id="img-path"></li>' + 
						'<li id="title"></li>' + 
                        '<li id="descript"></li>' +
                        '<li id="schedule"></li>' +
						'<li id="price"></li>';
	$("#pageContent").html(str);
	$.ajax({
		url: data,
		// dataType: "json",
		success: function(data){
			$.each(data.products, function(id){
				// console.log(this.id); Testing id 
				if(this.id == myid){
					// console.log(this.name); Test the name provided on console
				$("#img-path").html('<img src ="' + this.imgPath + '">');
				$("#title").html('<h3>' + this.name + '</h3>');
				$("#descript").html('Description: ' + this.description);
                $("#schedule").html("Schedule: " + this.schedule);
								 price = this.price;
																					
				}
			})
		},
	});
// duplicating same method from loading list to amend currency view
// style of currency change regards to user experience can be improved
// user has to pre-select currency to view in which is not good
	$.ajax({
		url: data2,
		// dataType: "json",
		success: function(data2){
	$.each(data2.currencies, function(code){
								
		if(this.code == currency){
		var convrate = this.conversion * price;
		$("#price").html("Price: " + currency + " " + convrate + "/semester");
		
		}
	})	
},
});
	
}


