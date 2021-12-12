import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import pkg from "./package.json"
export default {
    input: "src/txtiful.js",
    output: {
        file: pkg.main,
        format: "umd",
        compact: true,
        name: "txtiful"
    },
    plugins: [
        resolve(), // so Rollup can find `ms`
        commonjs() // so Rollup can convert `ms` to an ES module
    ]
};
