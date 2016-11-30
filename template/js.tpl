define("<%= filebase %>", [
    "vue", 
    "text!<%= filebase %>.html", 
    "css!<%= filebase %>.css"
], function(Vue, tmpl, css){
    'use strict';
    
    return Vue.extend({
        template : tmpl
    });
});