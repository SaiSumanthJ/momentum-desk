# Momentum Desk

Momentum Desk is a place to sit with a sample stock tape on Confluent Cloud and read it the way a desk would.

Open it here: https://saisumanthj.github.io/momentum-desk/

A tape is a rush of small facts. Someone bought. Someone sold. A price moved. A name got busy, then quiet, then one-sided. The desk gathers that rush into one view, so a name can be seen as busy, one-sided, reversing, or worth a look while the prints are still the story.

Two feeds start it. Customers arrive on one stream. Stock trades arrive on the other. Each symbol stays in its own order, and every trade carries the customer who sent it. From there the stream answers the questions that matter once the prints are moving.

Is this name busy right now, and is the buying or the selling lopsided? Does the next stretch look busier than this one? Did the last print actually move the price? Which region is putting weight on the tape? Does that tilt still hold when the clock stretches to a full minute? Did the same person buy and then sell the same name? Did that round trip make money? What should the desk do with this name in this window?

Market is the tape. A ten-second window shows how many trades landed, how many customers were in them, and how one-sided the flow was. A forecast sits beside the current count, so the next window can be compared with the one that just closed. Price jumps keep a move in the price separate from the mere number of prints. Region pressure shows where the activity is coming from on that same clock. A minute horizon checks whether the same tilt is still there after the short window has passed.

Customers is the book of people behind those prints. A profile carries the region and the description of the customer. Positions show what that customer still holds in a name, whether the book is long or short, and how the buys and sells add up. Sessions catch the moment one customer touches several symbols inside a single short burst.

Reversals look for a round trip. The same customer buys a name and then sells it a short time later. The match is kept, and so is the money: the buy, the sell, the size, and whether that pair came out ahead or behind.

Decisions turn those readings into one action for each symbol in each window. The action can be quiet, heating, a surge, or imbalanced. Alerts keep the ones that are not quiet, the queue a person would actually look at. When the action changes from one window to the next, that change is kept on its own, so the moment of the shift stays visible.

The floor is the page meant to stay open. It holds the last ten seconds of the tape beside the action and the counts that justified it, with the closed ten-second and one-minute windows alongside.

Underneath, two connectors land the customers and the trades, and each of those records has a schema. The stream builds the windows, the forecast of the next count, and the match of a buy followed by a sell. The source records keep their schemas, and the processed tables carry schemas of their own.

The site above is a capture from that running tape. Anyone who opens the link can walk the overview, the four groups, and the floor, and see the rows the desk was reading.
