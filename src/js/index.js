document.addEventListener("DOMContentLoaded", function () {
    const inputForm = document.getElementById("inputBook");
    const searchForm = document.getElementById("searchbook");
    const uncompletedBookshelfList = document.getElementById("uncompleted");
    const completedBookshelfList = document.getElementById("completed");

    const STORAGE_KEY = "BOOKSHELF_APPS";

    function refreshData() {
        const books = getDataFromStorage();
        renderBooks(books);
    }

    function saveDataToStorage(books) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }

    function getDataFromStorage() {
        let books = [];
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            books = JSON.parse(storedData);
        }
        return books;
    }

    function renderBooks(books) {
        uncompletedBookshelfList.innerHTML = "";
        completedBookshelfList.innerHTML = "";

        books.forEach((book) => {
            const bookItem = createBookItem(book);

            if (book.isComplete) {
                completedBookshelfList.appendChild(bookItem);
            } else {
                uncompletedBookshelfList.appendChild(bookItem);
            }
        });
    }

    function createBookItem(book) {
        const bookItem = document.createElement("div");
        bookItem.classList.add("book");

        const bookDesc = document.createElement("div");
        bookDesc.classList.add("book-desc");
        bookDesc.innerHTML = `
            <h3>${book.title}</h3>
            <p>Penulis: <span>${book.author}</span></p>
            <p>Tahun: <span>${book.year}</span></p>
        `;
        bookItem.appendChild(bookDesc);

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button");

        const uncompletedButton = document.createElement("button");
        uncompletedButton.classList.add("uncompleted-button");
        uncompletedButton.setAttribute("title", "Belum Selesai Dibaca");
        uncompletedButton.innerHTML = `<i class="fas fa-book-open"></i>`;
        uncompletedButton.addEventListener("click", function () {
            toggleBookStatus(book.id);
        });
        buttonContainer.appendChild(uncompletedButton);

        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.setAttribute("title", "Hapus Buku");
        trashButton.addEventListener("click", function () {
            deleteBook(book.id);
        });
        buttonContainer.appendChild(trashButton);

        bookItem.appendChild(buttonContainer);

        return bookItem;
    }

    function addBook() {
        const bookTitle = document.getElementById("bookTitle").value;
        const bookAuthor = document.getElementById("bookAuthor").value;
        const bookYear = parseInt(document.getElementById("bookYear").value);
        const bookIsComplete = document.getElementById("bookIsComplete").checked;

        if (isNaN(bookYear) || bookYear < 0) {
            alert("Tahun harus berupa angka positif");
            return;
        }

        const newBook = {
            id: +new Date(),
            title: bookTitle,
            author: bookAuthor,
            year: bookYear,
            isComplete: bookIsComplete,
        };

        const books = getDataFromStorage();
        books.push(newBook);
        saveDataToStorage(books);

        refreshData();
        inputForm.reset();
    }

    function toggleBookStatus(bookId) {
        const books = getDataFromStorage();
        const index = books.findIndex((book) => book.id === bookId);
        books[index].isComplete = !books[index].isComplete;
        saveDataToStorage(books);

        refreshData();
    }

    function deleteBook(bookId) {
        const books = getDataFromStorage();
        const index = books.findIndex((book) => book.id === bookId);
        books.splice(index, 1);
        saveDataToStorage(books);

        refreshData();
    }

    inputForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });

    searchForm.addEventListener("input", function () {
        const keyword = searchForm.value.toLowerCase();
        const books = getDataFromStorage();

        const filteredBooks = books.filter((book) => {
            return (
                book.title.toLowerCase().includes(keyword) ||
                book.author.toLowerCase().includes(keyword) ||
                String(book.year).includes(keyword)
            );
        });

        renderBooks(filteredBooks);
    });

    refreshData();
});
