# Installation instructions

## Prerequisites

Currently only tested under Ubuntu 15.10

## Installation Instructions



### Quick start - single dev machine - tiny map.

* Single development machine.
* One small neighborhood of map data.

instructions

    sudo apt-get install git ansible
    git clone git@github.com:forensiclogic/mapserver_osm_gis_analytics.git
    cd mapserver_osm_gis_analytics
    ansible-playbook -i ./ansible/hosts/hosts.minimal ./ansible/playbooks/mapserver_osm_gis_analytics.yaml

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

    ansible-playbook -s --vault-password-file ~/.vault_pass.txt --forks=8 -i ./ansible/hosts/hosts.3-tier ./ansible/playbooks/mapserver_osm_gis_analytics.yaml


