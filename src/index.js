import { appendElements } from './helper.js'
import { sidebar, getProjectFrom, showList } from './domhandler.js'
import {
    initFirebaseAuth,
    isUserSignedIn,
    saveProject,
    loadProjects,
    saveList,
    deleteProjectFromDB,
} from './firebaseAuth'
const signInButton = document.querySelector('#sign-in')

let allProjects = []
let firebaseProjs = null
function ID() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9)
}

initFirebaseAuth()
async function start() {
    if (isUserSignedIn()) {
        let x = await loadProjects()
        allProjects = x
    } else {
        if (localStorage.getItem('allProjects')) {
            allProjects = JSON.parse(localStorage.getItem('allProjects'))
        } else {
            localStorage.setItem('allProjects', JSON.stringify(allProjects))
            allProjects = JSON.parse(localStorage.getItem('allProjects'))
        }
    }
    makeExample()
    newProjectForm()
    addedProj()
}

class ToDoList {
    constructor(
        title,
        description,
        dueDate,
        priority = 1,
        notes = '',
        status = false
    ) {
        this.status = status
        this.title = title
        this.description = description
        this.dueDate = dueDate
        this.priority = priority
        this.notes = notes
    }
}

class Project {
    constructor(name, description) {
        this.name = name
        this.description = description
        this.lists = []
        this.id = ID()
        allProjects.push(this)
        if (!isUserSignedIn()) {
            localStorage.setItem('allProjects', JSON.stringify(allProjects))
        }
    }
}

function addList(project, list) {
    project.lists.push(list)

    if (!isUserSignedIn()) {
        localStorage.setItem('allProjects', JSON.stringify(allProjects))
    } else {
        saveList(project.id, project.lists)
    }
}

function deleteList(project, list) {
    let index = project.lists.indexOf(list)
    project.lists.splice(index, 1)
    if (!isUserSignedIn()) {
        localStorage.setItem('allProjects', JSON.stringify(allProjects))
    } else {
        saveList(project.id, project.lists)
    }
    showList(project)
}

function deleteProject(project) {
    if (!isUserSignedIn()) {
        allProjects.splice(allProjects.indexOf(project), 1)
        localStorage.setItem('allProjects', JSON.stringify(allProjects))
    } else {
        deleteProjectFromDB(project.id)
    }

    document.querySelector('#view').click()
    document.querySelector('#view').click()
    document.querySelector('.list').innerHTML = ''
}

function check(project) {
    return true
}

function newProjectForm() {
    const newProject = document.querySelector('#new-project')
    newProject.addEventListener('click', () => {
        const list = document.querySelector('.list')
        list.innerHTML = `
        <div class="new-project-form"
        <h2> New Project </h2>
            <form class="project-form">
                <input type="text" name="project-name" id="" placeholder="Project Name" required>
                <br>
                <input type="text" name="project-description" id="" placeholder="Project Description">
                <br>
                <input type="submit" id="submit-project" />
            </form>
        </div>
        `

        let submit = document.getElementById('submit-project')

        submit.addEventListener('click', (e) => {
            e.preventDefault()
            let data = getProjectFrom()
            let project = new Project(data.projectName, data.projectDescription)
            if (isUserSignedIn()) {
                saveProject(project, project.id)
            }
            showList(allProjects[allProjects.length - 1])
            addedProj()
            document.querySelector('#view').click()
        })
    })
}

function makeExample() {
    if (!allProjects.length) {
        const project = new Project('Example Project', 'This is an example')
        if (!isUserSignedIn()) {
            localStorage.setItem('allProjects', JSON.stringify(allProjects))
            addList(
                project,
                new ToDoList(
                    'Example List',
                    'Example Description',
                    '10-20-20',
                    3,
                    'Optional Notes',
                    false
                )
            )
            document.querySelector('#view').click()
            document.querySelector('.project-names').click()
        } else {
            saveProject(project, project.id).then((x) => {
                addList(
                    project,
                    new ToDoList(
                        'Example List',
                        'Example Description',
                        '10-20-20',
                        3,
                        'Optional Notes',
                        false
                    )
                )
                document.querySelector('#view').click()
                document.querySelector('.project-names').click()
            })
        }
    }
}
function addedProj() {
    sidebar(allProjects)

    if (!isUserSignedIn()) {
        localStorage.setItem('allProjects', JSON.stringify(allProjects))
    }
}

start()

function reset() {
    let node = document.querySelector('#view').classList.remove('show')
}

export { ToDoList, addList, deleteList, deleteProject, check, start, reset }
