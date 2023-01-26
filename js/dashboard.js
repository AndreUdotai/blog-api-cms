// *******************************************************************************
// UI COMPONENT GENEREATOR FUNCTIONS
// *******************************************************************************
// Function to generate USERS LIST COMPONENT
let generateUsersListComponent = (username) => {
    return `<li class="row align-items-center my-2">
                <p class="col rounded">${username}</p>
                <div class="col d-grid gap-2 d-md-flex justify-content-md-end">
                    <button type="button" class="btn btn-primary">Edit</button>
                </div>
            </li>
            <hr>`;
};

// Function to generate DASHBOARD COUNTS COMPONENT
let generateDashboardComponent = (count1, count2, count3) => {
    return `<div class="row p-3 m-5 rounded text-left" id="dashboard-display">
                <div class="col m-1 dashboard-items rounded p-5">
                    <div class="h1" id="post-count">${count1}</div>
                    <div class="number-description">Total Posts</div>
                </div>
                <div class="col m-1 dashboard-items rounded p-5">
                    <div class="h1" id="user-count">${count2}</div>
                    <div class="number-description">Total Users</div>
                </div>
                <div class="col m-1 dashboard-items rounded p-5">
                    <div class="h1" id="comment-count">${count3}</div>
                    <div class="number-description">Total Comments</div>
                </div>
            </div>`;
};

// Function to generate the POST LIST COMPONENT
let generatePostListComponent = (title, id, publishStatus) => {
    return `<li class='row align-items-center my-2'>
                <div class='col'>${title}</div>
                <div class='col d-grid gap-2 d-md-flex justify-content-md-end'>
                    <button
                        type='button'
                        class='btn btn-primary'
                        data-id='${id}'
                        data-value='${publishStatus}'
                        id='publishButton'
                    >
                        ${publishStatus}
                    </button>
                    <button type='button' class='btn btn-primary' data-edit='${id}'>
                        Edit
                    </button>
                </div>
            </li>
            <hr>`;
};

// Function to generate the LOADING ANIMATION COMPONENT
let generateLoadingComponent = () => {
    return `<div class="h-100 d-flex align-items-center justify-content-center">
                <div class="spinner-grow" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>`;
};

// Function to generate the NEW POST FORM COMPONENT
let generateNewPostComponent = (id) => {
    return `<form class="col-10 mx-auto mt-2 p-4 rounded" id="new-post">
                <div class="mb-3">
                    <label for="title" class="form-label">Title</label>
                    <input type="text" class="form-control" id="title" aria-describedby="emailHelp">
                </div>
                <div class="mb-3">
                    <label for="content" class="form-label">Post</label>
                    <textarea class="form-control" id="content" rows="15"></textarea>
                </div>
                <button type="button" class="btn btn-primary" id="submitPost" data-post="submit">Submit</button>
                <button type="button" class="btn btn-primary" id="updatePost" data-postid="${id}" data-update="update">Update</button>
            </form>`;
};

// *******************************************************************************
// FETCH FUNCTIONS
// *******************************************************************************

