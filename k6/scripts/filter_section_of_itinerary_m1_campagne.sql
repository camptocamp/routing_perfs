DROP TABLE IF EXISTS test1;
create temp table test1 
(lon double precision,
lat double precision);
insert into test1 (lon, lat)
values 
-- m1_campagne
(2.9281479,48.5872454),
(2.9370473,48.6160958),
(2.9704873,48.5960883),
(3.0049624,48.638116),
(3.0360042,48.6687008),
(3.1157576,48.6062114),
(3.1401509,48.5820105),
(3.1212283,48.5464993),
(3.0635944,48.5548806),
(3.0329398,48.5282842);
select * from test1;

DROP TABLE IF EXISTS test2;
create temp table test2
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
);
do
$$
declare
	departure_lon constant double precision default 3.0580155;
	departure_lat constant double precision default 48.5982848;
	buffer_size constant integer default 1000;
    f record;
begin
    for f in select lon, lat 
	       from test1 
    loop 
		insert into test2 select * from get_section_edges(departure_lon,departure_lat,f.lon, f.lat, buffer_size);
    end loop;
end;
$$;
delete from edge
WHERE not EXISTS (
   SELECT FROM test2 
	where edge.id = test2.id
   );
--select * from test2;
select * from edge;