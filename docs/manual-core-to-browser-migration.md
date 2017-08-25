# Manually transfer a name from core to portal

This guide assumes you have the latest mac app installed (v0.10.0 as of writing),
you've created a new profile in the Profiles app that doesn't have any username
associated with it.

## Preparation

You'll need to collect the following information:

1. Profile address to transfer name to
2. Core API password

### Profile address

This is the address that is displayed on a profile that doesn't have a username
associated with it. Copy this address to an easily accessible place.

### Core API password

1. Option-Click on the Blockstack icon in your menu bar.
2. Click "Enable Development Mode"
3. Click on the Blockstack icon in your menu bar.
4. Click "Copy Core API Password"
5. Put this in an easily accessible place.
6. Option-Click on the Blockstack icon in your menu bar to disable.

## Sanity checks

Going forward, you'll need to enter commands in your Terminal app. If you're
not comfortable doing this, you should ask a friend for help.

You'll want to replace the strings `INSERT_CORE_PASSWORD_HERE` with the Core API
password you made note of in the previous step.

### Make sure Core is running

Let's make sure your Blockstack Core installation is functioning properly and
can reach the Blockstack Core full node it is configured to use.

Run the following command:

`/tmp/blockstack-venv/bin/blockstack --debug --config ~/Library/Application\ Support/Blockstack/config/client.ini -y ping`

You should see output similar to the following:

```JSON
{
    "advanced_mode": false,
    "cli_version": "0.14.2.0",
    "consensus_hash": "eaf32321a1e28843bae74c1fc99c3e98",
    "last_block_processed": 469296,
    "last_block_seen": 469302,
    "server_alive": true,
    "server_host": "node.blockstack.org",
    "server_port": 6264,
    "server_version": "0.14.1.5"
}
```
The exact block numbers, consensus hash and version numbers will be different.

### Confirm Core wallet really owns your name

Next, we'll check to make sure the name you are trying to transfer is really
owned by your Core wallet.

Run the following command replacing `INSERT_CORE_PASSWORD_HERE` with your
Core API password from earlier:

`/tmp/blockstack-venv/bin/blockstack --debug --config ~/Library/Application\ Support/Blockstack/config/client.ini -y --api_password INSERT_CORE_PASSWORD_HERE --password INSERT_CORE_PASSWORD_HERE names`

You should see output similar to the following with the name you'd like to
transfer in the place of `yourname.id`:

```JSON
{
    "addresses": [
        {
            "address": "33GcdiK7JxuNX8NCQTvVh58dZEKW2ym7Hp",
            "names_owned": ["yourname.id"]
        }
    ],
    "names_owned": ["yourname.id"]
}
```

If the name you'd like to transfer isn't listed, this means your current
Core wallet doesn't own the name and you won't be able to continue.

## Transferring the name

Now that we've made sure Blockstack Core is running properly on your computer and
your Core wallet does in fact own the name you'd like to transfer, the final
step is to transfer the name.

Please double check the address you're transferring it to. There's no way to
recovery your name if you send it to an address you don't control.

Run the following command replacing `INSERT_CORE_PASSWORD_HERE` with your
Core API password:

`/tmp/blockstack-venv/bin/blockstack --debug --config ~/Library/Application\ Support/Blockstack/config/client.ini -y --api_password INSERT_CORE_PASSWORD_HERE --password INSERT_CORE_PASSWORD_HERE transfer`

You will be prompted to enter the address you'd like to transfer the name to.

If everything succeeds, you'll see a message similar to the following:

```JSON
{
  "message": "Name queued for transfer. The process takes ~1 hour. You can check the status with blockstack info.",
  "success": true,
  "transaction_hash": "fc271325db"
}
```

You can look up the `transaction_hash` value at https://explorer.blockstack.org
to make sure the transaction has been broadcast to the Bitcoin network.

It will take a couple hours for the name to appear in your Profiles app.
