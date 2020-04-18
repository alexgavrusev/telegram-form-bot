module.exports = {
  presets: ["next/babel"],
  // TODO: handle mui transpilation
  plugins: [
    [
      "babel-plugin-import",
      {
        libraryName: "@material-ui/core",
        libraryDirectory: "",
        camel2DashComponentName: false,
      },
      "core",
    ],
    [
      "babel-plugin-import",
      {
        libraryName: "@material-ui/icons",
        libraryDirectory: "",
        camel2DashComponentName: false,
      },
      "icons",
    ],
  ],
};
