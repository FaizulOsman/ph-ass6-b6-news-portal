/* Load Data For Categories */
const loadCategoryData = async () => {
    try {
        const res = await fetch(`https://openapi.programming-hero.com/api/news/categories`)
        const data = await res.json()
        category(8)
        return data.data.news_category
    } catch (error) {
        console.log(error)
    }
}

// Category Adding Function
const categories = async () => {
    const loadCategories = await loadCategoryData()
    const categorySection = document.getElementById('category-section')

    loadCategories.forEach(category => {
        const div = document.createElement('div')
        div.classList.add('mt-3')
        div.innerHTML = `
            <a style="cursor: pointer;" onclick="category(${category.category_id})"class="py-3 text-sm">${category.category_name}</a>
        `
        categorySection.appendChild(div)
    });
}
categories()


// News Display Dynamically
const category = async (id) => {
    spinner(true)
    const url = `https://openapi.programming-hero.com/api/news/category/0${id}`
    const res = await fetch(url)
    const data = await res.json()
    const newses = data.data
    const newsSection = document.getElementById('news-section')
    newsSection.innerHTML = ''

    // Count Category
    const countCategory = document.getElementById('count-category')
    countCategory.innerHTML = ` 
        <p><b>${newses.length > 0 ? newses.length + ' items found for this category.' : 'No News Found'}</b></p>
    `

    /* Sort By Section */
    const sortBy = document.getElementById('sort-by')
    if (sortBy.value == "view-count") {
        newses.sort((a, b) => {
            return b.total_view - a.total_view;
        });
    } else if (sortBy.value == "rating") {
        newses.sort((a, b) => {
            return b?.rating?.number - a?.rating?.number;
        });
    } else if (sortBy.value == "published-data") {
        newses.sort((a, b) => {
            return new Date(b.author?.published_date) - new Date(a.author?.published_date);
        });
    }

    // newses.sort((a, b) => {
    //     return b.total_view - a.total_view;
    // });

    /* Get Every News for Categories */
    newses.forEach(news => {
        const { author, thumbnail_url, title, details, total_view, _id } = news
        const { img, name, published_date } = author


        // Cooking News Card
        const div = document.createElement('div')
        div.classList.add("mt-5")
        div.innerHTML = `
            <div class="card card-side bg-base-100 shadow-xl p-4 flex flex-col md:flex-row justify-center">
                <figure class="w-1/2 md:w-1/6 mx-auto"><img class="rounded" src="${thumbnail_url}"
                        alt="Movie">
                </figure>
                <div class="card-body py-0 w-full md:w-5/6 pt-5 md:pt-0">
                    <h2 class="card-title">${title}</h2>
                    <p class="text-sm">${details.length > 300 ? details.slice(0, 300) + '...' : details}</p>
                    <div class="card-actions flex flex-col sm:flex-row justify-between items-center">
                        <div class="flex my-2">
                            <img class="w-10 rounded-full" src="${img}" />
                            <div class="pl-4">
                                <h5 class="font-semibold">${name === null || name === '' ? 'No Name Available' : name}</h5>
                                <p class="text-sm">${published_date === null ? 'No Published Date' : published_date}</p>
                            </div>
                        </div>
                        <div class="flex items-center my-2">
                            <i class="fa-regular fa-eye mr-3"></i>
                            <p>${total_view === null ? 'No View Available' : total_view}</p>
                        </div>
                        <div class="flex items-center my-2">
                            <span class="font-semibold mr-3">${news?.rating?.number}</span>
                            <i class="fa-regular fa-star-half-stroke"></i>
                            <i class="fa-regular fa-star"></i>
                            <i class="fa-regular fa-star"></i>
                            <i class="fa-regular fa-star"></i>
                            <i class="fa-regular fa-star"></i>
                        </div>
                        <div class=" my-2">
                            <label onclick="newsModal('${_id}')" for="my-modal-3" class="btn modal-button">
                                <i class="fa-solid fa-arrow-right"></i>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `
        newsSection.appendChild(div)
    })
    spinner(false)
}

// Modal Opening Function
const newsModal = async (idNumber) => {
    const res = await fetch(`https://openapi.programming-hero.com/api/news/${idNumber}`)
    const data = await res.json()
    const { total_view, details, thumbnail_url, title, author } = data.data[0]
    const { name, img, published_date } = author

    const modalBody = document.getElementById('modal-body')
    modalBody.innerHTML = `
        <div class="modal-box relative">
            <label for="my-modal-3" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
            <h3 class="text-lg font-bold pr-2">${title}</h3>
            <img class="mx-auto my-2" src="${thumbnail_url}">
            <p><b>Description: </b>${details.length > 300 ? details.slice(0, 300) + '...' : details}</p>
            <div class="py-4 flex flex-col sm:flex-row justify-between items-center">
                <div class="mt-3 flex flex-col justify-center">
                    <img class="w-10 rounded-lg mx-auto" src="${img}">
                    <h5 class="font-semibold">${name === null || name === '' ? 'No Name Available' : name}</h5>
                </div>
                <p class="mt-3">${total_view === null ? 'No View Available' : total_view}</p>
                <p class="mt-3">${published_date === null ? 'No Published Date' : published_date}</p>                               
            </div>
        </div>
    `
}

// Spinner Adding Function
const spinner = (isTrue) => {
    const spinnerDisplay = document.getElementById('spinner-display')
    if (isTrue === true) {
        spinnerDisplay.classList.remove('hidden')
    } else {
        spinnerDisplay.classList.add('hidden')
    }
}