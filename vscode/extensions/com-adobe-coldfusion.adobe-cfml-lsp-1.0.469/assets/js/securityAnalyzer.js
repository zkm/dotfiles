const vscode = acquireVsCodeApi();
var rowsIdArr = [];
var unScannedFileInfo = [];
var reasonType = 'all';
let errDesc;
let unscannedDataArr = [];

window.addEventListener("resize", function() {
    toggleOnResize()
});


const i18n_en = {
    test: "test",

    title: "Title",
    problemstatement: "Problem Statement",
    solution: "Solution",

    sqlinjection_title: "SQL Injection",
    sqlinjection_name: "SQL Injection",
    sqlinjection_problemstatement: "The attacker can create arbitrary SQL statements to execute against the database by passing values into the vulnerable variables",
    sqlinjection_solution: "By using the cfqueryparam tag, you have parameterized the variable in your SQL query, which separates the variables (or parameters) in your SQL query from the SQL statements. In database terms, this is called a prepared statement, and can sometimes yield performance improvements in addition to security.",

    xss_title: "XSS",
    xss_name: "XSS",
    xss_problemstatement: "Using the vulnerable code, the attacker can pass JavaScript into the vulnerable variables that will be executed in the browser of anyone visiting the URL",
    xss_solution: "The EncodeForHTML function (requires ColdFusion 10 or higher) will encode the variable to escape special characters using their HTML entity. For example, the < character will be replaced with &lt;",

    htmltopdfxss_title: "PDF XSS",
    htmltopdfxss_name: "HTML To PDF XSS",
    htmltopdfxss_problemstatement: "The cfhtmltopdf tag, introduced in ColdFusion 11 provides powerful HTML rendering, powered by WebKit to produce PDF files. Because the HTML is rendered by the server, care should be taken when using variables in the PDF document.",
    htmltopdfxss_solution: "Consider running the PDF Generation service on an isolated dedicated server to mitigate the risks associated with the rendering of dynamic content.",

    passwords_title: "Hard-coded password should be avoided",
    passwords_name: "Passwords",
    passwords_problemstatement: "Hard coded passwords were found in the code",
    passwords_solution: "Passwords should be salted with a random unique string and stored using a one way function. ColdFusion provides the Hash function, a one way function which supports multiple algorithms implemented by the Java Cryptography Extension (JCE).,",

    fileupload_title: "Uploading files to server",
    fileupload_name: "File Upload",
    fileupload_problemstatement: "Whenever files are uploaded to the server, take extreme care to ensure that you have properly validated the file path and file type.",
    fileupload_solution: "Use strict attribute and keep it as true.When strict=true the file content is validated internally using the FileGetMimeType function. When strict=false, it uses the file extension of the uploaded file to match the mime type.",

    getvspost_title: "Get vs Post",
    getvspost_name: "Get vs Post",
    getvspost_problemstatement: "It is a good idea to ensure that certain operations only occur over the HTTP POST method, to prevent attack vectors that implicitly use HTTP GET (such as img tags or iframes).",
    getvspost_solution: "Use Post instead of Get for form submissions specially when it is submitting some sensitive information",

    cflocationvalidations_title: "Addtoken attribute of cflocation should be false",
    cflocationvalidations_name: "CF Location Validations",
    cflocationvalidations_problemstatement: "Avoid appending the session identifiers to the URL query string.End users will email, or publish URLs without realizing their session identifier is in the url. When you use the cflocation tag it will append the session identifier by default, unless you specify addtoken=false",
    cflocationvalidations_solution: "Addtoken attribute should be false and it will not append session identifiers in the url",

    cookiesvalidations_title: "HTTPOnly and Secure attribute of cfcookie should be true",
    cookiesvalidations_name: "CF Cookie",
    cookiesvalidations_problemstatement: "Since cookies are often used to maintain state or sessions, understanding practices to limit their transmission and readability can improve security",
    cookiesvalidations_solution: "When the secure attribute is enabled on a cookie, the browser will only send the cookie back to the server over a secure transport mechanism (such as HTTPS). If a cookie contains sensitive information (such as session identifiers) it should only be sent over a secure transport mechanism (to prevent eavesdropping), and thus should have the secure attribute enabled.If an attacker is able to exploit a XSS vulnerability, they can read the visitors cookies using JavaScripts document.cookie variable. In 2002 browser vendors began supporting a new cookie attribute called HttpOnly which prevents the cookie from being read by non HTTP APIs, such as JavaScript. So when a cookie is set with the HttpOnly attribute, its value is not available in document.cookie.",

    fileinjection_title: "File path injection",
    fileinjection_name: "File Injection",
    fileinjection_problemstatement: "An attacker can use the vulnerable code to read any file on the server that ColdFusion has access to. For example by requesting ?header=../../server-config.txt the attacker may read a configuration file that is not meant to be public.",
    fileinjection_solution: "Always validate variables used in file paths directly before use",

    csrf_title: "CSRF",
    csrf_name: "CSRF",
    csrf_problemstatement: "Cross Site Request Forgeries (CSRF) vulnerabilities are exploited when an attacker can trick an authenticated user into clicking a URL, or embedding a URL in a page that will be requested by their authenticated browser.",
    csrf_solution: "ColdFusion 10 added two functions for working with CSRF tokens, CSRFGenerateToken and CSRFVerifyToken",

    unnamedapp_title: "Unnamed Application",
    unnamedapp_name: "Unnamed Application",
    unnamedapp_problemstatement: "You have not defined name for your application",
    unnamedapp_solution: "Avoid creating unnamed applications",

    errors: "Errors",
    warnings: "Warnings",

    error: "Error",
    warning: "Warning",
    low: "Low",
    medium: "Medium",
    high: "High",
    security_issues: "Security Issues"

};

