## Description
A user can choose base and target currencies, enter amount in any of them and see the rate and the result of conversion.

`Fixer.io` provides the list of currencies sorted by their symbols. In this implementation this list firstly is sorted by names of currencies. It can be omitted if not needed. 

## Before start
You should initialize field `FIXER_ACCESS_KEY` in `src/defines.js` with your `access_key` to `Fixer.io API`

## How to run
#### 1. using WebStorm
    Run "index.html" 
#### 2. using console
    cd currency_converter
    npx http-server ./

## Errors
#### If you didn't provide `access_key` to `Fixer.io` you won't be able to use the app.
#### If your `access_key` to `Fixer.io` is attached to a free plan, you won't be able to select base currency. 