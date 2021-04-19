let VTracker = (function(initOptions) {

    let $ = window.jQuery;

    let self = this;

    let cookieName = 'vtracker';

    let tokens = {
        clickId: null,
        campaignId: null,
        trafficSource: null
    };

    let links = [];

    let options = {};

    let jsLoaded = false;

    let calls = {
        updateUrls: function() {
            links.each(function(){

                let url = new URL(this.href);

                log("Updating link", url);

                url.searchParams.set('cid', tokens.clickId);
                this.href = url.href;

                // add the click handler (pending - this does nothing for now)
                $(this).click(calls.registerClick);
            });
        },
        registerClick: function(e) {
            e.stopPropagation();
            log("register click");
            dtpCallback.logConversion('payout'); // don't think this actually does anything
        },
        onLibLoadedCallback: function() {
            let vtokens = dtpCallback.getTokens();

            log("Received tokens", vtokens);

            tokens.clickId = vtokens.cid;
            tokens.campaignId = vtokens.cmp;
            tokens.trafficSource = vtokens.traffic_source;

            setCookie(tokens);

            calls.updateUrls();
        }
    };

    function setCookie() {
        var d = new Date();
        d.setTime(d.getTime() + (30*24*60*60*1000)); // 30 days
        var expires = "expires="+ d.toUTCString();
        document.cookie = cookieName + "=" + JSON.stringify(tokens) + ";" + expires + ";path=/";
        log("setCookie", document.cookie);
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

        // set flag so we can check later if we've loaded the JS or not
        jsLoaded = true;
    }

    function setBindings () {
        links = $('[data-join-link]');

        // if there are no links, don't do anything
        if (links.length === 0) {
            log('No links to bind to');
            return false;
        }
    }

    function init() {

        // first check the necessary params are set in the page already
        if (!initOptions.hasOwnProperty('base_url')) {
            log('No base_url provided');
            return false;
        }
        if (!initOptions.hasOwnProperty('campaign_id')) {
            log('No campaign_id provided');
            return false;
        }
        if (!initOptions.hasOwnProperty('offer_id')) {
            log('No offer_id provided');
            return false;
        }

        // set the root level options based on the passed in params now they're "validated"
        options = {
            base_url: initOptions.base_url,
            campaign_id: initOptions.campaign_id,
            offer_id: initOptions.offer_id
        };

        log("initialized with options", options);

        // bind any links
        setBindings();

        // check the cookie, do we already have the tracking info?
        let cookie = getCookie();

        // check it's valid - if so then we don't need to load the JS
        // if NO - then load the JS if we don't already have the stuff in the cookie
        if (!cookie.hasOwnProperty('clickId')) {
            log('Loading JS because cookie tokens are not set');
            loadJS();
            log('dtpCallback', dtpCallback);
            dtpCallback(calls.onLibLoadedCallback); // tokens set, cookie updated and URLs get updated in this callback
        } else {
            log('Not loading JS because cookie tokens are already set: ', cookie);
            tokens = cookie;
            // now set all the URLs on the page
            calls.updateUrls();
        }
    }

    init(initOptions);

    // return public method to enable the page to get the tokens if they want to
    return {
        getTokens: function(){return tokens;}
    };
});


