/**
 * Mobile util
 */

var Mob = {

    Demo: false,

    geolocation : {

        watching : 0,

        options : {
            maximumAge: 3000, 
            timeout: 300000, 
            enableHighAccuracy: true
        },

        test_position : {
            coords : {
                latitude : 45,
                longitude : 11,
                accuracy : 3,
                altitude : 13,
                altitudeAccuracy : 5,
                heading : 0,
                speed : 0
            },
            timestamp : new Date().getTime()
        },

        has : function(){
            if("geolocation" in navigator){
                return true;
            }

            return false;
        },

        /**
         * return object position
        */
        get : function(callBack){

            if(Mob.Demo){
                callBack(Mob.geolocation.test_position);
            }

            if(!Mob.geolocation.has()){
                callBack(null, {code: -100, message:'geolocation not found'})
                return;
            }

            navigator.geolocation.getCurrentPosition(function(p){ // On success
                callBack( Mob.geolocation.format(p) );
            }, function(e){ // On error
                callBack(null, e);
            }, Mob.geolocation.options );

        },

        startWatch: function(callBack){

            if(Mob.Demo){
                callBack(Mob.geolocation.test_position);
            }

            if(!Mob.geolocation.has()){
                callBack(null, {code: -100, message:'geolocation not found'})
                return;
            }
            
            Mob.geolocation.watching = navigator.geolocation.watchPosition(function(p){ // On success
                callBack( Mob.geolocation.format(p) );
            }, function(e){ // On error
                callBack(null, e);
            }, Mob.geolocation.options );
        },

        stopWatch: function(){

            if(!Mob.geolocation.has() && Mob.geolocation.watching > 0){
                navigator.geolocation.clearWatch(Mob.geolocation.watching);
                Mob.geolocation.watching = 0;
            }

        },

        format : function (position) {

            var positionObject = {};
        
            if ('coords' in position) {
                positionObject.coords = {};
        
                if ('latitude' in position.coords) {
                    positionObject.coords.latitude = position.coords.latitude;
                }
                if ('longitude' in position.coords) {
                    positionObject.coords.longitude = position.coords.longitude;
                }
                if ('accuracy' in position.coords) {
                    positionObject.coords.accuracy = typeof position.coords.accuracy == 'number' ? position.coords.accuracy.toFixed(2) : 0;
                }
                if ('altitude' in position.coords) {
                    positionObject.coords.altitude = position.coords.altitude;
                }
                if ('altitudeAccuracy' in position.coords) {
                    positionObject.coords.altitudeAccuracy = typeof position.coords.altitudeAccuracy == 'number' ? position.coords.altitudeAccuracy.toFixed(2) : 0;
                }
                if ('heading' in position.coords) {
                    positionObject.coords.heading = position.coords.heading;
                }
                if ('speed' in position.coords) {
                    positionObject.coords.speed = position.coords.speed;
                }
            }
        
            if ('timestamp' in position) {
                positionObject.timestamp = position.timestamp;
            }

            return positionObject;
        }
    }
}