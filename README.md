# voluum-test

This is a project to illustrate to Voluum what we are trying to achieve with a real world example.


# Run Locally

## Run local web server (example with PHP)
Checkout this code and cd to the new directory and run a local webserver
```shell script
php -S localhost:8078
```

## Run the test
Go to the following link in your browser:
http://localhost:8078/

This is the main page which will list videos etc. from here there are 2 example links, video 1 and video2.

Video 1 is a working link and loads the tracking JS and it works as expected because there is an offer configured with the URL of http://localhost:8078/videos/video1.html?cid={clickid}&cmp={campaign.id}&traffic_source={trafficsource.id}

Video 2 does not work because the JS does not load, it gets a 400 response because there is no offer configured for this URL. We CANNOT create an offer for every single video page. We have over 12,000 videos, and they are updated all the time.

We need to know how to configure the site as like this example.

## What do we want to be able to do?
We want to be able to do this:
 - Main Page (log that a user landed on the page - maybe with pixel? But clickId will not be the same if using a pixel...)
 - Video Page - localhost:8078/{video-id}/{video-name}/ (log that the user viewed the "offers")
   -  onclick of the link to billing system, log custom conversion (i.e. offer-click)
 - Billing Join Page (log the postback and set - aff_payout, revenue, affiliate, custom_campaign, custom_join_type, custom_ad_id)
 
Then we want to be able to see everything by these dimensions (affiliate, custom_campaign, custom_join_type, custom_ad_id)
 - Net revenue
 - Visits / unique visits
 - Clicks (i.e. CTA clicks manually logged)
 - Conversions (each type of conversion e.g. maybe CC decline, view offer)
 - Offer Clicked (maybe this is #3 depending on how we have to implement)
 
We also would want to be able to see a join flow / funnel with stats for example see the drop off at each step e.g.
 - Load Main Page
 - Load Video Page
 - Click CTA
 - Conversion (sale)

### TLDR
Essentially, we want to be able to get to the point where we add tracking code to a page and add the JS library to the page which lists the join links and then do the postback at the end with custom params (the postback is not an issue - it's the tracking JS)
 

## Configuration
I have NOT configured a lander for this as we talked about on the call.
I configured a traffic source, a campaign (7c9410cb-7c14-4b5e-9c2e-18ca2c51562c)
