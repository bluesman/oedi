/*

the aggregate venue model - this is the composite venue data which is a product of the aggregated source_venue data 
there is a mapper job that relates source_venues to the aggregate venue and decides which data from which source 
gets used by the aggregate when the same data is available from multiple sources (venue name for example).
There is a venue_source_map that defines how the data from a given source maps to the aggregate venue.

*/
