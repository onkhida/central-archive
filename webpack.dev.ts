import { merge } from "webpack-merge";
import common from "./webpack.common";
import { Configuration } from "webpack";

// Create an interface that extends Configuration to include devServer
interface DevServerConfiguration extends Configuration {
  devServer?: {
    static: string;
  };
}

// Merge common configuration with the development-specific configuration
const config: DevServerConfiguration = merge<DevServerConfiguration>(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
  },
});

// Export the configuration
export default config;
