# Problèmes Webpack

WARNING in asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).
This can impact web performance.
Assets: 
  tchatReact.client.js (253 KiB)
  distributionReact.client.js (291 KiB)
  adminReact.client.js (868 KiB)

WARNING in entrypoint size limit: The following entrypoint(s) combined asset size exceeds the recommended limit (244 KiB). This can impact web performance.
Entrypoints:
  tchatReact (253 KiB)
      tchatReact.client.js
  distributionReact (291 KiB)
      distributionReact.client.js
  adminReact (868 KiB)
      adminReact.client.js


WARNING in webpack performance recommendations: 
You can limit the size of your bundles by using import() or require.ensure to lazy load some parts of your application.
For more info visit https://webpack.js.org/guides/code-splitting/

webpack 5.31.0 compiled with 3 warnings in 19827 ms

# Typage

## // @ts-ignore

Annotation à utiliser si problème de typage insoluble.

## ParsedUrlQuery

- dans serveurConnexion, c'est le type inféré mais impossible à utiliser : il est inconnu. Solution : importer du module "querystring" (à chercher sur le web !).

```
  import {ParsedUrlQuery} from "querystring";
```