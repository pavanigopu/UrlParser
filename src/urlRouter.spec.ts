import app from "./app";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import "mocha";
import { fetchValidDomains } from "./UrlRouter";

chai.use(chaiHttp);
const expect = chai.expect;

before("Fetch valid domains before running the tests", fetchValidDomains);

function test(input: string, expected: string) {
  return chai
    .request(app)
    .post("/api/v1/parseUrl")
    .set("Content-Type", "text/plain")
    .send(input)
    .then(res => {
      expect(res.text).to.eql(expected);
    });
}
/* Cases to be filtered */
describe("Parse Url API Tests - Urls to be filtered", async () => {
  it("www.something.com.", async () => test("This contains www.abcd.com. please check.", "http://www.abcd.com"));
  it("www.something.com,", async () => test("This contains www.abcd.com, please check.", "http://www.abcd.com"));
  it("www.something.com/", async () => test("This contains www.abcd.com/, please check.", "http://www.abcd.com/"));
  it("www.something.com/some.txt", async () => test("This contains www.abcd.com/def.txt, please check.", "http://www.abcd.com/def.txt"));
  it("www.something.com//some.txt", async () => test("This contains www.abcd.com//def.txt, please check.", "http://www.abcd.com//def.txt"));
  it("www.something.com//some.txt//", async () => test("This contains www.abcd.com//def.txt//, please check.", "http://www.abcd.com//def.txt//"));
  it("something.com", async () => test("This contains abcd.com, please check.", "http://abcd.com"));
  it("something.com/", async () => test("This contains abcd.com/, please check.", "http://abcd.com/"));
  it("something.com/somefile.gh", async () => test("This contains abcd.com/def.gh, please check.", "http://abcd.com/def.gh"));
  it("https://something.io/", async () => test("This contains https://abcd.io/, please check.", "https://abcd.io/"));
  it("https://something.com/somefile.gh", async () => test("This contains https://abcd.com/def.gh, please check.", "https://abcd.com/def.gh"));
  it("i❤images.ws", async () => test("This contains i❤images.ws please check.", "http://i❤images.ws"));
  it("https://something.io/()!@#$middle%^gfg&_=", async () => test("This contains https://abcd.io/()!@#$something here %^gfg&_= please check.", "https://abcd.io/()!@#$something"));
  it("https://something.io/!@#$something", async () => test("This contains https://abcd.io/!@#$something here %^gfg&_= please check.", "https://abcd.io/!@#$something"));
  it("Long url with special characters", async () => test("This contains http://chart.apis.google.com/chart?chs=500x500&chma=0,0,100,100&cht=p&chco=FF0000%2CFFFF00%7CFF8000%2C00FF00%7C00FF00%2C0000FF&chd=t%3A122%2C42%2C17%2C10%2C8%2C7%2C7%2C7%2C7%2C6%2C6%2C6%2C6%2C5%2C5&chl=122%7C42%7C17%7C10%7C8%7C7%7C7%7C7%7C7%7C6%7C6%7C6%7C6%7C5%7C5&chdl=android%7Cjava%7Cstack-trace%7Cbroadcastreceiver%7Candroid-ndk%7Cuser-agent%7Candroid-webview%7Cwebview%7Cbackground%7Cmultithreading%7Candroid-source%7Csms%7Cadb%7Csollections%7Cactivity|Chart please check.", "http://chart.apis.google.com/chart?chs=500x500&chma=0,0,100,100&cht=p&chco=FF0000%2CFFFF00%7CFF8000%2C00FF00%7C00FF00%2C0000FF&chd=t%3A122%2C42%2C17%2C10%2C8%2C7%2C7%2C7%2C7%2C6%2C6%2C6%2C6%2C5%2C5&chl=122%7C42%7C17%7C10%7C8%7C7%7C7%7C7%7C7%7C6%7C6%7C6%7C6%7C5%7C5&chdl=android%7Cjava%7Cstack-trace%7Cbroadcastreceiver%7Candroid-ndk%7Cuser-agent%7Candroid-webview%7Cwebview%7Cbackground%7Cmultithreading%7Candroid-source%7Csms%7Cadb%7Csollections%7Cactivity|Chart"));
  it("Url with unicode characters", async () => test("This contains http://www.example.com/düsseldorf?neighbourhood=Lörick,, please check.", "http://www.example.com/düsseldorf?neighbourhood=Lörick"));
  it("Url with ftp protocol", async () => test("This contains ftp://ftp.funet.fi/pub/standards/RFC/rfc959.txt. Please check", "ftp://ftp.funet.fi/pub/standards/RFC/rfc959.txt"));
});