const i18n_ja = {
    test: "テスト",

    problemstatement: "問題文",
    solution: "解決",
    title: "題名",

    sqlinjection_title: "SQLインジェクション",
    sqlinjection_name: "SQLインジェクション",
    sqlinjection_problemstatement: "攻撃者は、脆弱な変数に値を渡すことにより、データベースに対して実行する任意のSQLステートメントを作成できます",
    sqlinjection_solution: "cfqueryparamタグを使用して、SQLクエリ内の変数をパラメーター化し、SQLクエリ内の変数（またはパラメーター）をSQLステートメントから分離します。データベース用語では、これはプリペアドステートメントと呼ばれ、セキュリティに加えてパフォーマンスの向上をもたらすことがあります。",

    xss_title: "XSS",
    xss_name: "XSS",
    xss_problemstatement: "攻撃者は脆弱なコードを使用して、JavaScriptを脆弱な変数に渡し、URLにアクセスした人のブラウザで実行されます。",
    xss_solution: "EncodeForHTML関数（ColdFusion 10以降が必要）は、HTMLエンティティを使用して特殊文字をエスケープするために変数をエンコードします。たとえば、<文字は＆lt;に置き換えられます。",

    htmltopdfxss_title: "PDF XSS",
    htmltopdfxss_name: "PDF XSS",
    htmltopdfxss_problemstatement: "ColdFusion 11で導入されたcfhtmltopdfタグは、強力なHTMLレンダリングを提供し、WebKitを使用してPDFファイルを生成します。 HTMLはサーバーによってレンダリングされるため、PDFドキュメントで変数を使用する場合は注意が必要です。",
    htmltopdfxss_solution: "分離された専用サーバーでPDF生成サービスを実行して、動的コンテンツのレンダリングに関連するリスクを軽減することを検討してください",

    passwords_title: "ハードコードされたパスワードは避けてください",
    passwords_name: "パスワード",
    passwords_problemstatement: "ハードコードされたパスワードがコードで見つかりました",
    passwords_solution: "パスワードはランダムな一意の文字列でソルト処理し、一方向の関数を使用して保存する必要があります。 ColdFusionは、Java Cryptography Extension（JCE）によって実装された複数のアルゴリズムをサポートする一方向関数であるハッシュ関数を提供します。",

    fileupload_title: "サーバーへのファイルのアップロード",
    fileupload_name: "ファイルのアップロード",
    fileupload_problemstatement: "ファイルがサーバーにアップロードされるときは常に、ファイルパスとファイルタイプが適切に検証されていることを確認するように細心の注意を払ってください",
    fileupload_solution: "strict属性を使用してtrueのままにします。strict= trueの場合、ファイルの内容はFileGetMimeType関数を使用して内部的に検証されます。 strict = falseの場合、アップロードされたファイルのファイル拡張子を使用してMIMEタイプを照合します。",

    getvspost_title: "Get vs Post",
    getvspost_name: "Get vs Post",
    getvspost_problemstatement: "HTTP GETを暗黙的に使用する攻撃ベクトル（imgタグやiframeなど）を防ぐために、特定の操作がHTTP POSTメソッドでのみ行われるようにすることをお勧めします。",
    getvspost_solution: "フォームの送信には、機密情報を送信する場合は特に、GetではなくPostを使用してください。",

    cflocationvalidations_title: "cflocationのAddtoken属性はfalseである必要があります",
    cflocationvalidations_name: "CFロケーション検証",
    cflocationvalidations_problemstatement: "URLクエリ文字列にセッション識別子を追加することは避けてください。エンドユーザーは、セッション識別子がURLに含まれていることを認識せずに、URLを電子メールで送信または公開します。 cflocationタグを使用すると、addtoken = falseを指定しない限り、デフォルトでセッション識別子が追加されます",
    cflocationvalidations_solution: "Addtoken属性はfalseである必要があり、URLにセッション識別子を追加しません",

    cookiesvalidations_title: "cfcookieのHTTPOnlyおよびSecure属性はtrueである必要があります",
    cookiesvalidations_name: "CFクッキー",
    cookiesvalidations_problemstatement: "Cookieは状態やセッションを維持するためによく使用されるため、その送信と可読性を制限するための慣行を理解することでセキュリティを向上させることができます",
    cookiesvalidations_solution: "cookieでセキュア属性が有効になっている場合、ブラウザは、セキュアなトランスポートメカニズム（HTTPSなど）を介してサーバーにCookieを送り返すだけです。 Cookieに機密情報（セッション識別子など）が含まれている場合、（盗聴を防止するために）安全なトランスポートメカニズムを介してのみ送信する必要があるため、secure属性を有効にする必要があります。攻撃者がXSS脆弱性を悪用できる場合、 JavaScriptのdocument.cookie変数を使用して訪問者のCookieを読み取ります。 2002年、ブラウザベンダーはHttpOnlyと呼ばれる新しいCookie属性のサポートを開始しました。これにより、JavaScriptなどの非HTTP APIによってCookieが読み取られなくなります。したがって、CookieがHttpOnly属性で設定されている場合、その値はdocument.cookieで使用できません。",

    fileinjection_title: "ファイルパスインジェクション",
    fileinjection_name: "ファイルインジェクション",
    fileinjection_problemstatement: "攻撃者は脆弱なコードを使用して、ColdFusionがアクセスできるサーバー上の任意のファイルを読み取ることができます。たとえば、？header = .. / .. / server-config.txtを要求することにより、攻撃者は公開することを意図していない構成ファイルを読み取る可能性があります。",
    fileinjection_solution: "常に使用前にファイルパスで使用される変数を直接検証",

    csrf_title: "CSRF",
    csrf_name: "CSRF",
    csrf_problemstatement: "クロスサイトリクエストフォージェリ（CSRF）の脆弱性は、攻撃者が認証されたユーザーをだましてURLをクリックさせたり、認証されたブラウザから要求されるページにURLを埋め込んだりするときに悪用されます。",
    csrf_solution: "ColdFusion 10には、CSRFトークンを操作するための2つの関数、CSRFGenerateTokenとCSRFVerifyTokenが追加されました",

    unnamedapp_title: "名前のないアプリケーション",
    unnamedapp_name: "名前のないアプリケーション",
    unnamed_problemstatement: "アプリケーションの名前が定義されていません",
    unnamed_solution: "名前のないアプリケーションを作成しない",

    errors: "エラー",
    warnings: "警告",
    security_issues: "セキュリティ上の問題",

    error: "エラー",
    warning: "警告",
    low: "低",
    medium: "中",
    high: "高い"
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

function init(errors, errorDesc) {
    errDesc = errorDesc;
    createTree(errors, errorDesc);
    runToggler();
    runChildToggler();
    createTable(errors, errorDesc);
    toggleOnResize();
}

function initUnScannedFile( nodeData ) {
    setUnScannedFileInfo( nodeData )
    runToggler();
    runUnscanChildToggler();
    createUnScannedTable();
    toggleOnResize();
}

function runUnscanChildToggler() {
    var toggler = document.getElementsByClassName("error");
    var i;
    for (i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function () {
            removeBG("error");
            removeBG("caret");
            this.classList.add("liText");
        });
    }
}

