#!/bin/sh

if [ ! -v INSTALL_DIR ]; then
   export INSTALLDIR=$HOME/tmp/installdir
   echo "INSTALL_DIR was not set. Defaulting to: $INSTALLDIR"
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
export PGHOST=${PGHOST-localhost}
export PGUSER=${PGUSER-gis}
export PGDATABASE=${PGDATABASE-gis}

