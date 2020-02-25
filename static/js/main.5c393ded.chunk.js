(this.webpackJsonpcidr_tools=this.webpackJsonpcidr_tools||[]).push([[0],{12:function(t,e,a){},13:function(t,e,a){},14:function(t,e,a){"use strict";a.r(e);var n=a(0),s=a.n(n),i=a(3),r=a.n(i),o=(a(12),a(1)),c=a(4),l=a.n(c),u=a(5),m=a(6),h=function(t){return[(t&255<<24)>>>24,(t&255<<16)>>>16,(65280&t)>>>8,255&t].join(".")},p=function(t){var e=t.split(".");if(0===e.length||e.length>4)throw new Error("Invalid IP");for(var a=0;a<e.length;a++){var n=e[a];if(isNaN(parseInt(n,10)))throw new Error("Invalid byte: ".concat(n));if(n<0||n>255)throw new Error("Invalid byte: ".concat(n))}return(e[0]<<24|e[1]<<16|e[2]<<8|e[3])>>>0},d=function(){function t(e,a){if(Object(u.a)(this,t),"string"!==typeof e)throw new Error("Missing ip");if(!a){var n=e.split("/",2),s=Object(o.a)(n,2);e=s[0],a=s[1]}if(!a)throw new Error("Invalid ip address: ".concat(e));if(!a)throw new Error("Invalid netmask: empty");if(this.bitmask=parseInt(a,10),this.maskLong=0,this.bitmask>0&&(this.maskLong=4294967295<<32-this.bitmask>>>0),isNaN(this.bitmask)||this.bitmask>32||this.bitmask<0)throw new Error("Invalid netmask: ".concat(a));try{this.netLong=(p(e)&this.maskLong)>>>0}catch(i){throw new Error("Invalid ip address: ".concat(e))}this.ip=e,this.cidr="".concat(e,"/").concat(this.bitmask),this.size=Math.pow(2,32-this.bitmask),this.netmask=h(this.maskLong),this.hostmask=h(~this.maskLong),this.first=h(this.netLong),this.last=h(this.netLong+this.size-1)}return Object(m.a)(t,[{key:"contains",value:function(e){return"string"===typeof e&&(e.indexOf("/")>0||4!==e.split(".").length)&&(e=new t(e)),e instanceof t?this.contains(e.base)&&this.contains(e.last):(p(e)&this.maskLong)>>>0===(this.netLong&this.maskLong)>>>0}},{key:"next",value:function(e){return null==e&&(e=1),new t(h(this.netLong+this.size*e),this.bitmask)}},{key:"forEach",value:function(t){for(var e=p(this.first),a=p(this.last),n=0;e<=a;)t(h(e),e,n),n++,e++}},{key:"toString",value:function(){return this.first+"/"+this.bitmask}}]),t}();a(13);function f(t){return t.split(".").map((function(t){return Number(t).toString(2).padStart(8,"0")})).join(" ")}var v=function(){var t=s.a.useState("192.168.0.37/30"),e=Object(o.a)(t,2),a=e[0],n=e[1],i=s.a.useState(a),r=Object(o.a)(i,2),c=r[0],u=r[1],m=s.a.useState(""),h=Object(o.a)(m,2),p=h[0],v=h[1],k={},g={};return function(){if(c)try{var t=new d(c);k={"CIDR Range":t.cidr,"Net Mask":t.netmask,"Host Mask":t.hostmask,"First IP":t.first,"Last IP":t.last,"Total Hosts":t.size},g={"Base IP":f(t.ip),"Net Mask":f(t.netmask),"Host Mask":f(t.hostmask),"First IP":f(t.first),"Last IP":f(t.last)}}catch(e){u(),v(e.message)}}(),s.a.createElement("div",{className:"App"},s.a.createElement("div",{className:"title"},s.a.createElement("p",null,"CIDR To IP Range")),s.a.createElement("input",{className:"cidr-input",autoFocus:!0,type:"text",value:a,onChange:function(t){var e=t.target.value,a=e.split("/"),s=Object(o.a)(a,2),i=s[0],r=s[1];l()({exact:!0}).test(i)&&r?u(e):u(),n(e),v("")}}),s.a.createElement("div",{className:"cidr-output"},c?Object.entries(k).map((function(t){var e=Object(o.a)(t,2),a=e[0],n=e[1];return s.a.createElement("div",{className:"output-row",key:a},s.a.createElement("div",{className:"output-left"},"".concat(a,":")),s.a.createElement("div",{className:"output-right"},n))})):s.a.createElement("div",{className:"cidr-output"},s.a.createElement("div",{className:"cidr-error"},s.a.createElement("p",null,p)))),s.a.createElement("div",{className:"title"},s.a.createElement("p",null,"In Binary")),s.a.createElement("div",{className:"cidr-output"},!!c&&Object.entries(g).map((function(t){var e=Object(o.a)(t,2),a=e[0],n=e[1];return s.a.createElement("div",{className:"output-row",key:a},s.a.createElement("div",{className:"output-left"},"".concat(a,":")),s.a.createElement("div",{className:"output-binary-right"},n))}))),s.a.createElement("div",{className:"cidr-output"},s.a.createElement("p",null,"<IP> AND <Net Mask> => <First IP>"),s.a.createElement("p",null,"<First IP> OR <First IP> => <Last IP>")))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(s.a.createElement(v,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))},7:function(t,e,a){t.exports=a(14)}},[[7,1,2]]]);
//# sourceMappingURL=main.5c393ded.chunk.js.map