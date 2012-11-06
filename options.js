var Options = new function() {
    var save = function() {
        var options = new Array();
        $.each($(".optionline"), function(index, value) {
            var option = {};
            option.trigger = $(value).find('.triggeroption').val();
            option.ping = $(value).find('.pingoption').val();
            option.time = $(value).find('.timeoption').val();
            options.push(option);
        });

        localStorage["sessionlifesaver"] = JSON.stringify(options);

        $('#feedback').html("Options Saved.");
        setTimeout(function() {
            $('#feedback').html("");
        }, 750);
    }

    var restore = function() {
        var options = JSON.parse(localStorage["sessionlifesaver"]);
        if (!options) {
            return;
        }

        for ( var i = 0; i < options.length; i++) {
            var value = options[i];
            addOption(value.trigger, value.ping, value.time);
        }
    }
    
    var removeOption = function( el ) {
        $(el).parent().parent().remove();
    }

    var buildOptionLine = function(trigger, ping, time) {
        return '<tr class="optionline"><td><input type="text" class="triggeroption" value="'+trigger+'"></input></td><td><input type="text" class="pingoption" value="'+ping+'"></input></td><td><input type="text" class="timeoption" value="'+time+'"></input></td><td><button class="remove">Remove</button></tr>';
    }

    var addOption = function(trigger, ping, time) {
        $("#options").append(buildOptionLine(trigger, ping, time));
    }
	
	this.init = function() {
		$(document).ready( function () {
			restore();
			$('.save').click( function(e) {
				save();
			});
			$('.add').click( function(e) {
				addOption();
			});
			$('.remove').click( function(e) {
				removeOption(this);
			});
		});
	}
}

Options.init();