function runChildToggler() {
    var toggler = document.getElementsByClassName("liInnerText");
    var i;

    for (i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function () {
            removeBG("liInnerText");
            removeBG("caret");
            this.classList.add("liText");
        });
    }
}

function runToggler() {
    var toggler = document.getElementsByClassName( "caret" );
    var i;

    for ( i = 0; i < toggler.length; i++ ) {
        toggler[i].addEventListener("click", function() {
            if (this.parentElement.querySelector( ".nested" ) != null ) {
                this.parentElement.querySelector( ".nested" ).classList.toggle( "active" );
                removeBG( "caret" );
                removeBG( "liInnerText" );
                removeBG( "error" );
                this.classList.add( "liText" );
            }
            this.classList.toggle( "caret-down" );
        });
    }
}

function removeBG(className) {
    var toggler = document.getElementsByClassName(className);
    var i;

    for (i = 0; i < toggler.length; i++) {
        toggler[i].classList.remove("liText");
    }
}

function createAnalyserData(errors, errorDesc) {
    let parents = [];
    let output = [];
    errors.map(data => {
        parents.push(data.Error)
    });
    output.total = parents.length;
    parents = parents.filter((v, i, a) => a.indexOf(v) === i);
    parents.map(p => {
        let temp = errors.filter(e => e.Error === p);
        let labels = [];
        let childrenArray = [];
        temp.map(data => {
            labels.push(data.type)
        });
        labels = labels.filter((v, i, a) => a.indexOf(v) === i);
        labels.map(label => {
            let types = temp.filter(t => t.type === label);
            childrenArray.push({ key: label, value: types.length })
        })
        let tempObj = {
            parent: p,
            total: temp.length,
            children: childrenArray
        };
        output.push(tempObj)
    })
    return output;
}

