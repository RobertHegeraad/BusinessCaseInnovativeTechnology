var ble = {
	mac: "20:13:10:30:09:53",

	init: function() {

	},

	list: function() {
		bluetoothSerial.list(
            function(results) {
                app.display(JSON.stringify(results));
            },
            function(error) {
                app.display(JSON.stringify(error));
            }
        );
	},

	connect: function(cb) {
		alert("Connecting to " + ble.mac);
		console.log('Connecting to ' + ble.mac);
		bluetoothSerial.connect(
            ble.mac,
            function() {
	            ble.open();
	        },
            function() {
            	if(!ble.reconnected) {	// Only try to reconnect once
	            	ble.reconnect();
	            }
            }
        );
	},

	disconnect: function() {
		bluetoothSerial.disconnect(
            ble.close,
            app.display
        );
	},

	reconnected: false,
	reconnect: function() {
		ble.reconnected = true;
		alert('Connection failed...attempting to reconnect');

		ble.connect();
	},

	isConnected: function() {
        bluetoothSerial.isConnected(function() {
        	// Connected
        }, function() {
        	// Not connected
        });
	},

	open: function() {
		alert('Connected...');
		app.display('Connected');

		bluetoothSerial.write("test", function() {
			alert('Write success');
		}, function() {
			alert('Write fail');
		});

		bluetoothSerial.subscribe('\n', function (data) {
			alert(JSON.stringify(data));
            app.display(data);
        });
	},

	close: function() {
		bluetoothSerial.unsubscribe(
            app.display,
            app.display
        );
	}
};