var SibApiV3Sdk = require("sib-api-v3-sdk");
var defaultClient = SibApiV3Sdk.ApiClient.instance;

var apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.R21_SENDINBLUE_API_KEY_V3;

var apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
var emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();

emailCampaigns.name = "Campaign sent via the API";
emailCampaigns.subject = "My subject";
emailCampaigns.sender = {name: "From name", email: "recipes21.com@gmail.com"};
emailCampaigns.type = "classic";
emailCampaigns.htmlContent = "Hello! This is a test from the Sendinblue's API";
emailCampaigns.recipients = {listIds: [2]};

apiInstance.createEmailCampaign(emailCampaigns).then(
    function(data) {
        console.info("API called successfully. Returned data: ");
        console.info(data);
    },
    function(error) {
        console.error(error);
    }
);