function createTree( errors, errorDesc ) {
    let data = createAnalyserData(errors, errorDesc);
    var ul = document.getElementById("createTree");
    var li = document.createElement("li");
    var innerSpan = document.createElement("span");
    var innerSpanIcon = document.createElement("i");
    innerSpan.setAttribute("onClick", "showTblData('load-data','','')");
    // innerSpan.setAttribute("onClick", "showTblData('text-white'" + ',' + JSON.stringify(errorDesc) + ")");
    innerSpan.setAttribute("class", "caret");
    innerSpanIcon.setAttribute("class", "fa fa-chevron-right");
    innerSpan.appendChild(innerSpanIcon);
    innerSpan.appendChild(document.createTextNode(localize("security_issues") + " (" + data.total + ")"));
    li.appendChild(innerSpan);
    ul.appendChild(li);
    var innerUnorderList = document.createElement("ul");
    innerUnorderList.setAttribute("class", "nested SANestedTree");

    data.map((result, index) => {
        // parent
        var innerSpanIconSecondary = document.createElement("i");
        innerSpanIconSecondary.setAttribute("class", "fa fa-chevron-right");
        secondaryList = document.createElement("li");
        secondaryList.setAttribute("class", result.parent);
        var span = document.createElement("span");
        span.setAttribute("onClick", "showTblData('" + result.parent + "',1" + ',' + JSON.stringify(errorDesc) + ")");
        span.setAttribute("class", "caret");
        span.appendChild(innerSpanIconSecondary);
        span.appendChild(document.createTextNode(localize(`${result.parent}_name`) + " (" + result.total + ")"));
        secondaryList.appendChild(span);
        innerUnorderList.appendChild(secondaryList);
        li.appendChild(innerUnorderList);
        var secondaryUnorder = document.createElement("ul");
        secondaryUnorder.setAttribute("class", "nested SANestedTree");

        // child
        result.children.map((child, index) => {
            subList = document.createElement("li");
            subList.setAttribute("style", "cursor:pointer;");
            subList.setAttribute("class", "liInnerText");
            subList.setAttribute("onclick", "showTblData('" + result.parent + "_" + child.key + "',0" + ',' + JSON.stringify(errorDesc) + ")");
            var spanIcon = document.createElement("span");
            spanIcon.setAttribute("class", child.key == "error" ? "error pr-1" : "warning pr-1");
            subList.appendChild(spanIcon);
            var type = (child.key == "error") ? localize("errors") : localize("warnings");
            subList.appendChild(document.createTextNode(type + " (" + child.value + ")"));
            secondaryList.appendChild(secondaryUnorder);
            secondaryUnorder.appendChild(subList);
        });
    });
}

function setRowArr(params) {
    rowsIdArr.push(params);
}

