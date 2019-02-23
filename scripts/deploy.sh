rsync -arvz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" --rsync-path="sudo rsync" --delete-after --exclude=.git --exclude=lib --exclude=node_modules --delete-excluded --progress . hc2:/opt/sensor-net-data-api
read -p "Please enter the database password: " password
ssh hc2 "sudo echo \"PGPASSWORD=$password\" >> /opt/sensor-net-data-api/sensor-net-data-api-env"
ssh hc2 "cd /opt/sensor-net-data-api; PATH=\"/usr/local/lib/nodejs/node-v10.15.1-linux-armv6l/bin:\$PATH\" npm install --deployment"
ssh hc2 "cd /opt/sensor-net-data-api; PATH=\"/usr/local/lib/nodejs/node-v10.15.1-linux-armv6l/bin:\$PATH\" npm run build"
ssh hc2 "sudo rm /etc/systemd/system/sensor-net-data-api.* || true"
ssh hc2 "sudo ln -s /opt/sensor-net-data-api/sensor-net-data-api.service /etc/systemd/system"
ssh hc2 "sudo ln -s /opt/sensor-net-data-api/sensor-net-data-api.socket /etc/systemd/system"
ssh hc2 "sudo systemctl enable sensor-net-data-api.socket"
ssh hc2 "sudo systemctl reload-or-restart sensor-net-data-api.socket"
