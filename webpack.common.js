// imports
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require("fs");
const matter = require("gray-matter");
const { marked } = require("marked");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// defined the month names here to get them via indexing later in the function
const monthNames = [
  "Jan.",
  "Feb.",
  "Mar.",
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

const files = fs.readdirSync(path.resolve(__dirname, "commentary"));
const outputPaths = files.map((filename) => {
  return filename.replace(".md", "");
});

let dates = [];

// the objects of posts
const postObjects = outputPaths.map((filepath) => {
  const postMarkdown = fs.readFileSync(
    path.resolve(__dirname, "commentary", `${filepath}.md`),
    "utf-8"
  );

  const { data: frontmatter } = matter(postMarkdown);
  let postDate = new Date(frontmatter.date);
  postDate = `${monthNames[postDate.getMonth()]} ${postDate.getDate()}`;
  const postTitle = frontmatter.title;

  dates.push(frontmatter.date.substring(0, 7));

  return {
    detailURI: `c/${filepath}.html`,
    dateID: frontmatter.date,
    postDate,
    postTitle,
  };
});

const uniqueDates = [...new Set(dates)];
uniqueDates
  .sort(function (a, b) {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(a) - new Date(b);
  })
  .reverse();

postObjects.sort(function (a, b) {
  // Turn your strings into dates, and then subtract them
  // to get a value that is either negative, positive, or zero.
  return new Date(a.dateID) - new Date(b.dateID);
});

const monthObjects = uniqueDates.map((date) => {
  const posts = postObjects.filter(
    (post) => post.dateID.substring(0, 7) === date
  );
  let month = new Date(date);
  month = `${fullMonthNames[month.getMonth()]} ${month.getFullYear()}`;

  return {
    month,
    posts,
  };
});

let multipleHtmlPlugins = outputPaths.map((name) => {
  const markdownWithMeta = fs.readFileSync(
    path.resolve(__dirname, "commentary", `${name}.md`),
    "utf-8"
  );

  const { data: frontmatter, content } = matter(markdownWithMeta);
  const parsedContent = marked(content);
  const metaDesc = frontmatter.desc;

  let articleDate = new Date(frontmatter.date);
  articleDate = `${
    fullMonthNames[articleDate.getMonth()]
  } ${articleDate.getDate()}, ${articleDate.getFullYear()}`;

  return new HtmlWebpackPlugin({
    filename: `c/${name}.html`,
    template: "./templates/commentary-detail.ejs",
    favicon: "./src/assets/favicon.ico",
    postTitle: frontmatter.title,
    content: parsedContent,
    desc: metaDesc,
    postDate: articleDate,
    chunks: ["index"],
  });
});

// let technicalPosts = // this should be an array of the technical posts returned
// const technicalTemplates = fs.readdirSync(
//   path.resolve(__dirname, "templates", "technical")
// );
// let technicalWebpackPlugins = technicalTemplates.map((t) => {
//   return new HtmlWebpackPlugin({
//     filename: `t/${t}`,
//     template: `./templates/technical/${t}`,
//     favicon: "./src/assets/favicon.ico",
//     chunks: ["index"],
//   });
// });

// console.log(technicalWebpackPlugins);
// const outputPaths = files.map((filename) => {
//   return filename.replace(".md", "");
// });

module.exports = {
  entry: {
    index: "./src/ts/core.ts",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./templates/index.html",
      favicon: "./src/assets/favicon.ico",
      outputPathsObj: outputPaths,
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      filename: "commentary.html",
      template: "./templates/commentary.ejs",
      favicon: "./src/assets/favicon.ico",
      monthObjects: monthObjects,
      chunks: ["index"],
    }),
    // new HtmlWebpackPlugin({
    //   filename: "technical.html",
    //   template: "./templates/technical.html",
    //   favicon: "./src/assets/favicon.ico",
    //   chunks: ["index"],
    // }),
    new HtmlWebpackPlugin({
      filename: "404.html",
      template: "./templates/404.html",
      favicon: "./src/assets/favicon.ico",
      chunks: ["index"],
    }),
    // new HtmlWebpackPlugin({
    //   filename: "readings.html",
    //   template: "./templates/readings.html",
    //   favicon: "./src/assets/favicon.ico",
    //   chunks: ["index"],
    // }),
    new MiniCssExtractPlugin(),
  ].concat(multipleHtmlPlugins),
  // .concat(technicalWebpackPlugins),
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
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  optimization: {
    runtimeChunk: "single",
  },
};
