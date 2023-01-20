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
    // Fetch the user, comment and post counts
    fetch('http://localhost:3000/api/dashboard', {
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
    })
        .then((response) => response.json())
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

// Click listener on dashboard button to display the dashbaord counters
let dashboardButton = document.getElementById('dashboard');
dashboardButton.addEventListener('click', () => dashboardDisplay());

// When Post list button is clicked
let postListButton = document.getElementById('post-list');
postListButton.addEventListener('click', () => {
    // Fetch all the posts
    fetch('http://localhost:3000/api/posts', {
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
    })
        .then((response) => response.json())
        .then((data) => {
            // Select the username element and set it to the username from the authData
            let username = document.getElementById('username');
            username.innerText = data.authData.user.username;

            // Create a new Ul element that will contain the post list
            let postListContainer = document.createElement('ul');
            postListContainer.classList.add("row", "p-3", "m-5", "rounded", "text-left");
            postListContainer.setAttribute("id", "post-list");

            // Loop over posts array
            for(let post of data.posts) {
                let postCapsule = document.createElement('div');

                // Set published status button display according to its value
                let publishStatus = post.published ? 'Published' :"Unpublished";

                // Create the post list HTML component
                let postListComponent = `<li class='row align-items-center my-2'>
                                            <div class='col'>${post.title}</div>
                                            <div class='col d-grid gap-2 d-md-flex justify-content-md-end'>
                                                <button
                                                    type='button'
                                                    class='btn btn-primary'
                                                    data-id='${post._id}'
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
});

let display = document.getElementById('display');
display.addEventListener('click', (e) => {
    if(e.target.hasAttribute('data-id')){
        console.log(e.target.dataset.id)
    }
})