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
		document.getElementById('count').innerHTML = "Characters left: " + (textinput.length + " / 2000");
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
						locList += "<em class='tag-gray'>"+loc[w]+"</em>";
						document.getElementById("locList").innerHTML = locList;
					}
					var org = results.ORG;
					for (x in org) {
						orgList += "<em class='tag-gray'>"+org[x]+"</em>";
						document.getElementById("orgList").innerHTML = orgList;
					}
					var per = results.PER;
					for (y in per) {
						perList += "<em class='tag-gray'>"+per[y]+"</em>";
						document.getElementById("perList").innerHTML = perList;
					}
					var others = results.MISC;
					for (z in others) {
						othersList += "<em class='tag-gray'>"+others[z]+"</em>";
						document.getElementById("othersList").innerHTML = othersList;
					}
				},
				error: function (err) {
					console.log("err : " + err);
					document.getElementById("loader").style.display = "none";
					$("#confirmation-modal").modal();
					document.getElementById("errorTxt").innerHTML = "Please check your content and Try Again...";
				}
			});
		}
	}
	
	function textClear(){
		location.reload();
	}
	