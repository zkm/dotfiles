const i18n_en = {
    "adobe-cfml.services-browser.serverNotStart"   : "Unable to get meta data for cfc",
    "adobe-cfml.services-browser.connectionTimeOut": "Unable to connect to server",

};

const i18n_ja = {
    "adobe-cfml.services-browser.serverNotStart"   : "cfc \u306e\u30e1\u30bf\u30c7\u30fc\u30bf\u3092\u53d6\u5f97\u3067\u304d\u307e\u305b\u3093\u3002",
    "adobe-cfml.services-browser.connectionTimeOut": "サーバーに接続できません"
};

function localize(message) {
    var type = document.getElementById("languageID").value;
    message = message || "en";
    let result;
    if (type == "en" && i18n_en.hasOwnProperty(message)) {
        result = i18n_en[message];
    } else if (type == "ja" && i18n_ja.hasOwnProperty(message)) {
        result = i18n_ja[message];
    }
    return result;
}