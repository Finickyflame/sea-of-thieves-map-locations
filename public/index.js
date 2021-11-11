document.querySelector(".search").addEventListener("input", ({currentTarget: {value}}) => {
    const searchString = new RegExp(value, "i");
    document.querySelectorAll(".location").forEach(({dataset: {name, type}, classList}) => {
        if (name.match(searchString) || type.match(searchString)) {
            classList.remove("hidden");
        }
        else {
            classList.add("hidden");
        }
    });
});