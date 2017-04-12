# up
An upvoting system

## Installing

### Clone the repo

```bash
git clone git@github.com:lukewegryn/up.git
```

### Install dependencies

```
brew upgrade node
brew upgrade npm
cd up/up
npm install
```

### Setup MongoDB

#### Download MongDB using Homebrew

```bash
brew update
brew install mongodb
```

#### Create the data directory

**Note: You will likely need to use sudo**

```
mkdir -p /data/db
chown $(whoami) /data/db
```

#### Start the database

```bash
mongod
```

## Start `up`

```bash
npm start
```
