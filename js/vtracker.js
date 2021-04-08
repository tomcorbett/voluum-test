let VTracker = (function() {

    let $ = window.jQuery;

    let self = this;

    let links = [];

    let tokens = {
        clickId: null,
        campaignId: null,
        trafficSource: null
    };

    let vlib = null;

    let calls = {
        updateUrls: function() {
            links.each(function(){
                let url = new URL(this.href);

                log("Updating link", url);

                url.searchParams.set('traffic_source', tokens.trafficSource);
                url.searchParams.set('cmp', tokens.campaignId);
                url.searchParams.set('cid', tokens.clickId);
                this.href = url.href;

                $(this).click(calls.registerClick);
            });
        },
        registerClick: function(e) {
            e.stopPropagation();
            log("register click");
            dtpCallback.logConversion('payout');
        },
        onLibLoaded: function() {
            let vtokens = dtpCallback.getTokens();

            log("Received tokens", vtokens);

            tokens.clickId = vtokens.cid;
            tokens.campaignId = vtokens.cmp;
            tokens.trafficSource = vtokens.traffic_source;

            calls.updateUrls();
        }
    };

    function setBindings() {
        links = $('[data-join-link]');

        // if there are no links, don't do anything
        if (links.length === 0) {
            log('No links to bind to');
            return false;
        }

        calls.onLibLoaded();
    }

    function log(msg, obj) {

        if (typeof obj === "undefined" || !obj) {
            console.log("[VTracker] " + msg);
        } else {
            console.log("[VTracker] " + msg, obj);
        }
    }

    function init(vlib) {

        this.vlib = vlib;
        setBindings();
    }

    return {
        init: init
    };

});

vtrack = new VTracker();
dtpCallback(vtrack.init);

