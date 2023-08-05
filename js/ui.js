export const showLoader = () => {
    document.getElementById("loader").style.display = "block";
    document.getElementById("main").style.display = "none";
};

export const hideLoader = () => {
    document.getElementById("loader").style.display = "none";
    document.getElementById("main").style.display = "block";
};

export const showError = (message) => {
    hideLoader();

    document.getElementById("error").style.display = "flex";
    document.getElementById("main").style.display = "none";
    document.getElementById("error-text").innerText = message;
};