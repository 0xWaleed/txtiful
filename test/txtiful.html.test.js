const { expect } = require("chai");
const { txtiful } = require("../src/txtiful");

describe("txtiful", () =>
{
    it("should exist", () =>
    {
        expect(txtiful).not.to.be.undefined;
    });

    it("should return the same text", () =>
    {
        expect(txtiful("Hello world")).to.equals("Hello world");
    });

    it("should return undefined when input is undefined", () =>
    {
        expect(txtiful()).to.be.undefined;
    });

    it("should able to generate html with style color", () =>
    {
        expect(txtiful("Hello [red](world)")).to.equals("Hello <span style=\"color:red;\">world</span>");
        expect(txtiful("[red](hello) world")).to.equals("<span style=\"color:red;\">hello</span> world");
    });

    it("should able to generate html with style color for multiple elements", () =>
    {
        expect(txtiful("[green](Hello) normal [red](world)")).to.equals("<span style=\"color:green;\">Hello</span> normal <span style=\"color:red;\">world</span>");
        expect(txtiful("Hello [red](world)[green](!) a text"))
            .to.equals("Hello <span style=\"color:red;\">world</span><span style=\"color:green;\">!</span> a text");
    });

    it("should able to generate modifier that apply on all text if modifier has no wrapped text", () =>
    {
        expect(txtiful("[green]Hello world")).to.equals("<span style=\"color:green;\">Hello world</span>");
    });

    it("should stop when reaching another modifier for non wrapped text", () =>
    {
        expect(txtiful("[green]Hello world[red](!)")).to.equals("<span style=\"color:green;\">Hello world</span><span style=\"color:red;\">!</span>");
    });

    it("should able to generate without TEXT,WRAPPED_TEXT", () =>
    {
        expect(txtiful("[green]")).to.equals("<span style=\"color:green;\"></span>");
    });
});
