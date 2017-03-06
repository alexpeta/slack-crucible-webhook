var express = require('express');
var restify = require('restify');
var slackMessageHelper = require('./src/slackMessageHelper');

var app = express();

var slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
var crucibleRestUrl = process.env.CRUCIBLE_REST_URL;

var cachedReviews = [];
var reviewsToBroadcast = [];

var slackRestClient = restify.createJsonClient({ url: slackWebhookUrl });
var crucibleRestClient = restify.createJsonClient({ url: crucibleRestUrl });

function postToSlack(text, attachments)
{
    slackRestClient.post('', {"channel":"#code-reviews","username": "CrucibleBot", "text": text ,"icon_emoji": ":doge:", "attachments": attachments}, function(err, req, res, obj) {
        if(err)
        {
            console.log(err);
        }
    });
}

function pollReviews()
{
    reviewsToBroadcast.slice(0);

    crucibleRestClient.get('',function(err, req, res, obj) {
        
        if (obj.reviewData.length > 0)
        {
            for(var i=0; i< obj.reviewData.length; i++)
            {
                var newReview = obj.reviewData[i];
                var index = cachedReviews.findIndex(function(cachedReview){
                    return cachedReview.permaId.id == newReview.permaId.id;
                });

                if (index < 0)
                {
                    reviewsToBroadcast.push(newReview);
                }
            }
        }

        for(var j=0; j<reviewsToBroadcast.length;j++)
        {
            var review = reviewsToBroadcast[j];
            var attachments = slackMessageHelper.getSlackMessageAttachments(review);
            postToSlack("", attachments);
            cachedReviews.push(review);
        }
    }); 
}

app.listen(3000, function () 
{
  console.log('Example app listening on port 3000!');
  var t = setTimeout(pollReviews, 4000);
})