
# Get the docker image
docker pull quay.io/blockstack/blockstack-browser:feature_core-endpoints-disabled

# Extract some stuff
docker create quay.io/blockstack/blockstack-browser:feature_core-endpoints-disabled --name browser-container
docker cp browser_container:/src/blockstack-browser/build browser-build


# In the event of upgrading either the CORS Proxy or blockstackProxy.js, you'll need to figure that out manually,
#  sorry!
