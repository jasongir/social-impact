(this["webpackJsonpsocial-impact"]=this["webpackJsonpsocial-impact"]||[]).push([[0],{11:function(e,t,n){"use strict";n.r(t);var r=n(1),c=n.n(r),s=n(4),a=n.n(s),i=n(2),o="f523e477-7200-471e-bc77-f4e7f17f707a",u=(n(9),n(0));var l=function(e){var t=Object(r.useState)(""),n=Object(i.a)(t,2),c=n[0],s=n[1];return Object(u.jsxs)("section",{className:"btn-search-area",children:[e.children,Object(u.jsx)("input",{onChange:function(e){s(e.target.value)},type:"text",placeholder:"Search for a "+e.keyName,className:"searchBar"}),Object(u.jsx)("div",{className:"item-btns",children:e.itemList.filter((function(t){return String(t[e.keyName]).toLowerCase().startsWith(c.toLowerCase())})).map((function(t){return Object(u.jsx)("div",{className:"btn-container",children:Object(u.jsx)("button",{onClick:function(){return e.selectItem(t[e.keyName])},className:"btn",children:t[e.keyName]})},String(t[e.keyName]))}))||Object(u.jsxs)("p",{children:["couldn't find a matching ",e.keyName]})})]})},h=function(e){var t=Object(r.useState)(""),n=Object(i.a)(t,2),c=n[0],s=n[1],a={Green:{description:"Air quality is satisfactory, and air pollution poses little or no risk.",color:"rgba(66, 245, 96, 0.5)"},Yellow:{description:"Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.",color:"rgba(239, 245, 66, 0.5)"},Orange:{description:"Members of sensitive groups may experience health effects. The general public is less likely to be affected.",color:"rgba(245, 206, 66)"},Red:{description:"Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.",color:"rgba(245, 87, 66)"},Purple:{description:"Health alert: The risk of health effects is increased for everyone.",color:"rgba(242, 34, 197)"},Maroon:{description:"Health warning of emergency conditions: everyone is more likely to be affected.",color:"rgba(163, 42, 5)"},none:{description:"",color:"#fff"},"":{description:"",color:"#fff"}};Object(r.useEffect)((function(){e.setResultsBackground(a[c].color)}),[c,a]),Object(r.useEffect)((function(){s(o(e.results.data.current.pollution.aqius))}),[c,e.results.data]);var o=function(e){return e<51?"Green":e<101?"Yellow":e<151?"Orange":e<201?"Red":e<301?"Purple":"Maroon"},l=new Date("".concat(e.results.data.current.weather.ts)),h=new Date("".concat(e.results.data.current.pollution.ts));return Object(u.jsxs)("section",{className:"results-section",children:[e.results.data.current.weather.ic?Object(u.jsx)("img",{src:"https://www.airvisual.com/images/".concat(e.results.data.current.weather.ic,".png"),alt:"current weather",className:"weather-image"}):null,Object(u.jsxs)("h1",{className:"results-h1",children:[e.results.data.city,", ",e.results.data.state,","," ",e.results.data.country]}),Object(u.jsxs)("div",{className:"air-quality results-container",children:[Object(u.jsxs)("h2",{children:["Air Quality: ",function(e){switch(e){case"Green":return"Good";case"Yellow":return"Moderate";case"Orange":return"Unhealthy for Sensitive Groups";case"Red":return"Unhealthy";case"Purple":return"Very Unhealthy";case"Maroon":return"Hazardous";default:return"none"}}(c)," (U.S. AQI:"," ",e.results.data.current.pollution.aqius,")"]}),Object(u.jsxs)("h3",{className:"timestamp-info",children:["(as of"," ",h.getHours()<=12?h.getHours():0===h.getHours()?"12":h.getHours()-12,":",h.getMinutes()<10?"0"+h.getMinutes():h.getMinutes," ",h.getHours()<=12?"AM":"PM",","," ",h.getMonth()+1,"/",l.getDate(),"/",h.getFullYear(),")"]}),Object(u.jsx)("p",{className:"desc-p",children:a[c].description})]}),Object(u.jsxs)("div",{className:"weather-info results-container",children:[Object(u.jsx)("h2",{children:"Weather Information:"}),Object(u.jsxs)("h3",{className:"timestamp-info",children:["(as of"," ",l.getHours()<=12?l.getHours():0===l.getHours()?"12":l.getHours()-12,":",l.getMinutes()<10?"0"+l.getMinutes():l.getMinutes," ",l.getHours()<=12?"AM":"PM",","," ",l.getMonth()+1,"/",l.getDate(),"/",l.getFullYear(),")"]}),Object(u.jsxs)("p",{className:"desc-p",children:[e.results.data.current.weather.tp,"\xb0C /"," ",9*e.results.data.current.weather.tp/5+32,"\xb0F"]})]})]})},j=function(e){if(!e.ok)throw Error(e.statusText);return e},d=function(){var e=Object(r.useState)([]),t=Object(i.a)(e,2),n=t[0],c=t[1],s=Object(r.useState)(""),a=Object(i.a)(s,2),d=a[0],f=a[1],b=Object(r.useState)([]),O=Object(i.a)(b,2),m=O[0],p=O[1],y=Object(r.useState)(""),g=Object(i.a)(y,2),x=g[0],v=g[1],k=Object(r.useState)([]),w=Object(i.a)(k,2),N=w[0],S=w[1],M=Object(r.useState)(""),C=Object(i.a)(M,2),H=C[0],U=C[1],A="OWN_USER_CITY",E=Object(r.useState)({}),I=Object(i.a)(E,2),F=I[0],R=I[1],L=Object(r.useState)(""),Y=Object(i.a)(L,2),q=Y[0],G=Y[1],P=Object(r.useState)("country"),B=Object(i.a)(P,2),D=B[0],Q=B[1],T=Object(r.useState)(""),_=Object(i.a)(T,2),J=_[0],W=_[1],z=function(){f(""),v(""),U(""),Q("country"),W("")};return Object(r.useEffect)((function(){return fetch("http://api.airvisual.com/v2/countries?key="+o).then(j).then((function(e){return e.json()})).then((function(e){return c(e.data)})).catch((function(){z(),G("Uh oh, errors occurred while getting that country's data.")})),fetch("http://api.airvisual.com/v2/nearest_city?key="+o).then(j).then((function(e){return e.json()})).then((function(e){return R(e)})).catch((function(){z(),G("Uh oh, errors occurred while getting your city's data.")})),function(){return G("")}}),[]),Object(r.useEffect)((function(){return""!==d&&(console.log("chosen country: "+d),fetch("http://api.airvisual.com/v2/states?country="+d+"&key="+o).then(j).then((function(e){return e.json()})).then((function(e){return p(e.data)})).catch((function(){z(),G("Uh oh, errors occurred while getting that country's data.")}))),function(){return G("")}}),[d]),Object(r.useEffect)((function(){return""!==d&&""!==x&&fetch("http://api.airvisual.com/v2/cities?state="+x+"&country="+d+"&key="+o).then(j).then((function(e){return e.json()})).then((function(e){return S(e.data)})).catch((function(){z(),G("Uh oh, errors occurred while getting that state's data.")})),function(){return G("")}}),[x,d]),Object(r.useEffect)((function(){return H===A&&fetch("http://api.airvisual.com/v2/nearest_city?key="+o).then(j).then((function(e){return e.json()})).then((function(e){return R(e)})).catch((function(){z(),G("Uh oh, errors occurred while getting your city's data.")})),""!==d&&""!==x&&""!==H&&fetch("http://api.airvisual.com/v2/city?city="+H+"&state="+x+"&country="+d+"&key="+o).then((function(e){return e.json()})).then((function(e){return R(e)})).catch((function(){z(),G("Uh oh, errors occurred while getting that city's data.")})),function(){return G("")}}),[H,d,x]),Object(u.jsxs)("div",{className:"App ".concat("results"===D?"results-app":""),style:{background:J?"radial-gradient(#fff, ".concat(J," 99%)"):""},children:[Object(u.jsxs)("header",{children:[Object(u.jsx)("h1",{children:"Air Quality App"}),Object(u.jsx)("h2",{children:"Find out about the air you breathe"})]}),Object(u.jsxs)("div",{className:"top-btn-container",children:[Object(u.jsx)("div",{children:Object(u.jsx)("button",{className:"btn top-btn",onClick:z,children:"Reset"})}),"country"===D?Object(u.jsx)("div",{children:Object(u.jsx)("button",{className:"btn top-btn",onClick:function(){U(A),Q("results")},children:"Just Show My Air Quality!"})}):null]}),"country"===D?Object(u.jsxs)("div",{children:[Object(u.jsxs)(l,{itemList:n,selectItem:function(e){f((function(){return String(e)})),Q("state")},keyName:"country",children:[Object(u.jsx)("h2",{children:"Find a Country"}),Object(u.jsx)("h3",{children:q||null})]})," "]}):null,"state"===D?Object(u.jsxs)(l,{itemList:m,selectItem:function(e){v((function(){return String(e)})),Q("city")},keyName:"state",children:[Object(u.jsx)("button",{className:"back-btn",onClick:function(){return Q("country")},children:"\u2b05\ufe0f"}),Object(u.jsxs)("h3",{children:["Current country: ",d]}),Object(u.jsx)("h2",{children:"Find a State"})]}):null,"city"===D?Object(u.jsxs)(l,{itemList:N,selectItem:function(e){U((function(){return String(e)})),Q("results")},keyName:"city",children:[Object(u.jsx)("button",{className:"back-btn",onClick:function(){return Q("state")},children:"\u2b05\ufe0f"}),Object(u.jsxs)("h3",{children:["Current country: ",d]}),Object(u.jsxs)("h3",{children:["Current state: ",x]}),Object(u.jsx)("h2",{children:"Find a City:"})]}):null,"results"===D?Object(u.jsx)(h,{results:F,setResultsBackground:W}):null]})};a.a.render(Object(u.jsx)(c.a.StrictMode,{children:Object(u.jsx)(d,{})}),document.getElementById("root"))},9:function(e,t,n){}},[[11,1,2]]]);
//# sourceMappingURL=main.48f43445.chunk.js.map