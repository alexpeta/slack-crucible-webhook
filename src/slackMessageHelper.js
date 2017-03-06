
function getSlackMessageAttachments(review)
{
    var attachement = [
            {
                "fallback": `New review : [${review.permaId.id}] ${review.name} by ${review.creator.userName}`,
                "color": "#36a64f",
                "pretext": "New review",
                "author_name": review.creator.userName,
                "author_link": "http://localhost:8060/user/Alex",
                "author_icon": "http://laptop423:8060/avatar/Alex?s=48",
                "title": `[${review.permaId.id}] ${review.name}`,
                "title_link": "https://api.slack.com/",
                "text": "",
                "ts": new Date(review.createDate).getTime()/1000|0
            }
    ];

    return attachement;
}

exports.getSlackMessageAttachments = getSlackMessageAttachments;

