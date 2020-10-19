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