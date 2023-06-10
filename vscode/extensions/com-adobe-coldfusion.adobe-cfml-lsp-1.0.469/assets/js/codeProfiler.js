const vscode = acquireVsCodeApi();

function postData( filePath, lineNumber ) {
    vscode.postMessage( {
        filepath: filePath,
        line: lineNumber
    } );
}

function openFolderPicker() {
	config = {
		"file": document.forms[0].file.value,
		"newFileName": document.forms[0].newFileName.value,
		"isSubmitted": ""
	};

	vscode.postMessage({
		command: "openFolderPicker",
		text: config
	});
}

function runToggler() {
    var toggler = document.querySelectorAll(".fa");
    var i;
    for (i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function (e) {
            if (this.parentElement.parentElement.nextSibling != null) {
                this.parentElement.parentElement.nextSibling.classList.toggle("active");
                this.classList.toggle("caret-down");
            }
        });
    }
}

function runHighlightToggler() {
    var toggler = document.querySelectorAll(".pmtInnerText");
    var i;
    for (i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function (e) {
            removeBG("pmtInnerText");
            this.classList.add("pmtText");
        });
    }
}

function removeBG(className) {
    var toggler = document.getElementsByClassName(className);
    var i;
    for (i = 0; i < toggler.length; i++) {
        toggler[i].classList.remove("pmtText");
    }
}

function init() {
    let jsonContent = document.getElementById("fileContent").value.trim();
    jsonContent = jsonContent.replace( /'/g, '\"' );
    jsonContent = JSON.parse( jsonContent );
    let cpData = jsonContent;
    let noOfExecutes = cpData.length;
    let i = 0;
    while ( i < noOfExecutes ) {
        let allExecutions = cpData[i];
        let executions = allExecutions[ "executions" ];
        for ( let j = 0; j < executions.length; j++ ) {
            let temp = [];
            temp.push( executions[ j ].code_flow.tag_stack );
            createTree( temp, document.getElementById( "PMTtree" ) );
        }
        i++;
    }
    runToggler();
    runHighlightToggler();
}

function createTree( orgData, targetUL ) {
    var i;
    for ( i = 0; i < orgData.length; i++ ) {
        if ( orgData[i].hasOwnProperty( "id" ) && orgData[i].hasOwnProperty( "children" )) {
            let line = orgData[i].id;
            let pathLineTime = line.split( " :" );
            let nameText = "";
            let path = "";
            let lineNumber = "";
            if ( pathLineTime.length == 2 ) {
                path = pathLineTime[0];
                let pathAndFunction = path.split( " " );
                let functionName = "";
                if ( pathAndFunction.length == 2 ) {
                    path = pathAndFunction[0].trim();
                    functionName = pathAndFunction[1];
                }
                let lineTime = pathLineTime[1];
                let lineTimeA = lineTime.split( ":" );
                lineNumber = lineTimeA[0];
                let timeTaken = lineTimeA[1];
                nameText = path;
                if( functionName != "" )
                    nameText = nameText + "\xa0" + functionName;
                if ( parseInt( lineNumber ) != 0 )
                    nameText = nameText + "\xa0:" + lineNumber;

                nameText = nameText + "\xa0\xa0\xa0\xa0" + timeTaken + "ms";
            }
            var newLI = document.createElement( "li" );
            newLI.setAttribute( "class", "cursor-pointer" );
            let childPath = path.replace( /\\/g, "\\\\" );
            var innerSpan = document.createElement( "span" );
            var innerSpanIcon = document.createElement( "i" );
            if ( Array.isArray( orgData[i].children ) && orgData[i].children.length ) {
                innerSpan.setAttribute( "class", "caret" );
                innerSpanIcon.setAttribute( "class", "fa fa-chevron-right" );
            }
            innerSpan.appendChild( innerSpanIcon );
            let nameLabel = document.createElement("span");
            nameLabel.setAttribute( "ondblclick", "postData( '" + childPath + "'," + lineNumber + " )" );
            nameLabel.setAttribute( "class", "pmtInnerText" );
            nameLabel.appendChild( document.createTextNode( nameText ) )
            innerSpan.appendChild( nameLabel );

            newLI.appendChild( innerSpan );
            targetUL.appendChild( newLI );
        }
        if ( orgData[i].hasOwnProperty( "children" ) ) {
            if ( Array.isArray( orgData[i].children ) && orgData[i].children.length ) {
                var newUL = document.createElement( "ul" );
                newUL.setAttribute( "class", "nested" );
                var lowUl = targetUL.appendChild(newUL);
                var lowUL = targetUL.querySelector( "ul" );
                createTree( orgData[i].children, newUL );
            }
        }
    }
}