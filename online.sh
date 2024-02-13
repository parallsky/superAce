cd node/
if [ ! -d "./webpages_back" ]; then
  echo 'no backdir'
  exit 0
fi

rm -rf ./webpages
mv webpages_back webpages

sysOS=`uname -s`
if [ "$sysOS" == "Darwin" ];then
  echo 'mac os'
  # nodemon
else
  echo 'other os'
  npm run apion
fi