function showTblData(errorName, parent, errorDesc) {
    if (errorName == "load-data") {
        document.getElementById("type").disabled = false;
        document.getElementById("type").value = "both";
        document.getElementById('validationTextarea').innerHTML = '';
    } else {
        document.getElementById("type").disabled = true;
    }
    if (parent == 0 && errorName.split("_")[1] != undefined) {
        document.getElementById("type").value = errorName.split("_")[1];
        document.getElementById("type").setAttribute("attack", errorName.split("_")[0]);
    } else {
        document.getElementById("type").value = "both";
        document.getElementById("type").setAttribute("attack", errorName.split("_")[0]);
    }
    rowsIdArr = [];
    var className = "";
    var rows = document.getElementsByTagName("table")[0].rows;
    for (var i = 1; i < rows.length; ++i) {
        if (parent) {
            className = rows[i].className.split(" ")[1];
        } else {
            className = rows[i].className.split(" ")[2];
        }
        if (errorName == "load-data") {
            rows[i].style.display = '';
        } else if (className == errorName) {
            rows[i].style.display = '';
            setRowArr(rows[i].id);
        } else {
            rows[i].style.display = 'none';
        }
    }
    if (!parent) {
        errorName = errorName.split("_")[0];
    }

    // show the right nav content from error name provided
    showRightNavContent( errorName );

    filterTblOnSelect();
}

function showRightNavContent( errorName ) {
    let res = "";

    if( errDesc.length ) {
        errDesc.map( thisDesc => {
            if( thisDesc.name == errorName ) {
                let temp = Object.keys( thisDesc.description ).reverse();
                if( temp.length > 2 )
                    temp = [ temp[0], temp[2], temp[1] ];
                temp.forEach( function( key ) {
                    res += `${localize(key)} : ${localize(thisDesc.name + '_' + key) != undefined ? localize(thisDesc.name + '_' + key) : " "} <br><br>`;
                });
            }
        });
        document.getElementById( "validationTextarea" ).innerHTML = res;
    }
}

function filterTblOnSelect() {
    // document.getElementById("noData").style.display = "none";
    var table = document.getElementById("errorTbl");
    var severity = document.getElementById("severityLevel").value.toUpperCase();
    var type = document.getElementById("type").value.toUpperCase();
    var errorName = document.getElementById("type").getAttribute('attack');
    var fileName = document.getElementById("filename").value;
    var tr = table.getElementsByTagName("tr");
    var count = 0;
    for (var i = 0; i < tr.length; i++) {
        var td0 = tr[i].getElementsByTagName("td")[0];
        var td1 = tr[i].getElementsByTagName("td")[4];
        var td2 = tr[i].getElementsByTagName("td")[5];
        var td3 = tr[i].getElementsByTagName("td")[3];
        if (td0) {
            var txtType = td1.getAttribute('type');
            var txtSeverity = td2.getAttribute('severityLevel');
            var txtFile = td0.textContent || td0.innerText;
            var attackName = td3.textContent || td3.innerText;
            if (txtType != null )
                txtType = txtType.trim();
            if (txtSeverity != null)
                txtSeverity = txtSeverity.trim();
            txtFile = txtFile.trim();
            var temp = errorName == 'load-data' ? true : attackName == errorName;
            if (type == "BOTH" && severity == "ALL" && fileName == "" && temp) {
                tr[i].style.display = "";
            } else {
                if (type == "BOTH" && severity != "ALL") {
                    if (txtSeverity.toUpperCase().indexOf(severity) > -1 && txtFile.indexOf(fileName) > -1 && temp) {
                        tr[i].style.display = "";
                    } else {
                        tr[i].style.display = "none";
                        count = count + 1;
                    }
                } else if (severity == "ALL" && type != "BOTH") {
                    if (txtType != null && txtType.toUpperCase().indexOf(type) > -1 && txtFile.indexOf(fileName) > -1 && temp) {
                        tr[i].style.display = "";
                    } else {
                        tr[i].style.display = "none";
                        count = count + 1;
                    }
                } else if (severity == "ALL" && type == "BOTH" && fileName != "") {
                    if (txtFile.indexOf(fileName) > -1 && temp) {
                        tr[i].style.display = "";
                    } else {
                        tr[i].style.display = "none";
                        count = count + 1;
                    }
                } else {
                    if (txtSeverity != null && txtSeverity.toUpperCase().indexOf(severity) > -1 && txtType.toUpperCase().indexOf(type) > -1 && txtFile.indexOf(fileName) > -1 && temp) {
                        tr[i].style.display = "";
                    } else {
                        tr[i].style.display = "none";
                        count = count + 1;
                    }
                }
            }
        }
    }
    if (parseInt(count + 1) == tr.length) {
        // document.getElementById("noData").style.display = "";
    }
}

