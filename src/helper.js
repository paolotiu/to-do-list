function appendElements(parent, children=[]){
    children.forEach(x => {
        
        parent.appendChild(x);
    });
}

export {appendElements}