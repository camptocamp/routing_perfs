create or replace FUNCTION get_section_edges2(source_vid bigint, target_vid bigint, buffer_size float) returns table 
(
	id integer, 
	source integer, 
	target integer, 
	cost double precision, 
	reverse_cost double precision, 
	x1 double precision, 
	y1 double precision, 
	x2 double precision, 
	y2 double precision, 
	name varchar (255), 
	km double precision, 
	kmh integer, 
	geom geometry
) as $$
BEGIN
DROP TABLE IF EXISTS temp_edge_subset_1;
CREATE TEMPORARY TABLE temp_edge_subset_1 ON COMMIT DROP AS WITH
      -- Selection et projection du départ
      
      -- Création d'un polygone buffer autour de l'axe départ-arrivée afin de filtrer les tronçons pris en compte dans le calcul
      polygon_edge_filter AS (
        SELECT ST_Buffer(geo.geom, buffer_size) as geom
        FROM (SELECT  distinct edge.geom
FROM pgr_bdAstar 
( '
	SELECT  edge.id AS id 
	       ,*
	FROM edge', 
    -- source 
    source_vid, 
    -- target 
    target_vid 
) AS astar
INNER JOIN edge
ON edge.id = astar.edge) as geo
      ),
      -- Récupération des tronçons inclus dans le buffer avec leur coût conditionné par leurs éventuelles contraintes
      edges AS (
        SELECT
          edge.id, edge.source, edge.target,
         CASE
  WHEN contrainte.fermeture
  THEN -1
  ELSE
    CASE
    WHEN contrainte.modulation IS NOT NULL
    THEN edge.cost * contrainte.modulation
    ELSE edge.cost
    END
  END AS cost,
            CASE
  WHEN contrainte.fermeture_inverse
  THEN -1
  ELSE
    CASE
    WHEN contrainte.modulation IS NOT NULL
    THEN edge.reverse_cost * contrainte.modulation
    ELSE edge.reverse_cost
    END
  END as reverse_cost,
          edge.x1, edge.y1, edge.x2, edge.y2, edge.name, edge.km, edge.kmh, edge.geom
        FROM edge
        LEFT JOIN contrainte ON edge.id = contrainte.id_edge
        JOIN polygon_edge_filter ON ST_Intersects(edge.geom, polygon_edge_filter.geom)
      )
      SELECT distinct *
        FROM edges;
		
return query  select * from temp_edge_subset_1;
END
$$ LANGUAGE plpgsql;
