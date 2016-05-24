#!/bin/bash

export PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )"/.. && pwd )"
export PATH=$PROJECT_DIR/bin:$PATH

if [ ! -v INSTALL_DIR ]; then
   export INSTALL_DIR=$HOME/tmp/installdir
   echo "INSTALL_DIR was not set. Defaulting to: $INSTALL_DIR"
fi  

if [ ! -v GIS_DATA_DIR ]; then
   if [ -d "/mnt/gisdata" ] ; then
       export GIS_DATA_DIR=/mnt/gisdata
   else
       export GIS_DATA_DIR=$HOME/tmp/gisdata
   fi
   echo "GIS_DATA_DIR was not set.  Defaulting to: $GIS_DATA_DIR"
fi  

export PGPORT=${PGPORT-5432}
export PGHOST=${PGHOST-'postgis-01'}
export PGUSER=${PGUSER-gis}
export PGDATABASE=${PGDATABASE-gis}
export PGPASSWORD=`grep $PGHOST:$PGPORT:.:$PGUSER ~/.pgpass | perl -pe 's/.*://'`
