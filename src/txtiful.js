const tokensSpec = {
    "TEXT": {
        capture(text) {
            if (text[0] === "(" || text[0] === "[") {
                return null;
            }
            const index = text.indexOf("[");
            if (index === -1) {
                return text;
            }
            return text.substring(0, index);
        }
    },
    "WRAPPED_TEXT": {
        capture(text) {
            if (text[0] !== "(") {
                return null;
            }
            const index = text.indexOf(")");
            return text.substring(0, index + 1);
        },
        filter(text) {
            return text.slice(1, -1);
        }
    },
    "MODIFIER": {
        capture(text) {
            if (text[0] !== "[") {
                return null;
            }
            const index = text.indexOf("]");
            return text.substring(0, index + 1);
        },
        filter(text) {
            return text.slice(1, -1);
        }
    }
};

class Tokenizer
{
    constructor(text) {
        this._string = text;
        this._cursor = 0;
    }

    hasMoreTokens() {
        return this._cursor < this._string.length;
    }

    getNextToken() {
        if (!this.hasMoreTokens()) {
            return null;
        }

        const string = this._string.slice(this._cursor);

        for (const token in tokensSpec) {
            const currentTokenObject = tokensSpec[token];
            const captureFn = currentTokenObject.capture;
            const filterFn = currentTokenObject.filter;
            const tokenValue = this._match(captureFn, string);

            if (tokenValue == null) {
                continue;
            }

            return {
                type: token,
                value: filterFn ? filterFn(tokenValue) : tokenValue
            };
        }


        throw new SyntaxError(`Unexpected token: "${string[0]}"`);
    }

    _match(captureFn, input) {
        const result = captureFn(input);
        if (!result) {
            return null;
        }

        this._cursor += result.length;
        return result;
    }

}


class Parser
{
    constructor(tokenizer) {
        this._tokenizer = tokenizer;
        this._currentToken = tokenizer.getNextToken();
    }

    eatTokenOfType(tokenTypes) {
        const token = this._currentToken;

        if (!token) {
            throw new SyntaxError(
                `Unexpected end of input, expected "${tokenTypes.join(",")}"`
            );
        }

        tokenTypes = tokenTypes || [];

        if (!Array.isArray(tokenTypes)) {
            tokenTypes = [tokenTypes];
        }

        for (const type of tokenTypes) {

            if (type === token.type) {

                this._currentToken = this._tokenizer.getNextToken();

                return token;

            }
        }

        if (tokenTypes.length < 1 && token) {
            this._currentToken = this._tokenizer.getNextToken();
            return token;
        }

        throw new SyntaxError(
            `Unexpected token: ${token.type}, expected "${tokenTypes.join(",")}"`
        );

    }

    parseText() {
        const text = this._currentToken;
        this.eatTokenOfType("TEXT");
        return {
            type: "TEXT",
            value: text.value
        };
    }


    parseModifier() {
        const modifier = this._currentToken;
        this.eatTokenOfType("MODIFIER");
        const content = this.eatTokenOfType(["TEXT", "WRAPPED_TEXT"]);
        return {
            type: "MODIFIER",
            value: modifier.value,
            content: content.value
        };
    }

    parseTxtiful() {
        const tree = [];
        do {
            switch (this._currentToken.type) {
                case "TEXT":
                    tree.push(this.parseText());
                    break;
                case "MODIFIER":
                    tree.push(this.parseModifier());
                    break;
            }
        } while ((this._currentToken != null));

        return tree;
    }

    parse() {
        return this.parseTxtiful();
    }

}

class HtmlGenerator
{
    constructor(tree) {
        this._tree = tree;
        this._tokenGenerators = {
            "TEXT": this.textGenerator,
            "MODIFIER": this.modifierGenerator
        };
    }

    textGenerator(node) {
        return node.value;
    }

    modifierGenerator(node) {
        return `<span style="color:${node.value};">${node.content}</span>`;
    }

    build() {
        let output = "";
        for (const node of this._tree) {
            const generator = this._tokenGenerators[node.type];
            output += generator(node);
        }
        return output;
    }
}

function generate(tree) {
    const htmlGenerator = new HtmlGenerator(tree);
    return htmlGenerator.build();
}

function interpret(text) {
    const tree = new Parser(new Tokenizer(text))
        .parse();
    return generate(tree);
}

function txtiful(text) {
    if (!text) {
        return;
    }
    return interpret(text);
}

module.exports = {
    txtiful
};
