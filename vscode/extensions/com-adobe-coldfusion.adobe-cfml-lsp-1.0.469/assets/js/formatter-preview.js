const renderPreview = new Vue({
    el      : '#pills-formatter',
    mounted : function () {
        previewEditor 		= new CodeMirror( this.$refs.codemirror, {
            mode        : 'htmlmixed',
            theme       : 'material',
            autoRefresh : true,
            lineNumbers : true,
            tabSize     : 2,
            readOnly    : "nocursor",
            value       : this.replacePlaceholders( this.getCodeForTab( "general", this.$refs.tagcase.value == "2" ? true : false, this.$refs.attributecase.value == "2" ? true : false  ) ),
        } );
    },
    methods: {
        replacePlaceholders: function ( raw, tab ) {
            var res = raw;

            if( !this.$refs.putcfoutputonnewline.checked ){
                res = res.replace( /\$\$outEOL\$\$/gi, "$$$EOL$$$" );
                res = res.replace( /\$\$outTAB\$\$/gi, "$$$TAB$$$" );
            }

            if( this.$refs.maxatributesperline.name == "maxatributesperline" && this.$refs.maxatributesperline.value != "" ) {
                var regexExp        = "\\$\\$" + this.$refs.maxatributesperline.value + "\\$\\$";
                var regexExpCreate  = new RegExp( regexExp, "gi" );

                res                 = res.replace( regexExpCreate, "$$$EOL$$$" );
            }

            let sigleConditionChecked = [
                { "spacebetweenasignments"                  : [ { "aroundEqualSpace" : " " } ] },
                { "spacebetweenoperators"                   : [ { "aroundOperatorSpace" : " " } ] },
                { "spacearoundfunctionparams"               : [ { "aroundFunctionSpace" : " " } ] },
                { "spacebetweenfunctionparams"              : [ { "afterCommaFunctionSpace" : " " } ] },
                { "spacearoundfunctionarguments"            : [ { "functionArguSpace" : " " } ] },
                { "spacebetweenfunctionarguments"           : [ { "afterComafunctionArguSpace" : " " } ] },
                { "spacearoundarrayandstructinitializers"   : [ { "StructInitializerSpace" : " " } ] },
                { "spacebetweenstructinitializers"          : [ { "afterComaStructInitializerSpace" : " " } ] },
                { "spacebetweenstatementsinforloop"         : [ { "spacebetweenstatementsinforloop" : " " } ] },
                { "spacebeforeendtag"                       : [ { "spacebeforeendtag" : " " } ] },
                { "spacebeforeopeningroundbrace"            : [ { "spacebeforeopeningroundbrace" : " " } ] },
                { "blanklinebeforefunctiondeclaration"      : [ { "blanklinebeforefunctiondeclaration" : "\n" } ] },
                { "blanklineafterfunctiondeclaration"       : [ { "blanklineafterfunctiondeclaration" : "\n" } ] },
                { "blanklineafterfunctionarguments"         : [ { "blanklineafterfunctionarguments" : "\n" } ] },
                { "blanklinebeforeswitchblock"              : [ { "blanklinebeforeswitchblock" : "\n" } ] },
                { "blanklineafterswitchblock"               : [ { "blanklineafterswitchblock" : "\n" } ] },
                { "blanklinebeforescriptblock"              : [ { "blanklinebeforescriptblock" : "\n" } ] },
                { "blanklineafterscriptblock"               : [ { "blanklineafterscriptblock" : "\n" } ] },
                { "blanklinebeforeelseandelseif"            : [ { "blanklinebeforeelseandelseif" : "\n\t\t\t\t" } ] },
            ];

            sigleConditionChecked.map( ( data ) => {
                let keyFields = Object.keys( data )[ 0 ];

                data[ keyFields ].map( fields => {
                    let keyData         = Object.keys( fields )[ 0 ];
                    let regexExpCreate  = new RegExp( "\\$\\$" + keyData + "\\$\\$", "gi");
                    if( this.$refs[ keyFields ].checked ){
                        res = res.replace( regexExpCreate, fields[ keyData ] );
                    } else{
                        res = res.replace( regexExpCreate, "" );
                    }
                } );
            } );

            if( this.$refs.xmlstyletaglist ){
                var endTagOptionsArr = [];

                $( "#xmlstyletaglist option" ).each( function () {
                    endTagOptionsArr.push( $( this ).val() );
                } );

                res = !endTagOptionsArr.includes( "cfargument" ) ? res.replace( /\$\$cfargumentEndTag\$\$/gi, "$$$removedEndTag$$$" ) : res ;
                res = !endTagOptionsArr.includes( "cfproperty" ) ? res.replace( /\$\$cfpropertyEndTag\$\$/gi, "$$$removedEndTag$$$" ) : res ;
            }

            // component new line
            if( this.$refs.bracespositioncomponentdeclaration.value == "0" ) {
                res = res.replace( /\$\$componentEOL\$\$/gi, "" );
            } else{
                res = res.replace( /\$\$componentEOL\$\$/gi, "\n" );
            }

            // Funtion new line
            if( this.$refs.bracespositionfunctiondeclaration.value == "0" ) {
                res = res.replace( /\$\$functionEOL\$\$\$\$TAB\$\$/gi, "" );
            } else{
                res = res.replace( /\$\$functionEOL\$\$\$\$TAB\$\$/gi, "\n\t" );
            }

            // If new line
            if( this.$refs.bracespositionifblock.value == "0" ) {
                res = res.replace( /\$\$ifEOL\$\$\$\$TAB\$\$\$\$TAB\$\$/gi, "" );
            } else{
                res = res.replace( /\$\$ifEOL\$\$\$\$TAB\$\$\$\$TAB\$\$/gi, "\n\t\t" );
            }

            // Else new line
            if( this.$refs.bracespositionelseblock.value == "0" ) {
                res = res.replace( /\$\$elseEOL\$\$\$\$TAB\$\$\$\$TAB\$\$/gi, "" );
            } else {
                res = res.replace( /\$\$elseEOL\$\$\$\$TAB\$\$\$\$TAB\$\$/gi, "\n\t\t" );
            }

            // Switch new line
            if( this.$refs.bracespositionswitchblock.value == "0" ) {
                res = res.replace( /\$\$switchEOL\$\$\$\$TAB\$\$\$\$TAB\$\$/gi, "" );
            } else{
                res = res.replace( /\$\$switchEOL\$\$\$\$TAB\$\$\$\$TAB\$\$/gi, "\n\t\t" );
            }

            // try new line
            if( this.$refs.bracespositiontryblock.value == "0" ) {
                res = res.replace( /\$\$tryEOL\$\$\$\$TAB\$\$\$\$TAB\$\$/gi, "" );
            } else{
                res = res.replace( /\$\$tryEOL\$\$\$\$TAB\$\$\$\$TAB\$\$/gi, "\n\t\t" );
            }

            // Indentation Tab functionality
            let setListOfDoNotIndent    = [ "cfcatch", "cfelseif", "cfelse", "cffinally", "cfif", "cfdump", "cfscript", "cfabort" ];
            let listOfEndTagOnNewLine   = $.map( $( "#endtagonnewline option" ), function ( e ) { return e.value; } );

            setListOfDoNotIndent.map( data => {
                let regexExp = "\\$\\$" + data + "\\$\\$";
                let regexExpCreate = new RegExp( regexExp, "gi" );
                let removeIndentForDeleteValues = ( listOfEndTagOnNewLine.indexOf( data ) > -1 );

                if( removeIndentForDeleteValues ) {
                    res = data == "cfif"        ? res.replace(/\$\$if\$\$\$\$Indent\$\$/gi, "")                                 : res;
                    res = data == "cfabort"     ? res.replace(/(?<=\$\$abortStart\$\$)(.*)(?=\$\$abortEnd\$\$)/gi, "")          : res;
                    res = data == "cfscript"    ? res = res.replace(/\$\$script\$\$\$\$Indent\$\$/gi, "")                       : res;
                    res = data == "cfdump"      ? res.replace(/(?<=\$\$dumpStart\$\$)(.*)(?=\$\$dumpEnd\$\$)/gi, "")            : res;
                    res = data == "cfdump"      ? res = res.replace(/(?<=\$\$dumpStartSec\$\$)(.*)(?=\$\$dumpEndSec\$\$)/gi, ""): res;

                    res = res.replace( regexExpCreate, "" );
                } else{
                    if( this.$refs.tabpolicy.value == 1 && this.$refs.tabcount.value != "0" && this.$refs.tabcount.value != "" ) {
                        for( let index = 0; index < this.$refs.tabcount.value; index++ ) {
                            res = res.replace( regexExpCreate, "$$$Indent$$$" );
                        }
                    }

                    if( this.$refs.tabpolicy.value == 2 && this.$refs.tabsize.value != "0" && this.$refs.tabsize.value != "" ) {
                        for( let index = 0; index < this.$refs.tabsize.value; index++ ) {
                            res = res.replace( regexExpCreate, "$$$IndentSize$$$" );
                        }
                    }
                }
            } );

            if( this.$refs.tabpolicy.value == 1 && this.$refs.tabcount.value != "0" && this.$refs.tabcount.value != "" ) {
                let tabCount = "\t\t";

                res = res.replace(/\$\$Indent\$\$/gi, "$$$IndentTAB$$$");
                res = res.replace( /\$\$IndentTAB\$\$/gi, tabCount.repeat( this.$refs.tabcount.value ) );
            }

            if( this.$refs.tabpolicy.value == 2 && this.$refs.tabsize.value != "0" && this.$refs.tabsize.value != "" ) {
                let tabsize = " ";

                res = res.replace(/\$\$Indent\$\$/gi, "$$$IndentSize$$$");
                res = res.replace( /\$\$IndentSize\$\$/gi, tabsize.repeat( this.$refs.tabsize.value ) );
            }

            res = res.replace( /\$\$EOL\$\$/gi, "\n" );
            res = res.replace( /\$\$BEFOREBLANKLINEFUNC\$\$/gi, "\n" );
            res = res.replace( /\$\$AFTERBLANKLINEFUNC\$\$/gi, "\n" );
            res = res.replace( /\$\$TAB\$\$/gi, "\t" );
            res = res.replace( /\$\$cfcatch\$\$/gi, "" );
            res = res.replace( /\$\$cffinally\$\$/gi, "" );
            res = res.replace( /\$\$cfelseif\$\$/gi, "" );
            res = res.replace( /\$\$cfelse\$\$/gi, "" );
            res = res.replace( /\$\$if\$\$/gi, "" );
            res = res.replace( /\$\$script\$\$/gi, "" );
            res = res.replace( /\$\$abortStart\$\$/gi, "" );
            res = res.replace( /\$\$abortEnd\$\$/gi, "" );
            res = res.replace( /\$\$dumpStart\$\$/gi, "" );
            res = res.replace( /\$\$dumpEnd\$\$/gi, "" );
            res = res.replace( /\$\$dumpStartSec\$\$/gi, "" );
            res = res.replace( /\$\$dumpEndSec\$\$/gi, "" );
            res = res.replace( /\$\$dump\$\$/gi, "" );
            res = res.replace( /\$\$IndentTAB\$\$/gi, "\t" );
            res = res.replace( /\$\$IndentSize\$\$/gi, " " );
            res = res.replace( /\$\$Indent\$\$/gi, " " );
            res = res.replace( /\$\$ASSSPACE\$\$/gi, " " );
            res = res.replace( /\$\$OPSPACE\$\$/gi, " " );
            res = res.replace( /\$\$FUNCPARASPACE\$\$/gi, " " );
            res = res.replace( /\$\$FUNCARGSPACE\$\$/gi, " " );
            res = res.replace( /\$\$FUNCPARACOMASPACE\$\$/gi, " " );
            res = res.replace( /\$\$FUNCARGCOMASPACE\$\$/gi, " " );
            res = res.replace( /\$\$START\$\$/gi, "" );
            res = res.replace( /\$\$END\$\$/gi, "");
            res = res.replace( /\$\$EMPTYSPACE\$\$/gi, " " );
            res = res.replace( /\$\$ATT\$\$/gi, "");
            res = res.replace( /\$\$outEOL\$\$/gi, "" );
            res = res.replace( /\$\$outTAB\$\$/gi, "" );
            res = res.replace( /\$\$ARGENDTAGLINE\$\$/gi, "/" );
            res = res.replace( /\$\$cfargumentEndTag\$\$/gi, "/" );
            res = res.replace( /\$\$cfpropertyEndTag\$\$/gi, "/" );
            res = res.replace( /\$\$removedEndTag\$\$/gi, "" );
            res = res.replace( /\$\$ANDOPERATOR\$\$/gi, "&&" );
            res = res.replace( /\$\$EQUALOPERATOR\$\$/gi, "=" );
            res = res.replace( /\$\$1\$\$/gi, "" );
            res = res.replace( /\$\$2\$\$/gi, "" );
            res = res.replace( /\$\$3\$\$/gi, "" );
            res = res.replace( /\$\$4\$\$/gi, "" );
            res = res.replace( /\$\$5\$\$/gi, "" );

            return res;
        },
        updateCode: function ( tab ) {
            let rawContent      = this.getCodeForTab( tab, this.$refs.tagcase.value == "2" ? true : false, this.$refs.attributecase.value == "2" ? true : false );

            previewEditor.getDoc().setValue( this.replacePlaceholders( rawContent, tab ) );

            if( tab == "wrapping" )
                setWrapData();
        },
        getCodeForTab: function ( tab, tagCase, attrCase ) {
            let code        = "";
            let tagStruct   = this.getTagsList( tagCase );
            let attrStruct  = this.getAttrList( attrCase );

            switch ( tab ) {
                case "general":
                    code =
                        '<' + tagStruct[ "cftryTag" ] + '>$$EOL$$' +
                        '$$TAB$$<' + tagStruct[ "cfpropertyTag" ] + ' ' + attrStruct[ "nameAttr" ] +'$$EQUALOPERATOR$$"ID" '+ attrStruct[ "typeAttr" ] + '$$EQUALOPERATOR$$"ID" '+ attrStruct[ "generatorAttr" ] + '$$EQUALOPERATOR$$"native" $$cfpropertyEndTag$$>$$TAB$$$$TAB$$' +
                        '$$BEFOREBLANKLINEFUNC$$$$TAB$$<' + tagStruct[ "cffunctionTag" ] + ' ' + attrStruct[ "nameAttr" ] + ' $$EQUALOPERATOR$$"foo">$$EOL$$' +
                        '$$TAB$$$$TAB$$ <' + tagStruct[ "cfargumentTag" ] + ' ' + attrStruct[ "nameAttr" ]+ '$$EQUALOPERATOR$$"arg1"$$ATT$$$$ASSSPACE$$' + attrStruct[ "typeAttr" ] + '$$EQUALOPERATOR$$"any"$$ASSSPACE$$$$cfargumentEndTag$$>$$EOL$$$$EOL$$' +
                        '$$TAB$$$$TAB$$<' + tagStruct[ "cfoutputTag" ] + '>$$outEOL$$$$outTAB$$$$outTAB$$$$outTAB$$#myVar#$$outEOL$$$$outTAB$$$$outTAB$$<$$ARGENDTAGLINE$$' + tagStruct[ "cfoutputTag" ] + '>$$EOL$$' + '$$TAB$$$$TAB$$<' + tagStruct[ "cfsetTag" ] + ' a$$ASSSPACE$$$$EQUALOPERATOR$$$$ASSSPACE$$1$$ASSSPACE$$$$ARGENDTAGLINE$$>$$EOL$$' +
                        '$$TAB$$<$$ARGENDTAGLINE$$' + tagStruct[ "cffunctionTag" ] + '>$$EOL$$$$AFTERBLANKLINEFUNC$$' +
                        '$$TAB$$<' + tagStruct[ "cfcatchTag" ] + ' ' + attrStruct[ "typeAttr" ] + '$$EQUALOPERATOR$$"Any">$$EOL$$ $$TAB$$<$$ARGENDTAGLINE$$' + tagStruct[ "cfcatchTag" ] + '>$$EOL$$' +
                        '<$$ARGENDTAGLINE$$' + tagStruct[ "cftryTag" ] + '>';
                    break;
                case "indentation":
                    code = '<' + tagStruct[ "cftryTag" ] + '>$$EOL$$' +
                        '$$if$$$$Indent$$<' + tagStruct["cfifTag"] + ' a eq 10>$$EOL$$' +
                        '$$dumpStart$$$$if$$$$Indent$$$$Indent$$$$dumpEnd$$<' + tagStruct[ "cfdumpTag" ] + ' ' + attrStruct[ "varAttr" ] +'$$EQUALOPERATOR$$"#a#" ' + attrStruct[ "formatAttr" ] +'$$EQUALOPERATOR$$"text">$$EOL$$' +
                        '$$if$$$$cfelseif$$$$Indent$$<' + tagStruct["cfelseifTag"] + ' a eq 20>$$EOL$$' +
                        '$$dumpStartSec$$$$if$$$$cfelseif$$$$Indent$$$$Indent$$$$dumpEndSec$$<' + tagStruct[ "cfdumpTag" ] + ' ' + attrStruct[ "varAttr" ] +'$$EQUALOPERATOR$$"##" ' + attrStruct[ "formatAttr" ] +'$$EQUALOPERATOR$$"html">$$EOL$$' +
                        '$$if$$$$cfelse$$$$cfelseif$$$$Indent$$<' + tagStruct["cfelseTag"] + '>$$EOL$$' +
                        '$$abortStart$$$$if$$$$cfelse$$$$cfelseif$$$$Indent$$$$Indent$$$$abortEnd$$<' + tagStruct[ "cfabortTag" ] + '>$$EOL$$' +
                        '$$if$$$$Indent$$<$$ARGENDTAGLINE$$' + tagStruct[ "cfifTag" ] + '>$$EOL$$' +
                        '$$script$$$$Indent$$<' + tagStruct[ "cfscriptTag" ] + '>$$EOL$$' +
                        '$$script$$$$Indent$$$$Indent$$function foo()$$EOL$$' +
                        '$$script$$$$Indent$$$$Indent$${$$EOL$$' +
                        '$$script$$$$Indent$$$$Indent$$$$Indent$$if(a $$EQUALOPERATOR$$$$EQUALOPERATOR$$ b)$$EOL$$' +
                        '$$script$$$$Indent$$$$Indent$$$$Indent$${$$EOL$$' +
                        '$$script$$$$Indent$$$$EOL$$' +
                        '$$script$$$$Indent$$$$Indent$$$$Indent$$$$Indent$$writeOutput("Hello");$$EOL$$' +
                        '$$script$$$$Indent$$$$Indent$$$$Indent$$}$$EOL$$' +
                        '$$script$$$$Indent$$$$Indent$$}$$EOL$$' +
                        '$$script$$$$Indent$$<$$ARGENDTAGLINE$$' + tagStruct[ "cfscriptTag" ] + '>$$EOL$$' +
                        '$$cfcatch$$<' + tagStruct[ "cfcatchTag" ] + ' ' + attrStruct[ "typeAttr" ] + '$$EQUALOPERATOR$$"Any">$$EOL$$' +
                        '$$cfcatch$$<$$ARGENDTAGLINE$$' + tagStruct[ "cfcatchTag" ] + '>$$EOL$$' +
                        '$$cffinally$$<' + tagStruct[ "cffinallyTag" ] + '>$$EOL$$' +
                        '$$cffinally$$<$$ARGENDTAGLINE$$' + tagStruct[ "cffinallyTag" ] + '>$$EOL$$' +
                        '<$$ARGENDTAGLINE$$' + tagStruct[ "cftryTag" ] + '>$$EOL$$';
                    break;
                case "whitespace":
                    code = '<' + tagStruct[ "cftryTag" ] + '>$$EOL$$' +
                        '$$TAB$$<' + tagStruct["cfsetTag"] + ' a$$aroundEqualSpace$$$$EQUALOPERATOR$$$$aroundEqualSpace$$1$$spacebeforeendtag$$>$$EOL$$' +
                        '$$TAB$$<' + tagStruct["cfsetTag"] + ' print$$spacebeforeopeningroundbrace$$($$functionArguSpace$$a$$aroundOperatorSpace$$+$$aroundOperatorSpace$$10,$$afterComafunctionArguSpace$$20$$functionArguSpace$$)$$spacebeforeendtag$$>$$EOL$$$$blanklinebeforescriptblock$$' +
                        '$$TAB$$<' + tagStruct[ "cfscriptTag" ] + '>$$EOL$$' +
                        '$$TAB$$$$TAB$$arr$$aroundEqualSpace$$$$EQUALOPERATOR$$$$aroundEqualSpace$$;$$EOL$$' +
                        '$$TAB$$$$TAB$$str$$aroundEqualSpace$$$$EQUALOPERATOR$$$$aroundEqualSpace$${$$StructInitializerSpace$$key1$$EQUALOPERATOR$$"one",$$afterComaStructInitializerSpace$$key2="two",$$afterComaStructInitializerSpace$$key3="three"$$StructInitializerSpace$$};$$TAB$$$$TAB$$$$TAB$$$$EOL$$$$blanklinebeforefunctiondeclaration$$' +
                        '$$TAB$$$$TAB$$function$$EMPTYSPACE$$print$$spacebeforeopeningroundbrace$$($$aroundFunctionSpace$$int$$EMPTYSPACE$$arg1,$$afterCommaFunctionSpace$$int$$EMPTYSPACE$$arg2$$aroundFunctionSpace$$)$$EOL$$' +
                        '$$TAB$$$$TAB$${$$EOL$$' +
                        '$$TAB$$$$TAB$$$$TAB$$for$$spacebeforeopeningroundbrace$$(i$$aroundEqualSpace$$$$EQUALOPERATOR$$$$aroundEqualSpace$$arg1;$$spacebetweenstatementsinforloop$$i$$aroundOperatorSpace$$<$$EQUALOPERATOR$$$$aroundOperatorSpace$$arg2;i++)$$EOL$$'+
                        '$$TAB$$$$TAB$$$$TAB$${$$EOL$$' +
                        '$$TAB$$$$TAB$$$$TAB$$$$TAB$$if$$spacebeforeopeningroundbrace$$(i$$aroundOperatorSpace$$$$EQUALOPERATOR$$$$EQUALOPERATOR$$$$aroundOperatorSpace$$10)$$EOL$$' +
                        '$$TAB$$$$TAB$$$$TAB$$$$TAB$${$$EOL$$' +
                        '$$TAB$$$$TAB$$$$TAB$$$$TAB$$$$TAB$$writeOutput$$spacebeforeopeningroundbrace$$($$functionArguSpace$$10$$functionArguSpace$$);$$EOL$$' +
                        '$$TAB$$$$TAB$$$$TAB$$$$TAB$$}$$blanklinebeforeelseandelseif$$' +
                        'else$$EOL$$' +
                        '$$TAB$$$$TAB$$$$TAB$$$$TAB$${$$EOL$$' +
                        '$$TAB$$$$TAB$$$$TAB$$$$TAB$$$$TAB$$writeOutput$$spacebeforeopeningroundbrace$$($$functionArguSpace$$i$$functionArguSpace$$);$$EOL$$' +
                        '$$TAB$$$$TAB$$$$TAB$$$$TAB$$}$$EOL$$' +
                        '$$TAB$$$$TAB$$$$TAB$$}$$EOL$$$$blanklinebeforeswitchblock$$' +
                        '$$TAB$$$$TAB$$$$TAB$$switch$$spacebeforeopeningroundbrace$$(arg1)$$EOL$$' +
                        '$$TAB$$$$TAB$$$$TAB$${$$EOL$$' +
                        '$$TAB$$$$TAB$$$$TAB$$$$TAB$$case$$EMPTYSPACE$$1:$$EOL$$' +
                        '$$TAB$$$$TAB$$$$TAB$$$$TAB$${$$EOL$$' +
                        '$$TAB$$$$TAB$$$$TAB$$$$TAB$$$$TAB$$writeOutput$$spacebeforeopeningroundbrace$$($$functionArguSpace$$"case$$EMPTYSPACE$$1"$$functionArguSpace$$);$$EOL$$' +
                        '$$TAB$$$$TAB$$$$TAB$$$$TAB$$}$$EOL$$' +
                        '$$TAB$$$$TAB$$$$TAB$$}$$EOL$$$$blanklineafterswitchblock$$' +
                        '$$TAB$$$$TAB$$}$$EOL$$$$blanklineafterfunctiondeclaration$$' +
                        '$$TAB$$<$$ARGENDTAGLINE$$' + tagStruct["cfscriptTag"] + '>$$EOL$$$$blanklineafterscriptblock$$' +
                        '$$TAB$$<' + tagStruct[ "cffunctionTag" ] + ' ' + attrStruct[ "nameAttr" ] + ' $$EQUALOPERATOR$$"foo"' + ' ' + attrStruct[ "returnTypeAttr" ] + ' $$EQUALOPERATOR$$"Any"$$spacebeforeendtag$$>$$EOL$$' +
                        '$$TAB$$$$TAB$$<' + tagStruct[ "cfargumentTag" ] + ' ' + attrStruct[ "nameAttr" ]+ '$$EQUALOPERATOR$$"arg1"$$cfargumentEndTag$$>$$EOL$$' +
                        '$$TAB$$$$TAB$$<' + tagStruct["cfargumentTag"] + ' ' + attrStruct["nameAttr"] + '$$EQUALOPERATOR$$"arg2"$$cfargumentEndTag$$>$$EOL$$$$blanklineafterfunctionarguments$$' +
                        '$$TAB$$$$TAB$$<cfreturn$$EMPTYSPACE$$1$$spacebeforeendtag$$>' +
                        '$$BEFOREBLANKLINEFUNC$$$$TAB$$<$$ARGENDTAGLINE$$' + tagStruct[ "cffunctionTag" ] + '>$$EOL$$' +
                        '$$TAB$$<' + tagStruct["cfsetTag"] + ' a$$aroundEqualSpace$$$$EQUALOPERATOR$$$$aroundEqualSpace$$foo$$spacebeforeopeningroundbrace$$()>$$EOL$$' +
                        '<' + tagStruct[ "cfcatchTag" ] + ' ' + attrStruct[ "typeAttr" ] + '$$EQUALOPERATOR$$"Any"$$spacebeforeendtag$$>$$EOL$$' +
                        '<$$ARGENDTAGLINE$$' + tagStruct[ "cfcatchTag" ] + '>$$EOL$$' +
                        '<$$ARGENDTAGLINE$$' + tagStruct[ "cftryTag" ] + '>$$EOL$$';
                    break;
                case "wrapping":
                    code = '<' + tagStruct[ "cftryTag" ] + '> $$EOL$$' +
                        '$$TAB$$<' + tagStruct["cfsetTag"] + '$$EMPTYSPACE$$foo($$EMPTYSPACE$$"argument1",$$EMPTYSPACE$$"argument11",$$EMPTYSPACE$$"argument12",$$EMPTYSPACE$$"argument13",$$EMPTYSPACE$$"argument14",$$EMPTYSPACE$$"argument15",$$EMPTYSPACE$$"argument16",$$EMPTYSPACE$$"argument17",$$EMPTYSPACE$$"argument18"$$EMPTYSPACE$$)$$EMPTYSPACE$$>$$EOL$$'+
                        '$$TAB$$<' + tagStruct["cffeedTag"] + '$$EMPTYSPACE$$' + attrStruct["actionAttr"] + '$$EQUALOPERATOR$$"read"$$EMPTYSPACE$$$$1$$' + attrStruct["sourceAttr"] + '$$EQUALOPERATOR$$"#source#"$$EMPTYSPACE$$$$1$$$$2$$' + attrStruct["nameAttr"] + '$$EQUALOPERATOR$$"myfeed"$$EMPTYSPACE$$$$1$$$$3$$' + attrStruct["overwriteAttr"] + '$$EQUALOPERATOR$$"true"$$EMPTYSPACE$$$$1$$$$2$$$$4$$' + attrStruct["timeoutAttr"] + '$$EQUALOPERATOR$$"60"$$EMPTYSPACE$$$$1$$$$5$$' + attrStruct["enclosuredirAttr"] + '$$EQUALOPERATOR$$"#dir#">$$EOL$$' +
                        '$$TAB$$<' + tagStruct["cfsetTag"] + '$$EMPTYSPACE$$arrayVar$$EMPTYSPACE$$$$EQUALOPERATOR$$$$EMPTYSPACE$$[$$EMPTYSPACE$$"arrayValue_1",$$EMPTYSPACE$$"arrayValue_2",$$EMPTYSPACE$$"arrayValue_3",$$EMPTYSPACE$$"arrayValue_4",$$EMPTYSPACE$$"arrayValue_5",$$EMPTYSPACE$$"arrayValue_6",$$EMPTYSPACE$$"arrayValue_7",$$EMPTYSPACE$$"arrayValue_8",$$EMPTYSPACE$$"arrayValue_9"$$EMPTYSPACE$$]>$$TAB$$$$TAB$$$$TAB$$$$EOL$$' +
                        '$$TAB$$<' + tagStruct["cfsetTag"] + '$$EMPTYSPACE$$structVar$$EMPTYSPACE$$$$EQUALOPERATOR$$$$EMPTYSPACE$${$$EMPTYSPACE$$a1$$EQUALOPERATOR$$"struct data",$$EMPTYSPACE$$a2$$EQUALOPERATOR$$"struct data",$$EMPTYSPACE$$a3$$EQUALOPERATOR$$"struct data",$$EMPTYSPACE$$a4$$EQUALOPERATOR$$"struct data",$$EMPTYSPACE$$a5$$EQUALOPERATOR$$"struct data",$$EMPTYSPACE$$a6$$EQUALOPERATOR$$"struct data",$$EMPTYSPACE$$a7$$EQUALOPERATOR$$"struct data",$$EMPTYSPACE$$a8$$EQUALOPERATOR$$"struct data"$$EMPTYSPACE$$}>$$EOL$$$$EOL$$' +
                        '$$TAB$$<' + tagStruct[ "cfscriptTag" ] + '>$$EOL$$$$EOL$$' +
                        '$$TAB$$$$TAB$$public$$EMPTYSPACE$$function$$EMPTYSPACE$$foo(String$$EMPTYSPACE$$a1,$$EMPTYSPACE$$String$$EMPTYSPACE$$a11,$$EMPTYSPACE$$String$$EMPTYSPACE$$a12,$$EMPTYSPACE$$String$$EMPTYSPACE$$a13,$$EMPTYSPACE$$String$$EMPTYSPACE$$a14,$$EMPTYSPACE$$String$$EMPTYSPACE$$a15,$$EMPTYSPACE$$String$$EMPTYSPACE$$a16,String$$EMPTYSPACE$$a17,$$EMPTYSPACE$$String$$EMPTYSPACE$$a18)$$EOL$$'+
                        '$$TAB$$$$TAB$${$$EOL$$' +
                        '$$TAB$$$$TAB$$$$TAB$$if(isDefined(a10)$$EMPTYSPACE$$$$ANDOPERATOR$$$$EMPTYSPACE$$isDefined(a11)$$EMPTYSPACE$$$$ANDOPERATOR$$$$EMPTYSPACE$$isDefined(a12)$$EMPTYSPACE$$$$ANDOPERATOR$$$$EMPTYSPACE$$isDefined(a13)$$EMPTYSPACE$$$$ANDOPERATOR$$$$EMPTYSPACE$$isDefined(a14)$$EMPTYSPACE$$$$ANDOPERATOR$$$$EMPTYSPACE$$isDefined(a15)$$EMPTYSPACE$$$$ANDOPERATOR$$$$EMPTYSPACE$$isDefined(a16)$$EMPTYSPACE$$$$ANDOPERATOR$$$$EMPTYSPACE$$isDefined(a17)$$EMPTYSPACE$$$$ANDOPERATOR$$$$EMPTYSPACE$$isDefined(a10))$$TAB$$$$TAB$$$$TAB$$$$EOL$$' +
                        '$$TAB$$$$TAB$$$$TAB$${$$EOL$$' +
                        '$$TAB$$$$TAB$$$$TAB$$$$TAB$$writeOutput("Hello");$$EOL$$' +
                        '$$TAB$$$$TAB$$$$TAB$$}$$EOL$$' +
                        '$$TAB$$$$TAB$$}$$EOL$$' +
                        '$$TAB$$<$$ARGENDTAGLINE$$' + tagStruct["cfscriptTag"] + '>$$EOL$$$$EOL$$' +
                        '$$TAB$$<' + tagStruct[ "cfoutputTag" ] + '>$$EOL$$' +
                        '$$TAB$$$$TAB$$This is just plain text over here. This text should be wrapped based on maximux column width when wrap option for text is selected$$EOL$$' +
                        '$$TAB$$<$$ARGENDTAGLINE$$' + tagStruct["cfoutputTag"] + '>$$EOL$$' +
                        '$$TAB$$<' + tagStruct["cfcatchTag"] + ' ' + attrStruct["typeAttr"] + '$$EQUALOPERATOR$$"Any">$$EOL$$$$TAB$$<$$ARGENDTAGLINE$$' + tagStruct[ "cfcatchTag" ] + '>$$EOL$$<$$ARGENDTAGLINE$$' + tagStruct[ "cftryTag" ] + '>$$EOL$$';
                    break;
                case "braces":
                    code = 'component$$componentEOL$${' +
                        '$$EOL$$$$EOL$$$$TAB$$function foo()$$functionEOL$$' +
                        '$$TAB$${$$EOL$$' +
                        '$$TAB$$$$TAB$$try$$tryEOL$$' +
                        '$$TAB$$$$TAB$${' +
                        '$$EOL$$$$TAB$$$$TAB$$$$TAB$$for(i $$EQUALOPERATOR$$ 0; i < 10; i++) { '+
                        '$$EOL$$$$TAB$$$$TAB$$$$TAB$$$$TAB$$writeOutput(i);' +
                        '$$EOL$$$$TAB$$$$TAB$$$$TAB$$}$$EOL$$$$TAB$$$$TAB$$}$$EOL$$' +
                        '$$TAB$$$$TAB$$catch(Any e)$$EOL$$$$TAB$$$$TAB$${$$EOL$$$$TAB$$$$TAB$$}' +
                        '$$EOL$$$$TAB$$$$TAB$$if(a $$EQUALOPERATOR$$$$EQUALOPERATOR$$ b)$$ifEOL$$$$TAB$$$$TAB$${$$EOL$$$$TAB$$$$TAB$$$$TAB$$a $$EQUALOPERATOR$$ 10; $$EOL$$$$TAB$$$$TAB$$}'+
                        '$$EOL$$$$TAB$$$$TAB$$else if(a > b) $$EOL$$$$TAB$$$$TAB$${$$EOL$$$$TAB$$$$TAB$$$$TAB$$a $$EQUALOPERATOR$$ 20; $$EOL$$$$TAB$$$$TAB$$} $$EOL$$$$TAB$$$$TAB$$else$$elseEOL$$$$TAB$$$$TAB$${'+
                        '$$EOL$$$$TAB$$$$TAB$$$$TAB$$a $$EQUALOPERATOR$$ 100; $$EOL$$$$TAB$$$$TAB$$}'+
                        '$$EOL$$$$EOL$$$$TAB$$$$TAB$$switch(a)$$EMPTYSPACE$$$$switchEOL$$$$TAB$$$$TAB$${'+
                        '$$EOL$$$$TAB$$$$TAB$$$$TAB$$case 1: $$EMPTYSPACE$${'+
                        '$$EOL$$$$TAB$$$$TAB$$$$TAB$$$$TAB$$writeOutput("1"); $$EOL$$$$TAB$$$$TAB$$$$TAB$$$$TAB$$break;'+
                        '$$EOL$$$$TAB$$$$TAB$$$$TAB$$} $$EOL$$$$TAB$$$$TAB$$$$TAB$$default: {'+
                        '$$EOL$$$$TAB$$$$TAB$$$$TAB$$$$TAB$$writeOutput("2");$$EOL$$ $$TAB$$$$TAB$$$$TAB$$}'+
                        '$$EOL$$$$TAB$$$$TAB$$} $$EOL$$$$EOL$$$$TAB$$$$EMPTYSPACE$$}$$EOL$$$$EOL$$}';
                    break;
                default:
                    code = '<' + tagStruct[ "cftryTag" ] + '>$$EOL$$$$BEFOREBLANKLINEFUNC$$$$TAB$$<' + tagStruct[ "cffunctionTag" ] + ' ' + attrStruct[ "nameAttr" ]+ '$$EQUALOPERATOR$$"foo">$$EOL$$$$TAB$$$$TAB$$<' + tagStruct[ "cfargumentTag" ] + ' ' + attrStruct[ "nameAttr" ]+ '$$EQUALOPERATOR$$"arg1"$$ATT$$' + attrStruct[ "typeAttr" ] + '$$EQUALOPERATOR$$"any"$$ATT$$' + attrStruct[ "requiredAttr" ] + '$$EQUALOPERATOR$$"false"$$ARGENDTAGLINE$$>$$EOL$$$$TAB$$$$TAB$$<cfoutput>#myVar#<$$ARGENDTAGLINE$$cfoutput>$$EOL$$$$TAB$$$$TAB$$<cfset a$$ASSSPACE$$$$EQUALOPERATOR$$$$ASSSPACE$$1 $$ARGENDTAGLINE$$>$$EOL$$$$TAB$$<$$ARGENDTAGLINE$$' + tagStruct[ "cffunctionTag" ] + '>$$EOL$$$$AFTERBLANKLINEFUNC$$$$TAB$$<' + tagStruct[ "cfcatchTag" ] + ' ' + attrStruct[ "typeAttr" ] + '$$EQUALOPERATOR$$"Any">$$EOL$$$$TAB$$<$$ARGENDTAGLINE$$' + tagStruct[ "cfcatchTag" ] + '>$$EOL$$<$$ARGENDTAGLINE$$' + tagStruct[ "cftryTag" ] + '>$$EOL$$';
                    break;
            }

            return code;
        },
        getTagsList( tagCase ){
            let tagStruct = {};

            tagStruct[ "cftryTag" ]       = tagCase ? "CFTRY"      : "cftry";
            tagStruct[ "cfcatchTag" ]     = tagCase ? "CFCATCH"    : "cfcatch";
            tagStruct[ "cffinallyTag" ]   = tagCase ? "CFFINALLY"  : "cffinally";
            tagStruct[ "cfpropertyTag" ]  = tagCase ? "CFPROPERTY" : "cfproperty";
            tagStruct[ "cffunctionTag" ]  = tagCase ? "CFFUNCTION" : "cffunction";
            tagStruct[ "cfargumentTag" ]  = tagCase ? "CFARGUMENT" : "cfargument";
            tagStruct[ "cfoutputTag" ]    = tagCase ? "CFOUTPUT"   : "cfoutput";
            tagStruct[ "cfdumpTag" ]      = tagCase ? "CFDUMP"     : "cfdump";
            tagStruct[ "cfabortTag" ]     = tagCase ? "CFABORT"    : "cfabort";
            tagStruct[ "cfsetTag" ]       = tagCase ? "CFSET"      : "cfset";
            tagStruct[ "cfifTag" ]        = tagCase ? "CFIF"       : "cfif";
            tagStruct[ "cfelseifTag" ]    = tagCase ? "CFELSEIF"   : "cfelseif";
            tagStruct[ "cfelseTag" ]      = tagCase ? "CFELSE"     : "cfelse";
            tagStruct[ "cfscriptTag" ]    = tagCase ? "CFSCRIPT"   : "cfscript";
            tagStruct[ "cffeedTag" ]      = tagCase ? "CFFEED"     : "cffeed";

            return tagStruct;
        },
        getAttrList( attrCase ){
            let attributeStruct = {};

            attributeStruct[ "nameAttr" ]       = attrCase ? "NAME"         : "name";
            attributeStruct[ "returnTypeAttr" ] = attrCase ? "returntype"   : "returntype";
            attributeStruct[ "fieldtypeAttr" ]  = attrCase ? "FIELDTYPE"    : "fieldtype";
            attributeStruct[ "generatorAttr" ]  = attrCase ? "GENERATOR"    : "generator";
            attributeStruct[ "typeAttr" ]       = attrCase ? "TYPE"         : "type";
            attributeStruct[ "varAttr" ]        = attrCase ? "VAR"          : "var";
            attributeStruct[ "formatAttr" ]     = attrCase ? "FORMAT"       : "format";
            attributeStruct[ "requiredAttr" ]   = attrCase ? "REQUIRED"     : "required";
            attributeStruct[ "actionAttr" ]     = attrCase ? "ACTION"       : "action";
            attributeStruct[ "sourceAttr" ]     = attrCase ? "SOURCE"       : "source";
            attributeStruct[ "overwriteAttr" ]  = attrCase ? "OVERWRITE"    : "overwrite";
            attributeStruct[ "timeoutAttr" ]    = attrCase ? "TIMEOUT"      : "timeout";
            attributeStruct[ "enclosuredirAttr" ]= attrCase ? "ENCLOSUREDIR": "enclosuredir";

            return attributeStruct;
        }
    }
} );

function setWrapData( ){
    let columnWidth     = $( "#maxcolumnwidth" ).val() + "%";
    let wrapStyle       = "";
    let warppingArray   = [
                            { "wraparrayinitializers"   : "arrayVar" },
                            { "wrapattributes"          : "cffeed" },
                            { "wrapcomments"            : "hello-world" },
                            { "wrapifconditions"        : "isDefined" },
                            { "wrapfunctionargs"        : "argument1" },
                            { "wrapfunctionparams"      : "function" },
                            { "wrapstructinitializers"  : "structVar" },
                            { "wraptext"                : "text" }
                        ];

    warppingArray.map( ( data ) => {
        let keyFields   = Object.keys( data )[ 0 ];
        let value       = data[ keyFields ];
        wrapStyle       = $( "#" + keyFields ).is( ":checked" ) ? "pre-wrap" : "pre"

        $( "pre" ).filter( function () {
            if( $( this ).text().toLowerCase().indexOf( value.toLowerCase() ) >= 0 )
                $( this ).css( { "max-width" : columnWidth, "white-space": wrapStyle } );
        } );
    } );
}