# Process

## Table of contents

* [Week 1](#Week-1)
    * [Day 1](#Day-1)
    * [Day 2](#Day-2)
    * [Day 3](#Day-3)
    * [Day 4](#Day-4)
    * [Day 5](#Day-5)

## Week 1

### Day 1

Today I focussed on setting up the boilerplate once more, this time with [TypeScript](typescript), because I felt like I was really missing that in the past few weeks.

I got stuck at creating my own TypeScript configurator a lot today.
I just Googled my way to the correct use cases (which in my case was having both [Nodemon](nodemon) and TypeScript).

I have found that TypeScript is great, when you can get it up and running, but setting up an environment is not really simple, making it less appealing for creating a quick app.

When I finally got it to work, I decided to start transforming the data from the OBA API to [TypeScript types](../api/types/Query.ts).
I did this, mainly, because I think it will be easier for me to see a pattern of data, which is interesting to explore.
[Last projects visualization](https://beta.observablehq.com/@maikxx/division-of-books-per-language-at-the-oba) was not very exciting, so I am trying to make it exciting this time.

### Day 2

Today I spend a lot of time in transforming the data to be a certain format for an example that I found.
I also thought about the variables I wanted to use, the concept on it's whole and how it would work out.

**Variables required**

* Genres
* Author
* Language
* Title
* Years

**Concept**

Show a graph with on the X-axis the years, while on the Y-axis the amount of books per year is shown.
The graph is shown on a language base.

When clicking on a dot on the amount a web opens up, with different levels:

1. Amount of books
2. Genres
3. Author
4. Title

When clicking on a point when it is opened, it closes again. You can also change the language to multiple different languages, which are:

* Dutch
* German
* French
* English
* Spanish
* Italian
* Russian

After trying a lot of languages, I found out that Russian and Italian had barely any books in the database, besed on my genres, which caused me to strip them from the lookup, since it took too long.

I iterated a lot of times here to optimize the code.

### Day 3

During the feedback moment of today I got to hear that I would need to change up my concept a bit in order for me to keep challenging myself. This was kind of a bummer, since I put a lot of work in getting it working yesterday, however it would also be fun to do something with a map, as was suggested.

I changed up my concept by thinking of something that I would really like to make.
I like flying a lot, so I wanted to do something with this.

**Updated Concept**

I started thinking about locations of where the books came from and eventually I came up with a globe, which has a lot of dots on them, which are the publication locations of the books.
The color of these dots would be a certain scale, based on how long it would take to fly from that location to Amsterdam, based on one of a few airplanes, which can be selected with a select input right besides the globe.
When you click on a certain location on the globe, the map will zoom out and show you the flying route drawn on the globe.

After thinking of this concept I looked for a large dataset which would have a lot of cities from around the world in it. I soon realised that git does not like files which are more than 100mb in size, which got me stuck at this moment in time.

I have already written the transformation code for the cities, so that is in a more useful format than a string.
This caused multiple problems as well, since for some reason Node can run out of memory when performing large operations on large files, which is exactly what happend. For me it was enough to write my code a little bit different, so that Node doesn't have to load all the objects in the transformed array at once.

However, for [Chelsea](https://github.com/chelseadoeleman) we could not find a solution as easy as this, we had to boost the amount of memory allocated to Node, which is something you don't really want to do, but had to be done for now. It might be needed for me in the end as well when binding the data from the API to the cities data.

### Day 4

I didn't have a lot of time today, so I only managed to update my concept and create some wireframes with Illustrator.
The concept might be very difficult to realize in the end, but we will see about that when we get to that point.

### Day 5

Today I started working with data in D3, however quickly noted that my idea was way too complex. I decided to leave out the search functionality in it's whole.
It would be a great addition when there is more time.

I also got a lot of help from [Wouter](https://github.com/maanlamp), Tim and [Chelsea](https://github.com/chelseadoeleman) today, with getting things to work the way I want them to.

On my part I helped [Jessie](https://github.com/jessiemasonx) and [Chelsea](https://github.com/chelseadoeleman) with some of their functionalities. It is great to help people, because you have a bird's eye view of their code, whereas they might have lost it at that point.

### Weekend

During the weekend I worked a lot on this project to get up to speed with the rest, I focussed on transforming the data into GeoJSON, which could be used by MapBox. This was a lot more difficult than it sounds, because I had to make a connection to another external API from the server, which is LocationIQ.

When working with this I found out soon enough that this API wasn't made for mass requests like mine (230 requests approximately). It kept throwing `419` error codes, which meant I was sending too much requests. I finally solved this by leaving a second in between requests.

When the weekend was over I had a completely functional map with MapBox as the map provider and with publication locations of OBA books across the world.

I had also made a simple connection and interaction between the selected city (like London) to Amsterdam, which would draw a line on the map between these two cities.
I was not satisfied with this line yet though, as it was a straight line, while if you look at plane route maps, they always curve along with the earths rounding.

### Day 6

After having the map semi-functional I decided it was time to focus on the UI. I wanted to include at least a legend, a way to change the plane on which the speed is based, and an overview of the selected variables from within the UI and the map. I ofcourse also needed a title for the map.

The title was quickly integrated, along with the UI sidebar.
The tricky part was the selected values data display section.
This would need to be essentially a React like component, with state and an ability to modify it's values, without it being React. To do this I created a global variable (👀) to store this data, since I needed these values in multiple functions.

I spent a lot of my day trying to calculate the distance between coordinates, and showing this in the UI in a nice way (like: 1 hour and 40 minutes). This prove to be harder than I thought, because the modulus operator does not return the decimal value if the variable on which it is performed is less than the right hand side of the operation.
To fix this, I had to write very ugly code, which could be definately be refactored. I just had spend enough time on this issue.

Finally I looked into a way to curve the lines shown on the map according to the globes curvature.
This was, as usual, harder than it sounds, since there are pretty much no fitting examples to be found anywhere.
I fixed this by mixmashing my own code with some of an example of MapBox.

<!-- Links -->
[nodemon]: https://nodemon.io
[typescript]: https://www.typescriptlang.org