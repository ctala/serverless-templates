# aws-typescript-nodejs12x

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Contributing](../CONTRIBUTING.md)

## About <a name = "about"></a>

This project is the template for fast developing with Serverless, NodeJS, Typescript and AWS Lambda. Includes all the skeleton, folder structure, linters, plugins needed to standarized the development between different teams.

## Getting Started <a name = "getting_started"></a>



### Prerequisites

#### Installing the linting

```
$ npm install -g eslint
# Or for yarn users
$ yarn global add eslint
```

#### Linting on Save

On settings.json on .vscode folder add the following.

```
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript"]
 }
 ```