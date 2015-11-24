# Dashboard4SAM

## Getting started

In order to initialize the project, you will have to install NodeJS for your platform of choice, 
followed by *Bower* and *Grunt*.<br>
After installing NodeJS make sure the *npm* executable is in your path and run the following command:

```
npm install -g bower grunt-cli
```

This will install the grunt and bower commandlet which you will require to orchestrate building process (Grunt) and 
download dependencies (Bower).

### Installing dependencies

Use either the init.bat or init.js file which will run:

```
bower install
npm install
```

## Building the project

Depending on your target environment use either:

Development environment:

```
grunt init-dev
grunt build-dev
```

Production environment:

```
grunt build-prod
```

