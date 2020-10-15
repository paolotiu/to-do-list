import { appendElements } from './helper.js'
import { ToDoList, addList, deleteList, deleteProject, check } from './index.js'
function sidebar(array = []) {
    const view = document.querySelector('#view')
    const projects = document.querySelector('#projects')
    let sort = document.querySelector('#a')
    let clicked = false
    view.addEventListener('click', () => {
        if (clicked) {
         =
            sort.innerText = 'arrow_right'
            projects.classList.remove('show')
            clicked = false
        } else {
            sort.innerText = 'arrow_drop_down'
            projects.innerHTML = ''
            array.forEach((x) => {
                let p = document.createElement('p')
                let del = document.createElement('span')
                del.classList.add('material-icons')
                del.innerText = 'delete_forever'
                p.addEventListener('click', (e) => {
                   
                    showList(x)
                })
                del.addEventListener('click', (e) => {
                   
                    deleteProject(x)
                })
                p.classList.add('project-names')
                p.innerHTML = x.name

                p.appendChild(del)
                projects.appendChild(p)

                projects.classList.add('show')
            })
            clicked = true
        }
    })
}

function showList(project) {
    let listConatiner = domElements.listConatiner
    //reset list shown
    domElements.listConatiner.innerHTML = ''

    //show name of project
    let projectName = document.createElement('h1')
    projectName.innerText = project.name
    listConatiner.appendChild(projectName)

    //Show all the lists
    project.lists.forEach((x) => {
        let currentDate = new Date()

        let div = document.createElement('div')
        let date = document.createElement('p')
        if (x.status) {
            div.classList.add('list-item', 'completed')
        } else if (currentDate >= new Date(x.dueDate)) {
            div.classList.add('list-item', 'late')
        } else {
            div.classList.add('list-item')
        }
        let title = document.createElement('h2')
        let description = document.createElement('p')

        let del = document.createElement('span')
        let completed = document.createElement('span')
        del.classList.add('material-icons', 'trash')
        completed.classList.add('material-icons', 'check')
        del.innerText = 'close'
        completed.innerText = 'check'

        completed.addEventListener('click', () => {
            if (!x.status) {
                x.status = true
            } else {
                x.status = false
            }
            div.classList.toggle('completed')
        })

        del.addEventListener('click', () => {
            deleteList(project, x)
            showList(project)
        })

        if (x.notes) {
            let notes = document.createElement('p')
            notes.innerText = x.notes
        }

        description.innerText = x.description
        title.innerText = x.title
        date.innerText = x.dueDate

        appendElements(div, [
            title,
            document.createElement('hr'),
            description,
            date,
            completed,
            del,
        ])
        listConatiner.appendChild(div)
    })

    let submit = document.createElement('button')
    submit.classList = 'new'
    submit.innerText = 'New List'
    submit.addEventListener('click', () => newListForm(project))
    listConatiner.appendChild(submit)
}

function getProjectFrom() {
    let projectName = document.getElementsByName('project-name')[0].value
    let projectDescription = document.getElementsByName(
        'project-description'
    )[0].value
    return { projectName, projectDescription }
}

function newListForm(project) {
    domElements.listConatiner.innerHTML = `
    <div class="new-todo">
    <h2> New To Do </h2>
    <form action="prevent()">
                <input type="text" name="title" placeholder="List Name" required>
                <br>
                <input type="text" name="description" placeholder="List Description" required>
                <br>
                <input type="date" name="date" placeholder="Date" required>
                <br>
                <input type="submit" name="submit-list" value="Submit">
            </form>
    </div>
    `
    let submit = document.getElementsByName('submit-list')[0]
    submit.addEventListener('click', (e) => {
        e.preventDefault()
        makeNewList(
            project,
            document.getElementsByName('title')[0].value,
            document.getElementsByName('description')[0].value,
            document.getElementsByName('date')[0].value
        )
    })
}

function makeNewList(project, title, description, date) {
    addList(project, new ToDoList(title, description, date))
    showList(project)
}

function toggleComplete(list) {
    if (list.status) {
        return true
    }
}

const domElements = (function domElements() {
    const listConatiner = document.querySelector('.list')

    return { listConatiner }
})()
export { sidebar, showList, getProjectFrom }
