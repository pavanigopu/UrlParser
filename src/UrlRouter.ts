import { Router, Request, Response, NextFunction } from "express";
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

export let urlRouter: Router = Router();
urlRouter.post("/api/v1/parseUrl", parseUrl);
let validDomains: string[];

export async function parseUrl(req: Request, res: Response, _next: NextFunction) {
  try {
    // Do not fetch data again if already fetched.
    if (!validDomains) {
      await fetchValidDomains();
    }
    const input = req.body;
    /* Filter urls from given text */
    const splitArray: string[] = input.split(/[ ]+/);
    // Remove "." or "," in the end for all strings
    const fixedSplitArray: string[] = splitArray.map(s => s.replace(/\.*$|,*$/, ""));
    // Strings which contain valid extension are considered as Urls.
    const filterdUrls = fixedSplitArray.filter(a => {
      const extension = tryGettingExtension(a);
      return extension.length && validDomains.indexOf(extension.toLowerCase()) !== -1;
    });

    /* Normalize filtered urls */
    let response = "";
    for (const url of filterdUrls) {
      let normalized = url;
      // Check if url has is starting with protocols of http:// or https:// or ftp:// 
      if (!isStringStartingWithUrlProtocol(url)) {
        normalized = "http://" + url;
      }
      response = response === "" ? normalized : response + ", " + normalized;
    }

    /* Send the response */
    res.send(response);
  } catch (e) {
    console.log("Problem in parsing the urls from the text: " + e);
  }
}

export async function fetchValidDomains() {
  const validDomainsText = (await getText("http://data.iana.org/TLD/tlds-alpha-by-domain.txt")) as string;
  validDomains = validDomainsText.split(/\r?\n/).map(s => s.toLowerCase());
}

function getText(filePath: string) {
  // read text from URL location
  return new Promise((resolve, reject) => {
    var request = new XMLHttpRequest();
    request.open("GET", filePath, true);
    request.send(null);
    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
        var type = request.getResponseHeader('Content-Type');
        if (type.indexOf("text") !== 1) {
          return resolve(request.responseText);
        }
      }

      return "";
    }
    request.onerror = () => reject("Error in fetching valid domains " + filePath);
  });
}

function isStringStartingWithUrlProtocol(input: string) {
  return input.match("(http://|https://|ftp://).*");
}

function tryGettingExtension(input: string) {
  // case of http://
  // Find index of double slashes.
  const doubleslashIndex = isStringStartingWithUrlProtocol(input) ? input.indexOf("://") : -1;
  // case of http://something.com/
  // Find index of "/" that comes after (*).com.
  // 3 is length of ("://").
  const slashIndex = input.indexOf("/", doubleslashIndex !== -1 ? doubleslashIndex + 3 : undefined);
  // Find the index of "." to know where url extension starts.
  const urlExtensionIndex = input.lastIndexOf(".", slashIndex !== -1 ? slashIndex : undefined);
  // If there is no dot(.) then it is not url.
  if (urlExtensionIndex !== -1) {
    // Get extension out from urls. For ex: "com" from "http://something.com" | www.something.com/ | http://something.com/abc/de.txt
    const extensionString = input.substring(urlExtensionIndex + 1, slashIndex !== -1 ? slashIndex : undefined);
    // Check for optional port
    const extensionSplit = extensionString.split(":");
    if ((extensionSplit.length === 2 && extensionSplit[1].match(/^[0-9]+$/)) || extensionSplit.length === 1) {
      return extensionSplit[0];
    }
  }

  return "";
}