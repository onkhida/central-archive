// imports
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const fs = require("fs");
const matter = require("gray-matter");
const { marked } = require("marked");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// defined the month names here to get them via indexing later in the function
const monthNames = [
  "Jan.",
  "Feb.",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug.",
  "Sept.",
  "Oct.",
  "Nov.",
  "Dec.",
];

const fullMonthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// the files from the commentary archive
const files = fs.readdirSync(path.resolve(__dirname, "commentary"));

flippedFiles = files.reverse();

// the objects for the posts › this helps me develop a list of available posts on `commentary.html`
const postObjects = files.map((filepath) => {
  const postMarkdown = fs.readFileSync(
    path.resolve(__dirname, "commentary", filepath),
    "utf-8"
  );

  const { data: frontmatter } = matter(postMarkdown);
  let postDate = new Date(frontmatter.date);
  postDate = `${
    monthNames[postDate.getMonth()]
  } ${postDate.getDate()}, ${postDate.getFullYear()}`;
  const postTitle = frontmatter.title;

  const fileName = filepath.replace(".md", "");
  const postSlug = fileName.split(" ")[1];

  return {
    detailURI: `c/${postSlug}.html`,
    dateID: frontmatter.date,
    postDate,
    postTitle,
  };
});

// now I'm using this to generate the HTML for each specific commentary post
let multipleHtmlPlugins = files.map((file) => {
  const markdownWithMeta = fs.readFileSync(
    path.resolve(__dirname, "commentary", file),
    "utf-8"
  );

  const { data: frontmatter, content } = matter(markdownWithMeta);
  const parsedContent = marked(content);
  const metaDesc = frontmatter.desc;

  let articleDate = new Date(frontmatter.date);
  articleDate = `${
    fullMonthNames[articleDate.getMonth()]
  } ${articleDate.getDate()}, ${articleDate.getFullYear()}`;

  const fileName = file.replace(".md", "");
  const postSlug = fileName.split(" ")[1];

  return new HtmlWebpackPlugin({
    filename: `c/${postSlug}.html`,
    template: "./templates/commentary-detail.ejs",
    favicon: "./src/assets/favicon.ico",
    postTitle: frontmatter.title,
    content: parsedContent,
    desc: metaDesc,
    postDate: articleDate,
    chunks: ["index"],
  });
});

module.exports = {
  entry: {
    index: "./src/ts/core.ts",
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "./src/assets", to: "assets" }, // Copies the 'assets' folder to 'dist/assets'
      ],
    }),
    new HtmlWebpackPlugin({
      template: "./templates/index.html",
      favicon: "./src/assets/favicon.ico",
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      filename: "commentary.html",
      template: "./templates/commentary.ejs",
      favicon: "./src/assets/favicon.ico",
      postObjects: postObjects,
      chunks: ["index"],
    }),
    // new HtmlWebpackPlugin({
    //   filename: "technical.html",
    //   template: "./templates/technical.html",
    //   favicon: "./src/assets/favicon.ico",
    //   chunks: ["index"],
    // }),
    // new HtmlWebpackPlugin({
    //   filename: "readings.html",
    //   template: "./templates/readings.html",
    //   favicon: "./src/assets/favicon.ico",
    //   chunks: ["index"],
    // }),
    new HtmlWebpackPlugin({
      filename: "404.html",
      template: "./templates/404.html",
      favicon: "./src/assets/favicon.ico",
      chunks: ["index"],
    }),
    new MiniCssExtractPlugin(),
  ].concat(multipleHtmlPlugins),
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[hash].[ext]",
              outputPath: "images", // Output directory for images
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  optimization: {
    runtimeChunk: "single",
  },
};
