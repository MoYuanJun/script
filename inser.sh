# 福州数据：
dbFile_mysql='/home/qianyin/Company/资料/fz_maintenance_test_data/maintenance.sql'
dbDataUrl_mongo='/home/qianyin/Company/资料/fz_maintenance_test_data/maintenance'

# 龙岩数据
# dbFile_mysql='/home/qianyin/Company/资料/龙岩数据备份/mysql.sql'
# dbDataUrl_mongo='/home/qianyin/Company/资料/龙岩数据备份/maintenance'

# 容器ID
mysql='9df565960bcc'
mongo='b038a425940f'

# mysql
sudo docker cp $dbFile_mysql $mysql:/root/mysql.sql
sudo docker exec $mysql bash -c 'mysql -uroot -pemsoft maintenance < /root/mysql.sql'
sudo docker exec $mysql bash -c 'rm -rf /root/*'

# mongo
sudo docker cp $dbDataUrl_mongo $mongo:/root/maintenance
sudo docker exec $mongo bash -c 'mongorestore --drop -d maintenance /root/maintenance'
sudo docker exec $mongo bash -c 'rm -rf /root/*'


echo '脚本结束'

