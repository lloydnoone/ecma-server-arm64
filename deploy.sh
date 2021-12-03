# This script will be run as part of the pre-push git hook when pushing from master

SHA=$(git rev-parse HEAD)
branch="$(git rev-parse --abbrev-ref HEAD)"

if [ "$branch" = "master" ]; then
  echo "###### building server-test image ######"
  docker build -t spoonobi/server-test -f ./server/Dockerfile.dev  ./server # dev version has dependencies to run tests
  echo "###### running tests ######"
  echo "###### before committing to '"${branch}"' branch ######"
  docker run -e CI=true spoonobi/server-test npm test
fi

# if tests dont produce non zero exit code the build push and deploy
echo "##### building mutli-server-arm ######"
docker buildx build -t spoonobi/multi-server-arm:latest -t spoonobi/multi-server-arm:$SHA --platform linux/arm64 -f ./server/Dockerfile ./server

echo "##### pushing :latest and "$SHA" ######"
docker push spoonobi/multi-server-arm:latest
docker push spoonobi/multi-server-arm:$SHA

# log into remote and pipe in commands from here
#log in, apply k8s, update deployment image
echo "##### ssh, applying k8s, updating deployment image ######"
ssh lloyd@192.168.1.188 "kubectl apply -f development/ecmatrials/k8s && kubectl set image deployments/server-deployment server=spoonobi/multi-server-arm:"$SHA""