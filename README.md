# Momentum Desk

I built Momentum Desk for a sample stock tape on Confluent Cloud.

Open the desk: https://saisumanthj.github.io/momentum-desk/

Customers come in on one stream and trades come in on another. I keep each symbol in order, attach the customer to every trade, and use that stream to answer the questions I would ask at a desk. Is this name busy? Is the next stretch likely to print more? Did the same person buy and then sell? Did that round trip make money? What should I do with this name in this window?

Market is the tape. I show the ten-second window, the forecast for the next one, the price jumps, the region that is pushing, and whether the buy-versus-sell tilt still holds over a full minute.

Customers is the book of people. I show who is trading, what they still hold, and whether one person is moving through several symbols in one burst.

Reversals is the round trip. I show a buy followed by a sell in the same name, and the profit or loss on that pair.

Decisions is the call. I write one action for each symbol window, I keep the ones worth a look, and I mark the moment that action changes.

The floor is the page I keep in front of me. It places the last ten seconds beside that action and the counts that justified it.

I run this on cluster lkc-7ykmzdo in AWS us-east-2. Two Datagen connectors land the customers and the trades, each with a JSON schema. Flink builds the windows, the count forecast, and the buy-then-sell match. Schema Registry holds the source schemas, and the Flink tables are Avro.

I published a capture from that cluster on the site above, so you can open every page and see the rows I used.
