# Simple Perl

## Features

- Code snippets for common control structures used in Perl.
- Code linting via `Perl::Critic`.
- Code formatting via `Perl::Tidy`.

It is a combination of [Perl extension](https://marketplace.visualstudio.com/items?itemName=henriiik.vscode-perl) by
Henrik Sjööh and [Perl Toolbox](https://marketplace.visualstudio.com/items?itemName=d9705996.perl-toolbox) by David Walker.

## Installation

Just make sure you have `perlcritic` and `perltidy` available in `$PATH`.
Customization `Perl::Critic` by modify your `.perlcriticrc` file, configuration in Visual Studio Code is not needed. Same is true for `Perl::Tidy`, it reads configuration from `.perltidyrc`.

## Extension Settings

| Setting                  | Default      | Description                        |
| ------------------------ | ------------ | ---------------------------------- |
| `simple-perl.perltidy`   | `perltidy`   | Path to `Perl::Tidy` executable.   |
| `simple-perl.perlcritic` | `perlcritic` | Path to `Perl::Critic` executable. |

## Release Notes

### 0.0.4

Updated dependencies for the extension.
Fix the problem that Perl::Critics does not look for `.perlcriticrc` in project folder.

### 0.0.3

Remove hardcoded severity `brutal`.
Update dependencies.
Credit: [@glauschwuffel](https://github.com/glauschwuffel) [issues](https://github.com/zhiyuan-lin/vscode-perl/issues/2)

### 0.0.2

Refine README.md.

### 0.0.1

Initial release of Simple Perl.

---

**Enjoy!**

# License

[MIT](https://github.com/zhiyuan-lin/vscode-perl/blob/master/LICENSE)
