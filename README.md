# Voluum Tracking JS

This is an example JS library which can be loaded on a page with the necessary params to help with Voluum tracking.

It will manage keeping track of the clickId in a cookie and also append automatically to all URLs on the page so it's not lost. 

# Usage
To use this script, you can simply include the file and pass it the necessary params like below:
```html
<script src="src/vtracker.js"></script>
<script>
    let vtrackerOptions = {
        base_url: 'https://fingkok-singola.com', // This is the base URL configured in Voluum, this will change
        campaign_id: '7c9410cb-7c14-4b5e-9c2e-18ca2c51562c', // The campaignID from Voluum (not the cmpId from the tour, this is different
        offer_id: '5d6bb058-56cc-47d9-b6a4-2a457469c939', // The offerID from Voluum
        debug: true // Can be true or false, defaults to false, if true, will log various debug information
    };
    // unused right now, there is only one method for vtrack which is getTokens(), this returns the clickId, trafficSource and campaignIf from Voluum (or the cookie)
    let vtrack = new VTracker(vtrackerOptions);
</script>
```

# Run example Locally

## Run local web server (example with PHP)
Checkout this code and cd to the new directory and run a local webserver
```shell script
php -S 127.0.0.1:8078
```

## Run the test
Go to the following link in your browser:
http://127.0.0.1:8078/html

This is the main page which will list videos etc. from here there are 2 example links, video 1 and video2. Both are working links.

From there, each video page will show a few join links/options to mimic linking to an actual billing system / credit card join form e.g. "trial", "monthly" and "yearly"

## What is the example of?
The example illustates one standard use case for using Voluum e.g.:
 - [html/index.html] Main Page / Video Listing Page (log that a user landed on the page)
 - [html/videos/video1.html] Video Page - e.g. localhost:8078/html/videos/video1.html (log that the user viewed the various join links e.g. trial, monthly, etc.)
   -  onclick of the link to credit card join form, log click (PENDING how to do this)
 - [html/join.html] Credit Card Join Page (In this example, we are assuming that the credit card join form would be a different system i.e. a billing system, here we would do the postback on a successful purchase)
