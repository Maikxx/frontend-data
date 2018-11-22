# Frontend Data

## Table of contents

* [Installation](#Installation)
* [Concept](#Concept)
* [Future enhancements](#Future-enhancements)
* [Process](#Process)
* [Development](#Development)
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
3. Run the _server_ with (**Warning: Don't do this on celular**) `yarn serve` or `npm run serve`.
4. Run the _client_ with `yarn start:client` or `npm run start:client`.
5. Start _linting_ with `yarn lint` or `npm run lint`.

To build the code locally use `yarn build:client` and change the links of the CSS and JS in the [index.html](index.html) file from `/client...` to `/dist/client...`.

**If you are experiencing CORS errors, please consider installing [this](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en) Chrome plugin**

## Concept

*Note: These designs might be a little outdated, but the global concept still stands*

I originally planned to make a graph, which would hold all the variables of the books from the OBA in it. However, this felt like it was not interesting enough. I also received feedback that I needed to make a visualization which was interesting to me personally.

When I heard that, I immediately looked at a way to implement airplanes in the visualization.
I eventually came up with a map, which holds all the cities in which atleast one books is published.

I decided to go for a map in D3, because I heard good things about that from [Tim](https://github.com/timruiterkamp), [Titus](https://github.com/wooorm) and [Lifely](https://lifely.nl).

The landing page can be seen in this image:

![Concept image 1](docs/concept-visualization-01.jpg)

Here you can select an airplane and then select a city on the map.
You could also zoom out on the map to reveal more of the world.
When you click on a specific point you can explore the books that are published at this location from a popup.
My initial way to visualize this can be seen in the following image:

![Concept image 2](docs/concept-visualization-02.jpg)

However, after exploring the amount of books I had per location, I quickly realized this was not possible.
I have thought of something new when you read this, check out the [live visualization](https://maikxx.github.io/frontend-data/index.html).

On the next two images another interaction state can be seen. The color of the city changes and there is a line being drawn from the selected city to the destination city, which is always Amsterdam.

![Concept image 3](docs/concept-visualization-03.jpg)
![Concept image 4](docs/concept-visualization-04.jpg)

The main thought behind this visualization was to have the user explore the world to find their favorite books.
I coupled the flight data with this, because I thought it would make the visualization a lot more interesting.

**Disclaimers**

* There is no way the flight times are 100% accurate, since the calculation takes the cruising speed of a plane, in other words, the take-off and landing speeds are not taken into account.
* The speed is not live, which means that flight times may always vary with wind speeds.
* Probably the most books don't arrive in the Netherlands by plane, and even may or may not come from the publication city.


## Future enhancements

For an up to date list of future enhancements, you can take a look [here](https://github.com/Maikxx/frontend-data/issues).

## Process

During these two weeks I learned a lot more than I had initially thought.
The learning process started with, what was a mystery for me, that GitHub doesn't like to have large files stored on it's servers.

I had to use a `git` tool, called [Git-LFS](https://git-lfs.github.com) to store the data file I originally had. This was a text file containing all the geographic coordinates of cities in the world.
I eventually stopped using this file, because my computer could not handle the amount of computations required to `filter` and `map` through the data to transform it.

I then choose to use an external API to load the coordinates by city name (at this point I had transformed all the cities to cleaned names). I thought these requests (±230) could be fired from the client, however I quickly found out that the API only allows 1 request per second, which would make the load time of the map equivalent to the amount of requests, which was way too long.

Finally, in this chain of events I choose to take an approach I think is rather unnecessary, but after started to apreciate. One might call this *the long route*, which involved me writing a data file to my computer for each significant step in the data transformation process. You can find all these resulting files [here](./data).

Because you write a file every significant step, getting lost in the data is harder, which is a good thing.
Because of this approach the client only has to do two requests, which is to [this](./data/city.geo.json) and this [this](./data/cityConnections.geo.json).

More things I learned these past weeks include, of course D3, but also MapBox, which is a great Map provider, which makes interaction with it and placing svg layers on top super easy.

As for the concepting part of this project, well... The moment I heard from Titus that I should make something that is fun for me to make, I was just flying (pun intended) to do something with airplanes for once after two years of not having the time to make something like that happen.

The concept really just evolved over time, and at this moment it is still a work in progress, which I think is great, because I can add a lot of things to the visualization when it progresses.

I initially thought I was going to hate D3, because everyone I know said it was awefull, however the reality is that I love it. It makes a lot of things so much more easy.
The things that I could not easily write myself or solve with D3, I fixed by using Lodash.

The further the project got, the more I started enjoying it, and now I would like to keep this project up to date and develop it to the next level when I have the time for it. You can look at my [GitHub issues](https://github.com/Maikxx/frontend-data/issues) to see what I want to add in the future.

Finally, I am starting to like working with GitHub issues and git branches each time a little bit more, which I would not have imagined I would ever say for a solo project.

The full log of my process can be found [here](docs/PROCESS.md)!

## Development

### Code attribution

Pretty much all the code I wrote is made by myself. This includes the complete development environment setup, as well as the [server](./index.ts) every file in the [api folder](./api).

The server and api code is mainly used for transforming the raw data from the OBA to usable geoJson. The reason I complete this task on the server instead of the client, is because otherwise the client would need to send out 230 requests, as I explained earlier.

Pretty much the whole graph is also made by me, except for [the gradient part of the scaleLegend function](./graph/graph.js#L468) and the [code that transforms a line into an arc](./graph/graph.js#L332).
For both of these, the motivation to not write it myself, is because I couldn't understand how they would work.
For the line to arc transformation, this was pretty much the only decent example that I could find and could get to work with the structure I had built at that moment.

All of the other code is written by myself, unless otherwise stated.

### Data

In the visualization I used books that have a publication location. The base data came from Wouter, who had exported about 4500 hits in a JSON file, which made developing way easier, instead of having to wait for like 500000 books to load.
Thus, this visualization is made up of a subset of the data from the OBA.

What I used in terms of variables to tie it all together:

* Book title
* Publication location of a book
* Lat, long coordinates based on the publication locations, revrieved from [LocationIQ](https://locationiq.com/docs)
* The distance between cities, calculated with the help of [MapBox](https://www.mapbox.com)
* Names and cruising speeds of a select amount of airplanes, attribution can be found [here](#L150)
* Fly time between two points
* Amount of books per location

I originally planned to make the select have more options by attaching it to another API, from Wikipedia for example, but due to the simple fact that most planes have similar cruising speeds, this was not usefull enough for me to start looking in it, for now.

### Interaction

If, for some reason, the interaction is not clearly visible at first, no worries, I got you covered here.

* Zooming in and out on the map
* Clicking on the Amsterdam legend item flies you back to Amsterdam if you get lost on the map
* Selecting an airplane from the dropdown
* Clicking on a point on the map to draw a line between this city and Amsterdam in order for the statistics in the panel on the right to update with accurate approximate fly times and distances
* When you click on a city without selecting an airplane you will get an error toast🍞.

### Tools and API's

The graphs base is using MapBox, because I heard a lot of good things about this before starting at this task and started to wonder if I could make something happen with an additional SVG layer on top.

* [D3](https://d3js.org)
* [Git-LFS](https://git-lfs.github.com)
* [JSON To TS](http://www.jsontots.com)
* [JSONbin](https://jsonbin.io)
* [LocationIQ](https://locationiq.com/docs) - API for getting coordinates from city names.
* [Lodash](https://lodash.com)
* [MapBox](https://www.mapbox.com) - API for showing the map
* [Node.js](https://nodejs.org/en/)
* [Nodemon](https://nodemon.io)
* [Dark Sky](https://darksky.net/dev) - API for live weather data
* [TypeScript](https://www.typescriptlang.org)
* [Yarn](https://yarnpkg.com/en/)

## Honourable mentions

* [Wouter](https://github.com/maanlamp):
    Wouter created the [boilerplate for pagination](https://github.com/maanlamp/node-oba-api-wrapper) with the OBA API.
* [Chelsea](https://github.com/chelseadoeleman):
    Chelsea helped me writing the data transformators and getting me up and running with D3.
* [Jessie](https://github.com/jessiemasonx):
    Jessie helped me getting up and running with D3.

## Sources

* D3 Gradient Bar - Map Legend Example [Code]. (2017, June 12). Retrieved November 21, 2018, from https://bl.ocks.org/duspviz-mit/9b6dce37101c30ab80d0bf378fe5e583.
* MapBox. (2018, november 19). Animate a point along a route [Code]. Retreived november 19 2018, from https://www.mapbox.com/mapbox-gl-js/example/animate-point-along-route/.
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