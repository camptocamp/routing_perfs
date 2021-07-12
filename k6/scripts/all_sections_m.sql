--m1_campagne
SELECT  distinct edge.*
FROM pgr_bdAstar 
( '
	SELECT  id AS id 
	       ,*
	FROM edge', 
    -- source 
    71731454, 
    -- target 
    ARRAY[600989092, 807863450, 71727452, 807014388, 558347787, 71732057, 558349563, 71730741, 71729244, 558361936] 
) AS astar
INNER JOIN edge
ON id = astar.edge UNION
--m1_ville
SELECT  distinct edge.*
FROM pgr_bdAstar 
( '
	SELECT  id AS id 
	       ,*
	FROM edge', 
    -- source 
    558253884,
    -- target 
    ARRAY[558251333, 918098781, 558255052, 1139218919, 558269718, 558255469, 1153547374, 558251639, 992327553, 835325076] 
) AS astar
INNER JOIN edge
ON id = astar.edge UNION
--m2
SELECT  distinct edge.*
FROM pgr_bdAstar 
( '
	SELECT  id AS id 
	       ,*
	FROM edge', 
    -- source 
    71706525, 
    -- target 
    ARRAY[71677697, 71704276, 71679824, 71680618, 71705219, 1142910552, 71710960, 558282321, 558279836, 1148565148, 601004088, 1037876610, 558271080, 558245943] 
) AS astar
INNER JOIN edge
ON id = astar.edge UNION
--m3
SELECT  distinct edge.*
FROM pgr_bdAstar 
( '
	SELECT  id AS id 
	       ,*
	FROM edge', 
    -- source 
    916092865, 
    -- target 
    ARRAY[558239640] 
) AS astar
INNER JOIN edge
ON id = astar.edge 
/*
UNION
--m4
SELECT  distinct edge.*
FROM pgr_bdAstar 
( '
	SELECT  id AS id 
	       ,*
	FROM edge', 
    -- source 
    807296622, 
    -- target 
    ARRAY[1093610302, 1094550207, 558333026, 558331274, 837069956, 548753390, 558317737, 558417530, 601002708, 71763902, 71763813, 71741047, 558364654, 558416552, 558366450, 71736421, 558294350, 558385181, 558385265, 558383299, 1138460452, 558380968, 71720769, 837214169, 600976541, 558380641, 558236612, 548763471, 908948240, 548763491] 
) AS astar
INNER JOIN edge
ON id = astar.edge 
*/