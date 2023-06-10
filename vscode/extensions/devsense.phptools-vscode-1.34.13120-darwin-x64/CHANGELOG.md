
## 1.34.13120 (May 12, 2023)

### IntelliSense

#### Trait Adaptation Blocks

Code completion and tool-tips in `trait` adaptation blocks has been implemented. ([#582](https://community.devsense.com/d/582))

#### Other Improvements

- Type inferring in the context of `is_a()` analysed correctly.
- Less falsy warnings for non-static methods called statically in case there is `__callStatic()` magic method.
- New quick refactorings through code actions.
- Updated integrated PHP manual and localizations.

### Add Missing PHPDoc

The `Add Missing PHPDoc` code action inserts the doc comment as a snippet ([#157(comment)](https://github.com/DEVSENSE/phptools-docs/issues/157#issuecomment-1512313864)). This replaces template variables and allows to type into placeholders.

### Formatting

We've added an option that enables you to turn formatting on or off within a specified range of code. The code between a comment `// @php-format off` or `/* @php-format off */` and a corresponding comment `// @php-format on` or `/* @php-format on */` will not be formatted. 

Additionally, We've added a new option `php.format.rules.declKeepRightParenAndOpenBraceOnOneLine` which will keep the right closing parenthesis `)` of a function or method declaration header on the one line as opening brace of the body `{`.

The other options that allows for more formatting customizations include:
 - `php.format.rules.openBraceOnNewLineForNamespaces` which place open brace `{` on a new line for namespace declarations.
 - `php.format.rules.openBraceOnNewLineForBlocks` which place open brace `{` on a new line for all types of code blocks, except for those controlled by other formatting rules.
 - `php.format.rules.spaceBeforeParenthesesInControlStatements` which insert a space before parentheses in control statements.
 - `php.format.rules.spaceBeforeParenthesesInCalls` which insert a space before parentheses in method, function and constructor call parentheses.
 - `php.format.rules.spaceBeforeParenthesesInDeclarations` which insert a space before parentheses in method, function and constructor declaration parentheses.

### Inlay Hints

 We've added an option to show return type inlay hint only for named functions, not for anonymous functions and arrow functions ([#326](https://github.com/DEVSENSE/phptools-docs/issues/326)).

### Fixes

- Respecting `class_alias()` within type checks and type inferrence checks.
- Respecting `@return $this` and treating it as `static` return type hint.
- Respecting `"php.completion.autoimport-docblock"` setting when generating **PHPDoc** above functions ([#896](https://community.devsense.com/d/896)).
- `"mongodb"` stub updated and fixed some missing MongoDB classes and functions. Use setting `"php.stubs": {"*", "mongodb"}` to use it ([#927](https://community.devsense.com/d/927)).
- Find All References performs type analysis if necessary to provide better results ([#322](https://github.com/DEVSENSE/phptools-docs/issues/322))
- Fixed use of named parameters of methods introduced with PHPDoc `@method` tag ([#921](https://community.devsense.com/d/921)).
- Properly handling the nullable `?static` type.
- Code diagnostics improvements, avoids a few falsy warnings.
- Fixes internal error when completing user snippets.
- When multiline php code was present inside javascript string, formatting wasn't working correctly [#908](https://community.devsense.com/d/908-tab-stop-indentation-with-open-curly-braces/5)
- Fix of incorrect indentation when named arguments were used in multi-line static function calls.
- Fix of unwanted compacting of new lines when multiple foreach colon blocks were used. [#893-12](https://community.devsense.com/d/893-another-formatting-issue/12)
- Fix of incorrect indentation of named arguments in certain cases [#928](https://community.devsense.com/d/928-wrong-formatting-of-named-arguments)
- Fix of incorrect indent of pseudo class constant [#932](https://community.devsense.com/d/932-formatting-issue)
- Fix of formatting when php was inside script/style tags. [#1460](https://community.devsense.com/d/1460-codeigniter-4)
- Fix of lossing indentation in multiline comments delimited with `/*` [#1489](https://community.devsense.com/d/1489-code-formatting-issue-in-visual-studio-code-using-php-tools/3)
- Fix of formatting removing empty lines in `/*` comments [#1522](https://community.devsense.com/d/1522-comment-block-issue)
- Fix of incorrect indent in multiple nested multiline lambda functions[#1500](https://community.devsense.com/d/1500-formating-issue)

## 1.33.12934 (April 8, 2023)

### IntelliSense

Supporting `.phpstorm.meta.php` with `expectedArgments()` and `argumentsSet()` now.

![expectedarguments](https://raw.githubusercontent.com/DEVSENSE/phptools-docs/master/docs/vscode/imgs/meta-expectedarguments.png)

### Fixes

- Formatting was compacting whitespaces after arrow or lambda functions ([#913](https://community.devsense.com/d/913-after-update-formatting-deletes-empty-lines-and-moves-curly-braces-up)).
- Internal exception fix when navigating to definition ("Go To Definition" command).
- Crash fix for rare cases in huge files in Drupal.
- Added the missing `static` keyword in code completion in function body.
- IntelliSense/Code analysis handling `iterable<K,T>` (with 2 generic arguments) the same as PHPStan does ([#914](https://community.devsense.com/d/914-generic-of-traverable/2)).

## 1.33.12924 (April 05, 2023)

### Test Explorer

The _Test Explorer_ looks and watches for any _PHPUnit_ XML configuration file matching glob pattern `**/phpunit*.xml` or `**/phpunit.xml.dist` (outside the `vendor` folder) [#313](https://github.com/DEVSENSE/phptools-docs/issues/313). This allows having **multiple configuration files** in the same directory with custom names.

![multiple phpunit configurations](https://raw.githubusercontent.com/DEVSENSE/phptools-docs/master/docs/vscode/imgs/test-multiple-configs.png)

Additionally, we have fixed:

- Executing all tests within a configuration file.
- Executing all tests within a single test suite.
- Correct Xdebug diretives so it won't cause unnecessary warnings when debugging tests.

### ParaTest

This update allows running [ParaTest](https://github.com/paratestphp/paratest) in the same way as PHPUnit tests. To do so:

- Install ParaTest composer package using command `Composer: require dev package`, and search package `brianium/paratest`.
- Update your workspace settings:
  ```json
  {
    "phpunit.phpunit": "./vendor/bin/paratest"
  }
  ```
- Navigate to _Testing_ panel and run or debug your tests.

### Sort Uses on Save

The following setting works for sorting and organizing `use` statements on save:

```json
{
  "editor.codeActionsOnSave": { "source.organizeImports": true },
}
```

### IntelliSense

Now it's possible to `Ctrl`+`Click` (or go to with `F12`) on `@inheritdoc` to navigate to base Doc Comment directly. [#897](https://community.devsense.com/d/897-jump-to-phpdoc-via-clicking-on-inheritdoc)

Additionally, return type hint in signature help is respecting template (generic) arguments.

### Composer `"composer.workingPath"` Setting

Thanks to the feedback [#909](https://community.devsense.com/d/909-setup-a-working-directory-for-composer), we've added setting `"composer.workingPath"` where users can specify the relative path for the `composer.json` and `vendor` folders.

### Fixes

- Memory leak happening when updating/removing `.phar` files in the workspace fixed. (happens usually on `composer update` and `require`.) [#291](https://github.com/DEVSENSE/phptools-docs/issues/291)
- Not auto-completing parentheses `()` after `array`, `require`/`include`, `exit`, and `die`.
- If a multiline HTML attribute was enclosed in single quotes and located within a PHP blocks, it would be indented during every formatting session. [882](https://community.devsense.com/d/882-one-more-auto-format-creeper) 
- Fixed rare case when mixed html/php formatting resulted stopped the formatter. [887-B](https://community.devsense.com/d/887-cannot-format-code-with-syntax-errors)

## 1.32.12895 (March 28, 2023)

### IntelliSense

- `null` specified as Doc Comment `@param` type is reported as invalid.
- `true` pseudo-type correctly handled within union types.
- Methods named `new()` are handled correctly in mouse hover and code completion.
- Detecting Laravel services improved.
- Initial implementation for `expectedArguments()` PHPStorm meta.
- Completing `declare` and `declare(strict_types=1);` after `<?php` tag.

### Refactoring

- PHPDoc `@see` and `@uses` is recognized during rename refactoring, find all references, and highlight occurences.
- Unused `use` check works even if **problems** setting is turned off.
- **Namespace import** for any simple class name. We have code action suggestions to import a namespace or fully qualify the class name if there are more classes with the same name.

#### Organize Imports

We have added support for VS Code's **"organize imports"** command and eventual `"editor.codeActionsOnSave"` setting allowing you to _organize imports_ (aka **remove unused uses**) when saving document automatically.

![organize uses](https://raw.githubusercontent.com/DEVSENSE/phptools-docs/master/docs/vscode/imgs/source.organizeimports.png)

### Fixes

- Stability fixes.
- Smart select fixes.
- `#!` at the beginning of file not reported as syntax error.
- Properties on some `mixed` types not reported as unknown.
- Format supports indenting PHP8 attributes which are spread over multiple lines [#879](https://community.devsense.com/d/879-php-8-attribute-code-formatting)
- Format was removing whitespaces when `readonly` or `static` was used as function argument name.
- Fixed the case where formatter was adding an extra space between `new` and `()` [#883](https://community.devsense.com/d/883-formatting-new-function-issue)

## 1.31.12821 (March 20, 2023)

### Fixes

- Breadcrumbs fixed. ([#302](https://github.com/DEVSENSE/phptools-docs/issues/302))
- Unrecognized Psalm and PHPStan special type names. ([#860](https://community.devsense.com/d/860-breadcrumb-bar-strange-behavior))
- Global variable type check fix ([#303](https://github.com/DEVSENSE/phptools-docs/issues/303))
- Mouse hover looks into `@mixin`s for properties.
- IntelliSense: Methods from both Laravel facade and DocComment `@method` gets resolved as expected.
- Fixes `rg` processes spawned by VS Code ([#877](https://community.devsense.com/d/877)).
- Fixes a complex html/php mixed formatting issue. [#852](https://community.devsense.com/d/852-another-auto-format-error)
- Fixes incorrect indentation of multi-line chained call. [#862](https://community.devsense.com/d/862-formatting-bug)
- Fixes position of open brace in method or function declaration when multiline header is provider in `PSR-12`. [#305](https://github.com/DEVSENSE/phptools-docs/issues/305)
- Fixes unwanted newline after lambda function passed as an argument to a method or function. [#306](https://github.com/DEVSENSE/phptools-docs/issues/306)
- Fixes formating of enums with backing types implementing interfaces.
- Fixes indentation of named arguments when function call is multiline. [#863](https://community.devsense.com/d/863-php-named-parameters-do-not-get-formatted-correctly)
- Format selection didn't work in certain cases when invoked with html/php mix.
- Format doesn't indent php code block in html comments [#872-3](https://community.devsense.com/d/872-syntax-highlighting-and-another-auto-format-creeper)

## 1.31.12740 (March 4, 2023)

### Inlay Hints

Newly **Inlay Hints** for PHP code are available!

![inlay hints](https://raw.githubusercontent.com/DEVSENSE/phptools-docs/master/docs/vscode/imgs/vsc-inlay-hints.png)

The inlays are available for parameter names, by-reference arguments, and inferred function return types.

![inlay hints](https://docs.devsense.com/content_docs/vscode/imgs/vsc-inlay-parameter-byref.png)

To enable or disable the inlay hints, change the following **settings**:

- `"editor.inlayHints.enabled"`
- `"php.inlayHints.parameters.enabled"`
- `"php.inlayHints.parameters.byReference"`
- `"php.inlayHints.types.return"`
- `"php.inlayHints.types.variable"`

See [the documentation](https://docs.devsense.com/vscode/editor/inlay-hints) for more details.

### Quick Fix for missing Doc Comments

New code action adds missing doc comments with inferred type information and summary placeholders. The functionality is the same as by typing `/**` above a function/class/property/constant or `define()` call, but it can be invoked through a code action and it can be invoked over a whole selection of code for multiple declarations at once. ([#226](https://github.com/DEVSENSE/phptools-docs/issues/226))

### Smart Select

Visual Studio Code's selection range feature allows to quickly select syntactic elements; the PHP extension provides selection range for all the statements, declarations, and blocks of code.

### Formatting

Another feature request we received quite often was to introduce `Drupal` code style [#795](https://community.devsense.com/d/795-add-drupal-code-style-to-list). So we're happy to announce `Drupal` code style has been introduced in this version.

Formatter respects `files.InsertFinalNewLine` option now. [#837](https://community.devsense.com/d/837-formatter-removes-a-new-line-after-a-class-closing-brace)

### Fixes

- Fixes highlighted range when peeking definitions ([#288](https://github.com/DEVSENSE/phptools-docs/issues/288))
- Fixes some internal exceptions.
- Fixes mouse hover when code is syntactically invalid.
- Fixes "Search TODO" command if there are remote:// or git:// files in the workspace, possibly after using git merge, or diff window.
- Fixes indexing directories inside `.git` and other special directories when changed.
- Types specified in Doc Comments can be `$this` keyword as an alias to `self`, i.e. `callable($this)` ([#843](https://community.devsense.com/d/843-error-in-parameter-type-with-docblock)).

### Formatting Fixes

- Fixes formatting when multiple method calls chained when object was inside parenthesis.[#820/8].(https://community.devsense.com/d/820-heredoc-with-interpolated-variables-breaks-auto-formatting-for-the-entire-file/8)
- Fixes formatting of mixed JS and PHP. [#820/5](https://community.devsense.com/d/820-heredoc-with-interpolated-variables-breaks-auto-formatting-for-the-entire-file/5)
- Fixes case when JS formatting with php code inside was moving `}` on each format. [#820/7](https://community.devsense.com/d/820-heredoc-with-interpolated-variables-breaks-auto-formatting-for-the-entire-file/7)
- Fixes case when insides of multi-line HTML attributes, comments or CDATA were indented on each format. [#820/12](https://community.devsense.com/d/820-heredoc-with-interpolated-variables-breaks-auto-formatting-for-the-entire-file/12)
- Fixes case when linux line endings caused different format output when mixed languages were present in php file.
- Fixes case when `use` with alias same as class stopped the formatter.
- Fixes double indentation when array access and member use is combined in multi-line expression. [#842](https://community.devsense.com/d/842-formatter-adds-unnecessary-tabs)
- Fixes unwanted space after ampersand in ref assignment [#846](https://community.devsense.com/d/846-spaces-after-symbol-ampersand-to-define-reference), but in the same time respects this notation as well `$a =& $b;`.
- Fixes unwanted double indentation in multiline expression containing array item access.
- Fixes unwanted new line when line comment precedes `elseif`,`catch`,`finally`.
- Fixes unwanted space between `static` or `self` and `(` when creating a new instance of the object.
- Fixes formatter removing spaces aroung bitwise `&` operator.
- Fixes unwanted double indentation of object's field access in constructors calls when spread along multiple lines.
- Fixes `php.format.rules.alignConsecutiveAssignments` when combined with different kind of left expressions.
- Fixes missing space when reseved types were used as a type hint.
- Fixes incorrect commend indentation when used in multiline chained function calls.
- Fixes ocassional missing space after `)` when `php.format.rules.keepControlStatementsInOneLine` option is used. [#852-2](https://community.devsense.com/d/852-another-auto-format-error/2)
- Fixes unwanted space in multiline ternary operator.
- Fixes unwanted space after function with the same name as PHP keyword.
- Fixes static member access double indent when `static` keyword was used.
- Fixes incorrect indent when member was accessed in multiline constructors call.
- Fixes unwanted space after identifier named `default`.
- Fixes case when attributes in function declaration parameters stopped the formatter.
- Fixes case when trait use in namespace might have stopped the formatter.
- Fixes case when trait use with changing visibility to public stopped the formatter.

## 1.30.12484 (February 10, 2023)

### Fixes

- Code Formatter fixes.
- Fixes various standard functions missing, and missing ambiguities.
- Homebrew `php` recognized on macOS.
- Fixed formatting of heredoc with interpolated variables [#820](https://community.devsense.com/d/820-heredoc-with-interpolated-variables-breaks-auto-formatting-for-the-entire-file)

## 1.30.12450 (February 9, 2023)

### Editor

**Folding `use`** has been added; this allows to collapse the block of `use` statements ([tweet](https://twitter.com/JoelPiccoli/status/1622633203818176512)).

### Getter/Setter

Newly, code inserted by adding getters and setters can be customized using settings `"php.completion.getterSnippet"` and `"php.completion.setterSnippet"`. In this way, you can add various value handling and customize return values, or add comments for yourself ([#813](https://community.devsense.com/d/813-setter-without-self-reference)), i.e.:

```json
"php.completion.setterSnippet": "{PROPERTY} = sanitize(${NAME}) ?? throw new InvalidArgumentException('Invalid ${NAME}!');\n//done\nreturn {THIS};",
```

### Formatting

 - Backed enumerations are supported.
 - New setting `php.format.rules.keepControlStatementsInOneLine`. [#810](https://community.devsense.com/d/810-is-there-an-option-to-not-auto-indent-one-liners)
 - Setting `php.format.rules.SpaceBeforeColonInControlflowStatements` renamed to `php.format.rules.SpaceBeforeColonInControlStatements`.
 - Fixed unwanted space in type declaration [#271](https://github.com/DEVSENSE/phptools-docs/issues/271)
 - `php.format.rules.alignConsecutiveAssignments` now aligns only assignment if they directly follow each other. Inserting a new line between assignments will force them to align differently.

 ### Fixes

 - Documents opened in diff view won't appear twice in symbol searches and symbol navigations ([#549](https://community.devsense.com/d/549-intellisense-remembers-old-method-parameters/11)).
 - Fixes symlinks recursion on Unix ([#269](https://github.com/DEVSENSE/phptools-docs/issues/269)).
 - Fixes blank What's New screen.

## 1.30.12417 (February 7, 2023)

### Doc Comments

Supporting literals and constants inside Doc Comments (i.e. inside `key-of<>` and `value-of<>`), so the type information in Doc Comment is parsed and IntelliSense works inside it ([#801](https://community.devsense.com/d/801-key-of-and-value-of-support)).

### Diagnostics

- Duplicate promoted property reported.
- Reports modifying read-only properties.
- Reports use of undefined property if there is `__get`/`__set` but also `@property` doc comment declaration.
- Added diagnostic for unknown attribute class.

### Rename Refactoring

Renaming a `class`, `interface`, `trait`, or `enum` suggests to rename the corresponding file as well, if appliable.

### Hover Tool-Tips

Newly, there are two more settings to configure the hover tool-tip.

- `"php.hover.fullname"` adds the full class member name at the top of tooltip (including the fully qualified name of the class) (disabled by default) ([#808](https://community.devsense.com/d/808-show-class-name-in-function-description-on-hover-popup)).
- `"php.hover.containingClass"` lets you to enable/disable showing class name as a part of a function tool-tip (enabled by default).

### Fixes

- Overall workspace processing time (source code parsing) has been optimized.
- Added missing `ZipArchive::` constants ([#256](https://github.com/DEVSENSE/phptools-docs/issues/256)).
- Constants defined inside lambda functions are shown in IntelliSense, and code diagnostics ([#257](https://github.com/DEVSENSE/phptools-docs/issues/257)).
- Rename refactoring and semantic highlighting of constructor promoted properties.
- Context-aware completion after `extends`/`implements` keywords.
- Fixes `"Problems: Exclude Git Ignore"` in case there are many `.gitignore` files in the workspace.
- Fixes use of `@global` type defined above function declaration.
- Fixes generating Doc Comment upon `/**` above trailing comma ([#265](https://github.com/DEVSENSE/phptools-docs/issues/265))
- Fixes updating problems and code analysis when using `includePath` overlapping the workspace path(s).

## 1.29.12304 (January 29, 2023)

### IntelliSense Improvements

**Respecting `@internal` annotation**

Symbols annotated with `@internal` doc comment tag are hidden in the completion list now;

**Correct ordering**

We have updated how the code completion is ordered depending on context and so-far typed text; Symbols from imported namespaces are listed first, then top-level symbols, and at the end there are symbols that can be auto-imported.

**Deprecated classes**

Additionally, deprecated classes and interfaces are striked-out in the code completion list, and when used in the source code. Previously, we did that only for functions.

![deprecated classes and interfaces](https://raw.githubusercontent.com/DEVSENSE/phptools-docs/master/docs/vscode/imgs/vscode-deprecated-types.png)

**Performance**

More frequent operations have been moved to a background thread to make the user experience fluent and uninterrupted.

### Short Open Tags `<?`

We have enabled parsing of PHP code inside short open tags (`<?`) by default. It handles the case where `<?xml` is at the beginning of the source code; 

Parsing inside short open tags can be disabled using the setting `"php.workspace.shortOpenTag"`.

### Composer

The local development version of `composer.phar` is updated automatically every 30 days.

### Fixes

- Missing `pcntl` constants added to IntelliSense.
- Fixed `#region`/`#endregion` collapsing.
- Fixed collapsing in various situations.
- Fixed update of IntelliSense after `composer update`.
- Fixed incorrect `integer` type name shown in tool-tips.
- Fixed renaming of global variables ([#242](https://github.com/DEVSENSE/phptools-docs/issues/242))
- Fixed warning message on non-en localizations ([#249](https://github.com/DEVSENSE/phptools-docs/issues/249)).
- Fixed missing unreachable code warning in `switch` statement.
- Fixed missing `Exception` class in the completion right after `throw new`.
- Fixed auto-import when there is a syntax error ([#671](https://community.devsense.com/d/671)).
- Formatter does not remove space after `yield format` ([#248](https://github.com/DEVSENSE/phptools-docs/issues/248)).
- `use` with leading `/` stopped the formatter.
- Colon block ending with `;` separated with whitespaces from colon block closing token stopped the formatter.

## 1.28.12200 (January 21, 2023)

### New Code Actions

More useful refactorings are coming to the PHP extension and VS Code. Following are refactorings introducing common PHP 8 syntax to your code.

**Condition `?:` can be replaced with `?->`**

Simplifying conditional expressions like the one below:

![simplify conditional expression](https://raw.githubusercontent.com/DEVSENSE/phptools-docs/master/docs/vscode/imgs/vsc-code-action-conditional.gif)

**Assignments can be simplified**

Simplifying assignments:

![simplify assignment expression](https://raw.githubusercontent.com/DEVSENSE/phptools-docs/master/docs/vscode/imgs/vsc-code-action-assignment.gif)

**Converting `switch` to `match`**

In certain cases, `switch` statement can be converted to the new `match` expression.

### PHPStan Conditional Return Types

This update adds support for the new PHPStan's Conditional return types. Return types specified in this way are properly recognized now, colored accordingly right in the source code, and the IntelliSense uses the specified types correspondingly.

![phpstan conditional return types](https://raw.githubusercontent.com/DEVSENSE/phptools-docs/master/docs/vscode/imgs/phpdoc-phpstan-confitional-return.png)

### Improved Type Checks and IntelliSense

**BREAKING:** By default, we're now reporting diagnostics _inside opened documents only_. This can be changed using setting `"php.problems.scope"`. The exception is the syntax errors - those are reported from across the whole workspace.

In addition, various _falsy_ warnings have been fixed, mostly in combination with generic types. The type analysis have been improved in general.

Also, most of polyfills are not messing up with codecompletion and symbol navigation; Since built-in manual is annotated with generic type arguments, it is preferred over the polyfills from 3rd party packages ([#241](https://github.com/DEVSENSE/phptools-docs/issues/241)).

### Improved Completion Ordering

The code completion itself has been improved, so _local_ symbols should be listed first. We're still working on this feature, and improving as much as possible.

### Fixes

- We have fixed a memory leak, and the language server crash.
- Fixed PHPDoc snippet after typing `/**`, when text got corrupted.
- Added missing Psalm scalar type annotations.
- Correct order of resolving `@mixin` members ([#777](https://community.devsense.com/d/777)).
- `html` files can be associated with `php` language support.
- `//region`/`//endregion` folding ([#788](https://community.devsense.com/d/788-region-comments-won-t-fold))

### Formatting

- Removing unwanted extra space after `?` token in nullable return type [#752](https://community.devsense.com/d/752-extra-space-after-optional-type)
- Fixes in **Wordpress** code style
  - Types and function declarations have do not place a open brace `{` on a new line
  - `Unset` calls weren't formatted with spaces within parentheses.
  - `exit()` or `die()` do not have a space within parentheses.
- `php.format.rules.alignConsecutiveAssignments` stopped the formatter in certain cases.
- Using not equal operator `<>` instead of `!=` stopped the formatter.
- Optional comma in constructor header in property promotion stopped the formatter.
- Certain situations when combining HTML and PHP stopped the formatter.
- When `case` inside `switch` was followed by `;` instead of `:` stopped the formatter.

## 1.27.12010 (January 9, 2023)

### Doc Comment Syntaxes

We've been working on recognizing the whole range of commonly used type syntaxes in Doc Blocks; now supporting the most of PHPStan, and other popular linting frameworks.

This release introduces more compatibility, and more features towards Doc Blocks, and related type analysis and code diagnostics.

### Colorization and Semantic Tokens

PHP Doc Comments are getting very complex, and frameworks like PHPStan add even more syntaxes and complexity. We're supporting most of the extended syntax, including generic types, templates, type aliases, unions, intersections, `callable` syntax, and array shapes; and in this release, those types in _documentary comments_ are colorized accordingly.

![php callable specification](https://raw.githubusercontent.com/DEVSENSE/phptools-docs/master/docs/vscode/imgs/callable-type-def.png)

The whole type expression is now parsed, colorized, and recognized. The tooltip shows the signature help displaying the `Closure`s arguments and return types.

_Note:_ a nicer tooltip is in progress!

### PHPStan Array Shape, `callable`, `list`, and more

Since this release, the editor supports all the syntaxes for array shapes and callables. In addition, the type analysis handles specified PHPStan types accordingly.

PHPStan and Psalm  **array shapes** specified in PHP Doc Comments are allowed, parsed, colorized, and used in code completion and type analysis.

Additionally, `list` and `non-empty-list` types are handled as well. Including their generic counterparts with `<` and `>` types specified.

All the **callable** syntaxes in PHP Doc Comments are supported now as well.

### More Generic Annotations

This update brings the standard types annotated with generic template types; this is especially helpful in Laravel and Symfony frameworks, where it provides type inferring for all the collections, iterables, `Generator`, `DOMNodeList`, etc.

This improves value inferred within `foreach` for all kinds of iterables.

### Doc Comment Snippet for Variables

When creating a Doc Block above variable assignment, or above a global variable, you can now configure the snippet that will be created. Additionally, the snippet setting has a new property `"singleline": true|false` (for variables it's `true` by default) allowing you to specify whether to create the Doc Block single-lined (i.e. `/** @var Type */`).

Sample setting:

```json
{
    "php.docblock.variableSnippet": {
        "singleline": false
    }
}
```

### Fixes

- `integer`, `boolean`, `list` types are handled properly in Doc Block.
- Unused `use` analysis fixed, so it handles type names specified in Doc Blocks.
- Diagnostic and parameter completion for `session_set_cookie_params()` works for both possible definitions.
- Missing `Imagick` constants added.
- Improves type inferring for generic types and various edge cases.

## 1.26.11866 (January 3, 2023)

### IntelliSense &amp; Enums

The PHP 8.1 `enum` objects implicitly implements `UnitEnum` and `BackedEnum` interfaces. The `BackedEnum<TValue>` interface is annotated with a template type argument so it can be used in Doc Comments with the backed type for better type analysis. E.g.:

```php
/** @param \BackedEnum<string> $e */
function foo($e) {
    return $e->value // -> string
}

enum MyEnum : string {
    case A;
}

foo( MyEnum::A );
```

**Generic Types &amp; Doc Comments Type Annotations**

The type annotations in PHP Doc Comments have been reimplemented, so even complex constructs are handled, can be completed, refactored, highlighted, and previewed. Highlighting occurences works even in nested generic types, as well as rename refactoring and code completion.

```php
/**
 * @template TElement of \BackedEnum<string>
 * @return (Collection<int, TElement>|array<int, TElement>)[] Complex generic type annotations */
```

**Multi-Lined Structured Array Types**

This release adds support for multi-lined structured array type annotations. This allows users to specify array type with its keys and corresponding entries types. See the exmaple below:

```php
/**
 * @return array
 *         {
 *           name: string,
 *           age: int,
 *         }
 */
```

### Code Diagnostics Improvements

We're constantly working on improving the code analysis and related diagnostics. This release avoids a lot of falsy warnings.

### Formatting

We're happy to introduce new **Laravel** code style. You just need set `php.format.codestyle` to `laravel`. 

Now you can also let formatter to auto-align consecutive assignments with `php.format.rules.alignConsecutiveAssignments` option [#692](https://community.devsense.com/d/692-sug-formatting-add-auto-align-option).

```php
$a     = 1;
$bbb   = 2;
$ccccc = 3;
```

And other formatting rules we've added are:

|Setting|Description|
|-------|-----------|
|`php.format.rules.spaceBeforeColonInControflowStatements`|Insert a space before colon in control flow blocks.|
|`php.format.rules.spaceBeforeColonInReturnType`|Insert a space before colon in a return type.|
|`php.format.rules.spaceWithinCallParens`|Insert a space within method, function and constructor call parentheses.|
|`php.format.rules.spaceWithinDeclParens`| Insert a space within method, function and constructor declaration parentheses. |
|`php.format.rules.spaceWithinArrayInitilizersParens`|Insert a space within array initializer parentheses.|
|`php.format.rules.spaceWithinIfParens`|Insert a space within `if` statement header parentheses.|
|`php.format.rules.spaceWithinWhileParens`|Insert a space within `while` statement header parentheses.|
|`php.format.rules.spaceWithinForParens`|PInsert a space within `for` statement header parentheses.|
|`php.format.rules.spaceWithinForeachParens`|Insert a space within `foreach` statement header parentheses.|
|`php.format.rules.spaceWithinSwitchParens`|Insert a space within `switch` statement header parentheses.|
|`php.format.rules.spaceWithinCatchParens`|Insert a space within `catch` statement header parentheses.|
|`php.format.rules.spaceWithinBrackets`|Insert a space within brackets.|
|`php.format.rules.spaceWithinBracketsAroundExpression`|Insert a space within brackets around expression.|
|`php.format.rules.spaceWithinExpressionParens`|Insert a space within parentheses around expression.|

We've also fixed some formatting issues:
- `readonly` in namespace caused formatter to stop formatting
- `readonly` and `enum` in function declaration doesn't add space before paren
- PHP 8.2 Disjunctive Normal Form Types are supported now
- Constant uses were double indented in multi-line expressions [#748](https://community.devsense.com/d/748-constant-arrays-are-being-double-indented)
- We've address some cases when combing html and php code didn't result in neat looking code. Most notably in **Wordpress** templates.

### Fixes

Hot fix for built-in PHP functions type analysis.

## 1.26.11753 (December 28, 2022)

### Type Analysis Improvements

- Expression in the `assert()` language construct is used to determine variables type now. ([#744](https://community.devsense.com/d/744-support-assert-to-determine-type))
- Certain type annotations are now more precise.
- Implicit closure variables inside arrow functions are now properly initialized. This fixes falsy warnings about uninitialized variables use inside nested arrow functions.
- More Core types have been annotated with template type arguments, allowing for better inferring of types where `@template` and similar are used ([#746](https://community.devsense.com/d/746)).
- Support for generics has been improved to properly handle doctrine/collections and other templated types using extended `@template` syntax ([#746](https://community.devsense.com/d/746)).

### Editor Improvements

- `readonly` and `enum` keywords are not incorrectly reported as a syntax error, when used as a part of namespace or a function declaration.
- The language server is allocating significantly less memory during code completion; this improves the overall performance.

### Formatting

- In **Wordpress** code style we are no longer inserting space between parentheses and brackets when empty e.g `foo()`, but `foo( 1, 2 )`.
- Not aligning array initializers key value pairs when they are not on separate line (when `php.format.rules.arrayInitializersAlignKeyValuePairs` enabled).
- Fixes incorrect outdenting of constants in multiline expressions.

### Apple Silicon

Introducing the support for Apple **M1** and **M2** chips (**Apple Silicon**). These CPU's with `arm64-x64` architecture were not fully supported in previous release and we're happy to provide the language server for those architectures now.

## 1.25.11652 (December 21, 2022)

### PHP 8.2

Built-in IntelliSense has been updated to provide the latest PHP 8.2 classes, functions, constants, and documentation in all the available languages ([#215](https://github.com/DEVSENSE/phptools-docs/issues/215)).

As a part of PHP 8.2, we have added integrated multi-language documentation for the new `Random` extension.

### Formatting

One of the feedbacks we got more often was that sometimes formatting was slow. We've addressed these cases, and it should be much better now. But please let us know if you run into a case when it's not fast.

We're also happy to introduce **Wordpress** code style. You just need set `php.format.codestyle` to `wordpress`. Though there are still a couple of rules for us to implement, it's mostly ready.

In this release, we've also focused on code formatting of mixed html/css/js/php. This one is tricky since the indentation of html code is influencing the php code and vice versa [#171](https://github.com/DEVSENSE/phptools-docs/issues/171). We think we got it right now, so hopefully **wordpress templates** will look good when formatted.

### Fixes

- On the first format request, directly after VSCode was first started, only php code was formatted.
- HTML matching tag should get highlighted regardless if it has a php tag inside. [#172](https://github.com/DEVSENSE/phptools-docs/issues/172)
- Wrapping of function arguments list with trailing comma, stoped the formatter.
- Incorrect indentation of function calls prefixed with namespace backslash.
- Unwanted spaces inserted into php code in javascript. [#222](https://github.com/DEVSENSE/phptools-docs/issues/222)
- When formatting, indentation of php code determined by a position of open tags might have been incorrect. The formatter needed a second pass to get it right.
- Code diagnostics fixes:
  - `parent::` not reported as static call in some cases.
  - Local variables in nested arrow functions not reported as uninitialized.
  - Inheriting `@param` type from base classes, if there is no Doc Comment.
  - Removed support for old `@param` syntax [#740](https://community.devsense.com/d/740).
  - Fixes control flow analysis of nested binary expressions.
  - Added support for alternative Doc Comment array syntax, i.e. `(int|string)[]`.
  - Fixed type analysis for more complex generic types inheritance.
  - Added support for generic `IteratorAggregate<TValue>`.
  - Generic types are properly propagated and substituted in tool-tips.

## 1.25.11537 (December 11, 2022)

### Hover Tool-Tip Improvements

Newly, the mouse hover tool-tip shows **descriptions of parameters**. This behavior can be changed using the setting `"php.hover.parameters"`.

The documentation link the muse hover tool-tip can be enabled or disabled using the new setting `"php.hover.documentation"`.

### Generics

The template type inferring and substitution has been improved to handle more complex type hierarchies. ([#723](https://community.devsense.com/d/723), [#733](https://community.devsense.com/d/733), [#731](https://community.devsense.com/d/731))

### Fixes

- Generated **Doc Comment** respects `yield` and correctly annotates function with `Generator` type hint. Additionally, the code diagnostics respect function returning `Generator` and correctly analyzes the return value type.

- `'enum'` keyword is a little hack in the PHP itself. We have fixed how it is parsed so it respects the PHP 5, 7, 8, and 8.1 onwards conrrectly ([#205](https://github.com/DEVSENSE/phptools-docs/issues/205)).

- Autocompletion of parenthesis `()` is inserted ust once when generating automatic function override ([#730](https://community.devsense.com/d/730))

- _Go to Definition_ has been fixed.

### Formatting

#### New customization settings

As promised, we are adding more formatting options based on your feedback.

|Setting|Description|
|-------|-----------|
|`php.format.rules.spaceBeforeParenthesesInArrowFunctions`|Space before parentheses in arrow functions|
|`php.format.rules.spaceAroundConcatenation`|Space around concatenation `.`|
|`php.format.rules.spaceAfterUnaryNot`|Space after unary not `!`|
|`php.format.rules.groupUseWrap`| Defines wrapping behavior of group use |
|`php.format.rules.groupUseNewLineBeforeFirstDeclaration`|Place a new line before first group use declaration|


#### `foreach`

We are compacting `foreach` statement headers into a one line by default now (as defined in `PSR-12`).

```php
<?php 
foreach ($iterable as $key => $value) {
}
```

#### `PSR-12`

We've slightly improved `PSR-12` code style. Now we are automatically wrapping multiline group use declarations as specified in the standard.

```php
<?php
use Vendor\Package\SomeNamespace\{
    SubnamespaceOne\ClassA,
    SubnamespaceOne\ClassB,
    SubnamespaceTwo\ClassY,
    ClassZ,
};
```

#### Fixes

- When anonymous class implements list was defined on multiple lines, we didn't indent them correctly
- Implements list wrapping settings work for anonymous classes too

## 1.24.11420 (December 1, 2022)

### Array Shapes

The editor treats inline array shapes specified in Doc Comments now. The following syntax is correct, and understood by the PHP editor:

```php
<?php

/**
 * @param array{ name: string, id: int, data: \App\Model\User } $a The entity.
 */
function foo($a) { .. }
```

Array shapes improve your code completion, as it provides code completion for array keys; and inferred types, as it resolves the array items type according to the specified index.

### IntelliSense Improvements

**Prentheses Completion**

Newly, IntelliSense completes parentheses when completing a function. The keyboard cursor is placed in between them. Optionally, the feature can be either disabled, or the complete function signature can be completed as a snippet. This allows jumping between parameters with `[tab]` key and fill-in the arguments.

The feature is configurable through the setting `"php.completion.parameters"`. By default, it is set to `"parentheses"` so it completes just the parentheses `()`.

![php complete parentheses](https://raw.githubusercontent.com/DEVSENSE/phptools-docs/master/docs/vscode/imgs/vsc-complete-parentheses.gif)

**Xdebug stubs**

We have added stubs for **Xdebug** extension. Go to settings, and add `"xdebug"` to the `"php.stubs"` setting:

```json
{ "php.stubs": ["*", "xdebug"] }
```

This adds _Xdebug_ functions to IntelliSense, code diagnostics, and improves the type inferring analysis.

**Deprecation Messages**

Whenever a deprecated symbol is used, it is striked out and the corresponding warning is shown. Additionally, in this release, we're adding the deprecation message to the code completion tool-tip.

![php deprecation message](https://raw.githubusercontent.com/DEVSENSE/phptools-docs/master/docs/vscode/imgs/vsc-deprecated-message.png)

Note, to mark your function as deprecated, add the `@deprecated` Doc Comment tag as it is below:

```php
/** @deprecated Do not use this, since version 1.2.3 it is not maintaned anymore! */
function getEntity(array $row) : object { ... }
```

### Customizable Formatter

Many companies have coding guidelines when creating source code which might differ from our predefined code styles. We're happy to introduce highly customizable formatter and we begin with around `30` different code formatting options. This is just a begining and we're accepting suggestions which options to prioritize next.

These more granular code formatting options are only available for `PREMIUM` users, but Community version users can still influence formatting with `php.format.codestyle` option.

For example you can let formatter to auto-align key value pairs in array initializers with `php.format.rules.arrayInitializersAlignKeyValuePairs` option [#692](https://community.devsense.com/d/692-sug-formatting-add-auto-align-option).

```php
$x = [
    1    => 'foo',
    1234 => 'bar'
];
```

Or if you and your company prefer `Whitesmiths` style you can set that up by setting `php.format.codestyle` to `allman` and `php.format.rules.indentBraces` to `true` [#689](https://community.devsense.com/d/689-whitesmiths-style-sometimes-termed-wishart-style).

```php
function foo()
    {
    echo "Hello";
    }
```

In general use `php.format.rules.*` settings to configure the formatter to behave as you wish. For a detailed list of formatting options, either open the Settings Editor (`Ctrl+,`) and type `php format` in the Search bar or see our [documentation page](https://docs.devsense.com/vscode/editor/customize-formatting).

### Format on Type

We've reimplemented how format on type behaves. Now it correctly picks up what part of the code you are editing and formats it when you type `;` or `}`. This way your code always stays correctly formatted without a need to explicitly call the formatting command.

We recommend to turn this feature on. By default in VS Code it's disabled.

If you'd like to turn it on just for PHP you can do it in `settings.json` like this:

```json
"[php]": {
  "editor.formatOnType": true
}
```

### Formatting Fixes

- Functions with multiple parameters that also contained `func_get_args` or `funct_num_args` in the body stopped the formatter.
- Multiline use traits statement were double indented.
- Indentation fix of lambda functions nested in certain statement headers.
- Fixes indenation of chained method calls when part of the chain is a field. [#715](https://community.devsense.com/d/715-if-expression-without-braces-indents)
- Correctly indents arguments of static method calls spread across multiple lines.
- Fixes indentation of multiline field uses, including static fields or constants.
- Null-safe operator is supported.
- Attributes are supported.

### IntelliSense Fixes

**Control Flow**

We have fixed the control flow analysis, when there are functions that never return (i.e. they throw an exception instead of returning a value). Correspondingly, false warnings about unreachable code were fixed, and corresponding variables type inferring as well.

**Trailing Comma in Lambda `use ()`**

The issue with unsupported trailing comma in lambda declaration has been fixed ([#207](https://github.com/DEVSENSE/phptools-docs/issues/207)).

**Blade**

We have fixed use of `@can`, `@endcan`, `@forelse`, and `@empty` inside `.blade.php` files.

**`"php.stubs"`**

The configuration setting `"php.stubs"` has been fixed. It was not working after reloading a workspace.

## 1.23.11234 (November 10, 2012)

### `launch.json` with `"envfile"` Option

Newly, you can specify your `.env` file to be used by the built-in PHP server. This is important especially when developing a **Laravel** application! An example launch configuration would look like the following:

```json
{
    "name": "Start Built-in Server with .env",
    "type": "php",
    "request": "launch",
    "runtimeArgs": ["-S", "localhost:8888", "-t", "public"],
    "envfile": ".env"
}
```

### Doc Comment Generator

The generated PHP Doc has been improved. It specifies `@var` above properties and class constants if possible. Additionally, if the function is recognized as it **never** returns, it annotates the return type as `@return never` ([#193](https://github.com/DEVSENSE/phptools-docs/issues/193)).

### Quick Fixes

The quick fix for getters and setters follows `PSR-12` now. Additionally, it specifies a type hint in the correct form.

Quick fix for generating `__construct()` ([#198](https://github.com/DEVSENSE/phptools-docs/issues/198)) generates Doc Comment in the correct form now. Then generated function complies with PSR-12 now as well.

Also the quick fix for implementing an interface has been updated to follow PSR-12 and to generate type names correctly.

### PHP 8.2

The remaining PHP 8.2 features are being supported by PHP Editor.

- Newly, the special attribute `#[SensitiveParameter]` is included in code completion.
- Also, `enum` case values can be used in constant expressions, as specified in RFC.

### Formatting

#### `PSR-12`

There are couple more rules we are introducing for `PSR-12` code style in this version. Particularly they instruct the formatter on how to behave when formatting control statement headers which are spread across multiple lines.

e.g. 
```php
for ($i = 0; $i < 10; $i++
    ) {
    // for body
}
```

gets formatted to:

```php
for (
    $i = 0;
    $i < 10;
    $i++
) {
    // for body
}
```

In a same way when list of `implements` is split across multiple lines, we put first item on the next line and each interface on a separete line.

Now, when wrapping function or method calls we also consider what kind of arguments are used. When a single argument is split into multiple lines, such as array or lambda function, we do not consider this as a reason to split the argument list. (This behaviour is according to [PSR12 specification](https://www.php-fig.org/psr/psr-12/#47-method-and-function-calls))

```php
<?php

somefunction($foo, $bar, [
  // ...
], $baz);

$app->get('/hello/{name}', function ($name) use ($app) {
    return 'Hello ' . $app->escape($name);
});
```

#### Format Selection

We've improved how format selection is working, which will also affect when `editor.formatOnType` and `editor.formatOnPaste` is enabled.

#### Fixes

We've also fixed an issue when Javascript formatter was adding spaces into php code [#203](https://github.com/DEVSENSE/phptools-docs/issues/203)
and HTML formatter editing contents of php code. This mainly manifestated when `editor.formatOnPaste` option was enabled.

The next, we've addressed some formatting issues as well:
  - Constructor closing `)` was sometimes indented incorrectly when statement was multiline.
  - In certain cases comments were indented incorrectly.
  - Method calls on single line shouldn't wrap. [#693](https://community.devsense.com/d/693-sug-formatting-don-t-wrap-when-there-is-no-data-in-brackets)
  - Functions with `func_get_args` or `funct_num_args` in the body stopped the formatter. [#691](https://community.devsense.com/d/691-bug-formatting-not-working-when-there-are-specific-functions)
  - Only multi-line comments begining with `*` are indented + 1.
  - Sometimes unnecesary new line was added after array initializer.
  - lambdas weren't pushed to the new line when containing element was wrapped
  - fix of double indentation when constructor was present in multiline array
  - Array with multiple lambdas indentation bug. [#702](https://community.devsense.com/d/702-code-format-array-with-multiple-anonymous-functions)
  - Parenthesis expressions weren't indented. [#700](https://community.devsense.com/d/700-code-format-if-condition-with-braces)
  - Multi-line use traits statement is properly indented now.
  - In certain cases new lines after the optional return type were collapsed. [#704](https://community.devsense.com/d/704-code-format-abstract-function)

## 1.22.11089 (October 31, 2022)

### PSR-12 Formatting

We are happy to announce an introduction **PSR-12** code style. With the previous releases we've mostly covered all the important rules necessary for PSR-12 compilent formatter. There are some minor things we are still going to improve, but we are mostly there. We are also switching the default formatting code style from old PSR-2 and from now on, it's going to be PSR-12.

![PSR-12 code style](https://raw.githubusercontent.com/DEVSENSE/phptools-docs/master/docs/vscode/imgs/psr-12.png)

To be complient we've also added these rules:
 - Adding space between exception types in `catch (OtherThrowableType | AnotherThrowableType $e)`
 - Compacting whitespaces in function declaration header so the return type is on the same line as `)` parenthesis

Being complient with `PSR-12` is important, but how the code looks after the formatting is too. And we are continuing to work on beauty part as well. One case we've done for this release is how array initializers are threated. When there is an new line anywhere in the array then we put all the array items on a new line and indent. [#683](https://community.devsense.com/d/683-code-format-array-new-line).

![Array initializer](https://raw.githubusercontent.com/DEVSENSE/phptools-docs/master/docs/vscode/imgs/array_initializers.gif)

In similar way, we are applying the analogous behaviour for call parameters and function/method declarations, but only in `PSR-12` code style.

We've also fixed some minor formatting issues.

### Composer Improvements

`create-project` command has been updated. Now it opens the Open Folder dialog if it's not clear where you'd like to create the new project. At the end, it opens the newly created project in VS Code.

### New Code Diagnostics

Newly, invalid declaration of properties inside interfaces is reported. ([#174](https://github.com/DEVSENSE/phptools-docs/issues/174))

Also, the code analysis handles the default **Laravel** class aliases. This affects IntelliSense and avoids false code warnings.

See the **Fixes** below for more updates.

### Fixes

Code Diagnostics are less strict about type juggling (`int` -> `float` type juggle in `for` loops), and also it handles better array element type inferring ([#185](https://github.com/DEVSENSE/phptools-docs/issues/185)).

Then we have fixed code diagnostic of functions, that use variable amount of arguments through `func_get_args()`. ([#677](https://community.devsense.com/d/677-problem-with-func-get-args-and-phpdoc/5))

Also there were issues when problems and IntelliSense did not get updated after composer packages being removed or updated - we've make changes that avoids that, and everything gets updated seamlessly as it should. ([#182](https://github.com/DEVSENSE/phptools-docs/issues/182))

## 1.21.10985 (October 23, 2022)

### `@var` above function parameters

Editor handles Documentary blocks right above function parameter definition. If there is a `@var` with type specification, it is used for the parameter type across IntelliSense, tool-tips, and code diagnostics.

```php
class MyClass {
    function __construct(
        /** @var T[] */
        public readonly $list, // $list is of type T[]
    ) { }
}
```

### Formatting

How it looks is important. So we continue our effort to make it beautiful:

 - Indent level is incresed in multi-line expressions when accessing a property or calling a method [#530](https://community.devsense.com/d/530-formatting-keep-braces-in-the-same-line/18)
 - We are indenting code in PHP tags in all the code styles. [#173](https://github.com/DEVSENSE/phptools-docs/issues/173)
 - In certain cases when HTML was combined with PHP unexpected new lines were added [#173](https://github.com/DEVSENSE/phptools-docs/issues/173#issuecomment-1280021048)
 - PHP Close tags `?>` are indented according to the previous `<?php` open tag

 ### Improvements

 #### PHPUnit Test View

 This update improves resolving of PHPUnit tests in _Test View_ panel. Processing test files is faster, avoiding redundant read and parse from disk. Also, the test view now supports tests from inherited classes ([#678](https://community.devsense.com/d/678-phpunit-test-explorer-ignores-tests-inside-abstract-parent-testcase-class)).
 
## 1.20.10937 (October 19, 2022)

### Editor Improvements

#### Highlighting Control Structures

Highlighting occurrences of control structures and corresponding keywords has been added. Newly the editor highlights control structures such as `for`, `foreach`, `while`, or `do`, with the corresponding `continue`, or `break`, when you navigate the caret on them. Also, all `return`s are highlighted in the function, and `case`s with `default` label.

It also highlights matching pairs of `switch`/`endswitch`, `if`/`elseif`/`endif`, `try`/`catch`/`finally`, and others.

![highlight if/elseif/endif](https://raw.githubusercontent.com/DEVSENSE/phptools-docs/master/docs/vscode/imgs/highlight-control-structure.png)

#### Fuzzy Search Symbol in Workspace

Searching through the workspace supports fuzzy queries; i.e. the symbol names are matched against letters in the query. Additionally, searching using upper-case letter is case-sensitive, so you can quickly search for camel-cased notation.

![fuzzy search symbols in worksspace](https://raw.githubusercontent.com/DEVSENSE/phptools-docs/master/docs/vscode/imgs/fuzzy-search.gif)

#### Formatting

We are improving formatting support with more cases. 

- The cast operators are separated with a space now. ([#175](https://github.com/DEVSENSE/phptools-docs/issues/175)).
- Constructor property promotion is formatted correctly. [#176](https://github.com/DEVSENSE/phptools-docs/issues/176)
- Unwanted space was added after `::class` in certain cases. [#530](https://community.devsense.com/d/530-formatting-keep-braces-in-the-same-line/26)
- `else` or `elseif` is placed on a new line when goes after a statement. [#530](https://community.devsense.com/d/530-formatting-keep-braces-in-the-same-line/25)
- When type reference is separated from the `?` with one space if it's part of the ternary operator. [#530](https://community.devsense.com/d/530-formatting-keep-braces-in-the-same-line/19)

### Diagnostic Improvements

#### New setting `"php.problems.scope": "opened"`

Newly you can only diagnose PHP files that are opened in the editor. Note, parse errors will be still reported across the entire workspace.

Set the setting `"php.problems.scope": "opened"` to see how it works.

#### Check for too many args

Now we check for use of `func_get_args`, `func_get_arg`, or `func_num_args` so functions with variable number of arguments are detected, and _too_many_args_ warning is not reported.

## v1.19.10893 (October 16, 2022)

### New Formatter

We have redesigned and updated the built-in PHP code formatter. It provides several new formatting styles through the setting `"php.format.codeStyle"`.

#### **`Allman`**

The `Allman` style is named after Eric Allman. This style puts the braces on the next line. This applies to all control statements and declarations.

```php
while ($x == $y)
{
    foo();
}
```

#### **`K&R`**

The `K&R` style (Kernighan & Ritchie Style) keeps open braces on the same line for control structures, types, functions and methods.

```php
while ($x == $y) {
    foo();
}
```

You can still keep using previously supported code styles:

- `"PSR-2"` style,
- Visual Studio-like style called `"PHP Tools"`,
- and `"Off"`,

The formatter works with HTML/JS/CSS, formats ranges, formats whole documents, and formats on typing - after closing a block of code or a statement.

![Formatting multi-line expression](https://raw.githubusercontent.com/DEVSENSE/phptools-docs/master/docs/vscode/imgs/format-document.gif)

#### Formatting Fixes

The following is the list of formatting issues we have fixed and implemented:

- Arrow function formatting fixes.
- Formatting supports nested function calls.
- Fixes of formatting enumerations.
- Fixes of formatting related to `match` expressions.
- *Heredoc* and *Nowdoc* expressions are left untouched during formatting.
- Formatting correctly indents grouped `use` statements.
- Indent multi-line control statements headers.
- Multi-line expressions inside lambdas are indented.
- Empty blocks with comments are indented.
- Group `use` statements and `match` expressions respect optional trailing comma.
- Space between type and ampersand `type &$x` when formatting function parameters.
- Indenting empty blocks with comments.
- Multi-line expressions inside anonymous types are indented.
- Multi-line function and method calls are correctly indented.
- Parenthesis of function or method headers on a new line are not indented.
- Fix of an incorrect new line after a lambda expression.
- Formatting leaves single-line php blocks.
- Close tag is always separated from the previous token.
- Function named arguments are formatted.
- Anonymous classes have space before `{` if kept on the same line as a class header.
- Fixed formatting of PHP code in HTML attributes (e.g. `<div style="<?php echo "something" ?>">`). The formatter won't add additional white-spaces anymore.

### Highlighting To-Do Comments

Newly the editor highlights to-do annotations in your code. This helps to keep track of unfinished work and pending issues.

![highlight todo](https://raw.githubusercontent.com/DEVSENSE/phptools-docs/master/docs/vscode/imgs/highlight-todo.png)

You can customize the style using the following setting:

```json
"php.highlight-todo.style" : {
    "backgroundColor": "#ec0"
}
```

Or you can turn the feature off completely with the setting `"php.highlight-todo.enable": false`.

### Debugger Code Completion

During debugging, when typing into a _Debug Console_, names of existing local variables will be suggested. Type `$` or the completion shortcut (by default `Ctrl`+`Space`), and available local variables will be suggested.

![debugger code completion](https://raw.githubusercontent.com/DEVSENSE/phptools-docs/master/docs/vscode/imgs/vsc-debug-completion.gif)

### New Diagnostics

The editor checks and reports the following diagnostics:

- Calling instance methods statically. ([#641](https://community.devsense.com/d/641-static-call-to-instance-method-not-detected))
- Invalid assignments to type properties. ([#647](https://community.devsense.com/d/647-assigning-wrong-types-is-not-detected))
- Too many arguments provided to a function call. ([#645](https://community.devsense.com/d/645-wrong-number-of-function-call-arguments-not-detected))
- Allows objects to be used for constants, and handles use of Doc Comment with `@var` above `const`.

### New Settings

We have added a new setting `"php.problems.excludeGitIgnore"` ([#169](https://github.com/DEVSENSE/phptools-docs/issues/169)) which simply lets you to ignore code diagnostics in files/folders specified in workspace's `.gitignore`s.

### Fixes

- Code action for generating `__construct()` respects text editor tabs and spaces setting.
- Generating Doc Comment (`/**`) respects the indentation.
- Generating Doc Comment above function respects customized Doc Comment snippet (`php.docblock.functionSnippet` setting).
- Fixes some cases, when IntelliSense was not updated after adding Composer packages.

## 1.18.10692 (September 30, 2022)

### Profiler Support 🔥

PHP code profiling allows you to inspect how much time and how many calls were made to every single function in the code.

[Read more (docs.devsense.com) ...](https://docs.devsense.com/vscode/profiling)

**We have added support for Xdebug profiling!** Xdebug profile files (cachegrind format) can be opened, viewed, and inspected. The extension also highlights hot paths in your code, according to the profiling results.

**Call Times View:**

![php call times view](https://raw.githubusercontent.com/DEVSENSE/phptools-docs/master/docs/vscode/imgs/profile-calltimes.png)

**Callers/Callees View**

Detailed view of callers and called functions, including times.

![php callers callees](https://raw.githubusercontent.com/DEVSENSE/phptools-docs/master/docs/vscode/imgs/profile-details.png)

**Hot Path Decoration**

Profiling result file is analyzed, and hot paths are highlighted right in the source code:

![profiling hot path decoration](https://raw.githubusercontent.com/DEVSENSE/phptools-docs/master/docs/vscode/imgs/profile-highlight.png)

### Updated code diagnostics

- Variables used inside arrow functions are not reported as uninitialized now ([#664](https://community.devsense.com/d/664-bug-when-use-use-keyword-inside-arrow-function-inside-anonymous-function)).
- Diagnostics `PHP1408` and `PHP1409` are reported with a lower severity now.

### Open-VSX

The entire extension is now available on [open-vsx.org](https://open-vsx.org/extension/devsense/phptools-vscode)

### Other Improvements

- Auto-imported 'use' is sorted ([#666](https://community.devsense.com/d/666-auto-import-alphabetically)).
- HTML code formatting fixes.
- Fix of constructor property promotion formatting.

## 1.17.10641 (September 26, 2022)

### Introducing **What's New**

We are getting many useful feature requests and feedbacks, and we're trying hard to add as many improvements as we can. One of them was to inform briefly about the news. With this release, we've started showing **What's New** window with the major updates.

The window can be opened manually with command `"PHP Tools: Release Notes"`. Automatic opening after each major update can be disabled with the checkbox at the bottom of the window.

  ![release notes command](https://raw.githubusercontent.com/DEVSENSE/phptools-docs/master/docs/vscode/imgs/vsc-open-releasenotes.png)

### Debug

Debugging has a few neat features! More settings for enabling profiling, `var_dump()` produces nicer and more detailed messages, and Xdebug for PHP is determined when debugging starts.

#### Debug `develop` Mode

Since this release, we have enabled `develop` Xdebug mode. This gives nicer looking and more informative `var_dump()` outputs.

In case you prefer the normal-looking `var_dump()` messages, change the `"noDevelop"` setting in the `launch.json` profile.

#### Debug `profile` Mode

You can enable `profile` mode now. Set the `"profile": true` setting in your `launch.json` profile:

```json
{
    "name": "Launch & Profile built-in Server",
    "type": "php",
    "request": "launch",
    "runtimeArgs": ["-S", "localhost:8000", "-t", "."],
    "noDebug": true, // <-- do not initiate debugging
    "profile": true // <-- enable xdebug.mode "profile"
}
```

#### Uncaught Exceptions Filter

Newly, the Debug view provides option to either break or ignore **Uncaught Exceptions**. This options is located in "Debug and Run" view, at "Breakpoints" panel.

### Code Diagnostics

- We have fixed incorrect duplicit key check in case of `enum`' case values. ([#658](https://community.devsense.com/d/658-problem-with-enums-as-keys))
- Fixed return type check when return type hint is `void`.
- Reporting anonymous functions with unused `use` variable.
- Reporting anonymous function' `use` variable is not initialized.
- Reporting of empty namespaces.
- Checking that value from a function returning `void` is being used.
- Reports accessing a property on `void`.
- Checks expressions in string interpolation are convertible to `string`.
- Checks that type of a property is defined.
- The diagnostic for unknown class or unknown function is suppressed if user is opening just a single file, without opening a workspace or folder.
- The diagnostic `0412` severity has been changed to *error*, code `1412` (unassigned variable use).

### Composer

All-in-One **Composer** integration has been added! It implements useful commands for requiring, removing and browsing packages, automatically installing `composer.phar` so you don't have to, adding IntelliSense for `composer.json`, code lenses for running scripts, neat tool-tips for your installed packages, it checks for abandoned packages, and more!

### Other Improvements

There are fixes to the PHP formatter. Formatting wasn't performed when explicit cast was used with less common data type alias, e.g. `(integer)`, `(boolean)`, or `(real)`.

## 1.15.10535 (September 14, 2022)

### Command `PHP: Search todo ...`

Introducing a quick way of browsing through all the to-do comments in PHP code. The command `"PHP: Search todo ..."` opens quick pick with all the to-do. It allows to filter, search through, and navigate to the selected item.

  ![searching to-do in PHP code](https://raw.githubusercontent.com/DEVSENSE/phptools-docs/master/docs/vscode/imgs/vsc-search-todo.gif)

### Tool-Tips get nicer

Hover tips for function signatures are split into more lines if they would get too long. Also, the optional parameters are not denoted with `[` `]` anymore. ([#159](https://github.com/DEVSENSE/phptools-docs/issues/159))

  ![long function tool-tip](https://raw.githubusercontent.com/DEVSENSE/phptools-docs/master/docs/vscode/imgs/vsc-long-tooltip.png)

Additionally, safe HTML tags in code comments get rendered nicely in a tool-tip now. Having tags like `<br/>`, `<b>`, `<i>`, `<ul>`, `<li>`, `<code>` in your documentary comments is allowed and when displayed in a tool-tip, it gets rendered nicely and formatted.

  ![html tool-tip](https://raw.githubusercontent.com/DEVSENSE/phptools-docs/master/docs/vscode/imgs/vsc-html-tooltip.png)

### Code Diagnostics

We have added more diagnostics, and fixed a few rare cases in code flow analysis.

- There is a diagnostic for invalid use `break;`, when `break` or `continue` are out of the allowed scope.
- Diagnostic of code reachability with `try`/`finally` was fixed.
- Diagnostic of function return has been improved in cases, where there is a type hint `mixed`, but the function does not return anything.

### Other Improvements

There are fixes to internal exceptions, and several performance and memory use optimizations.

## 1.14.10471 (September 7, 2022)

- new `"php"` **task definition**; this allows defining VS Code task that executes a PHP script, using currently configured "php" executable:
  ```json
  // .vscode/tasks.json
  {
      "type": "php",
      "file": "${workspaceFolder}/script1.php",
      "args": ["argument"]
  }
  ```
- **settings** `"phpunit.preTask"` and `"phpunit.postTask"` allowing to specify a task or list of tasks from `tasks.json` to be executed before or after a test runs ([#154](https://github.com/DEVSENSE/phptools-docs/issues/154#issuecomment-1207248667)).
  - tasks executed within `phpunit.preTask` and `phpunit.postTask` can use variables `${command:phpunit.filter}` or `${command:phpunit.testsuite}`
- **settings** to customize DocComments (_PHPDoc_) generated by typing `/**`
- **Diagnostics**:
  - duplicit field declaration reported
  - duplicit class constant declaration reported
  - dynamic properties reported if there isn't corresponding `__get`/`__set`, or `@property` annotation
  - foreach control variables can be annotated with DocBlock
- **IntelliSense**: updated PHP 8 `Attribute` class declaration with its members
- **getter/setter** code action respects `static` properties

## 1.13.10390 (August 30, 2022)

- fixes format on paste

## 1.13.10378 (August 29, 2022)

- fixes for HTML/CSS/JS editor features
- HTML/CSS/JS formatting enabled in PHP files
- fixes Format breaks subsequent code ([#156](https://github.com/DEVSENSE/phptools-docs/issues/156))

## 1.13.10301 (August 16, 2022)

- **PHP 8.2** read-only classes supported.
- Some **PHP 8.2** compatibility checks.
- _Go To Definition_ command navigates to `include`/`require` target file.
- Tooltip for pseudo-constants shows correct value.
- Spacebar (pressing `space`) after `new`, `use`, `extends`, or `implements` triggers code completion.
- Non-Standard Doc Block type names supported ([#622](https://community.devsense.com/d/622-nonstandard-external-library-docblocks)).

## 1.13.10239 (August 11, 2022)

- code diagnostic for unknown properties (`PHP0416`)
  - quick fix for unknown property (for now fixing small typos and casing)
  - `stdClass` and classes with `__get()` magic method ignored (as specified in [the PHP 8.2 RFC](https://wiki.php.net/rfc/deprecate_dynamic_properties))
- auto-import (FQN) avoids creating a conflict name
- code completion after `extends` avoids suggesting the containing class itself
- fixes case-sensitivity checks for property names

## 1.12.10140 (August 4, 2022)

- `Go to Type Definition` command added; navigates to type definition instead of `__construct` in `new` expression.
- PHPUnit View: Fixes tracking a failed test location ([#150](https://github.com/DEVSENSE/phptools-docs/issues/150#issuecomment-1192046307))

## 1.12.10040 (July 26, 2022)

- setting `php.workspace.includePath` allowing to specify additional directories to be included in IntelliSense.
- improves workspace loading, processes files better in parallel

## 1.12.10022 (July 25, 2022)

- fixes activation

## 1.12.9985 (July 20, 2022)

- **PHPUnit Tests Integration**
  - new UI for PHPUnit tests
  - **showing inline failure messages**
  - **debugging PHPUnit tests** using the new UI
  - **diff** of expected and actual values
  - smaller extension
  - avoids dependency to the old `ms-vscode.test-adapter-converter` **(can be uninstalled)**
  - avoids dependency to the old `hbenl.vscode-test-explorer` **(can be uninstalled)**
- optimized extension load, smaller installation package
- suggesting new parameter name based on its type hint
- union types properly inserted in newly generated Doc Comment (when typing `/**` above function)
- generated Doc Comment annotates thrown exceptions (`@throws` PHPDoc Tag)
- handles external changes, fixes re-indexing when composer packages are being installed/updated
- showing all classes in PHPDoc completion, will be auto-imported when commited (according to setting `php.format.autoimport`)
- fixes **Alpine Linux Arm64** platform
- fixes `phpTools.language` setting for various texts (summaries of various built-in functions and constats).
- fixes unused `use` warning being listed twice
- fixes rename refactoring of variables inside Doc Comments.
- not reporting missuse of `$this` in template files
- improved completion after functions noted in .phpstorm.meta file.
- improved completion after methods annotated with generic type within trait
- `php.format.autoimport-docblock` setting to configure completion of type names within Doc Block, `"FQN"` by default.

## 1.11.9762 (July 1, 2022)

- fixes completion after `enum`'s case (no completions listed)
- fixes tooltip over variables, resolved type name is correctly shortened

## 1.11.9761 (June 29, 2022)

- fixes error [#147](https://github.com/DEVSENSE/phptools-docs/issues/147)

## 1.10.9721 (June 25, 2022)

- fixes language server crash when completing the builtin `enum` member.

## 1.10.9716 (June 25, 2022)

- IntelliSense support for builtin `enum` methods and properties.
- Improves type inferring for array-typed properties.
- Laravel's Real-Time Facades recognized, and supported by code completion.
- Eloquent's Local Scopes listed in code completion.
- Fixes highlighting of unused `use` when it's used in an unused Doc Comment.
- Fixes Test Explorer for tests annotated with `@test` Doc Comment.

## 1.9.9585 (June 7, 2022)

- infers `@template` types in combination with `class-string<T>` type annotation
- automatically recognizes some non-standard file extensions to be parsed as PHP files as well (improves code completion on *Drupal*)
- fixes completion after reserved type names (`self`, `parent`, `static`)
- fixes `->` syntax after constants and class constants (*PHP 8.1*)
- fixes completion after `->` with `new` in the expression chain
- fixes changing PHP version

## 	1.9.9479 (May 25, 2022)

- improves Laravel Facades inferring on multi-core CPUs
- improves documentary comments processing, respects more conventions from phpstan and psalm
- improves code completion on generic types and generic `@mixin` types
- fixes possible crash on huge projects (StackOverflow fix)
- fixes possible completion issue, when 3rd party extension passes invalid LSP protocol data
- fixes issue handling breakpoints when there are many concurrent requests
- debugger stability improvements

## 1.9.9277 (April 29, 2022)

- **IntelliSense**
  - **support for generics**
  - IntelliSense handles specialized type names
  - templated types are resolved against bound generic arguments
  - generic types are infered from constructor arguments passed to `new()`
  - tooltips shows the generic arguments
  - IntelliSense understands `@template` arguments, and extended PHPDoc syntax (generics, psalm, phpstan)
  - IntelliSense completes special PHPDoc tags used for generics
  - code completion uses the template `of` type if the value is unbound
  - code analysis respects generics
- updated PHP syntax parser, fixes `instanceof` syntax
- fixes missing items in IntelliSense after installing/updating composer packages
- fixes for HTML/CSS/JS IntelliSense
- fixes items in IntelliSense after external file changes
- stubs include `zip` and `zlib` by default
- providing API for 3rd party extensions

## 1.8.8970 (March 23, 2022)

- adds missing `MYSQLI_` constants
- fixes PHPUnit runner; resolves correct `phpunit` PHP script
- fixes processing HEREDOC and NEWDOC syntax with empty lines and indentation
- fixes parser to allow PHP 8 `readonly` modifier in constructor property
- fixes `phpTools.language` setting, PHP manual is localized properly
- unused `use` check respects `@Method` PHPDoc tag
- fixes freezing during resolving PHP binaries and related PHP information
- `php.linkedEditing.variables`: setting to enable linked editing for local variables (`false` by default, `editor.linkedEditing` needs to be enabled)
- `editor.linkedEditing`: avoids bad edits when the whole variable name is deleted
- `editor.linkedEditing`: keeps the linked variable names even after they get deleted
- debugger listens on both IPv4 and IPv6, supports optional launch configuration `"hostname"`
- debugger fixes for arrays
- `php.version` setting is respected by the editor even there is no matching `php` executable
- `composer.json` is checked for the minimum PHP version, if `php.version` setting is not set
- **web** extension shows and allows to change PHP language level

---

- extension does not download external dependencies; makes the initial run faster and reliable
- extension does not expect `dotnet` runtime installed on the system
- language server supports incremental text edits to lower protocol overhead
- new platforms supported: `alpine-x64`, `win32-arm64`, `darwin-arm64`

## 1.7.8766 (March 8, 2022)

- updates IntelliSense with `ctype` books
- updates IntelliSense with STD constants
- functions marked with `@ignore` are not listed in completion and signature help
- completion after `new` lists variables as well
- optimizations

## 1.7.8717 (March 4, 2022)

- language server stability fix of a possible issue (when using ORM notation)
- `"php.debug.port"` can be set in workspace scope settings.
- debugging tests fix; uses correct port from `"php.debug.port"` or `9003` by default.
- Laravel static Facades recognized in IntelliSense
- Laravel class aliases recognized in IntelliSense
- improves code parser with PHPDoc

## 1.7.8637 (February 26, 2022)

- web extension load fix

## 1.7.8627 (February 25, 2022)

- debugger reports correctly when one or all of the ports are not available
- fixes missing `E_` constants in IntelliSense
- PHPUnit debugger respects Xdebug port setting "`php.debug.port`" instead of using hardcoded port `9000`

## 1.6.8588 (February 19, 2022)

- debugger "exclude" launch setting allows to negate the path with `!` prefix, i.e.:
  ```json
  "exclude": ["!**/app/**", "!**/vendor/mypackage/**"]
  ```
- debug won't launch if no Xdebug ports are available
- if Xdebug port can't be used, the detailed message is reported to the debug output panel
- installation: downloading dependencies with alternative locations
- IntelliSense prefers PHPDoc type annotation over the type hint (more specific completions)
- Doctrine ORM attributed annotation used for properties type annotation
- Language Server avoids using File System Watcher improving performance on Unix based system ([#521](https://community.devsense.com/d/521))
- smaller installation package
- setting `"php.stubs"` allowing to explicitly set names of extensions to be included in the IntelliSense, localized manual, and code analysis.
- added support for **linked editing** (`"editor.linkedEditing": true`) for local variables

---

- new platform supported: `web`

## 1.6.8479 (February 11, 2022)

- fixed preview of string values
- optimized file parsing

## 1.6.8448 (February 10, 2022)

- code analysis shows the incorrect declaration of PHP 8.1 `readonly` property
- fixes code-lens in virtual PHP manual files (when navigated to a builtin PHP with Go To Def (`F12`))
- virtual PHP manual displayed as a VS Code virtual document (does not create tmp file on disk)
- **PHPUnit runner and debugger** setting `phpunit.phpunit` to specify phpunit binary

## 1.6.8324 (January 28, 2022)

- **debugging adornments**
- extended compatibility
- code lens for enum cases
- `php.debug.port` and launch port setting allow to listen on multiple ports. `[9003, 9000]` by default.

## 1.5.8292 (January 25, 2022)

- fixes debug tooltips and debug watch

## 1.5.8280 (January 24, 2022)

- **debugging** launch improvements, provides every option on how to start debug according to current file or workspace
- provides advanced commands for running and debugging PHP files and projects
- added setting `php.debug.port` specifying the default Xdebug port
- the editor complies with PHP 8.1 by default, if not specified otherwise
- code lens minor updates
- fixes false warning about missing "php"
- fixes extension dependencies
- fixes extension activation time

## 1.5.8204 (January 17, 2022) preview

- **Code Lens**
  - references, method overrides, trait uses, type implementation, method prototype implementation
  - peeks the references in the references window
  - setting to enable/disable: `php.codeLens.enabled`. By default `true`.
- if no `php` is set for the workspace, the editor picks the highest defined in `php.executables` setting
- improves completion and tooltips after nullable type-hints
- improves code analysis for `trait` with private abstract functions
- improves code analysis for use of `[]`
- improves code analysis about `isset` in global code
- improves analysis of the missing implementation of abstract methods
- validation for PHP 8.1 intersection types (check for use of scalars, check for valid types used)
- added missing modifier keywords to completion within function header
- fixes **Testing** to allow to run all tests (`Run all tests` in *Testing* panel)

## 1.4.8059 (December 20, 2021) preview

- detected PHP binaries may have invalid configuration, PHP Tools will report the warning and use the binaries anyways if a user wants so.
- diagnostic reports improper use of `static` in parameter type hints
- shortens type names inside PHP 8.1 intersection types in tooltips according to the current namespace
- updated color tooltips with PHP 8.1 syntax

## 1.4.8033 (December 17, 2021) preview

- fixed *overflow to double* problem underline position
- debugger respects user arguments over its forced arguments
- avoids suggesting adding `use` if it's already there in some cases ([#127](https://github.com/DEVSENSE/phptools-docs/issues/127))
- updated PHP manual
- updated code completion within PHP 8 attributes
- avoids reporting ByRef issues as an error, reports as a warning instead
- folding HEREDOC blocks
- possible fix of resolution of existing `php` on Windows
- PHP 8.1 intersection types (parsed, resolved)

> *note: type inferring and tooltips do not handle intersection types completely yet*

## 1.4.7597 (September 30, 2021) preview

- updated inferred type analysis of built-in functions
- highlights `case` within `switch`
- fixed possible stack overflow exception

## 1.4.7534 (September 21, 2021) preview

- fixes crashing when code contains huge nested expressions
- fixes language server protocol
- improves code analysis for `array_pad()`, `array_fill()`
- fixes false positive warning for chained use of `[]` in LValue
- memory optimizations

## 1.4.7520 (September 19, 2021) preview

- memory optimizations
- fixes crashing when code contains huge nested expressions

## 1.4.7494 (September 15, 2021) preview

- function return value summary displayed in tooltips
- fixes refactoring actions
- fixes code actions
- fixes PHPDoc generator
- optimizes protocol

## 1.4.7449 (September 7, 2021) preview

- improves analysis of `$this`
- improves error reporting of unused variables
- fixes whole document formatting
- fixes formatting of variable-less `catch`
- fixes an occasional issue when no debug port is specified
- internal performance improvements for JSON protocol
- fixes debugging documents without a workspace *(just an opened file without workspace or folder)*
- updated PHP manual
- fixes PHP parser - `readonly` is treated as it should according to PHP version

## 1.4.7295 (August 17, 2021) preview

- **PHP 8.1** syntax, code sense, and checks
  - read-only properties
  - final class const
  - new in initializers
  - new callable syntax
- updated PHP manual
- fixes incorrectly reported deprecations
- fixes incorrect parameteres with 'null' type hint

## 1.4.7254 (August 15, 2021) preview

- **Debug**
  - allows compound launch
  - allows more debug sessions at once
  - Xdebug port doesn't have to be specified (the `"port"` launch configuration)

## 1.4.6982 (July 15, 2021) preview

- when auto-import enabled, completions shows all possible types within possible namespaces
- automatically completes fully-qualified-name when auto-importing and there is a conflict with existing alias
- shows *(auto import)* in completion, if auto-importing will happen
- completion better lists variables
- optimizations
- when there are multiple types to auto-import, they are all shown in the completion list to choose from

## 1.4.6842 (June 22, 2021) preview

- automatic import of alias when completion
- setting `php.format.autoimport`
  - **auto-import option**: auto imports alias when completing types/function/constants out of namespace scope
  - **fqn**: inserts fully qualified name upon completion
  - **none**: inserts name as it is
  - **hide**: does not show inaccessible symbols in code completion
- fix position of light bulb for code action for fully qualifying name
- strikes out deprecated symbols in code completion

## 1.4.6822 (June 19, 2021) preview

- updated code analysis and code completion
- recognizes more undocumented `.phpstorm.meta.php` constructs ([#102](https://github.com/DEVSENSE/phptools-docs/issues/102))
- fixes PHPUnit TestCase MockObject type analysis ([#102](https://github.com/DEVSENSE/phptools-docs/issues/102))
- code action for simplifying fully qualified names ([#88](https://github.com/DEVSENSE/phptools-docs/issues/88))

## 1.4.6762 (June 07, 2021) preview

- PHP version picker ([see Selecting PHP in docs](https://docs.devsense.com/en/vscode/editor/php-version-select))
- `.editorconfig` problems conventions ([see Problems in docs](https://docs.devsense.com/en/vscode/problems#editorconfig))
- `"php.problems.scope"` setting (ignoring "vendor" folder by default) ([see Problems in docs](https://docs.devsense.com/en/vscode/problems#phpproblemsscope))
- debugging improvements
- exception handling - always break on fatal error, option to choose whether to break on handled errors/exceptions

---

## 1.3.6645 (May 25, 2021) preview

- debugging fixes and improvements
- debugging UX improvements

## 1.3.6632 (May 21, 2021) preview

- **Test Explorer** lists tests without running them
- Test Explorer supports tests with data sets properly
- tests get retired (grayed) if the source is modified
- optimized **debug protocol**

## 1.3.6616 (May 21, 2021) preview

- new **Test Explorer** (requires `hbenl.vscode-test-explorer`)
- debugging has been updated with support for multiple request handling, stability enhancements, corectness
- debugging supports detach
- optimizes Xdebug protocol
- **PHP 8.1** syntax support, `never` return type, `enum`, octal number notation
- completion of static methods after `$this->`
- `#[NoReturn]` attribute supported

---

## 1.2.6549 (May 12, 2021) preview

- fixes debug implementation (unexpected debug sessions closing)
- fixes debug breakpoints
- optimizes Xdebug protocol
- fixes HEREDOC parser
- fixes named parameters analysis for special names
- fixes PHP 8 parsing and invalid syntax errors
- optimizations

## 1.2.6469 (April 24, 2021) preview

- code action for **sort uses** (PSR-12)
- reports curly braces as deprecated since PHP 8.0
- support for remote file systems
- type analysis improvements

## 1.2.6305 (April 04, 2021) preview

- shows PHP version in status bar without suffix
- hotfix for macOS, downloading runtime package

## 1.2.6273 (March 30, 2021) preview

- code action for **generating constructors**
- code action for **getter/setter** respect field staticness
- fixes code actions
- faster code completion popup
- faster tooltip display for variables

## 1.2.6177 (March 17, 2021) preview

- memory optimizations
- fixes for Node.JS on IA-32 architectures
- fixes `PHP0423` for ambigous function declarations
- does not list names of anonymous classes in completion

## 1.2.6021 (Feb 17, 2021) preview

- PHPDoc generated for local variables and globals when user types `/**` above them
- updated PHP manual with more PHP 8 declarations
- pretty-print after `::class` and `fn` fixes
- avoided a few falsely reported problems
- fixes type analysis for reserved keywords within PHPDoc `@return` tag
- more details in tool-tips for built-in type keywords
- DBGp Proxy support fixes for the server downloaded from the Xdebug home page

## 1.2.5988 (Feb 10, 2021) preview

- fixes language server crash (stack overflow exception)
- more tollerant problems validation
- code analysis improvements

## 1.2.5973 (Feb 08, 2021) preview

- code analysis overall improvements, finally blocks fixes, constrained constants not reported
- refactoring and highlight occurence fixes for global constants in a namespace
- improved performance
- (linux, macOs) fixes server not being closed after VSCode shutdown or folder closed

## 1.2.5931 (Jan 31, 2021) preview

- rename refactoring allows to rename dynamic names
- language server crash fix when `__construct` contains trailing comma
- updated pcre check
- type analysis improvements, less falsely warnings
- improved analysis of standard functions
- improved analysis of try/catch blocks
- tolerant to mismatching PHPDoc type annotation of properties
- type check looks into subtypes of traits and interfaces, not being so strict
- fixed code actions and quick fixes

## 1.2.5887 (Jan 23, 2021) preview

- rename refactoring with preview
- pretty print of `use` groups
- built on .NET 5.0 (having `.NET 5.0 Runtime` avoids additional downloads)
- treats subtypes when resolving methods
- handles trait users improving analysis of trait and go to definition for methods in subtypes
- improves code analysis and type analysis
- avoids a lot of falsely warnings
- go to definition of parent of anonymous class fix

## 1.2.5843 (Jan 18, 2021) preview

- files in source controlled folders are ignored when changed (.git, .history, .svn)
- fixes PHP version in status bar - only shown when editing a PHP file
- optimizations
- updated PCRE check
- fixed code completion at the very end of document

## 1.2.5783 (Jan 04, 2021) preview

- respects `@template` annotation in PHPDoc
- handles inline `@var` annotation
- signature help for ambiguous constructors (`new \ReflectionMethod`)
- PHPDoc array type with union elements annotation (`array<A\B\C>`)
- PHPDoc allows for nullable type annotation (e.g. `?int`)
- optimizations
- improves code analysis, avoids some false positives
- improves code flow analysis, isset(), is_resource(), and type inference
- improves analysis for lambda function use variables
- CLI specific constants and variables are allowed and code completed
- updates `.phpstorm.meta.php` parser for type inference
- does not respect PHP4-style ctor when using PHP 7.1+
- fixes "Go to Implementation" in case of an anonymous class
- fixes return check of generator functions
- fixes check for `__clone()` magic method, can be private
- fixes check for array access on `\SplObjectStorage`
- fixes case and array key duplicity check for non-printable characters

---

## 1.1.5686 (Dec 23, 2020) preview

- support for `@mixin` annotations
- support for `@method` annotation with `$this` return type
- handles nullable type annotation in PHPDoc
- fixes resolution of type names in PHPDoc blocks
- fixes some incorrectly reported warnings (mostly an unknown method warning)
- updated pcre check
- can be installed on linux-arm64
- improves type names in tool tips
- code formatting for `match` expressions
- fixes code validation of class declaration
- updated integrated PHP manual

## 1.1.5620 (Dec 12, 2020) preview

- syntax checks respect current PHP version including 8.0.
- more quick fixes for invalid union types
- updated pcre check
- tool-tip type names rendered shorter

## 1.1.5595 (Dec 04, 2020) preview

- named arguments code completion (PHP 8)
- named arguments hover information
- functions annotated with `#[Deprecated]` attribute reported in diagnostics
- diagnostics for matching or unknown named arguments (PHP 8)
- diagnostics for `iterable` type hint
- diagnostics for nullable types
- diagnostics for union types (PHP 8)
- `null` type name within unions (PHP 8)
- improved `.phpstorm.metadata.php` annotations
- support for Xdebug 3.0 and PHP 8.0 debugging

## 1.1.5532 (Nov 21, 2020) preview

- updated PSR-2 code formatting
- warning `PHP0415` for use of an undefined constant
- warning `PHP0418` for use of an undefined method
- code fix for `PHP0415` if it might be a local variable
- doctrine annotations in code completion
- fixes class name completion within PHPDoc
- updated global constants in code completion and analysis
- updated PHP manual translations

---

## 1.0.5403 (Oct 28, 2020) preview

- analysis of class properties
- fixes type hint for magic methods
- stability fixes

## 1.0.5342 (Oct 20, 2020) preview

- PHP 8 new attribute syntax `#[]`
- more code suggestions
- improves unused `use` diagnostic when used in PHPDoc
- improves underlining of problems in opened document when typing
- `@suppress` and `@SuppressWarnings` PHPDoc tags allowing to ignore specified warnings within class/function
- supports more PHPDoc array syntax conventions
- improves analysis of `isset()` and `new static()`

## 1.0.5264 (Sep 30, 2020) preview

- fix for double-dollar `$$` character in code completion of a variable

## 1.0.5229 (Sep 22, 2020) preview

- diagnostic and quick fix for names that can be simplified
- diagnostic for unused parameters in constructors and private functions
- updates of externally modified files (`*.php`)

## 1.0.5153 (Aug 28, 2020) preview

- `@dataProvider` PHPDoc attribute; code sense, navigation, completion
- implement missing abstracts quickfix respects original `public` keyword
- PHP 8.0 null-safe operator supported
- PHP 8.0 `match` construct supported (must have PHP >=8.0 `phpExecutable`)
- fix of `quick fix` for overlapping problems
- stability fixes

## 1.0.5087 (Aug 17, 2020) preview

- deduplicated quick fixes
- improved type analysis of expressions enclosed in parenthesis
- unknown type name in PHPDoc gets quick fix
- mouse hover shows whether function returns `null` as well (`void` is shown as `null` eventually)
- *go to implementations* for methods
- provides quick fix for invalid base classes
- code completion after `namespace` keyword

## 1.0.5044 (Aug 11, 2020) preview

- quick fix for unknown class names in PHPDoc
- quick fix to remove unnecessary `use`
- `iterable` phpdoc type hint
- load status indicator in status bar at left
- current PHP version indicator in status bar (bottom right)
- workspace re-analysed lazily when code is changed (disable with [`"php.problems.workspaceAnalysis": false`](https://docs.devsense.com/en/vscode/configuration#configuration-options))

## 1.0.5029 (Aug 07, 2020) preview

- "go to implementations" support
- `SonarSource.sonarlint-vscode` not reported as incompatible
- fixes "go to" of interface names after `extends` keyword
- deprecations are rendered with a strike through 

## 1.0.5015 (Aug 06, 2020) preview

- "find all references" of `__construct` includes class instantiations
- "find all references" perf.
- problems analysis improvements
- improved analysis of inline PHPDoc type hints
- some problems related to other problems are not reported
- parser fixes

## 1.0.4975 (July 29, 2020) preview

- performance improvements
- problems analysis improvements
- improves workspace loading
- logging of workspace load failures

## 1.0.4934 (July 19, 2020) preview

- standalone `@deprecated` not ignored
- few performance improvements
- fixes duplicities in reported problems
- some problems caused by other problems not reported
- workspace loading and code editing improvements

## 1.0.4908 (July 13, 2020) preview

- less falsely positive warnings
- improved type analysis of `static` and properties
- PHP 8.0 (Alpha 1) syntax supported
- New PHP 8.0 compatibility warnings
- fixed implements abstracts for trait members
- improved formatting when using tabs

## 1.0.4698 (May 19, 2020) preview

- better placement of `use` quick action

## 1.0.4666 (May 06, 2020) preview

- fixes for systems without .NET Runtime (3.x or 5.x) installed

## 1.0.4654 (May 05, 2020) preview

- improved run of all tests (runs within single process now)
- PHPDoc type hints in `@method` respect current namespace
- locals in arrow function used from parent scope and annotated properly

## 1.0.4608 (April 17, 2020) preview

- configuration snippet for `Launch current script in console` fixed
- HTML tooltips in PHP script
- `<` triggers HTML completion
- PCRE patterns check (within `preg_*` functions)
- PHPDoc `@method` with vararg supported
- unused `use` highlighting respects custom PHPDoc tags
- Test Explorer fixes:
  - debugging session closed after test finishes
  - test cases can be debugged without additional configuration
  - fixes exception upon test run

## 1.0.4394 (January 23, 2020) preview

- fixed completion of variables (`$` prefix is not duplicated)

## 1.0.4277 (December 10, 2019) preview

- code flow analysis improvements for `finally` blocks
- makes use of `dotnet` 3.1 if installed on the system
- minor fixes, and updates to stabilty issues

## 1.0.4229 (November 22, 2019) preview

- `Implement abstracts` **code action** & **quick fix** (interfaces and abstract members)
- `Add getter/setter` **code action** for fields and multiple fields
- updates to stability issues

## 1.0.4187 (November 10, 2019) preview

- code editor fixes (occuring when format on save, format on paste)
- completion inside PHPDoc

## 1.0.4168 (November 4, 2019) preview

- improved listing symbols in document/workspace
- listing properties when searching prefixed with `$`
- navigation to trait uses

## 1.0.4145 (October 24, 2019) preview

- problems check for not implemented functions
- problems check for traits
- improved tooltips and performance
- updated builtin PHP manual
- debugger reports common issues human friendly

## 1.0.4009 (September 23, 2019) preview

- `{@link}` in tooltips shown as hyperlink
- `{@inheritdoc}` gets substituted according to PHPDoc specs.
- updated blade templating editor (`@section`, `@yield`) and formatting fixes
- embedded HTML fixes
- stability fixes, improved internal error logging
- reporting problems improvements

## 1.0.3951 (September 9, 2019) preview

- generated PHPDoc respects type hints
- generated PHPDoc treats nullable types correctly
- language server crash fix
- avoids spawning `rg.exe` when running `composer install|update` (fixes system freezing)

## 1.0.3936 (September 5, 2019) preview

- PHAR files in workspace get parsed
- **code completion** includes declarations from PHAR files
- **go to definition** supports content in PHAR files
- **navigation** through entries in PHAR files
- **signature help** and **tooltips** for declarations in PHAR files
- minor fixes and improvements

## 1.0.3774 (August 1, 2019) preview

- formatting of typed properties
- completion after `use` is filtered by class name
- obtaining long data from Xdebug

## 1.0.3748 (July 24, 2019) preview

- classes/interfaces/traits not available in current namespace or uses are not listed in code completion
- dynamic class aliasing supported in code completion and type analysis (`class_alias()` and Joomla registered aliases)
- PHP in blade blocks (`.blade.php`) (except syntax highlighting)
- improved type analysis of arguments passed by reference
- fixed pasting when `Format on Paste` is enabled (HTML was corrupted)

## 1.0.3703 (July 17, 2019) preview

- performance optimizations
- `php.problems.workspaceAnalysis` setting to enable/disable workspace-wide problems analysis
- array unpack type check

**PHP 7.4 support**

- PHP 7.4 support (arrow functions, typed properties, spread array, `??=` operator, underscores in numbers)
- PHP 7.4 features reported when using PHP < 7.4
- PHP 7.4 features analysis, type analysis, problems analysis
- spread array type check

## 1.0.3645 (July 11, 2019) preview

- improved project load and background analysis
- `.phpstorm.meta.php` (version 2016.2+) processed
- Code completion and analysis of IoC
- fixed formatting for nullable types
- formatting pretty-prints opening bracket `{`
- formatting code style defaults to `PSR-2`

## 1.0.3603 (July 8, 2019) preview

- fixed issue when some warnings disappear and after few secs appear
- improved CPU use when opening/closing documents
- fixed formatting around `?:` and `::`
- improved code analysis evaluation
- less strict analysis of use of uninitialized variables
- completion after `use` gets fully qualified names

## 1.0.3593 (July 5, 2019) preview

- diagnostics of magic methods
- diagnostics of duplicit function parameters
- improved type analysis of numbers
- launching debugger enhancements
- PSR-2 formatter fixes

## 1.0.3574 (July 2, 2019) preview

- improved type analysis of `explode()`, `microtime()`, Oxid framework
- `catch` variable diagnostics and analysis

## 1.0.3547 (June 27, 2019) preview

- formatter improvements
- DBGP proxy support
- improved unused variable diagnostic

## 1.0.3525 (June 24, 2019) preview

- anonymous functions type analysis
- anonymous functions annotated with PHPDoc
- anonymous functions details in tool tips
- signature help with function return type
- dimmed unused variables
- loading project performance, responsiveness

## 1.0.3507 (June 22, 2019) preview

- fixed increasing number of untitled documents upon code format
- type analysis improvements
- inital support for dbgp proxy

## 1.0.3483 (June 17, 2019) preview

- updated PHP manual
- validation of value passed to `define()`
- validation of use of `define()` on PHP >= 7.3

## 1.0.3471 (June 12, 2019) preview

- support for logpoints
- `php.format.codeStyle` can be set in the workspace scope
- code formatting fixes, indentation after opening tag, blocks on a new line
- `html`+`php` formatting fix for overlapping ranges error

## 1.0.3435 (May 28, 2019) preview

- fix for disabling breakpoints
- optimized debug protocol

## 1.0.3428 (May 27, 2019) preview

- updated PHP manual for the latest PHP 7.3 and PHP 7.4 constructs
- updated readme

## 1.0.3386 (May 9, 2019) preview

- Disabled warning PHP0424 when passing an object in foreach
- Analysis of use params within lambda function
- Minor code navigation fixes
- Minor code formatting fixes

## 1.0.3348 (Apr 23, 2019) preview

- signature helper fixed, showing the correct parameter
- fixes running the extension when there is no `dotnet`
- works with `dotnet` 3.0

## 1.0.3241 (Mar 4, 2019) preview

- PHPDoc generation with parameter names

## 1.0.3230 (Feb 27, 2019) preview

- PHPDoc blocks inserted with placeholders (snippet)
- PHPDoc tags snippets
- PHP compatibility warnings
- fixed not disappearing warnings after file delete
- fixed pretty-print of `die()` construct
- fixed formatting for function headers and properties

## 1.0.3202 (Feb 20, 2019) preview

- updated PHP manual
- format on type (`;` and `}`)
- format profile `Off`
- formatting not applied when code is syntax invalid

## 1.0.3185 (Feb 14, 2019) preview

- code completion in PHPDoc for PHPDoc keywords (after `@`)
- code actions for typos in PHPDoc and unknown type names in PHPDoc

## 1.0.3174 (Feb 12, 2019) preview

- code action for adding `use ;` when applicable
- code action to fully qualify type name when necessary
- generating `PHPDoc` when user types `/**` (`formatOnType` must be enabled)
- selection format
- localized messages - en, de, ja, tz, es

## 1.0.3058 (Dec 30, 2018) preview

- improved code formatting
- few texts localized to german

## 1.0.3031 (Dec 3, 2018) preview

- folding collapses the inner range
- formatting code style setting `php.format.codeStyle`
- PHPDoc for local variables with multiple `@var`/`@global` tags
- code suggestion to add `$this->` if applicable

## 1.0.3003 (Nov 26, 2018) preview

- code suggestion for an unknown class error
- unnecessary `use` directives are rendered as fade out
- `F10` and `F11` start debugging and stop on entry
- `exclude` launch configuration - patterns that will be skipped from debugging when stepping
- debugger allows setting a variable or property value
- debugger supports long strings
- debugger supports paging for large arrays
- test explorer optimization
- generated files are not included in user's workspace
- test explorer shows only user's tests, only if there is no `phpunit.xml` in root then all tests in recursive dirs are listed

## 1.0.2930 (Nov 3, 2018) preview

- display language setting `phpTools.language` can be changed without reloading the workspace
- changing setting `php.problems.exclude` updates the problems window
- a file changed outside the editor gets updated
- stability fixes

## 1.0.2915 (Oct 30, 2018) preview

- debugger allows inspecting stack frames and locals value
- experimental: setting `files.exclude` is handled
- experimental: setting `php.problems.exclude` allows ignoring specified folders and all or specified problem codes
- not completing items right after <?
- highlighting references under caret optimization

## 1.0.2895 (Oct 23, 2018) preview

- project problems are updated after the workspace is loaded
- some false warnings are not reported
- `pathMappings` launch configuration
- fix: closing language server process on Unix systems
- fix: working with large mixed HTML/JS/CSS/PHP code
- signature help for new objects
- memory and perf. optimization
- stability fixes
- project startup optimizations
- code folding for all parenthesis

## 1.0.2802 (Oct 11, 2018) preview

- option to activate license/request trial offline
- option to mute warning about missing PHP
- tests are not loaded and run automatically (either enable `autorun` or click `reload`/`start`)
- debug watch tooltip provides expandable object properties
- more detailed output log about PHP and Xdebug that will be used for debugging/tests
- `F5` starts debugging of current script even without having `launch.json` configuration  
- does not provide basic completion after `:` (but `::`)
- code completion handles ambiguous trait declarations

## 1.0.2765 (Oct 8, 2018) preview

- Symbols in workspace feature.
- Processing all files mapped to `php` language.
- Code completion improvements.

## 1.0.2738 (Oct 3, 2018) preview

- Test Explorer detects phpunit.xml.dist to get enabled
- code completion handles ambiguous types better
- short open tags `<?` allowed if there is no normal open tag `<?php`
- updated readme and documentation
- re-enabled completion after $ (fixes recent update in VSCode)

## 1.0.2681 (Sep 27, 2018) preview

- option to request trial license
- downloading dependencies from CDN
- updated the extension's publisher ID

## 1.0.2590 (Sep 14, 2018) preview

- triggering completion after ->, $, \, ::
- code folding for blocks, comments, PHPDoc and regions
- language server providing
    - code completion
    - hover
    - formatting
    - code structure
    - signature help
    - find all references
    - navigation
    - go to definition
    - refactoring
    - highlighting
- code analysis and validation
- debug support
    - watch
    - debug mouse watch
    - breakpoints
    - UNC paths
    - path mapping
    - remote debug, console, built-in server
- workspaces
- UNC paths
- built-in PHP server
- PHPUnit Test Explorer
    - Live testing
    - Tests debugger
    - Tests browser
- Initial version of PHP Tools for VS Code
