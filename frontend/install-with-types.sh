# chmod +x install-with-types.sh
npm install $1
npx typesync
npm install
