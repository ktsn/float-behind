#!/bin/sh

cd /vagrant/setup

yum update -y
rpm -ivh http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm
rpm -ivh http://rpms.famillecollet.com/enterprise/remi-release-6.rpm

# remove default MySQL
yum remove -y mysql

# stop apache
systemctl disable httpd
systemctl stop httpd

# install MariaDB
yum install -y mariadb-server
mv -f /etc/my.cnf.d/server.cnf /etc/my.cnf.d/server.cnf.bak
cp -f server.cnf /etc/my.cnf.d/server.cnf
systemctl enable mariadb.service
systemctl start mariadb.service

# create floatbehind user, database and tables
mysql -u root < init.sql

# install redis
yum --enablerepo=remi install -y redis
service redis start
chkconfig redis on

# install Node.js
echo "export NODEBREW_ROOT=/opt/nodebrew" > /etc/profile.d/nodebrew.sh
echo "export PATH=/opt/nodebrew/current/bin:$PATH" >> /etc/profile.d/nodebrew.sh
source /etc/profile.d/nodebrew.sh
curl -L git.io/nodebrew | perl - setup
nodebrew install-binary v5.3.0
nodebrew use v5.3.0
nodebrew alias default v5.3.0
