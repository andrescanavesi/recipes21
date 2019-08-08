const SibApiV3Sdk = require("sib-api-v3-sdk");
const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.R21_SENDINBLUE_API_KEY_V3;

sendTransacEmail();

//still is not enabled
function sendTransacEmail() {
    var apiInstance = new SibApiV3Sdk.SMTPApi();

    var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

    sendSmtpEmail = {
        to: [
            {
                email: "andres.canavesi@gmail.com",
                name: "Andres Canavesi",
            },
        ],
        templateId: 8,
        params: {
            name: "John",
            surname: "Doe",
        },
        headers: {
            "X-Mailin-custom": "custom_header_1:custom_value_1|custom_header_2:custom_value_2",
        },
    };

    apiInstance.sendTransacEmail(sendSmtpEmail).then(
        function(data) {
            console.log("API called successfully. Returned data: " + data);
        },
        function(error) {
            console.error(error);
        }
    );
}

//works
function sendCampaign() {
    const apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
    const emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();

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
}
