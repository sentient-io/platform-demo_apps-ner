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
					console.log(response);
					document.getElementById("loader").style.display = "none";
					document.getElementById("responseDiv").style.display = "block";
					// Response
					var loc = response.results.loc;
					console.log(loc);
					for (w in loc) {
						var word=loc[w].split(' ').join('');
						var toolid=word+"tooll";
						locList += "<em class='tag-gray' id='"+toolid+"' onclick='gotoNer(this)' data-toggle='popover'  data-container='body' > <i class='fa fa-link' aria-hidden='true'></i> "+word+"</em>";
						document.getElementById("locList").innerHTML = locList;
					}
					var org = response.results.org;
					for (x in org) {
						var word=org[x].split(' ').join('');
						var toolid=word+"toolo";
						orgList += "<em class='tag-gray' id='"+toolid+"' onclick='gotoNer(this)' data-toggle='popover'  data-container='body'><i class='fa fa-link' aria-hidden='true'></i> "+org[x]+"</em>";
						document.getElementById("orgList").innerHTML = orgList;
					}
					var per = response.results.per;
					for (y in per) {
						var word=per[y].split(' ').join('');
						var toolid=word+"toolp";
						perList += "<em class='tag-gray' id='"+toolid+"' onclick='gotoNer(this)' data-toggle='popover'  data-container='body'><i class='fa fa-link' aria-hidden='true'></i> "+per[y]+"</em>";
						document.getElementById("perList").innerHTML = perList;
					}
					var others = response.results.misc;
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
	
	// Clear Content
	function textClear(){
		location.reload();
	}
	
	

	
