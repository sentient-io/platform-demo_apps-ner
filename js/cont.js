	// Variable declaration
	var endpointurl = 'https://apis.sentient.io/microservices/nlp/namedentityrecognition/v1/getpredictions';
	var callType = "AJAX";
	var contentType = "application/json";
	var inputjson = "";
	var locList = '';
	var orgList = '';
	var perList = '';
	var othersList = '';
	var w,x,y,z = '';
	
	// Characters count method
	function contentCount(){
		var textinput = document.getElementById('textinput').value;
		document.getElementById('count').innerHTML = "<span class='reset'>Characters left: " + (textinput.length + " / 5000")+"</span>";
		document.getElementById('clearTxt').innerHTML = "<span class='reset'>Clear</span>";
		
		if(textinput.length >0){
			$('.reset').css({"color":"#424143"});
		}
		
		if (textinput.length >= 5001) {
			$("#confirmation-modal").modal();
			document.getElementById("errorTxt").innerHTML = "Content allow upto 5000 Characters. Please Try Again...";
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
		
		// Process
		var textinput = document.getElementById('textinput').value;
		// Remove special characters in the input text
		var inputjsonRemoveSpace = textinput.replace(/\s+/g, " ");
		var removesplchar = inputjsonRemoveSpace.replace(/[^a-zA-Z ]/g, "");
		var inputjson = '{"text": "'+removesplchar+'"}';
		if(textinput == undefined || textinput == null || textinput == ""){ 	
			document.getElementById("loader").style.display = "none";
			document.getElementById('text-error').style.display = 'block';
			return false;
		}
		document.getElementById('count').innerHTML = "Characters left: " + (textinput.length + " / 5000");
		if (textinput.length >= 5001) {
			$("#confirmation-modal").modal();
			document.getElementById("errorTxt").innerHTML = "Content allow upto 5000 Characters. Please Try Again...";
			return false;
		}
		else{
			document.getElementById("loader").style.display = "flex";
			document.getElementById('text-error').style.display = 'none';
			// Calling named entity recognition api
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
					// Response
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
	
	// Process wikipedia
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
				$(id).popover({
					html: true,
					placement: 'top',
					container: 'body',
					content: "<div class='card-popover'><div class='cell'> <div class='spinner spinner-org'></div></div><div class='rightDiv'><p>Looking for related Wikipedia article…</p></div></div>",
				  }).popover('show');

			var templete="<div class='card-popover1'><div class='rightDiv'><p>Sorry, unable to find related Wikipedia articles on <b>"+keyword+"</b></p></div></div>";;	
			var result='N';
			// Calling wikipedia api
			$.ajax({
				method: 'POST',
				headers: { 'x-api-key': apikey },
				contentType: 'application/json',
				url: 'https://apis.sentient.io/microservices/utility/wikipedia/v0.1/getresults',
				data:JSON.stringify({"title":keyword,"filter_key":"all"}),
				timeout: 80000,
				success: function (response) {
					console.log(response);
					a=0;
					if(response.results !=undefined && response.results.summary!=undefined){
						
						var content=response.results.summary.substring(0,100)+"...";
						templete="<div class='card-popover'><div class='rightDiv'><h5><b>"+keyword+"</b></h5><p>"+content+"</p><a href='"+response.results.url+"' target='_blank'>Visit Link in Wikipedia</a></div></div>";
						
						if(response.results.images.length>0){
							templete="<div class='card-popover'><div class='leftDiv'><img class='flag' src='"+response.results.images[0]+"'></div><div class='rightDiv'><h5><b>"+keyword+"</b></h5><p>"+content+"</p><a href='"+response.results.url+"' target='_blank'>Visit Link in Wikipedia</a></div></div>";
						}
						result='S';
					}
					$(id).popover('destroy');
					setTimeout(function () {
						showPop(id,templete,result);
					},300);
				},
				error: function (err) {
					console.log(err);
					a=0;
					showPop(id,templete,result);
				}
				});
		}
	}
	// Clear Content
	function textClear(){
		location.reload();
	}
	
	//SHOW POPOVER BOX
	function showPop(id,templete,result){
		$(id).popover({
			html: true,
			placement: 'top',
			container: 'body',
			content: templete,
		}).popover('show');
		
		if(result=='N'){
			$('.popover').css({"background-color":"#9a999b","color":"white"});
		}
	}
	
	$('body').on('click', function (e) {
    $('[data-toggle=popover]').each(function () {
        // hide any open popovers when the anywhere else in the body is clicked
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('hide');
        }
    });
});
	
