/* document.querySelector("body").addEventListener("click",()=>{
    document.querySelectorAll(".createBtn").forEach((b)=>{
        b.addEventListener("click", (e)=>{e.target.classList.toggle("hidden")});
        taggNewForm();
    });
    console.log("body")
}) */
document.querySelectorAll(".createBtn").forEach((b)=>{
    b.addEventListener("click", (e)=>{e.target.classList.toggle("hidden")});
    taggNewForm();
});


function taggNewForm(){
    document.querySelectorAll(".createForm").forEach((f)=>{
        f.addEventListener("submit", (e)=>{
            
            if(e.parentElement.querySelector(".hidden")){
                document.querySelector(".hidden").classList.toggle("hidden");
            }
            e.target.remove();
            console.log("removed createform")
        });
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
            document.querySelectorAll(".createBtn").forEach((b)=>{
                b.addEventListener("click", (e)=>{
                    e.target.classList.toggle("hidden");
                    taggNewForm();
                });
                
            });
        }
        
    });
});

// Configure the MutationObserver to watch for changes in child nodes
const config = { childList: true };

// Start observing the target node for configured mutations
observer.observe(parentElement, config);
