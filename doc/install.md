# Installation instructions

## Prerequisites

Currently only tested under Ubuntu 15.10

## Installation Instructions



### Quick start - single dev machine - tiny map.

* Single development machine.
* One small neighborhood of map data.

* instructions:

    cd
    git clone git@github.com:forensiclogic/mapserver_osm_gis_analytics.git
    mapserver_osm_gis_analytics/bin/install_all


### Less quick start (3-tiered architecture)

* Load balanced 3-tiered architecture.
* Full planet of map data (warning - takes days to load)

instructions

    sudo apt-get install git ansible
    git clone git@github.com:forensiclogic/mapserver_osm_gis_analytics.git
    cd mapserver_osm_gis_analytics

    [
       edit ./ansible/hosts/hosts.3-tier
       and set appropriate IP addresses or Hostnames
       for the machines 
    ]

    ansible-playbook -i ~/mapserver_osm_gis_analytics/ansible/hosts.3-tier ~/mapserver_osm_gis_analytics/ansible/playbooks/install_mapserver_osm_gis_analytics.yaml 

# And to load map data.

    nohup env PGUSER=gis PGHOST=localhost PGDATABASE=gis_planet mapserver_osm_gis_analytics/bin/load_spatial_data --load-osm-data=planet &> planet.out &


--------------------------------------------------------------------------------


Copy&paste of each command to create an environment on 2017-01-04: 


     bin/create_azure_environment --environment=3-tier --resource-group=maps-prod-7  --azure-acct='Microsoft Azure Sponsorship'


     ssh gisadmin@[the-admin-machine]
     ssh-keygen
     sudo apt-get install git ansible

     mkdir ~/.ansible
     cp mapserver_osm_gis_analytics/ansible/hosts.small  ~/.ansible/hosts
     ./mapserver_osm_gis_analytics/bin/install_all


    ### on the database servers:

    git clone https://github.com/Azure/azure-quickstart-templates
    sudo bash azure-quickstart-templates/shared_scripts/ubuntu/vm-disk-utils-0.1.sh -s
    #  [ assume that created /datadisks/disk1 ]
    sudo service postgresql stop
    sudo mv /var/lib/postgresql /datadisks/disk1
    sudo ln -s /datadisks/disk1/postgresql /var/lib/postgresql
    sudo mkdir /datadisks/disk1/gisdata
    sudo ln -s /datadisks/disk1/gisdata /mnt/gisdata
    sudo chmod a+w /mnt/gisdata/.
    sudo service postgresql start

    sudo mkdir /mnt/swap
    sudo dd if=/dev/zero of=/mnt/swap/40GB bs=1M count=40480
    sudo chown root:root /mnt/swap/40GB
    sudo chmod 0600 /mnt/swap/40GB
    sudo mkswap /mnt/swap/40GB
    sudo swapon /mnt/swap/40GB

    git clone git@github.com:forensiclogic/mapserver_osm_gis_analytics.git
    nohup env PGUSER=gis PGHOST=localhost PGDATABASE=gis_planet mapserver_osm_gis_analytics/bin/load_spatial_data --load-osm-data=planet &> planet.out &
