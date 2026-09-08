#!/bin/sh
# Sync order-watch runtime to launchd-accessible dir (TCC blocks ~/Desktop for launchd).
# Run after any edit to order_watch.py or fulfillment_map.json.
cd "$(dirname "$0")"
D="$HOME/.config/vhyral/te_flywheel"
mkdir -p "$D"
cp order_watch.py fulfillment_map.json "$D/"
grep -e "^STRIPE_SECRET_KEY" -e "^SMTP_" ../.env.local > "$D/te_env"
launchctl bootout gui/501/com.te.orderwatch 2>/dev/null
launchctl bootstrap gui/501 "$HOME/Library/LaunchAgents/com.te.orderwatch.plist"
sleep 3
launchctl list | grep te.orderwatch && echo SYNCED
tail -2 /tmp/te_orderwatch.log
