# UrlParser

This is a very simple UrlParser service containing post API "/api/v1/parseUrl" which parses the urls from the given text and sends the parsed urls as response. The service can be accessed from localhost at PORT 3000. The port can be changed in app.ts if needed. 

# Get started

1. Install [Node.js](https://nodejs.org/en/download/current/).

2. Install dependencies and start the server.
    Run this command from command prompt to install the needed packages and start the server.
    ```
    $ npm install && npm run start
    ```

# Testing the API

Run these commands from different command prompt than the server.
1. Execute unit tests
    ```
    $ npm test
    ```
2. Test example text provided in assignment
    ```
    $ npm run send-request
    ```
3. Test any sample text
    ```
    $ curl -d "This is sample data with www.google.com" -H "Content-Type: text/plain" -X POST http:/localhost:3000/api/v1/parseUrl
    ```
4. Test with file other than data.txt
    ```
    $ curl -d "@{filepath}" -H "Content-Type: text/plain" -X POST http:/localhost:3000/api/v1/parseUrl
    ```

# Understanding the repository structure

* `src/` contain the source code for service and tests.
* `dist/` folder holds the compiled and minified output suitable for distribution.

# Questions

Questions at any phase, please send email to pavani.vaka@gmail.com