// General fetch function to call fetch() taking the url and the fetch method as arguments
async function getData(url, method, data) {
    const response = await fetch(url, {
        mode: 'cors',
        method: method,
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
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data),
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

// The fetch function that will run when the page loads
// This function fetches the json data for the dashboard counter display
let fetchCounts = () => {
    // select the display node
    let display = document.getElementById('display');

    // Set the display innerHTML to the loading animation component
    display.innerHTML = generateLoadingComponent();

    getData('http://localhost:3000/api/dashboard', 'GET').then((data) => {
        // Display the username of the logged in User
        displayUsername(data.authData.user.username);

        // Embed the dashboardComponent inside display node
        display.innerHTML = generateDashboardComponent(
            data.results.post_count,
            data.results.user_count,
            data.results.comment_count,
        );
    });
};
// Invoke the dashboardDisplay function on page load
fetchCounts();

// Display the username of the logged in user
let displayUsername = (username) => {
    let usernameDisplay = document.getElementById('username');
    return (usernameDisplay.innerText = username);
};

// the fetchPosts function to retrieve all the posts from the DB
let fetchPosts = () => {
    getData('http://localhost:3000/api/posts', 'GET')
        // .then((response) => response.json())
        .then((data) => {
            // Display the username of the logged in User
            displayUsername(data.authData.user.username);

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
                // Create a div to hold the looped data
                let postCapsule = document.createElement('div');

                // Set published status button display according to its value
                let publishStatus = post.published
                    ? 'Published'
                    : 'Unpublished';

                // Embed the postListComponent inside post capsule element
                postCapsule.innerHTML = generatePostListComponent(
                    post.title,
                    post._id,
                    publishStatus,
                );
                // Append post capsule on post list container for each iteration
                postListContainer.appendChild(postCapsule);
            }
            let display = document.getElementById('display');
            // Set the post list container as the only child of display node
            display.innerHTML = '';
            display.appendChild(postListContainer);
        });
};

// The fetch Users function to retrieve all the users from the DB
let fetchUsers = () => {
    getData('http://localhost:3000/api/users', 'GET').then((data) => {
        // Display the username of the logged in User
        displayUsername(data.authData.user.username);

        // Create a new Ul element that will contain the users list
        let usersListContainer = document.createElement('ul');
        usersListContainer.classList.add(
            'row',
            'p-3',
            'm-5',
            'rounded',
            'text-left',
        );
        usersListContainer.setAttribute('id', 'post-list');

        // Loop over users array
        for (let user of data.users) {
            // Create a div to hold the looped data
            let userCapsule = document.createElement('div');

            // Embed the usersListComponent inside user capsule element
            userCapsule.innerHTML = generateUsersListComponent(user.username);
            // Append user capsule on users list container for each iteration
            usersListContainer.appendChild(userCapsule);
        }
        let display = document.getElementById('display');
        // Set the user list container as the only child of display node
        display.innerHTML = '';
        display.appendChild(usersListContainer);
    });
};

// The fetch Blog Post function to retrieve a single blog post with a provided ID from the DB
let fetchBlogPost = (postID) => {
    // Call the getData function to initiate a get request to retrieve the details of the post
    let url = 'http://localhost:3000/api/post/' + postID + '/update';
    getData(url, 'GET').then((data) => {
        // Create a new div element that will contain the edit post form
        let editPostContainer = document.createElement('div');
        editPostContainer.classList.add('row', 'p-3');
        // Set the innerHTML of the new div to be the new post component
        // Edit post form will re-use the new post component
        editPostContainer.innerHTML = generateNewPostComponent();
        display.innerHTML = '';
        display.appendChild(editPostContainer);
        // Insert the values of the title and content of the retrieved post from the returned data from the API call
        // Note: these variables are created from the ids in the new post component
        let postTitle = document.getElementById('title');
        let postContent = document.getElementById('content');

        postTitle.value = data.post.title;
        postContent.value = data.post.post;
        // Select the submit post button and hide it
        let submitPostButton = document.getElementById('submitPost');
        submitPostButton.style.display = 'none';
        let updatePostButton = document.getElementById('updatePost');
        updatePostButton.dataset.postid = data.post._id;
    });
};

// The post published status toggle function
// Takes the post id and the status to be changed to as arguments
let updatePublishedStatus = (id, status) => {
    let url =
        'http://localhost:3000/api/post/' + id + '/published/update/' + status;
    // Call the getData function to initiate a post request to update the post of 'id' with a new 'status'
    getData(url, 'POST');
    fetchPosts();
};

// The display new post form function
let displayNewPostForm = () => {
    // Create a new div element that will contain the new post form
    let newPostContainer = document.createElement('div');
    newPostContainer.classList.add('row', 'p-3');
    newPostContainer.innerHTML = generateNewPostComponent();
    display.innerHTML = '';
    display.appendChild(newPostContainer);
    // Select the update post button and hide it
    let updatePostButton = document.getElementById('updatePost');
    updatePostButton.style.display = 'none';
};

// Submit blog post function
let submitBlogPost = () => {
    // Selet the input fields
    let title = document.getElementById('title');
    let content = document.getElementById('content');

    // Initializing a post object from entered data by the admin
    let blogPostData = {
        title: title.value,
        post: content.value,
    };

    // Clear post form after submission
    title.value = '';
    content.value = '';

    // Call the getData function to initiate a post request to send the new blog post
    let url = 'http://localhost:3000/api/post/create';
    getData(url, 'POST', blogPostData).then((data) => {
        if (data.errors) {
            title.value = `${data.post.title}`;
            content.value = `${data.post.post}`;
        } else {
            // Call the fetchPosts function to display all the posts
            fetchPosts();
        }
    });
};

// Update blog post function
let updateBlogPost = (postID) => {
    // Selet the input fields
    let title = document.getElementById('title');
    let content = document.getElementById('content');

        // Initializing a post object from entered data by the admin
        let blogPostData = {
            title: title.value,
            post: content.value,
        };

        // Clear post form after submission
        title.value = '';
        content.value = '';

    // Call the getData function to initiate a post request to update the blog post
    let url = 'http://localhost:3000/api/post/' + postID + '/update'; 
    getData(url, 'POST', blogPostData).then((data) => {
        if (data.errors) {
            title.value = `${data.post.title}`;
            content.value = `${data.post.post}`;
        } else {
            // Call the fetchPosts function to display all the posts
            fetchPosts();
            // console.log(data);
        }
    });
};

// *******************************************************************************
// CLICK EVENT LISTENERS
// *******************************************************************************

// WHEN DASHBOARD BUTTON IS CLICKED
// Select and add a click event listener on the dashboard button to display counts
let dashboardButton = document.getElementById('dashboard');
dashboardButton.addEventListener('click', () => fetchCounts());

// WHEN POST LIST BUTTON IS CLICKED
// Select and add a click event listener on the post list button to display posts
let postListButton = document.getElementById('post-list');
postListButton.addEventListener('click', () => fetchPosts());

// WHEN PUBLISHED STATUS BUTTON OF A POST IS CLICKED
// Select and add a click event listener on the publish status button to update published status
let display = document.getElementById('display');
display.addEventListener('click', (e) => {
    // Set a condition to target a child node with the data-id attribute (only published button has this attribute)
    if (e.target.hasAttribute('data-id')) {
        console.log(e.target.innerText);
        // Set a condition to check innerText value, that is, the buttons name
        if (e.target.dataset.value === 'Published') {
            // Call the updatePublished function with supplied arguments
            updatePublishedStatus(e.target.dataset.id, 'false');
        } else {
            updatePublishedStatus(e.target.dataset.id, 'true');
        }
    }
});

// WHEN USERS LIST BUTTON IS CLICKED
// Select and add a click event listener on the users list button to display users
let usersList = document.getElementById('users-list');
usersList.addEventListener('click', () => fetchUsers());

// WHEN NEW POST BUTTON IS CLICKED
// Select and add a click event listener on the new post button to display the post form
let newPost = document.getElementById('new-post');
newPost.addEventListener('click', () => displayNewPostForm());

// SELECT THE DISPLAY ELEMENT FOR EVERY CLICK LISTENER ON GENERATED DOM ELEMENT BUTTONS
let displayNode = document.getElementById('display');

// WHEN THE POST SUBMIT BUTTON IS CLICKED
// Select and add a click event listern on the post submit button
// Only the post submit button has a dataset value of post
displayNode.addEventListener('click', (e) => {
    if (e.target.dataset.post) {
        submitBlogPost();
    }
});

// WHEN THE POST EDIT BUTTON IS CLICKED
// Display the edit form with the title and post
// Only the edit button has a dataset value of edi
displayNode.addEventListener('click', (e) => {
    if (e.target.dataset.edit) {
        fetchBlogPost(e.target.dataset.edit);
    }
});

// WHEN THE POST UPDATE BUTTON IS CLICKED
// Select and add a click event listener on the update button to upate the post
// Only the update button as a dataset value of postid
displayNode.addEventListener('click', (e) => {
    if (e.target.dataset.postid) {
        updateBlogPost(e.target.dataset.postid);
    }
});
