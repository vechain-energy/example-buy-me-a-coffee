# Project Setup

```shell
git init
npm install --save --dev parcel typescript @types/react @types/react-dom
npm install --save react react-dom @vechain/dapp-kit-ui @vechain/dapp-kit-react
```

Manually add the following files:

1. [.gitignore](.gitignore)
2. [src/index.html](src/index.html)
3. [src/index.tsx](src/index.tsx)
4. [src/App.tsx](src/App.tsx)
5. [src/tsconfig.json](tsconfig.json)
6. [src/tsconfig.node.json](tsconfig.node.json)

Then, add the following to the `package.json` under the scripts section:

```json
    "start": "parcel src/index.html",
    "build": "parcel build src/index.html"
```

# Run

- Execute `npm start` to run the project.
- The app can be accessed at http://localhost:1234/

# Build

- To build the website, execute `npm run build`.
- The generated output will be located in the `dist/` directory.
