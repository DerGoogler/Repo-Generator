import { merge } from "webpack-merge";
import { defConfig, config, defPlugins } from "./webpack.config";

export default merge(config, {
  mode: "development",
  ...defConfig,
  devtool: "source-map",
  plugins: defPlugins,
});
