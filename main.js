var Http = new function() {
	this.get = function( url, data, callback ) {
		var header = [{'key' : 'User-agent' , 'value' : 'Mozilla/4.0 (compatible) Greasemonkey' }];
  	    var request = {'header' : header, 
  	    	'url': url + '?' + data };
  	    
  	    chrome.extension.sendRequest( request, function( data ) {
  	    	callback( data );
  	    } );
	}
}

var SessionLiveSaver = new function() {
	
    var options = {};

    var getOption( url ) {
	    for( var i=0;i<options.length;i++) {
           if( url.indexOf( url ) > -1 ) {
             return options[i]; 
           }
        }

        return null;
    }

	this.run = function( url ) {
        var option = getOption( url );
        if( option == null ) {
           return; 
        }

        while( true ) {
            //wait( option.time );
            Http.get( option.ping );
        }

    }
}

$(document).ready( function() {
    var currentUrl = ""; //document.url?
    SessionLiveSaver.run( currentUrl );
});



