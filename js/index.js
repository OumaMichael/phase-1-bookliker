document.addEventListener("DOMContentLoaded", function() {
    const bookList = document.querySelector("#list");
    const showPanel = document.querySelector("#show-panel");
    const currentUser = { id: 1, username: "pouros" };

    // Fetch and display books
    function fetchBooks() {
        fetch("http://localhost:3000/books")
            .then(res => res.json())
            .then(books => {
                books.forEach(book => renderBookListItem(book));
            });
    }

    function renderBookListItem(book) {
        const li = document.createElement("li");
        li.textContent = book.title;
        li.addEventListener("click", () => showBookDetails(book));
        bookList.appendChild(li);
    }

    function showBookDetails(book) {
        showPanel.innerHTML = `
            <h2>${book.title}</h2>
            <img src="${book.thumbnailUrl}" alt="${book.title}">
            <p>${book.description}</p>
            <ul id="users-list">
                ${book.users.map(user => `<li>${user.username}</li>`).join("")}
            </ul>
            <button id="like-button">${isUserInLikes(book.users) ? "Unlike" : "Like"}</button>
        `;

        document.querySelector("#like-button").addEventListener("click", () => toggleLike(book));
    }

    function isUserInLikes(users) {
        return users.some(user => user.id === currentUser.id);
    }

    function toggleLike(book) {
        let updatedUsers;
        if (isUserInLikes(book.users)) {
            updatedUsers = book.users.filter(user => user.id !== currentUser.id);
        } else {
            updatedUsers = [...book.users, currentUser];
        }

        fetch(`http://localhost:3000/books/${book.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ users: updatedUsers })
        })
        .then(res => res.json())
        .then(updatedBook => showBookDetails(updatedBook));
    }

    fetchBooks();
});
