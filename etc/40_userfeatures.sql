-- FROM rmap/sql/40_userfeatures.sql

drop schema userfeatures cascade;
create schema userfeatures;

CREATE TABLE userfeatures.users (
    userid serial NOT NULL,
    username text,
    organization text,
    md5password text,
    fname text,
    lname text,
    org text,
    title text,
    phone text,
    email text,
    addr_str text,
    addr_cit text,
    addr_sta text,
    addr_zip text,
    addr_cou text,
    created  timestamp default current_timestamp
);
create unique index users__unique on userfeatures.users(username,org);


CREATE TABLE userfeatures.sessions (
    userid       int,
    sessionid    serial,
    sessionname  text
);
CREATE TABLE userfeatures.icons (
    iconid    serial,
    iconfile  text,
    iconcode  text
);
CREATE TABLE userfeatures.colors (
    colorid   serial,
    colorname text
);

-------------------------------------------------------------------------


CREATE TABLE userfeatures.legend (
    userid       int,
    featureid    serial,
    featurename  text,
    featuretype  text,
    featurecat   text,
    exttype      text,
    num          integer,
    depth        integer,
    parentid     text,
    minx double precision,
    miny double precision,
    maxx double precision,
    maxy double precision,
    eids        integer []
);
CREATE TABLE userfeatures.point_features (
    pointid     serial,
    entity_id   int,
    featureid   int,
    sessionid   int,
    userid      int,
    extid       text,
    label       text,
    iconid      int
);
SELECT AddGeometryColumn('userfeatures','point_features','the_geom','-1','POINT',2);

CREATE TABLE userfeatures.line_features (
    lineid      serial,
    relationship_id int,
    featureid   int,
    sessionid   int,
    userid      int,
    extid       text,
    label       text,
    color       text
);
SELECT AddGeometryColumn('userfeatures','line_features','the_geom','-1','LINESTRING',2);

CREATE TABLE userfeatures.area_features (
    areaid      serial,
    featureid   int,
    sessionid   int,
    userid      int,
    extid       text,
    label       text,
    color       text,
    bordercolor text
);
SELECT AddGeometryColumn('userfeatures','area_features','the_geom','-1','MULTIPOLYGON',2);



create index point_features__featureid  on point_features(featureid);
create index point_features__postgis    on point_features   using GIST (the_geom GIST_GEOMETRY_OPS);
create index line_features__featureid  on line_features(featureid);
create index line_features__postgis    on line_features   using GIST (the_geom GIST_GEOMETRY_OPS);
create index area_features__featureid  on area_features(featureid);
create index area_features__postgis    on area_features   using GIST (the_geom GIST_GEOMETRY_OPS);

create or replace function makeuserschema(uid int) returns void as $$
    my ($uid) = @_;
    if (!$uid) {
        elog(ERROR,"no user id\n"); return;
    }
    my $schema = "user$uid";
    elog(NOTICE,'hi'); 
  END
$$ language plperl;

 alter table legend add unique(featureid);
 alter table point_features add foreign key (featureid) references legend (featureid) on delete cascade;
 alter table line_features add foreign key (featureid) references legend (featureid) on delete cascade;
 alter table area_features add foreign key (featureid) references legend (featureid) on delete cascade;

