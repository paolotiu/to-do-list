import { appendElements } from './helper.js'
import { sidebar, getProjectFrom, showList } from './domhandler.js'

let allProjects = []
if (localStorage.getItem('allProjects')){
    allProjects = JSON.parse(localStorage.getItem('allProjects'))
    
}
else{ 
    localStorage.setItem('allProjects', JSON.stringify(allProjects))
    allProjects = JSON.parse(localStorage.getItem('allProjects'))
    
}

class ToDoList {
    constructor(title, description, dueDate, priority=1, notes = '',status=false) {
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
        allProjects.push(this)
        localStorage.setItem('allProjects', JSON.stringify(allProjects))
    }

    
    
}

function addList(project, list){
    project.lists.push(list)
    localStorage.setItem('allProjects', JSON.stringify(allProjects))
}

function deleteList(project,list){
    let index = project.lists.indexOf(list)
    project.lists.splice(index, 1)
    localStorage.setItem('allProjects', JSON.stringify(allProjects))
}

function deleteProject(project){
    allProjects.splice(allProjects.indexOf(project), 1)
    localStorage.setItem('allProjects', JSON.stringify(allProjects))
    document.querySelector('#view').click()
    document.querySelector('#view').click()
    document.querySelector('.list').innerHTML = ''
}

function check(project){
    if(allProjects.includes(project)){
        return true
    }
    else{
        return false
    }
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
                <input type="submit" name="submit-project" id="submit-project">
            </form>
        </div>
        `

        let submit = document.getElementsByName('submit-project')[0]

        submit.addEventListener('click', () => {
            let data = getProjectFrom()
            new Project(data.projectName, data.projectDescription)
            
            showList(allProjects[allProjects.length - 1])
            addedProj()
            document.querySelector('#view').click()
        })
    })
}


newProjectForm()
addedProj()

if(!allProjects.length){
    addList(new Project('Example Project', 'This is an example'), new ToDoList('Example List', "Example Description", "10-20-20", 3, 'Optional Notes', false))  
    
    localStorage.setItem('allProjects', JSON.stringify(allProjects))
    document.querySelector('#view').click()
    document.querySelector('.project-names').click()
}

function addedProj() {
    sidebar(allProjects)

    localStorage.setItem('allProjects', JSON.stringify(allProjects))
}



export {ToDoList, addList, deleteList, deleteProject, check};