**Limited Support Notice**

--------------------------

This sample application and sample code are meant for example purposes. This example is not guaranteed to run out of the box as it may have been written for an older version of the FaceTec Browser SDK than we currently officially support for development purposes.

For experienced developers, this example should be enough to port the FaceTec Browser SDK into your own application. There may be some work required update the sample code to the very latest released "Browser/Web/JS" SDK, which can be downloaded here - <https://dev.facetec.com/#/downloads>

This example is not recommended for production code. It is designed only to show the minimum coded needed to perform a Liveness check with the FaceTec Browser SDK.

Hopefully this is enough to get you going!

If you have any more technical questions or need assistance upgrading this library to the latest version of the FaceTec Browser SDK, please feel free to contact us at support@facetec.com
------------------------------

**End Limited Support Notice**

** Steps to Run
------------

1. Download the latest "FaceTec Browser/JS SDK" from <https://dev.facetec.com/#/downloads>
2. Copy the FaceTecSDK-browser-x.x.x/core-sdk folder from the downloaded SDK folder and place it inside this folder.
3. Open the react-js-sample folder in your favorite editor.  We like Visual Studio Code.
4. Open src/Config.js, replace the DeviceKeyIdentifier variable value with the licenseKey from your developer account page (<https://dev.facetec.com/#/account>) and save the file.
5. Open terminal and navigate to this folder.
6. Run the following commands:
    npm install -- This command installs the necessary dependencies for building the app.
    npm start -- Serve the sample and open a new browser window.
