define("<%= filebase %>", [
    "vue", 
    "vue-resource", 
    "promise"
], function(Vue, http, _promise) {
    'use strict';

    Vue.use(http);

    return {
        test : function() {
            
        }
    }
});