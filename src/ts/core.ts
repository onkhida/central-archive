import "../css/main.css";

type colourWay = "light" | "dark";

class Init {
  browserPreference: colourWay;
  appPreference: colourWay;
  vects: HTMLCollectionOf<SVGElement>;
  themeToggler: HTMLElement | null;
  dateContainer: HTMLElement | null;
  readingTitles: NodeListOf<HTMLElement>;
  nowDate: Date;

  constructor() {
    this.browserPreference = this._getBrowserPreference();
    this.appPreference = this._getAppPreference();

    // get all the svg elements on the page + the theme toggler
    this.vects = document.getElementsByTagName("svg");
    this.themeToggler = document.querySelector(".theme-toggler");

    // get the container to display the date + init nowDate
    this.nowDate = new Date();
    this.dateContainer = document.querySelector(".locationTime");

    // color the graphics w/ respect to page colour + load the page theme style
    this._colorVectorGraphics(this.vects);
    this._loadTheme(this.themeToggler, this.vects);

    // run the `_loadDate()` method
    this._loadDate(this.dateContainer);

    this.readingTitles = document.querySelectorAll(
      "main.readings article span.book-title"
    );
    this._checkReadingTitleLength(this.readingTitles);
  }

  _loadDate(dateContainer: HTMLElement | null) {
    // if there is a date container (or footer) on the page.
    if (dateContainer) {
      setInterval(() => {
        this.nowDate = new Date();
        dateContainer.innerText = `LAGOS, NG — ${this.nowDate
          .toLocaleTimeString("en-US", {
            timeZone: "Africa/Lagos",
            timeStyle: "full",
            hour12: false,
          })
          .slice(0, 5)}`;
      }, 1000);
    }
  }

  _colorVectorGraphics(vectors: HTMLCollectionOf<SVGElement>) {
    Array.from(vectors).forEach((e) => {
      e.style.color = this.appPreference === "dark" ? "#f7f7f7" : "#161616";
    });
  }

  _getBrowserPreference() {
    return window.matchMedia("(prefers-color-scheme: light)").matches === true
      ? "light"
      : "dark";
  }

  _getAppPreference() {
    if (sessionStorage.getItem("colorScheme")) {
      // if there is a colorScheme key in storage, return that color scheme.
      return sessionStorage.getItem("colorScheme") as colourWay; // return the colourway.
    } else {
      // if there is no colorScheme in the sessionStorage, then set that key to browser preference + return it
      sessionStorage.setItem("colorScheme", this.browserPreference); // set the sessionStorage since there is none
      return sessionStorage.getItem("colorScheme") as colourWay; // return the colourway.
    }
  }

  _checkReadingTitleLength(el: NodeListOf<HTMLElement>) {
    if (el) {
      el.forEach((e) => {
        console.log(e.style);
        if (window.innerWidth < 480) {
          if (e.innerText.length > 22) {
            e.style.textOverflow = "ellipsis";
            e.style.maxWidth = "200px";
            e.style.whiteSpace = "nowrap";
            e.style.overflow = "hidden";
            // text-overflow: ellipsis;
            // white-space: nowrap;
            // max-width: 150px;
            // display: inline-block;
            // overflow: hidden;
          }
        } else {
          if (e.innerText.length > 42) {
            e.style.textOverflow = "ellipsis";
            e.style.maxWidth = "250px";
            e.style.whiteSpace = "nowrap";
            e.style.overflow = "hidden";
            // text-overflow: ellipsis;
            // white-space: nowrap;
            // max-width: 150px;
            // display: inline-block;
            // overflow: hidden;
          }
        }
      });
    }
  }

  _loadTheme(
    toggler: HTMLElement | null,
    vectors: HTMLCollectionOf<SVGElement>
  ) {
    // set the document attribute
    document.documentElement.setAttribute(
      "data-color-scheme",
      sessionStorage.getItem("colorScheme")!
    );

    // if there is a toggler on the page
    if (toggler) {
      toggler.addEventListener("click", () => {
        // essentially toggle the session storage

        sessionStorage.setItem(
          "colorScheme",
          sessionStorage.getItem("colorScheme") === "dark" ? "light" : "dark"
        );

        // reset the app preference since the session value has toggled

        this.appPreference = this._getAppPreference();

        Array.from(vectors).forEach((e) => {
          e.style.color = this.appPreference === "dark" ? "#f7f7f7" : "#161616";
        });

        document.documentElement.setAttribute(
          "data-color-scheme",
          sessionStorage.getItem("colorScheme")!
        );
      });
    }
  }
}

const init = new Init();