function createTable(errors, errorDesc) {
    var tableElement = document.getElementById("errorTbl");
    var tbody = document.getElementById("bodyData");
    // document.getElementById("noData").style.display = "none";

    errors.map((data, index) => {
        tblRow = document.createElement('tr');
        tblRow.setAttribute( "class", "load-data cursor-pointer " + data.Error + " " + data.Error + "_" + data.type );
        tblRow.setAttribute("id", data.Error + "_" + index);
        action = document.createElement('td');
        actionBtn1 = document.createElement("button");
        actionBtn2 = document.createElement("button");
        actionBtn3 = document.createElement("button");
        actionBtn1.setAttribute("class", "btn actionBtn btnFixed");
        actionBtn1.setAttribute("id", "fixed_" + index);
        actionBtn1.setAttribute("onclick", `updateStatus(${data.Error + "_" + index},"fixedStatus",${JSON.stringify(data)},${index})`);
        // TODO: This needs to have i18n???
        actionBtn1.setAttribute("title","Mark as Fixed");
        actionBtn2.setAttribute("class", "btn actionBtn ml-2 btnIgnore");
        actionBtn2.setAttribute("id", "ignore_" + index);
        actionBtn2.setAttribute("onclick", `updateStatus(${data.Error + "_" + index},"ignoreStatus",${JSON.stringify(data)},${index})`);
        // TODO: This needs to have i18n???
        actionBtn2.setAttribute("title", "Mark as Ignored");
        actionBtn3.setAttribute("class", "btn actionBtn btnToFix");
        actionBtn3.setAttribute("id", "toFix_" + index);
        actionBtn3.setAttribute("style", "display:none");
        actionBtn3.setAttribute("title", "Mark as To Fix");
        actionBtn3.setAttribute("onclick", `updateStatus(${data.Error + "_" + index},"",${JSON.stringify(data)},${index})`);

        data.path = data.path.replace(/\\\\/g, "\\");
        data.filePath = data.path + " : " + data.beginline;
        filename = document.createElement('td');
        filename.setAttribute("style", "word-wrap:break-word;");
        angerTag = document.createElement("a");
        angerTag.href = data.path;
        angerTag.ondblclick = () => openFileWithSelection(data, errors);
        angerTagPath = document.createElement("a");
        angerTagPath.href = data.path;
        angerTagPath.ondblclick = () => openFileWithSelection(data, errors);
        filepath = document.createElement('td');
        attackname = document.createElement('td');
        type = document.createElement('td');
        type.setAttribute("type", data.type);
        securitylevel = document.createElement('td');
        securitylevel.setAttribute("severityLevel", data.severityLevel);
        errorstatus = document.createElement('td');

        angerTag.appendChild(document.createTextNode(data.filename));
        angerTagPath.appendChild(document.createTextNode(data.filePath));

        filename.appendChild(angerTag);
        filepath.appendChild(angerTagPath);
        attackname.appendChild(document.createTextNode(data.Error));
        type.appendChild(document.createTextNode(localize(data.type)));
        securitylevel.appendChild(document.createTextNode(localize(data.severityLevel)));
        errorstatus.appendChild(document.createTextNode(""));
        actionBtnContainer = document.createElement("div");
        actionBtnContainer.setAttribute("class","d-flex d-center justify-content-center");
        actionBtnContainer.appendChild(actionBtn1);
        actionBtnContainer.appendChild(actionBtn2);
        actionBtnContainer.appendChild(actionBtn3);
        action.appendChild(actionBtnContainer);

        tblRow.appendChild(filename);
        tblRow.appendChild(action);
        tblRow.appendChild(filepath);
        tblRow.appendChild(attackname);
        tblRow.appendChild(type);
        tblRow.appendChild(securitylevel);
        tblRow.appendChild(errorstatus);
        // add click event to show the right nav content using the error name provided
        tblRow.onclick = () => showRightNavContent( data.Error );

        tbody.appendChild(tblRow);

    });
}

