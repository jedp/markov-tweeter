What?
-----

This module has two parts.

`markov` creates hybrid personalities by mashing people's twitter feeds
together.  Included in the `personas` directory are some data to create a Kanye
West + Dmitri Medvedev, and a Martha Stewart + Lady Gaga.

`app` uses `markov` to generate random tweets by the available personas (you
can always add more), and POSTs those tweets to the app you configure it for.

When you run `app`, it sprays 1000 tweets by default.  You can change this with
some command line arguments.

Why?
----

Experimenting with `node` and `mongoose` is just too much fun.  Like everybody
else, I wanted to write a toy microblogging service.  And that means I need
data to test it.  So this gives me some data.

Some Examples
-------------

Here are some random tweets by the Kanye West + Medvedev persona:

- Dmitry Medvedev: Draft agreement on the new iphone??? LOL!!!

- We need to modernise our economy and the music is unquestionable sooooo.....

- President Medvedev met with students at the graphics house in Paris designing
  the type of shit that is nooo way near LOL-able...


