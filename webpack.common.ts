// imports
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import fs from "fs";
import matter from "gray-matter";
import { marked } from "marked";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { Configuration } from "webpack";

// defined the month names here to get them via indexing later in the function
const monthNames: string[] = [
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

const fullMonthNames: string[] = [
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
const files: string[] = fs
  .readdirSync(path.resolve(__dirname, "commentary"))
  .reverse();

// the objects for the posts › this helps me develop a list of available posts on `commentary.html`
const postObjects = files.map((filepath: string) => {
  const postMarkdown: string = fs.readFileSync(
    path.resolve(__dirname, "commentary", filepath),
    "utf-8"
  );

  const { data: frontmatter } = matter(postMarkdown);
  let postDate: string;
  const date = new Date(frontmatter.date);
  postDate = `${
    monthNames[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()}`;
  const postTitle: string = frontmatter.title;

  const fileName: string = filepath.replace(".md", "");
  const postSlug: string = fileName.split(" ")[1];

  const birthday: boolean =
    `${monthNames[date.getMonth()]} ${date.getDate()}` === "May 4";

  return {
    detailURI: `c/${postSlug}.html`,
    birthday,
    postDate,
    postTitle,
  };
});

// now I'm using this to generate the HTML for each specific commentary post
const multipleHtmlPlugins = files.map((file: string) => {
  const markdownWithMeta: string = fs.readFileSync(
    path.resolve(__dirname, "commentary", file),
    "utf-8"
  );

  const { data: frontmatter, content }: { data: any; content: string } =
    matter(markdownWithMeta);
  const parsedContent: string = marked(content);
  const metaDesc: string = frontmatter.desc;

  let articleDate: string;
  const date = new Date(frontmatter.date);
  articleDate = `${
    fullMonthNames[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()}`;

  const fileName: string = file.replace(".md", "");
  const postSlug: string = fileName.split(" ")[1];

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

// Webpack configuration
const config: Configuration = {
  entry: {
    index: "./src/ts/core.ts",
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "./src/assets", to: "assets" }],
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
              outputPath: "images",
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

export default config;
