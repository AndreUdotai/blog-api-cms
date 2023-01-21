
async function getData(url){
    const response = await fetch(url, {
        mode: 'cors',
        method: 'GET',
        withCredentials: true,
        credentials: 'omit',
        headers: {
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': 'null',
            Authorization:
                'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYzYjc3NmJmYTQ3ZTliMjZlOWYzM2U1OSIsInVzZXJuYW1lIjoibWFjbWlsbGVyIiwicGFzc3dvcmQiOiIkMmEkMTAkNnBMaU04UmxFaFdmdzUwZGFTS3l4dUtFQzNENnY3Y252Yi9tbmlZMENCd21aWldFb1p4NS4iLCJfX3YiOjB9LCJpYXQiOjE2NzMyOTYwNzZ9.mKcfDLi7i9ULynoVRCI3pJaM6nbr4mm74dIYdFks5pQ',
            'Content-Type': 'application/json',
        },
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

// The fetch function that will run when the page loads
// This function fetches the json data for the dashboard counter display
let dashboardDisplay = () => {
    // select the display node
    let display = document.getElementById('display');
    // Create a loader animation component
    let loaderElement = `<div class="h-100 d-flex align-items-center justify-content-center">
                      <div class="spinner-grow" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>`;
    // Set the display innerHTML to the loader animation
    display.innerHTML = loaderElement;

    getData('http://localhost:3000/api/dashboard')
        .then((data) => {
            let username = document.getElementById('username');
            username.innerText = data.authData.user.username;
            // Create the dashboard count component
            let dashboardComponent = `<div class="row p-3 m-5 rounded text-left" id="dashboard-display">
                                        <div class="col m-1 dashboard-items rounded p-5">
                                            <div class="h1" id="post-count">${data.results.post_count}</div>
                                            <div class="number-description">Total Posts</div>
                                        </div>
                                        <div class="col m-1 dashboard-items rounded p-5">
                                            <div class="h1" id="user-count">${data.results.user_count}</div>
                                            <div class="number-description">Total Users</div>
                                        </div>
                                        <div class="col m-1 dashboard-items rounded p-5">
                                            <div class="h1" id="comment-count">${data.results.comment_count}</div>
                                            <div class="number-description">Total Comments</div>
                                        </div>
                                    </div>`;
            // Set the innerHTML of the display element to show the dashbaordComponent
            display.innerHTML = dashboardComponent;
        });
};
// Invoke the dashboardDisplay function on page load
dashboardDisplay();



let fetchPosts = () => {
    getData('http://localhost:3000/api/posts')
        // .then((response) => response.json())
        .then((data) => {
            console.log(data.posts)
            // Select the username element and set it to the username from the authData
            let username = document.getElementById('username');
            username.innerText = data.authData.user.username;

            // Create a new Ul element that will contain the post list
            let postListContainer = document.createElement('ul');
            postListContainer.classList.add(
                'row',
                'p-3',
                'm-5',
                'rounded',
                'text-left',
            );
            postListContainer.setAttribute('id', 'post-list');

            // Loop over posts array
            for (let post of data.posts) {
                let postCapsule = document.createElement('div');

                // Set published status button display according to its value
                let publishStatus = post.published
                    ? 'Published'
                    : 'Unpublished';

                // Create the post list HTML component
                let postListComponent = `<li class='row align-items-center my-2'>
                                                    <div class='col'>${post.title}</div>
                                                    <div class='col d-grid gap-2 d-md-flex justify-content-md-end'>
                                                        <button
                                                            type='button'
                                                            class='btn btn-primary'
                                                            data-id='${post._id}'
                                                            data-value='${publishStatus}'
                                                            id='publishButton'
                                                        >
                                                            ${publishStatus}
                                                        </button>
                                                        <button type='button' class='btn btn-primary'>
                                                            Edit
                                                        </button>
                                                    </div>
                                                </li>
                                                <hr>`;

                // Embed the postListComponent inside post capsule element
                postCapsule.innerHTML = postListComponent;
                // Append post capsule on post list container for each iteration
                postListContainer.appendChild(postCapsule);
            }
            let display = document.getElementById('display');
            // Set the post list container as the only child of display node
            display.innerHTML = '';
            display.appendChild(postListContainer);
        });
};

// The post published status toggle function
// Takes the post id and the status to be changed to as arguments
let updatePublishedStatus = (id, status) => {
    // A post request to update the post of 'id' with a new status
    fetch(
        'http://localhost:3000/api/post/' + id + '/published/update/' + status,
        {
            mode: 'cors',
            method: 'POST',
            withCredentials: true,
            credentials: 'omit',
            headers: {
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Origin': 'null',
                Authorization:
                    'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYzYjc3NmJmYTQ3ZTliMjZlOWYzM2U1OSIsInVzZXJuYW1lIjoibWFjbWlsbGVyIiwicGFzc3dvcmQiOiIkMmEkMTAkNnBMaU04UmxFaFdmdzUwZGFTS3l4dUtFQzNENnY3Y252Yi9tbmlZMENCd21aWldFb1p4NS4iLCJfX3YiOjB9LCJpYXQiOjE2NzMyOTYwNzZ9.mKcfDLi7i9ULynoVRCI3pJaM6nbr4mm74dIYdFks5pQ',
                'Content-Type': 'application/json',
            },
        },
    )
};

// *******************************************************************************
// WHEN DASHBOARD BUTTON IS CLICKED
// *******************************************************************************

// Select the dashboard button
let dashboardButton = document.getElementById('dashboard');
// Add a click listener on the db button and call the dashbaordDisplay function
dashboardButton.addEventListener('click', () => dashboardDisplay());

// *******************************************************************************
// WHEN POST LIST BUTTON IS CLICKED
// *******************************************************************************

// Select the post-list button element from the DOM
let postListButton = document.getElementById('post-list');
// Add a click listener to the button and call the fetchPosts function
// to update the DOM with the posts list
postListButton.addEventListener('click', () => fetchPosts());

// *******************************************************************************
// WHEN PUBLISHED STATUS BUTTON OF A POST IS CLICKED
// *******************************************************************************

// Select the display element from the DOM
let display = document.getElementById('display');
// Add a click listener to the display node
display.addEventListener('click', (e) => {
    // Set a condition to target a child node with the data-id attribute
    // only published button has this attribute
    if (e.target.hasAttribute('data-id')) {
        // Set a condition to check innerText value, that is, the buttons name
        if (e.target.dataset.value === 'Published') {
            e.target.innerText = 'Unpublished';
            // Call the updatePublished function with supplied arguments
            updatePublishedStatus(e.target.dataset.id, 'false');
        } else {
            e.target.innerText = 'Published';
            updatePublishedStatus(e.target.dataset.id, 'true');
        }
    }
});
