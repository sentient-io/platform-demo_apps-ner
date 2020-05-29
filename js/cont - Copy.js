	var endpointurl = 'https://ner.sentient.io/api/ner';
	var callType = "AJAX";
	var contentType = "application/json";
	var inputjson = "";
	var locList = '';
	var orgList = '';
	var perList = '';
	var othersList = '';
	var w,x,y,z = '';
	
	function contentCount(){
		var textinput = document.getElementById('textinput').value;
		document.getElementById('count').innerHTML = "<span class='reset'>Characters left: " + (textinput.length + " / 2000")+"</span>";
		document.getElementById('clearTxt').innerHTML = "<span class='reset'>Clear</span>";
		
		if(textinput.length >0){
			$('.reset').css({"color":"#424143"});
		}
		
		if (textinput.length >= 2001) {
			$("#confirmation-modal").modal();
			document.getElementById("errorTxt").innerHTML = "Content allow upto 2000 Characters. Please Try Again...";
			return false;
		}
	}
	
	function sendBtn(){
		var locList = '';
		var orgList = '';
		var perList = '';
		var othersList = '';
		var w,x,y,z = '';
		document.getElementById("responseDiv").style.display = "none";
		var textinput = document.getElementById('textinput').value;
		var inputjsonRemoveSpace = textinput.replace(/\s+/g, " ");
		var removesplchar = inputjsonRemoveSpace.replace(/[^a-zA-Z ]/g, "");
		var inputjson = '{"text": "'+removesplchar+'"}';
		if(textinput == undefined || textinput == null || textinput == ""){ 	
			document.getElementById("loader").style.display = "none";
			document.getElementById('text-error').style.display = 'block';
			return false;
		}
		document.getElementById('count').innerHTML = "Characters left: " + (textinput.length + " / 2000");
		if (textinput.length >= 2001) {
			$("#confirmation-modal").modal();
			document.getElementById("errorTxt").innerHTML = "Content allow upto 2000 Characters. Please Try Again...";
			return false;
		}
		else{
			document.getElementById("loader").style.display = "flex";
			document.getElementById('text-error').style.display = 'none';
			
			//console.log("api call input apikey : " + apikey);
			//console.log("api call input contentType : "+ contentType);
			//console.log("api call input endpointurl : " +endpointurl);
			//console.log("api call input inputjson : " + inputjson);
			
			$.ajax({
			method: 'POST',
			headers: { 'x-api-key': apikey },
			contentType: contentType,
			url: endpointurl,
			data:inputjson,
			timeout: 80000,
				success: function (response) {
					document.getElementById("loader").style.display = "none";
					document.getElementById("responseDiv").style.display = "block";
					var results = response;
					var loc = results.LOC;
					for (w in loc) {
						var word=loc[w].split(' ').join('');
						var toolid=word+"tooll";
						locList += "<em class='tag-gray' id='"+toolid+"' onclick='gotoNer(this)' data-toggle='popover'  data-container='body' > <i class='fa fa-link' aria-hidden='true'></i> "+word+"</em>";
						document.getElementById("locList").innerHTML = locList;
					}
					var org = results.ORG;
					for (x in org) {
						var word=org[x].split(' ').join('');
						var toolid=word+"toolo";
						orgList += "<em class='tag-gray' id='"+toolid+"' onclick='gotoNer(this)' data-toggle='popover'  data-container='body'><i class='fa fa-link' aria-hidden='true'></i> "+org[x]+"</em>";
						document.getElementById("orgList").innerHTML = orgList;
					}
					var per = results.PER;
					for (y in per) {
						var word=per[y].split(' ').join('');
						var toolid=word+"toolp";
						perList += "<em class='tag-gray' id='"+toolid+"' onclick='gotoNer(this)' data-toggle='popover'  data-container='body'><i class='fa fa-link' aria-hidden='true'></i> "+per[y]+"</em>";
						document.getElementById("perList").innerHTML = perList;
					}
					var others = results.MISC;
					for (z in others) {
						var word=others[z].split(' ').join('');
						var toolid=word+"tools";
						othersList += "<em class='tag-gray' id='"+toolid+"' onclick='gotoNer(this)' data-toggle='popover'  data-container='body'><i class='fa fa-link' aria-hidden='true'></i> "+others[z]+"</em>";
						document.getElementById("othersList").innerHTML = othersList;
					}
					
				},
				error: function (err) {
					console.log("err : " + err);
					document.getElementById("loader").style.display = "none";
					$("#confirmation-modal").modal();
					document.getElementById("errorTxt").innerHTML = "Please check your content and Try Again...";
					$('[data-toggle="popover"]').popover();
				}
				
				
			});
		}
	}
	var a=0;
	function gotoNer(e){
		if(a==0){
			a=1;
			$('.popover').css({"background-color":"#fff","color":"#424143"});
			$("#cardDiv").removeClass("card-popover1");
			$("#cardDiv").addClass("card-popover");
			var id = '#'+$(e).attr("id");
			var keyword=$(id).text();
			
			var isPopover = $(e).attr("data-original-title");
			$(id).css({"background-color":"#9a999b"});
			console.log(e);
			var content='Sorry, unable to find related Wikipedia articles on <b>'+keyword+'</b>';
			
				$(id).popover({
					html: true,
					placement: 'top',
					container: 'body',
					content: "<div class='card-popover'><div class='cell'> <div class='spinner spinner-org'></div></div><div class='rightDiv'><p>Looking for related Wikipedia article…</p></div></div>",
				  }).popover('show');

				
				
			$.ajax({
				method: 'POST',
				headers: { 'x-api-key': apikey },
				contentType: 'application/json',
				url: 'https://dev.apis.sentient.io/microservices/utility/wikipedia/v0.1/getresults',
				data:JSON.stringify({"title":keyword,"filter_key":"all"}),
				timeout: 80000,
				success: function (response) {
					console.log(response);
					a=0;
					//document.getElementById("loader").style.display = "none";
					if(response.results !=undefined && response.results.summary!=undefined){
						
						if(response.results.images.length>0){
							$("<div class='leftDiv'><img class='flag' id='loc_img' src='"+response.results.images[0]+"'></div>").insertBefore(".rightDiv");
							//$('#loc_img').attr('src', response.results.images[0]);
						}
						content=response.results.summary.substring(0,100)+"...";
						document.getElementById("loc_title").innerHTML = keyword;
						
						$('#loc_link').attr('href', response.results.url);
						document.getElementById("loc_link").innerHTML = "Visit Link in Wikipedia";
						
					}else{
						
						$("#cardDiv").removeClass("card-popover");
						$('.popover').css({"background-color":"#9a999b","color":"white"});
						$("#cardDiv").addClass("card-popover1");
					}
					document.getElementById("loc_content").innerHTML = content;
					$('.arrow').css({"display": "none"});
					$('.spinner').hide();
					
					$(id).popover('destroy');
					
					setTimeout(function () {
						$(id).popover({
							html: true,
							placement: 'top',
							container: 'body',
							content: "<div class='card-popover' id='cardDiv'><div class='cell'> <div class='spinner spinner-org'></div></div><div class='rightDiv'><h5><b id='loc_title'></b></h5><p id='loc_content'>"+content+"</p><a target='_blank' id='loc_link'></a></div></div>",
						  }).popover('show');
					},1000);
				},
				error: function (err) {
					console.log(err);
					a=0;
						$("#cardDiv").removeClass("card-popover");
						$('.popover').css({"background-color":"#9a999b","color":"white"});
						$("#cardDiv").addClass("card-popover1");
					document.getElementById("loc_content").innerHTML = content;
					$('.arrow').css({"display": "none"});
					$('.spinner').hide();
				}
				});
		}
	}
	
	function textClear(){
		location.reload();
	}
	
	$('body').on('click', function (e) {
    $('[data-toggle=popover]').each(function () {
        // hide any open popovers when the anywhere else in the body is clicked
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('hide');
        }
    });
});
	