describe("Exhaustive Tests - Should work", async () => {
  it("http://foo.com/blah_blah", async () => test("This contains http://foo.com/blah_blah please check.", "http://foo.com/blah_blah"));
  it("http://foo.com/blah_blah/", async () => test("This contains http://foo.com/blah_blah/ please check.", "http://foo.com/blah_blah/"));
  it("http://foo.com/blah_blah_(wikipedia)", async () => test("This contains http://foo.com/blah_blah_(wikipedia) please check.", "http://foo.com/blah_blah_(wikipedia)"));
  it("http://foo.com/blah_blah_(wikipedia)_(again)", async () => test("This contains http://foo.com/blah_blah_(wikipedia)_(again) please check.", "http://foo.com/blah_blah_(wikipedia)_(again)"));
  it("http://www.example.com/wpstyle/?p=364", async () => test("This contains http://www.example.com/wpstyle/?p=364 please check.", "http://www.example.com/wpstyle/?p=364"));
  it("https://www.example.com/foo/?bar=baz&inga=42&quux", async () => test("This contains https://www.example.com/foo/?bar=baz&inga=42&quux please check.", "https://www.example.com/foo/?bar=baz&inga=42&quux"));
  it("http://✪df.ws/123", async () => test("This contains http://✪df.ws/123 please check.", "http://✪df.ws/123"));
  it("http://userid:password@example.com:8080", async () => test("This contains http://userid:password@example.com:8080 please check.", "http://userid:password@example.com:8080"));
  it("http://userid:password@example.com:8080/", async () => test("This contains http://userid:password@example.com:8080/ please check.", "http://userid:password@example.com:8080/"));
  it("http://userid@example.com", async () => test("This contains http://userid@example.com please check.", "http://userid@example.com"));
  it("http://userid@example.com/", async () => test("This contains http://userid@example.com/ please check.", "http://userid@example.com/"));
  it("http://userid@example.com:8080", async () => test("This contains http://userid@example.com:8080 please check.", "http://userid@example.com:8080"));
  it("http://userid@example.com:8080/", async () => test("This contains http://userid@example.com:8080/ please check.", "http://userid@example.com:8080/"));
  it("http://userid:password@example.com", async () => test("This contains http://userid:password@example.com please check.", "http://userid:password@example.com"));
  it("http://userid:password@example.com/", async () => test("This contains http://userid:password@example.com/ please check.", "http://userid:password@example.com/"));
  it("http://➡.ws/䨹", async () => test("This contains http://➡.ws/䨹 please check.", "http://➡.ws/䨹"));
  it("http://⌘.ws", async () => test("This contains http://⌘.ws please check.", "http://⌘.ws"));
  it("http://⌘.ws/", async () => test("This contains http://⌘.ws/ please check.", "http://⌘.ws/"));
  it("http://foo.com/blah_(wikipedia)#cite-1", async () => test("This contains http://foo.com/blah_(wikipedia)#cite-1 please check.", "http://foo.com/blah_(wikipedia)#cite-1"));
  it("http://foo.com/blah_(wikipedia)_blah#cite-1", async () => test("This contains http://foo.com/blah_(wikipedia)_blah#cite-1 please check.", "http://foo.com/blah_(wikipedia)_blah#cite-1"));
  it("http://foo.com/unicode_(✪)_in_parens", async () => test("This contains http://foo.com/unicode_(✪)_in_parens please check.", "http://foo.com/unicode_(✪)_in_parens"));
  it("http://foo.com/(something)?after=parens", async () => test("This contains http://foo.com/(something)?after=parens please check.", "http://foo.com/(something)?after=parens"));
  it("http://☺.damowmow.com/", async () => test("This contains http://☺.damowmow.com/ please check.", "http://☺.damowmow.com/"));
  it("http://code.google.com/events/#&product=browser", async () => test("This contains http://code.google.com/events/#&product=browser please check.", "http://code.google.com/events/#&product=browser"));
  it("http://j.mp", async () => test("This contains http://j.mp please check.", "http://j.mp"));
  it("ftp://foo.bar/baz", async () => test("This contains ftp://foo.bar/baz please check.", "ftp://foo.bar/baz"));
  it("http://foo.bar/?q=Test%20URL-encoded%20stuff", async () => test("This contains http://foo.bar/?q=Test%20URL-encoded%20stuff please check.", "http://foo.bar/?q=Test%20URL-encoded%20stuff"));
  it("http://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com", async () => test("This contains http://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com please check.", "http://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com"));
  it("http://1337.net", async () => test("This contains http://1337.net please check.", "http://1337.net"));
  it("http://a.b-c.de", async () => test("This contains http://a.b-c.de please check.", "http://a.b-c.de"));
});


