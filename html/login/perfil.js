var User = getCurrentUser(user_UID);
window.location.href = "../home/home.html";


function getCurrentUser(user_UID){
    if (sessionStorage.User === undefined) {
        return userService.findByUid(user_UID).then (user=>{
            if(user === undefined){
                sessionStorage.setItem("profile_atualizar",true);
            }else{
                sessionStorage.setItem("profile_atualizar",false);
                setUser(user);
                getUser();
            }
        }).catch(error => {
            console.log(error);
        });
    }else{
        return getUser();
    }
}

function setUser(User){
    let UserString = JSON.stringify(User);
    sessionStorage.setItem('User', UserString);
}
  
function getUser(){
    let userString = sessionStorage.User;
    let user;
    if(!(userString === undefined)){
        user = JSON.parse(userString);
    }
    console.log(user);
    return user;
}