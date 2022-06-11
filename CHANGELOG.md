# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),

## [Unreleased]
## [1.4] - 2022-5-28
Changing eas-framework syntax to be more explicit and easy to understand

- new templating syntax
- more explicit extensions: mode -> model, inte -> integ (integration)
- better sitemap generator - within page template + hooks

### Separated syntax for each runtime:
- Compile runtime, for script that run once when the page build - sign with '#'
- Real runtime, for script that run every time the page is ssr - sign with '@'
