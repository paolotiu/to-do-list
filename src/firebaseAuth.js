import { start, reset } from './index'

function signIn() {
    //Sign into Firebase using popup auth & Google as the identity provider.
    let provider = new firebase.auth.GoogleAuthProvider()
    return firebase.auth().signInWithPopup(provider)
}

// Signs-out of Friendly Chat.
function signOut() {
    // Sign out of firebase
    firebase.auth().signOut()
}

// Initiate firebase auth.
function initFirebaseAuth() {
    //Listen to auth state changes.
    firebase.auth().onAuthStateChanged(authStateObserver)
}

// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
    // Return the user's profile pic URL.
    return firebase.auth().currentUser.photoURL
}

// Returns the signed-in user's display name.
function getUserName() {
    // Return the user's display name.
    return firebase.auth().currentUser.displayName
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
    // Return true if a user is signed-in.
    return !!firebase.auth().currentUser
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
    if (user) {
        // // User is signed in!
        // // Get the signed-in user's profile pic and name.
        let profilePicUrl = getProfilePicUrl()
        var userName = getUserName()
        signInButton.style.display = 'none'
        signOutButton.style.display = 'inline'
        userImage.style.backgroundImage = `url('${profilePicUrl}')`
        username.innerHTML = userName

        // // Set the user's profile pic and name.
        // userPicElement.style.backgroundImage =
        //     'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')'
        // userNameElement.textContent = userName
        // // Show user's profile and sign-out button.
        // userNameElement.removeAttribute('hidden')
        // userPicElement.removeAttribute('hidden')
        // signOutButtonElement.removeAttribute('hidden')
        // // Hide sign-in button.
        // signInButtonElement.setAttribute('hidden', 'true')
        // // We save the Firebase Messaging Device token and enable notifications.
        // saveMessagingDeviceToken()
    } else {
        signOutButton.style.display = 'none'
        signInButton.style.display = 'inline'
        userImage.style.backgroundImage = `url('https://cdn.pixabay.com/photo/2017/09/25/13/12/dog-2785074_960_720.jpg')`
        username.innerHTML = 'Guest'
        // // User is signed out!
        // // Hide user's profile and sign-out button.
        // userNameElement.setAttribute('hidden', 'true')
        // userPicElement.setAttribute('hidden', 'true')
        // signOutButtonElement.setAttribute('hidden', 'true')

        // // Show sign-in button.
        // signInButtonElement.removeAttribute('hidden')
    }
    start()
    reset()
}

function saveProject(project, id) {
    // Add a new message entry to the database
    return firebase
        .firestore()
        .collection('projects')
        .doc(id)
        .set({
            name: project.name,
            description: project.description,
            lists: [],
            id: project.id,
            uid: firebase.auth().currentUser.uid,
        })

        .catch((e) => {
            console.error('Error writing new message to data base', e)
        })
}

async function loadProjects() {
    let projects = []
    let query = await firebase.firestore().collection('projects').get()
    query.forEach((x) => {
        if (x.data().uid === firebase.auth().currentUser.uid) {
            projects.push(x.data())
        }
    })
    // // Start listening to the query
    // query.onSnapshot((snapshot) => {
    //     snapshot.docChanges().forEach((change) => {
    //         let data = change.doc.data()

    //         console.log(change.doc.id)
    //         return data
    //     })
    // })

    // console.log(doc.data())

    return projects
}

function saveList(id, projList) {
    const temp = projList.map((obj) => Object.assign({}, obj))

    firebase.firestore().collection('projects').doc(id).update({
        lists: temp,
    })
}

function deleteProjectFromDB(id) {
    firebase.firestore().collection('projects').doc(id).delete()
}

const signInButton = document.querySelector('#sign-in')
const signOutButton = document.querySelector('#sign-out')
const username = document.querySelector('.user-name')
const userImage = document.querySelector('.user-image')

signInButton.addEventListener('click', signIn)
signOutButton.addEventListener('click', signOut)
export {
    signIn,
    signOut,
    authStateObserver,
    initFirebaseAuth,
    saveProject,
    isUserSignedIn,
    loadProjects,
    saveList,
    deleteProjectFromDB,
}
