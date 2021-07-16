# Possible Performance Improvements

## Replace ST_Buffer and ST_Intersect with ST_DWithin
I noticed that there is this function ST_DWithin which can replace ST_Buffer with ST_Intersect and both return the same results in my tests.
I did some research but was at first not able to see what the difference between these two methods was.
Thanks to the EXPLAIN ANALYZE I saw that ST_DWithin uses [ST_Expand](https://postgis.net/docs/ST_Expand.html) which states:
*ST_Expand is similar in concept to ST_Buffer, except while buffer expands the geometry in all directions, ST_Expand expands the bounding box along each axis.*

Therefore ST_Expand should only return the same results if the Line between the two points is parallel to the equator or in a 90 Degree angle from it since it uses Bounding boxes. 

But in all of my experiments I got always the same result for both methods.

### Performance
As seen in the explain and analyze below, the performance of actual time, planning time and execution time is faster for ST_DWithin by a factor of 2-3. Although, how farther away the two points are and the bigger the buffer gets, the smaller this difference becomes. So for short itineraries ST_DWithin could be beneficial, but more tests should be made.

### Code of ST_Buffer and ST_Intersect
`WITH
      -- Selection et projection du départ
      start_point AS (
        SELECT ST_Transform(ST_SetSRID(ST_MakePoint(3.0580155,48.5982848), 4326), 2154) as geom
      ),
      -- Selection et projection de l'arrivée
      end_point AS (
        SELECT ST_Transform(ST_SetSRID(ST_MakePoint(2.9281479,48.5872454), 4326), 2154) as geom
      ),
      -- Création d'un polygone buffer autour de l'axe départ-arrivée afin de filtrer les tronçons pris en compte dans le calcul
      polygon_edge_filter AS (
        SELECT ST_Buffer(ST_MakeLine(start_point.geom, end_point.geom), 100)as geom
        FROM start_point, end_point
      ),
      -- Récupération des tronçons inclus dans le buffer avec leur coût conditionné par leurs éventuelles contraintes
      edges AS (
        SELECT
          edge.id, source, target,
         1 AS cost,
          1 as reverse_cost,
          x1, y1, x2, y2, name, km, kmh, edge.geom
        FROM edge
        LEFT JOIN contrainte ON edge.id = contrainte.id_edge
        JOIN polygon_edge_filter ON ST_Intersects(edge.geom, polygon_edge_filter.geom)
      )
      SELECT *
        FROM edges;`

### Code of ST_DWithin
`WITH
      -- Selection et projection du départ
      start_point AS (
        SELECT ST_Transform(ST_SetSRID(ST_MakePoint(3.0580155,48.5982848), 4326), 2154) as geom
      ),
      -- Selection et projection de l'arrivée
      end_point AS (
        SELECT ST_Transform(ST_SetSRID(ST_MakePoint(2.9281479,48.5872454), 4326), 2154) as geom
      ),
      -- Création d'un polygone buffer autour de l'axe départ-arrivée afin de filtrer les tronçons pris en compte dans le calcul
      polygon_edge_filter AS (
        SELECT ST_MakeLine(start_point.geom, end_point.geom)as geom
        FROM start_point, end_point
      ),
      -- Récupération des tronçons inclus dans le buffer avec leur coût conditionné par leurs éventuelles contraintes
      edges AS (
        SELECT
          edge.id, source, target,
         1 AS cost,
          1 as reverse_cost,
          x1, y1, x2, y2, name, km, kmh, edge.geom
        FROM edge
        LEFT JOIN contrainte ON edge.id = contrainte.id_edge
        JOIN polygon_edge_filter ON ST_DWithin(edge.geom, polygon_edge_filter.geom, 100) 
      )
      SELECT *
        FROM edges;`

### Explain and Analyze ST_Buffer and ST_Intersect
"Index Scan using edge_geom_idx on edge  (cost=0.27..7222.40 rows=179 width=172) (actual time=0.305..0.973 rows=49 loops=1)"
"  Index Cond: (geom && '01030000206A08000001000000230000004095E2C972332541CE0FE308AD0F5A41B76734994B332541D11846E4AC0F5A41C11028F024332541742706B5AD0F5A415318144B00332541D58F1D73AF0F5A4166F17A12DF32254170B3670DB20F5A41694E308DC232254115A8496AB50F5A41BED3C9D3AB322541BF1EAE68B90F5A414DB8D6C59B32254118DC4AE1BD0F5A417168480193322541B54023A8C20F5A418AB060DC913225416606398EC70F5A41A52561629832254144915A63CC0F5A41AC681C53A63225415210FDF7D00F5A4184856D25BB3225413035101FD50F5A41AF2A7D0CD63225418F89B9AFD80F5A4100E0A0FFF5322541E558E686DB0F5A41C0CA86C41933254153BCA488DD0F5A41A8EF49FB3F3325414E8636A1DE0F5A41F8D1556D127E2541D5655D3B11115A4181FF039E397E2541D25CFA5F11115A4177561047607E25412F4E3A8F10115A41E54E24EC847E2541CEE522D10E115A41D275BD24A67E254133C2D8360C115A41CF1808AAC27E25418ECDF6D908115A417A936E63D97E2541E45692DB04115A41EBAE6171E97E25418B99F56200115A41C7FEEF35F27E2541EE341D9CFB105A41AEB6D75AF37E25413D6F07B6F6105A419341D7D4EC7E25415FE4E5E0F1105A418CFE1BE4DE7E25415165434CED105A41B4E1CA11CA7E254173403025E9105A41893CBB2AAF7E254114EC8694E5105A41388797378F7E2541BE1C5ABDE2105A41789CB1726B7E254150B99BBBE0105A419077EE3B457E254155EF09A3DF105A414095E2C972332541CE0FE308AD0F5A41'::geometry)"
"  Filter: st_intersects(geom, '01030000206A08000001000000230000004095E2C972332541CE0FE308AD0F5A41B76734994B332541D11846E4AC0F5A41C11028F024332541742706B5AD0F5A415318144B00332541D58F1D73AF0F5A4166F17A12DF32254170B3670DB20F5A41694E308DC232254115A8496AB50F5A41BED3C9D3AB322541BF1EAE68B90F5A414DB8D6C59B32254118DC4AE1BD0F5A417168480193322541B54023A8C20F5A418AB060DC913225416606398EC70F5A41A52561629832254144915A63CC0F5A41AC681C53A63225415210FDF7D00F5A4184856D25BB3225413035101FD50F5A41AF2A7D0CD63225418F89B9AFD80F5A4100E0A0FFF5322541E558E686DB0F5A41C0CA86C41933254153BCA488DD0F5A41A8EF49FB3F3325414E8636A1DE0F5A41F8D1556D127E2541D5655D3B11115A4181FF039E397E2541D25CFA5F11115A4177561047607E25412F4E3A8F10115A41E54E24EC847E2541CEE522D10E115A41D275BD24A67E254133C2D8360C115A41CF1808AAC27E25418ECDF6D908115A417A936E63D97E2541E45692DB04115A41EBAE6171E97E25418B99F56200115A41C7FEEF35F27E2541EE341D9CFB105A41AEB6D75AF37E25413D6F07B6F6105A419341D7D4EC7E25415FE4E5E0F1105A418CFE1BE4DE7E25415165434CED105A41B4E1CA11CA7E254173403025E9105A41893CBB2AAF7E254114EC8694E5105A41388797378F7E2541BE1C5ABDE2105A41789CB1726B7E254150B99BBBE0105A419077EE3B457E254155EF09A3DF105A414095E2C972332541CE0FE308AD0F5A41'::geometry)"
"  Rows Removed by Filter: 127"
"Planning Time: 0.449 ms"
"Execution Time: 1.011 ms"

### Explain and Analyze ST_DWithin
"Index Scan using edge_geom_idx on edge  (cost=0.40..7222.53 rows=1 width=172) (actual time=0.091..0.286 rows=49 loops=1)"
"  Index Cond: (geom && st_expand('01020000206A08000002000000C424A2D42B7E254195AA336FF8105A4174429662593325410ECB0CD5C50F5A41'::geometry, '100'::double precision))"
"  Filter: st_dwithin(geom, '01020000206A08000002000000C424A2D42B7E254195AA336FF8105A4174429662593325410ECB0CD5C50F5A41'::geometry, '100'::double precision)"
"  Rows Removed by Filter: 127"
"Planning Time: 0.415 ms"
"Execution Time: 0.314 ms"


