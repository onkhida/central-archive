# Central Archive

When I started building this site, the goal was to make it as simple as possible—at least structurally. I know that this archive may become very large eventually, so to balance out the potential heaviness of the content, I needed the system managing this content to be incredibly light. I haven’t used any of the contemporary frameworks in spinning this together, and I’ve tried to keep the tooling at a minimum. The result (at the moment) is a static site generated from markdown files at build time using a Webpack server and its relevant plugins.

### Architecture

I’ve split the content that I publicise into the three different folders in the root of the project.

- The `commentary` folder contains general, free writing that I use to log my emotions and personal experiences. I believe that this gives the website a touch of personality.
- The `technical` folder stores entries on more “technical” concepts, especially on programming and science.
- `readings` is a folder that holds my notes and reviews on books, articles and other long-form texts that I consume.

The config file essentially transforms the markdown content in these folders into HTML files for the final website. 

### Installation & Usage

After cloning the repository and installing the dependencies, the `dev` script runs the development server.

```jsx
npm run dev
```

And to build the site, you can simply run the `build`  script.

```jsx
npm run build
```

### Contact

My most active channel on the internet is through my email. If you’ve got any questions or suggestions, I’m usually available or responsive on [‘onkhida@proton.me’](mailto:onkhida@proton.me). You're also welcome to contribute by forking this repository and submitting a pull request.