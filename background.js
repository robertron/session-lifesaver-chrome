/**
 * Background functions. Robert Breetzmann (robert.breetzmann@gmail.com)
 */
var SessionLiveSaver = new function() {

    var activePings = new Array();

    this.init = function() {
        chrome.tabs.onCreated.addListener(function(input) {
            if (console) {
                console.info('Tab added');
            }
            checkingOptions();
        });

        chrome.tabs.onRemoved.addListener(function(input) {
            if (console) {
                console.info('Tab removed');
            }
            checkingOptions();
        });

        run();
    }

    var checkingOptions = function() {
        chrome.windows.getAll({populate : true}, function(windows) {
            checkingNewOptions(windows);
            checkingInactiveOptions(windows);
            if (console) {
                console.info('Active queue: '+ JSON.stringify(activePings));
            }
        });
    }

    var checkingInactiveOptions = function(windows) {
        if (console) {
            console.info('Checking for inactive options');
        }
        for ( var i = 0; i < activePings.length; i++) {
            var activePing = activePings[i];
            var found = false;
            for ( var k = 0; k < windows.length; k++) {
                var window = windows[k];
                for ( var j = 0; j < window.tabs.length; j++) {
                    var tab = window.tabs[j];
                    if (tab.url.indexOf(activePing.trigger) > -1) {
                        found = true;
                    }
                }
            }

            if (!found) {
                if (console) {
                    console.info('Removed option from queue: ' + activePing.trigger);
                }
                activePings.splice(i, 1);
            }
        }
    }

    var checkingNewOptions = function(windows) {
        if (console) {
            console.info('Checking all tabs for new options');
        }
        for ( var k = 0; k < windows.length; k++) {
            var window = windows[k];
            for ( var i = 0; i < window.tabs.length; i++) {
                var tab = window.tabs[i];
                var option = getOption(tab.url, JSON.parse(localStorage["sessionlifesaver"]));
                if (option == null) {
                    continue;
                }
                addActiveOption(option);
            }
        }
    }

    var addActiveOption = function(option) {
        var newOption = getOption(option.trigger, activePings);

        if (!newOption) {
            option.count = 1;
            activePings.push(option);
            if (console) {
                console.info('Added option to queue: ' + option.trigger);
            }
        } else {
            if (console) {
                console.info('Option: ' + option.trigger + ' already in queue.');
            }
        }
    }

    var getOption = function(url, options) {
        for ( var i = 0; i < options.length; i++) {
            if (url.indexOf(options[i].trigger) > -1) {
                return options[i];
            }
        }

        return null;
    }

    var ping = function(option) {
        $.get(option.ping);
        if (console) {
            console.info("Ping " + option.ping);
            console.info("Next ping in " + option.time + " minutes");
        }
    }

    var run = function() {

        setTimeout(function() {
            if (console) {
                console.info("Checking now");
            }
            for ( var i = 0; i < activePings.length; i++) {
                if (parseInt(activePings[i].time) == activePings[i].count) {
                    activePings[i].count = 1;
                    ping(activePings[i]);
                } else {
                    activePings[i].count += 1;
                }

            }
            run();
        }, 1000 * 60);

    }
}

SessionLiveSaver.init();