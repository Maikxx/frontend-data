# Frontend Data

## Table of contents

* [Installation](#Installation)
* [Concept](#Concept)
    * [Future enhancements](#Future-enhancements)
* [Process](#Process)
* [Development](#Development)
    * [Tools](#Tools)
* [Honourable mentions](#Honourable-mentions)
* [Sources](#Sources)
* [License](#License)

## Installation

```bash
git clone git@github.com:Maikxx/frontend-data.git
cd frontend-data
```

1. Install the dependencies with: `yarn` or `npm install`.
2. Copy the _.env.example_ file with `cp .env.example .env` and provide the API keys.
3. Run the _development server_ with (**Warning: Don't do this on celular**) `yarn serve` or `npm run serve`.
4. Start _linting_ with `yarn lint` or `npm run lint`.

## Concept

*Note: These designs might be a little outdated, but the global concept still stands*

I originally planned to make a graph, which would hold all the variables of the books from the OBA in it. However, this felt like it was not interesting enough. I also received feedback that I needed to make a visualization which was interesting to me personally.

When I heard that, I immediately looked at a way to implement airplanes in the visualization.
I eventually came up with a map, which holds all the cities in which atleast one books is published.
The landing page can be seen in this image:

![Concept image 1](docs/concept-visualization-01.jpg)

Here you can select an airplane and then select a city on the map.
You could also zoom out on the map to reveal more of the world.
When you click on a specific point you can explore the books that are published at this location from a popup.
My initial way to visualize this can be seen in the following image:

![Concept image 2](docs/concept-visualization-02.jpg)

However, after exploring the amount of books I had per location, I quickly realized this was not possible.
I have thought of something new when you read this, check out the live visualization. <!-- TODO Add a link here -->

On the next two images another interaction state can be seen. The color of the city changes and there is a line being drawn from the selected city to the destination city, which is always Amsterdam.

![Concept image 3](docs/concept-visualization-03.jpg)
![Concept image 4](docs/concept-visualization-04.jpg)

The main thought behind this visualization was to have the user explore the world to find their favorite books.
I coupled the flight data with this, because I thought it would make the visualization a lot more interesting.

**Disclaimers**

* There is no way the flight times are 100% accurate, since the calculation takes the cruising speed of a plane, in other words, the take-off and landing speeds are not taken into account.
* The speed is not live, which means that flight times may always vary with wind speeds.
* Probably the most books don't arrive in the Netherlands by plane, and even may or may not come from the publication city.

<!-- TODO -->

<!-- * Animate the route when a point is clicked.
* Remove the active state from other routes when another is clicked. -->

### Future enhancements

* Implement search functionality. **Minor**
* Add live weather information for the clicked city to calibrate the flight duration. **Major**
* Take take-off and landing speeds into account calculating the time it takes between destinations. **Medium**
* Add curve to the plane route, which corresponds with the curvature of the globe. **Medium**
* Integrate the cost it takes for a book (based on weight) to ship it to Amsterdam. **Medium**
* Integrate multi-library support **Major**

## Process

<!-- TODO: Summary -->

The full log of my process can be found [here](docs/PROCESS.md)!

## Development

### Tools

* [Nodemon](https://nodemon.io)
* [TypeScript](https://www.typescriptlang.org)
* [Yarn](https://yarnpkg.com/en/)
* [JSON To TS](http://www.jsontots.com)

### API's

* [LocationIQ](https://locationiq.com/docs)
* [MapBox](https://www.mapbox.com)

## Honourable mentions

* [Wouter](https://github.com/maanlamp):
    Wouter created the [boilerplate for pagination](https://github.com/maanlamp/node-oba-api-wrapper) with the OBA API.
* [Chelsea](https://github.com/chelseadoeleman):
    Chelsea helped me writing the data transformators and getting me up and running with D3.
* [Jessie](https://github.com/jessiemasonx):
    Jessie helped me getting up and running with D3.

## Sources

* Wikipedia contributors. (2018, november 18). Airbus A340 - Wikipedia. Retreived november 18 2018, from https://en.wikipedia.org/wiki/Airbus_A340.
* Wikipedia contributors. (2018, November 18). Airbus A380 - Wikipedia. Retrieved November 18, 2018, from https://en.wikipedia.org/wiki/Airbus_A380.
* Wikipedia contributors. (2018, november 18). Antonov An-22 - Wikipedia. Retreived november 18 2018, from https://en.wikipedia.org/wiki/Antonov_An-22.
* Wikipedia contributors. (2018, november 18). Antonov An-124 Ruslan - Wikipedia. Retreived november 18 2018, from https://en.wikipedia.org/wiki/Antonov_An-124_Ruslan.
* Wikipedia contributors. (2018, november 15). strategic airlifter by Antonov. Retreived november 18 2018, from https://en.wikipedia.org/wiki/Antonov_An-225_Mriya.
* Wikipedia contributors. (2018, november 18). Boeing 747 - Wikipedia. Retrieved November 18, 2018, from https://en.wikipedia.org/wiki/Boeing_747.
* Wikipedia contributors. (2018, november 18). Boeing 777 - Wikipedia. Retreived november 18 2018, from https://en.wikipedia.org/wiki/Boeing_777.
* Wikipedia contributors. (2018, november 14). Fokker 100 - Wikipedia. Retreived november 18 2018, from https://en.wikipedia.org/wiki/Fokker_100.
* Wikipedia contributors. (2018, november 17). Hughes H-4 Hercules - Wikipedia. Retreived november 18 2018, from https://en.wikipedia.org/wiki/Hughes_H-4_Hercules.

## License

This repository is licensed as [MIT](LICENSE) by [Maikel van Veen](https://github.com/maikxx).