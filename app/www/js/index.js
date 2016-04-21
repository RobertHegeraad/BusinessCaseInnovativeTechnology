var app = {

    mac: "20:13:10:30:09:53",

    connectBtn: false,

    status: false,

    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('connect').addEventListener('click', app.connect, false);

        document.getElementById('update').addEventListener('click', function(e) {
            app.update(1);
        });

        // storage.set('tricks', app.tricks);

        app.connectBtn = document.getElementById('connect');
        app.status = document.getElementById('status');

        app.set();
    },

    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    connect: function() {
        app.status.innerHTML = "CONNECTING";

        bluetoothSerial.connect(
            app.mac,
            function() {
                app.connectBtn.dataset.connected = "true"
                app.connectBtn.innerHTML = "DISCONNECT";
                app.status.innerHTML = "LISTENING";
                
                app.listen();
            },
            function() {
                app.status.innerHTML = "RECONNECTING";

                if(!ble.reconnected) {  // Only try to reconnect once
                    ble.reconnect();
                }
            }
        );
    },

    listen: function() {
        // trick ontvangen als kickflip|frontside|half
        bluetoothSerial.subscribe('\n', function (id) {

            // app.status.innerHTML = "RECEIVED " + id;

            app.update(id);

            // app.status.innerHTML = "LISTENING";
        });
    },

    set: function() {
        var tricks = storage.get('tricks');
        console.log(tricks);
        if(tricks == null) {
            tricks = app.tricks;
        }

        for(var id in tricks) {
            var trick = document.getElementById(tricks[id].name + '-count');
            var count = tricks[id].count;

            trick.dataset.count = count;
            trick.innerHTML = count;
        }

        storage.set('tricks', tricks);
    },

    update: function(id) {
        id = parseInt(id);
        var tricks = storage.get('tricks');

        // if(tricks[id] == null) {
        //     return;
        // }

        var counter = document.getElementById(tricks[id].name + '-count');
        var count = counter.dataset.count;
        var trick = counter.parentElement.firstChild;

        // addClass(trick, 'wobble');

        var logo = document.getElementById('logo');
        addClass(logo, 'kickflip');
        setTimeout(function() {
            removeClass(logo, 'kickflip');
            app.status.innerHTML = "LISTENING";
        }, 2000);

        count++;

        counter.dataset.count = count;
        counter.innerHTML = count;
        tricks[id].count = count;

        storage.set('tricks', tricks);
    },

    tricks: {
        "1": {
            id: 1,
            name: 'kickflip',
            count: 0
        },
        "2": {
            id: 2,
            name: 'heelflip',
            count: 0
        }
    }
};



var storage = {
    has: function(key) {
        var item = window.localStorage.getItem(key);
        if(item !== null && item !== undefined) {
            return true;
        }
        return false;
    },

    set: function(key, value) {
        window.localStorage[key] = JSON.stringify(value);
    },

    get: function(key) {
        return JSON.parse(window.localStorage[key]);
    },

    save: function(key, value) {
        this.set(key, value);
        return this.get(key);
    },

    remove: function(k) {
        window.localStorage.removeItem(k);
    },

    clear: function() {
        window.localStorage.clear();
    }
};

function hasClass(el, className) {
  if (el.classList)
    return el.classList.contains(className)
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

function addClass(el, className) {
  if (el.classList)
    el.classList.add(className)
  else if (!hasClass(el, className)) el.className += " " + className
}

function removeClass(el, className) {
  if (el.classList)
    el.classList.remove(className)
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className=el.className.replace(reg, ' ')
  }
}

app.initialize();