function updateStatus(obj, text,data,id) {
    var filePath = obj.getElementsByTagName('td')[1].innerText;

    var Row = document.getElementById(obj.id);
    var cells = Row.getElementsByTagName("td")[6];
    cells.setAttribute("class", text);
    if(text == "") {
        document.getElementById("fixed_" + id).style.display = "block";
        document.getElementById("ignore_" + id).style.display = "block";
        document.getElementById("toFix_" + id).style.display = "none";
    }else{
        document.getElementById("fixed_" + id).style.display = "none";
        document.getElementById("ignore_" + id).style.display = "none";
        document.getElementById("toFix_" + id).style.display = "block";
    }
    const res = { path: filePath, process: `${text == "" ? "toFix" : text == "fixedStatus" ? "fixed" : "ignoreFile"}`, data: data}
    vscode.postMessage(res);
}

function openFile( param ) {
    const res = { path: param, process: 'openFile',openFileAlone:true}
    vscode.postMessage(res);
}

function openFileWithSelection(data, errors ){
    data.process = "openFile";
    data.openFileAlone = false;
    data.errorsList = JSON.stringify(errors.filter((datas) => datas.filename == data.filename));
    data.openFromWebview = true;
    vscode.postMessage(data);
}

function downloadReport(param) {
    let $table = $( "#errorTbl" );
    let orderBy = $( $table.find( "th.sorting_asc" ) ).attr( "id" ) ;
    let order =  "asc";

    if( orderBy === undefined ){
        orderBy = $( $table.find( "th.sorting_desc" ) ).attr( "id" );
        order = "desc";
    }
    orderBy = orderBy ? orderBy : "filename";

    const res = {
        filePath: param,
        process: "download",
        initialErrors: JSON.parse( $( "#initialErrors" ).val().replace(/'/g, '\"') ),
        vulnerablityType: document.getElementById( "type" ).value,
        severityLevel: document.getElementById( "severityLevel" ).value,
        fileName: document.getElementById( "filename" ).value,
        attackName: document.getElementById("type").getAttribute( "attack" ),
        orderBy: orderBy,
        order: order
    };
    vscode.postMessage(res);
}


function filterUnscannedTblData(params) {
    const reasonType = getReasonType();
    const resData = getReasonTypeData(reasonType);
    showUnScannedTable( resData, params );
}

function showTblContent(params) {
    setReasonType(params);
    const resData = getReasonTypeData(params);
    var fileInput = document.getElementById( "searchInput" );
    var filter = fileInput.value || '';
    showUnScannedTable(resData, filter);
}

function getReasonTypeData(type) {
    const dataArr = getUnScannedFileInfo();
    return type !== 'all' ? dataArr.filesnotscanned.filter(i => i.reason === type) :
        dataArr.filesnotscanned;
}

function setUnScannedFileInfo( info ) {
    unScannedFileInfo = info;
}

function getUnScannedFileInfo() {
    return unScannedFileInfo;
}

function setReasonType(type) {
    reasonType = type;
}

function getReasonType() {
    return reasonType;
}

function createUnScannedTable() {
    const dataArr = getUnScannedFileInfo();
    if ( dataArr.filesnotscanned == undefined )
        $( "#unScannedTable" ).DataTable( {
            searching: false,
            paging: false,
            info: false,
        } );
    else
        showUnScannedTable( dataArr.filesnotscanned, "" )
}

function createJSONForUnscannedTab( data ) {
    if ( data != undefined ) {
        data.map( ( item, index ) => {
            var fileName = item.filename;
            var n = item.filename.lastIndexOf( "\\" );
            var path = item.filename.replace( /\\/g, "/" );
            fileName = fileName.replace( fileName.substring( 0, n + 1 ), "" );
            let tmpFile = {};
            tmpFile [ "Name" ] = fileName; // for name column
            tmpFile [ "Path" ] = path; // for path column
            tmpFile [ "Reason" ] = item.reason; // for reason column
            unscannedDataArr.push( tmpFile );
        });

        $( "#unScannedTable" ).DataTable( {
            searching: false,
            paging: false,
            info: false,
            columns: [
                {
                    "data": "Name",
                    "render": function (data, type, row, meta) {
                        if (type === 'display') {
                            data = `<a href="${data}" ondblclick="openFile( '${data}' )" >${data}</a>`;
                        }
                        return data;
                    }
                },
                {
                    "data": "Path",
                    "render": function ( data, type, row, meta ) {
                        if ( type === 'display' ) {
                            data = `<a href="${data}" ondblclick="openFile( '${data}' )" >${data}</a>`;
                        }
                        return data;
                    }
                },
                { "data": "Reason" }
            ],
            data: unscannedDataArr
        });
    }
}

function showUnScannedTable( data, searchTerm ) {
    var tbody = document.getElementById( "unScannedTbody" );
    createJSONForUnscannedTab( data );
    $( "#unScannedTbody" ).empty();

    if ( data != undefined ) {
        data.map( ( item, index ) => {
            var fileName = item.filename;
            var n = item.filename.lastIndexOf( "\\" );
            var path = item.filename.replace( /\\/g, "/" );
            fileName = fileName.replace( fileName.substring( 0, n + 1 ), "" );

            if ( ( searchTerm !== '' && fileName.toUpperCase().includes( searchTerm.toUpperCase() ) || searchTerm === '' ) ) {
                tblRow = document.createElement( "tr" );

                // First td
                filename = document.createElement( "td" );
                filename.setAttribute( "id", `filePath-${index}` );
                filename.ondblclick = () => openFile( `${path}` );
                angerTag = document.createElement( "a" );
                angerTag.href = path;
                angerTag.appendChild( document.createTextNode( fileName ) );
                filename.appendChild( angerTag );

                // Second td
                filePath = document.createElement( "td" );
                filePath.setAttribute( "id", `filePath-${index}` );
                filePath.ondblclick = () => openFile( `${path}` );
                angerTag = document.createElement( "a" );
                angerTag.href = path;
                angerTag.appendChild( document.createTextNode( item.filename ) );
                filePath.appendChild( angerTag );

                // Third td
                reason = document.createElement( "td" );
                reason.appendChild( document.createTextNode( item.reason ) );

                // Row append
                tblRow.appendChild( filename );
                tblRow.appendChild( filePath );
                tblRow.appendChild( reason );

                tbody.appendChild( tblRow );
            }
        });
    }
}

function toggleLeftNav() {
    if (!hasClass(document.getElementById("createTree"), "active")) {
        addClass(document.getElementById("createTree"), "active");
        document.getElementById("createTree").style.display = "none";
        removeClass(document.getElementById("sa_leftSidebar"), "col-md-2");
    } else {
        removeClass(document.getElementById("createTree"), "active");
        document.getElementById("createTree").style.display = "block";
        addClass(document.getElementById("sa_leftSidebar"), "col-md-2");
    }
}

function toggleRightNav() {
    if (!hasClass(document.getElementById("validationTextarea"), "active")) {
        addClass(document.getElementById("validationTextarea"), "active");
        document.getElementById("validationTextarea").style.display = "none";
        removeClass(document.getElementById("sa_rightSidebar"), "col-md-2");
    } else {
        removeClass(document.getElementById("validationTextarea"), "active");
        document.getElementById("validationTextarea").style.display = "block";
        addClass(document.getElementById("sa_rightSidebar"), "col-md-2");
    }
}

function toggleLeftNavScan() {
    if (!hasClass(document.getElementById("leftSidebar"), "active")) {
        addClass(document.getElementById("leftSidebar"), "active");
        document.getElementById("leftSidebar").style.display = "none";
        removeClass(document.getElementById("sc_leftSidebar"), "col-md-2");
    } else {
        removeClass(document.getElementById("leftSidebar"), "active");
        document.getElementById("leftSidebar").style.display = "block";
        addClass(document.getElementById("sc_leftSidebar"), "col-md-2");
    }
}

function toggleOnResize() {
    if (window.innerWidth <= 768) {
        if (document.getElementById("validationTextarea")) {
            if (hasClass(document.getElementById("validationTextarea"), "active")) {
                document.getElementById("sa_sideBarLinkLeft").click();
            }
            if (hasClass(document.getElementById("validationTextarea"), "active")) {
                document.getElementById("sa_sideBarLinkRight").click();
            }
        } else {
            if (hasClass(document.getElementById("leftSidebar"), "active")) {
                document.getElementById("sc_sideBarLinkLeft").click();
            }
        }
    }
}

function hasClass(el, className) {
    if (el.classList)
        return el.classList.contains(className);
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}

function addClass(el, className) {
    if (el.classList)
        el.classList.add(className)
    else if (!hasClass(el, className))
        el.className += " " + className;
}

function removeClass(el, className) {
    if (el.classList) {
        el.classList.remove(className)
    } else if (hasClass(el, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        el.className = el.className.replace(reg, ' ');
    }
}

// DataTable for SA Results
$( function () {
    $( "#errorTbl" ).DataTable( {
        searching: false,
        paging: false,
        info: false
    });
});