
const generateBtn = document.getElementById("generatorBtn");
const userCard = document.getElementById("userCard");
const message = document.getElementById("myMessage");
const themeBtn = document.getElementById("themedbtn");
const favList = document.getElementById("favList");
const myFavId = document.getElementById("myFavId");

let favoriteUsers = JSON.parse(
    localStorage.getItem("favoriteUsers") || "[]"
);

function setTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);
    themeBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
}

setTheme(localStorage.getItem("theme") === "dark");

themeBtn.addEventListener("click", function () {
    const isDark = !document.body.classList.contains("dark-mode");
    setTheme(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

generateBtn.addEventListener("click", getRandomUsers);

async function getRandomUsers() {
    generateBtn.disabled = true;
    message.textContent = "Loading users...";
    userCard.replaceChildren();

    try {
        const count = document.getElementById("userCount").value;
        const gender = document.getElementById("genderFilter").value;
        const nationality = document.getElementById("nationalityFilter").value;

        let url = `https://randomuser.me/api/?results=${count}`;

        if (gender) url += `&gender=${gender}`;
        if (nationality) url += `&nat=${nationality}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Network error. Please try again.");
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error("No users were returned.");
        }

        data.results.forEach(user => displayUser(user, userCard, false));
        message.textContent = `${data.results.length} user(s) generated successfully.`;
    } catch (error) {
        message.textContent = error.message || "Something went wrong.";
    } finally {
        generateBtn.disabled = false;
    }
}

function displayUser(user, container, isFavorite) {
    const card = document.createElement("div");
    card.className = "user-profile";

    const photo = document.createElement("img");
    photo.src = user.picture.large;
    photo.alt = `Photo of ${user.name.first}`;

    const name = document.createElement("h3");
    name.textContent = `${user.name.title} ${user.name.first} ${user.name.last}`;

    const info = document.createElement("div");
    info.className = "user-info";

    const details = [
        ["Email", user.email],
        ["Gender", user.gender],
        ["Age", user.dob.age],
        ["Phone", user.phone],
        ["Country", user.location.country],
        ["City", user.location.city]
    ];

    details.forEach(([label, value]) => {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = label + ": ";

        const span = document.createElement("span");
        span.textContent = value ?? "Not available";

        p.append(strong, span);
        info.appendChild(p);
    });

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const favoriteBtn = document.createElement("button");
    favoriteBtn.type = "button";

    if (isFavorite) {
        favoriteBtn.textContent = "❌ Remove Favorite";
        favoriteBtn.className = "remove-favorite-btn";

        favoriteBtn.addEventListener("click", function () {
            removeFavorite(user.email);
        });
    } else {
        const alreadySaved = favoriteUsers.some(
            savedUser => savedUser.email === user.email
        );

        favoriteBtn.textContent = alreadySaved
            ? "❤️ Already Favorite"
            : "❤️ Add to Favorites";

        favoriteBtn.className = "favourite-btn";
        favoriteBtn.disabled = alreadySaved;

        favoriteBtn.addEventListener("click", function () {
            addFavorite(user);
        });
    }

    actions.appendChild(favoriteBtn);
    card.append(photo, name, info, actions);
    container.appendChild(card);
}

function addFavorite(user) {
    const alreadySaved = favoriteUsers.some(
        savedUser => savedUser.email === user.email
    );

    if (alreadySaved) return;

    favoriteUsers.push(user);

    localStorage.setItem(
        "favoriteUsers",
        JSON.stringify(favoriteUsers)
    );

    renderFavorites();
    userCard.replaceChildren();
    message.textContent = "❤️ User added to favorites!";
}

function removeFavorite(email) {
    favoriteUsers = favoriteUsers.filter(
        user => user.email !== email
    );

    localStorage.setItem(
        "favoriteUsers",
        JSON.stringify(favoriteUsers)
    );

    renderFavorites();
    message.textContent = "Favorite removed.";
}

function renderFavorites() {
    favList.replaceChildren();

    myFavId.textContent = favoriteUsers.length
        ? `${favoriteUsers.length} favorite user(s) saved.`
        : "Your favourite profiles will appear here.";

    favoriteUsers.forEach(user => {
        displayUser(user, favList, true);
    });
}

renderFavorites();
