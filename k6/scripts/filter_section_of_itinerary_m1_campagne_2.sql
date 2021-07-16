DROP TABLE IF EXISTS test1;
create temp table test1 
(source_vid bigint);
insert into test1 (source_vid)
values 
-- m1_campagne
(600989092), 
(807863450), 
(71727452), 
(807014388), 
(558347787), 
(71732057), 
(558349563), 
(71730741), 
(71729244), 
(558361936);
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
	target_vid constant bigint default 71731454;
	buffer_size constant integer default 15000;
    f record;
begin
    for f in select source_vid 
	       from test1 
    loop 
		insert into test2 select * from get_section_edges2(f.source_vid,target_vid, buffer_size);
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
