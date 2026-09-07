document.addEventListener('alpine:init', () => {
    Alpine.data('usersData', function(){
        return {
            users: [],
            isLoading: false,
            getUsers() {
                this.isLoading =true
                axios.get("https://jsonplaceholder.typicode.com/users").then((res) => {
                    this.users = res.data
                }).catch(error =>{
                    console.log(error.message);
                }).finally(() => {
                    this.isLoading = false
                })
            }
        }
    })
})