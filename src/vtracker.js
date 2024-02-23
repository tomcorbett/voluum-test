let VTracker = (function(initOptions) {

    let cookieName = 'vtracker';

    let debug = initOptions.debug || false;

    let tokens = {
        clickId: null
    };

    let links = [];

    // set the root level options based on the passed in params
    let options = {
        base_url: initOptions.base_url || null,
        campaign_id: initOptions.campaign_id || null,
        offer_id: initOptions.offer_id || null
    };

    let jsLoaded = false;

    let calls = {
        updateUrls: function() {

            for(let i = 0; i < links.length; i++) {

                let elem = links[i];

                let url = new URL(elem.href);

                log("Updating link", url);

                url.searchParams.set('cid', tokens.clickId);
                elem.href = url.href;

                // if it's a join link, add the register click
                if (elem.hasAttribute('data-join-link')) {
                    // add the click handler (pending - this does nothing for now)
                    log("Binding registerClick to join link", elem.href);
                    elem.onclick = calls.registerClick;
                }
            }
        },
        registerClick: function(e) {
            e.stopPropagation();

            if (jsLoaded) {
                // dtpCallback.logConversion(); // This logs a conversion, we don't want to do this yet we just want to log a click
                // dtpCallback.registerClick(); // this doesn't work, although it is in docs (https://doc.voluum.com/en/dtp_customziations.html)
                log("Click registered [not working currently]");
            } else {
                log("Could not register click because library was not loaded yet");
            }
        },
        onLibLoadedCallback: function() {

            // as this is a callback, we know here that the lib successfully loaded
            jsLoaded = true;

            // check the cookie, do we already have the tracking info?
            let cookie = getCookie();

            // if we don't already have the cookie set, then we need to call getTokens()
            if (!cookie || !cookie.hasOwnProperty('clickId') || cookie.clickId === null) {
                log('clickId not in cookie so checking URL');

                // if the clickId is already in the URL, the dtpCallback.getTokens() will return nothing so just take it from the URL
                let pageUrl = new URL(window.location.href);
                if (pageUrl.searchParams.has('cid')) {
                    tokens.clickId = pageUrl.searchParams.get('cid');
                    log("ClickID was already in URL so not calling getTokens()", tokens);
                } else {
                    let vtokens = dtpCallback.getTokens();
                    log("Received tokens from getTokens() call:", vtokens);
                    tokens.clickId = vtokens.cid;
                }

                setCookie(tokens);

            // if we already have the tokens in the cookie then we don't need to call getTokens()
            } else {
                tokens = cookie;
                log('clickId is already in cookie so do not have to get it', tokens);
            }

            // now set all the URLs on the page
            calls.updateUrls();
        }
    };

    function setCookie() {
        var d = new Date();
        d.setTime(d.getTime() + (30*24*60*60*1000)); // 30 days
        var expires = "expires="+ d.toUTCString();
        document.cookie = cookieName + "=" + JSON.stringify(tokens) + ";" + expires + ";path=/";
        log("setting cookie:", document.cookie);
    }

    function getCookie() {
        var name = cookieName + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return JSON.parse(c.substring(name.length, c.length));
            }
        }
        return "";
    }

    function log(msg, obj) {

        if (!debug) {
            return;
        }

        if (typeof obj === "undefined" || !obj) {
            console.log("[VTracker] " + msg);
        } else {
            console.log("[VTracker] " + msg, obj);
        }
    }

    function loadJS() {
        (function(b,a,f,n,c,l,g,h,k,d,m,e){b[c]||(b[c]=function(a){b[c].state.callbackQueue.push(a)},b[c].state={callbackQueue:[]},b[c].registerConversion=function(a){b[c].state.callbackQueue.push(a)},(k=/[?&]cpid(=([^&#]*)|&|#|$)/.exec(b.location.href))&&k[2]&&(d=k[2],m=a.cookie.match(new RegExp("(^| )vl-"+d+"=([^;]+)"))),g=a.createElement("script"),h=a.scripts[0],g.src=l+(-1===l.indexOf("?")?"?":"&")+"oref="+f(a.referrer)+"&ourl="+f(location[n])+"&opt="+f(a.title)+"&t="+(new Date).getTime()+(m?"&uw=no":
            ""),h.parentNode.insertBefore(g,h),d&&(e=new Date,e.setTime(e.getTime()+864E5),a.cookie="vl-"+d+"=1; expires="+e.toGMTString()+"; path=/"))})(window,document,encodeURIComponent,"href","dtpCallback",options.base_url+"/d/"+options.campaign_id+".js?oid="+options.offer_id+"&var1="+window.location.href);

        log('JS Loaded');

        dtpCallback(calls.onLibLoadedCallback); // tokens set, cookie updated and URLs get updated in this callback
    }

    function setBindings () {

        // bind to all links
        links = document.getElementsByTagName('a');

        // if there are no links, don't do anything
        if (links.length === 0) {
            log('No links to bind to');
            return false;
        }
    }

    function init() {

        // first check the necessary params are set in the page already
        if (!options.base_url) {
            log('No base_url provided');
            return false;
        }
        if (!options.campaign_id) {
            log('No campaign_id provided');
            return false;
        }
        if (!options.offer_id) {
            log('No offer_id provided');
            return false;
        }

        log("initialized with options", options);

        // bind any links
        setBindings();

        // always load the JS in case we need to log a conversion
        loadJS();
    }

    init();

    // return public method to enable the page to get the tokens if they want to
    return {
        getTokens: function(){return tokens;}
    };

    // add random code so I am a contributor (for testing)
});

