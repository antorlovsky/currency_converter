import {
    FIXER_API,
    FIXER_ACCESS_KEY,
    DEFAULT_BASE_CURRENCY,
    DEFAULT_TARGET_CURRENCY
} from "./defines.js";

import {
    showLoader,
    hideLoader,
    showError
} from "./ui.js";

let symbols = {};
let rates = {};

const fetchSymbols = async () => {
    const fixerURL = new URL(`${FIXER_API}symbols`);
    fixerURL.searchParams.append("access_key", FIXER_ACCESS_KEY);

    const symbolsRequest = new Request(fixerURL);
    const response = await fetch(symbolsRequest);
    const data = await response.json();

    if (data.success && data.symbols) {
        let items = Object.keys(data.symbols).map(key => [key, data.symbols[key]]);
        items.sort((a, b) => a[1].localeCompare(b[1]));
        
        symbols = {};
        for (let item of items) {
            symbols[item[0]] = data.symbols[item[0]];
        }

        const baseSelect = document.getElementById('base-select');
        const toSelect = document.getElementById('target-select');

        for (let [symbol, name] of Object.entries(symbols)) {
            let newBaseOption = new Option(
                name, symbol,
                symbol === DEFAULT_BASE_CURRENCY, symbol === DEFAULT_BASE_CURRENCY
            );
            baseSelect.add(newBaseOption, undefined);

            let newToOption = new Option(
                name, symbol,
                symbol === DEFAULT_TARGET_CURRENCY, symbol === DEFAULT_TARGET_CURRENCY
            );
            toSelect.add(newToOption, undefined);
        }
    }
    else {
        throw new Error(data.error.info || data.error.type);
    }
};

const fetchRates = async (base) => {
    const fixerURL = new URL(`${FIXER_API}latest`);
    fixerURL.searchParams.append("access_key", FIXER_ACCESS_KEY);
    fixerURL.searchParams.append("base", base);

    const ratesRequest = new Request(fixerURL);
    const response = await fetch(ratesRequest);
    const data = await response.json();

    if (data.success && data.rates) {
        rates = data.rates;

        const dateElement = document.getElementById("date");
        dateElement.innerText = new Date(data.timestamp * 1000).toUTCString();
    }
    else {
        throw new Error(data.error.info || data.error.type);
    }
};

const computeRate = () => {
    const baseInputElement = document.getElementById("base-input");
    const toInputElement = document.getElementById("target-input");
    const toSelectElement = document.getElementById("target-select");

    if (toSelectElement.value in rates) {
        if (baseInputElement.value >= 0) {
            let newValue = Number(baseInputElement.value) * rates[toSelectElement.value];
            toInputElement.value = newValue.toFixed(2);

            const rateElement = document.getElementById("rate");
            rateElement.innerText = `${rates[toSelectElement.value].toFixed(2)} ${symbols[toSelectElement.value]}`;
        }
    }
    else {
        throw new Error("Target rate doesn't exist. Need to reload latest rates.");
    }
};

const updateBaseTitle = (base) => {
    if (base in symbols) {
        const baseTitleElement = document.getElementById("base-title");
        
        baseTitleElement.innerText = `1 ${symbols[base]} equals`;
    }
    else {
        showError("Base rate doesn't exist. Need to reload symbols.")
    }
};

const onBaseInput = () => {
    try {
        computeRate();
    }
    catch(e) {
        showError(e);
    };
};

const onTargetInput = () => {
    const baseInputElement = document.getElementById("base-input");
    const toInputElement = document.getElementById("target-input");
    const toSelectElement = document.getElementById("target-select");

    if (toSelectElement.value in rates) {
        if (toInputElement.value >= 0) {
            let newValue = Number(toInputElement.value) / rates[toSelectElement.value];
            baseInputElement.value = newValue.toFixed(2);
        }
    }
    else {
        showError("Target rate doesn't exist. Need to reload latest rates.");
    }
};

const onBaseSelectChange = () => {
    const baseSelectElement = document.getElementById("base-select");

    showLoader();
    fetchRates(baseSelectElement.value)
        .then(() => {
            updateBaseTitle(baseSelectElement.value);
            computeRate();
            hideLoader();
        })
        .catch(e => showError(e));
};

const onTargetSelectChange = () => {
    try {
        computeRate()
    }
    catch(e) {
        showError(e);
    };
};

const onReloadBtnClick = () => {
    showLoader();
    document.getElementById("reload-btn").parentElement.style.display='none';
    loadApp();
};

const loadApp = () => {
    Promise.all([
        fetchSymbols(),
        fetchRates(DEFAULT_BASE_CURRENCY)
    ]).then(() => {
        updateBaseTitle(DEFAULT_BASE_CURRENCY);
        computeRate();
        hideLoader();
    }).catch((e) => {
        showError(e)
    });
};

window.loadApp = loadApp;
window.onBaseInput = onBaseInput;
window.onTargetInput = onTargetInput;
window.onBaseSelectChange = onBaseSelectChange;
window.onTargetSelectChange = onTargetSelectChange;
window.onReloadBtnClick = onReloadBtnClick;