define("<%= filebase %>", [
    "vue", 
    "vue-resource", 
    "promise"
], function(Vue, http, _promise) {
    'use strict';
    
    _promise.polyfill();

    Vue.use(http);

    return {
        test : function() {
            
        }
    }
});