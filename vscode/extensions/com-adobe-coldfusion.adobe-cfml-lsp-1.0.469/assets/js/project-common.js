const i18n_en = {
    "adobe-cfml.project.linkedFolder.error"                     : "Cannot create a link to {path} because it overlabs the location of the project that contains the linked resource.",

    "adobe-cfml.project.linkedFolder.errorLinkedFolderLocation" : "Location is not provided",
    "adobe-cfml.project.linkedFolder.errorLinkedFoldername"     : "Link name is not provided"
};

const i18n_ja = {
    "adobe-cfml.project.linkedFolder.error"                      : "リンクされたリソースを含むプロジェクトの場所と重複しているため、{path}へのリンクを作成できません。",
    "adobe-cfml.project.linkedFolder.errorLinkedFolderLocation"  : "リンク名は提供されていません",
    "adobe-cfml.project.linkedFolder.errorLinkedFoldername"      : "場所は提供されていません",
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