/* Cases of Not to be filtered */
describe("Parse Url API Tests - NOT to be filtered", async () => {
  it("picture.dog.png", async () => test("This contains picture.dog.png, please check.", ""));
  it("picture.cat.jpeg", async () => test("This contains picture.cat.jpeg please check.", ""));
  it("htp://www.something.com", async () => test("This contains htp://www.abcd.com, please check.", ""));
  it("http://www.something", async () => test("This contains http://www.abcd, please check.", ""));
  it("http://something", async () => test("This contains http://abcd, please check.", ""));
  it("www.something", async () => test("This contains www.abcd please check.", ""));
  it("com", async () => test("This contains com please check.", ""));
  it("http://", async () => test("This contains http:// please check.", ""));
  it("http://.", async () => test("This contains http://. please check.", ""));
  it("http://..", async () => test("This contains http://.. please check.", ""));
  it("http://../", async () => test("This contains http://../ please check.", ""));
  it("http://?", async () => test("This contains http://? please check.", ""));
  it("http://??", async () => test("This contains http://?? please check.", ""));
  it("http://??/", async () => test("This contains http://??/ please check.", ""));
  it("http://#", async () => test("This contains http://# please check.", ""));
  it("http://##", async () => test("This contains http://## please check.", ""));
  it("http://##/", async () => test("This contains http://##/ please check.", ""));
  it("//", async () => test("This contains // please check.", ""));
  it("//a", async () => test("This contains //a please check.", ""));
  it("///a", async () => test("This contains ///a please check.", ""));
  it("///", async () => test("This contains /// please check.", ""));
  it("http:///a", async () => test("This contains http:///a please check.", ""));
  it("rdar://1234", async () => test("This contains rdar://1234 please check.", ""));
  it("h://test", async () => test("This contains h://test please check.", ""));
  it(":// should fail", async () => test("This contains :// should fail please check.", ""));
  it("ftps://foo.bar/", async () => test("This contains ftps://foo.bar/ please check.", ""));
  it("http://-error-.invalid/", async () => test("This contains http://-error-.invalid/ please check.", ""));
  it("http://0.0.0.0", async () => test("This contains http://0.0.0.0 please check.", ""));
  it("http://3628126748", async () => test("This contains http://3628126748 please check.", ""));
  it("http://www.foo.bar./", async () => test("This contains http://www.foo.bar./ please check.", ""));
  it("http://.www.foo.bar./", async () => test("This contains http://.www.foo.bar./ please check.", ""));
  it("http://userid@example.com:8080:80:80", async () => test("This contains http://userid@example.com:8080:80:80 please check.", ""));
  it("http://userid@example.com:8a", async () => test("This contains http://userid@example.com:8a please check.", ""));
});