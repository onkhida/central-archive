import { merge } from "webpack-merge";
import common from "./webpack.common";
import { Configuration } from "webpack";

// Merge common configuration with the production-specific configuration
const config: Configuration = merge(common, {
  mode: "production",
});

// Export the configuration
export default config;
