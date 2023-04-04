# Spectral Documentation Ruleset

[![NPM Downloads](https://img.shields.io/npm/dw/@stoplight/spectral-documentation?color=blue)](https://www.npmjs.com/package/@stoplight/spectral-documentation) [![Stoplight Forest](https://img.shields.io/ecologi/trees/stoplightinc)][stoplight_forest]

Scan an [OpenAPI](https://spec.openapis.org/oas/v3.1.0) description to make sure you're leveraging enough of its features to help documentation tools like Stoplight Elements, ReDoc, and Swagger UI build the best quality API Reference Documentation possible. 

## Installation

``` bash
npm install --save -D @stoplight/spectral-documentation
npm install --save -D @stoplight/spectral-cli
```

## Usage


Create a local ruleset that extends the ruleset. In its most basic form this just tells Spectral what ruleset you want to use, but it will allow you to customise things, add your own rules, turn bits off if its causing trouble.

```
cd ~/src/<your-api>

echo 'extends: ["@stoplight/spectral-documentation"]' > .spectral.yaml
```

_If you're using VS Code or Stoplight Studio then the NPM modules will not be available. Instead you can use the CDN hosted version:_

```
echo 'extends: ["https://unpkg.com/@stoplight/spectral-documentation/dist/ruleset.mjs"]' > .spectral.yaml
```

_**Note:** You need to use the full URL with CDN hosted rulesets because Spectral [cannot follow redirects through extends](https://github.com/stoplightio/spectral/issues/2266)._

Next, use Spectral CLI to lint against your OpenAPI description. Don't have any OpenAPI? [Record some HTTP traffic to make OpenAPI](https://apisyouwonthate.com/blog/creating-openapi-from-http-traffic) and then you can switch to API Design-First going forwards.

```
spectral lint api/openapi.yaml
```

You should see some output like this:

```
/Users/phil/src/protect-earth-api/api/openapi.yaml
  44:17      warning  no-path-versioning #/paths/~1v1 contains a version number. API paths SHOULD NOT have versioning in the path. It SHOULD be in the server URL instead.  paths./v1
```

Now you have some things to work on for your API. Thankfully these are only at the `warning` severity, and that is not going to [fail continuous integration](https://meta.stoplight.io/docs/spectral/ZG9jOjExNTMyOTAx-continuous-integration) (unless [you want them to](https://meta.stoplight.io/docs/spectral/ZG9jOjI1MTg1-spectral-cli#error-results)).

There are [a bunch of other rulesets](https://github.com/stoplightio/spectral-rulesets) you can use, or use for inspiration for your own rulesets and API Style Guides.

## 🎉 Thanks

- [Phil Sturgeon](https://github.com/philsturgeon) - Made some of these fairly opinionated but probably reasonable rules.

## 📜 License

This repository is licensed under the MIT license.

## 🌲 Sponsor 

If you would like to thank us for creating Spectral, we ask that you [**buy the world a tree**][stoplight_forest].

[stoplight_forest]: https://ecologi.com/stoplightinc
