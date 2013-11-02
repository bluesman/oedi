Open Events Database Initiative [OEDI]
========================================

The OEDI was started to address the need for a free source of Event related data. the objectives are to:

1. Create a scalable, available, distributed source of event related data for consumption by applications.
2. Crowd Source the collection of event related data

How It Works
==============

Loaders
----------

Loaders translate Nouns into Objects with Ids

1. put a venue name (search string) in a queue
2. venue name queue processor will fire off a job that will:
   - query each venue source for that name and put the results in the source_venue collection
     - in order to query a source you need provider-source-credentials
   - put the source id and venue id of the queried source_venue results into a queue
   - put the venue data in the source_venue table
4. the source venue queue processor does the following:
   - read source/venue ids from the source_venue_queue
   - fire off a job that will fetch all the events and corresponding performers in the next 6 months for that venue
   - fire off a job that will map this source_venue to the aggregate venue object
     - this will fire another job that will reconstruct the aggregate venue data once the new venue data is mapped
