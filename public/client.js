/* document.querySelector("body").addEventListener("click",()=>{
    document.querySelectorAll(".createBtn").forEach((b)=>{
        b.addEventListener("click", (e)=>{e.target.classList.toggle("hidden")});
        taggNewForm();
    });
    console.log("body")
}) */
taggNewBtn();
function taggNewBtn(){
    document.querySelectorAll(".createBtn").forEach((b)=>{
        b.addEventListener("click", (e)=>{
            e.target.classList.toggle("hidden");
            const parentElement = e.target.parentElement;
            const observer = new MutationObserver(function(mutations){
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        // Check if the added node is a form element
                        if (node instanceof HTMLFormElement) {
                            // Handle the added form element
                            console.log('A form element has been added:', node);
                            // Add event listeners or perform other actions as needed
                            taggNewForm();
                        }
                    });
                });
            });
    
            // Configure the MutationObserver to watch for addition of child nodes
            const config = { childList: true/* , subtree: true  */};
    
            // Start observing the target node for configured mutations
            observer.observe(parentElement, config);
    
            /* e.target.parentElement.addEventListener("change", ()=>{
                if(e.target.parentElement.querySelector("form")){
                    console.log("detected form");
                    
                }
                else console.log("no form")
            }) */
             
            
        });
        
    });
}



function taggNewForm(){
    document.querySelectorAll(".createForm").forEach((f)=>{
        console.log("detected form");
        // Select the parent element whose children you want to monitor
        const parentElement = document.querySelector("main");

        // Create a new MutationObserver instance
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Child elements have been added
            
                    //console.log('Child elements have been added or removed.');
            
                    // Perform actions as necessary
                    //krockar med htmx som också använder submit eventet
                    if(f.parentElement.querySelector(".hidden")){
                        f.parentElement.querySelector(".hidden").classList.toggle("hidden");
                    }
                    f.remove();
                    console.log("removed createform")
                }
        
            });
        });

        // Configure the MutationObserver to watch for changes in child nodes
        const config = { childList: true };

        // Start observing the target node for configured mutations
        observer.observe(parentElement, config);
        
            
        
    });
}


// Select the parent element whose children you want to monitor
const parentElement = document.querySelector("body");

// Create a new MutationObserver instance
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Child elements have been added
            
            //console.log('Child elements have been added or removed.');
            
            // Perform actions as necessary
            taggNewBtn();
        }
        
    });
});

// Configure the MutationObserver to watch for changes in child nodes
const config = { childList: true };

// Start observing the target node for configured mutations
observer.observe(parentElement, config);
