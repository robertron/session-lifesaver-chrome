/**
 * Background functions.
 * Robert Breetzmann (robert.breetzmann@gmail.com) 
 */

var Http = new function() {
	this.get = function( url, data, callback ) {
		var header = [{'key' : 'User-agent' , 'value' : 'Mozilla/4.0 (compatible)' }];
  	    var request = {'header' : header, 
  	    	'url': url + '?' + data };
  	    
  	    chrome.extension.sendRequest( request, function( data ) {
  	    	callback( data );
  	    } );
	}
}

var SessionLiveSaver = new function() {
	
	var activePings = new Array();
	
	this.init = function() {
		chrome.tabs.onCreated.addListener( function(input) {
			
			var options = JSON.parse( localStorage["sessionlifesaver"] );
			
			chrome.windows.getAll({populate: true}, function( windows ) {
				for( var j=0;j<windows.length;j++) {
					var window = windows[j];
					for( var i=0;i<window.tabs.length;i++) {
						var tab = window.tabs[i];
						var option = getOption( tab.url, options );
						if( option == null ) {
							continue; 
						}
						addActiveOption( option ); 
					}
				}
			});
			
    	});

		function call(request, sender, callback) {
			var xhr = new XMLHttpRequest();
			var header = request['header'];
			var url = request['url'];
			var data = request['data'];
	
			xhr.onreadystatechange = function(data) {
				if (xhr.readyState == 4) {
					if (xhr.status == 201 || xhr.status == 200) {
						callback(xhr.responseText);
						return;
					}
	
					if (console) {
						console.info('Error:' + xhr.responseText);
					}
				}
			}
	
			xhr.open('POST', url, true);
			for ( var i = 0; i < header.length; i++) {
				xhr.setRequestHeader(header[i].key, header[i].value);
			}
			xhr.send(data);
		};
	
		// Wire up the listener.
		chrome.extension.onRequest.addListener(call);
		
		run();
	}
	
	var addActiveOption = function( option ) {
		var newOption = getOption( option.trigger, activePings);
		
		if( !newOption) {
			option.count = 0;
			activePings.push( option ); 
			if (console) {
				console.info('Added option to queue: ' + option.trigger);
			}
		} else {
		    if (console) {
                console.info('Option: ' + option.trigger + ' already in queue.' );
            }
		}
	}
	
	
    var getOption = function( url, options ) {
	    for( var i=0;i<options.length;i++) {
           if( url.indexOf( options[i].trigger ) > -1 ) {
             return options[i]; 
           }
        }

        return null;
    }

	var run = function() {
               
    	setTimeout(function() {
    		for( var i=0;i<activePings.length;i++) {
    			var option = activePings[i];
    			if( option.time == option.count) {
    				Http.get( option.ping );
    				option.count = 0;
    				if( console ) {
   	        			console.info( "Ping " + option.ping );
   	        			console.info( "Next ping in " + option.time + " minutes" );
    	    		}
    			} else {
    				option.count += 1;
    			}
    			
    		}
    		run();
		}, 1000*60);

    }
}

SessionLiveSaver.init();