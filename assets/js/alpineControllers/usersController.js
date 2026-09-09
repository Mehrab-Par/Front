document.addEventListener('alpine:init', () => {
    Alpine.data('usersData', function () {
        return {
            mainUsers: [],
            users: [],
            pageUsers: [],
            isLoading: false,
            showAddModal: false,
            pageCount: 1,
            itemCount: 4,
            currentPage: 1,
            newUserInfo: {
                name: "",
                username: "",
                email: "",
            },
            userIdToEdit: null,
            getUsers() {
                this.isLoading = true
                axios.get("https://jsonplaceholder.typicode.com/users").then((res) => {
                    this.mainUsers = res.data
                    this.users = res.data
                    this.pagination()
                }).catch(error => {
                    console.log(error.message);
                }).finally(() => {
                    this.isLoading = false
                })
            },
            pagination() {
                this.pageCount = Math.ceil(this.users.length / this.itemCount) // 10 / 4 = 3
                let start = (this.currentPage * this.itemCount) - this.itemCount
                let end = this.currentPage * this.itemCount
                this.pageUsers = this.users.slice(start, end)
            },
            nextPage() {
                if (this.currentPage < this.pageCount) this.currentPage++
                this.pagination()
            },
            previousPage() {
                if (this.currentPage > 1) this.currentPage--
                this.pagination()
            },
            handleChangeItemCount(e) {
                this.currentPage = 1
                this.itemCount = e.value
                if (this.itemCount < 1) this.itemCount = 1
                if (this.itemCount > this.users.length) this.itemCount = this.users.length
                this.pagination()
            },
            handleSearch(e) {
                setTimeout(() => {
                    this.users = this.mainUsers.filter(user => user.name.includes(e.value) || user.username.includes(e.value) || user.email.includes(e.value))
                    this.currentPage = 1
                    this.pagination()
                    this.itemCount = 4
                }, 100)
            },
            handleSubmitAddUserForm() {
                this.isLoading = true
                axios.post("https://jsonplaceholder.typicode.com/users", this.newUserInfo).then((res) => {
                    if (res.status == 201) {
                        this.mainUsers.push(res.data)
                        this.showAddModal = false
                        this.handleResetForm()
                        this.pagination()
                        M.toast({ html: 'User added successfully!', classes: 'rounded green' });
                    }
                }).finally(() => {
                    this.isLoading = false
                })
            },
            handleResetForm() {
                this.newUserInfo = {
                    name: "",
                    username: "",
                    email: "",
                }
            },
            handleDeleteUser(userId) {
                var toastHTML = '<span>Are you sure?(' + userId + ')</span><button class="btn-flat toast-action" x-on:click="handleConfirmDeleteUser(' + userId + ')">Delete</button>';
                M.toast({ html: toastHTML, classes: 'rounded' });
            },
            handleConfirmDeleteUser(userId) {
                axios.delete("https://jsonplaceholder.typicode.com/users" + userId).then((res) => {
                    if (res.status == 200) {
                        this.mainUsers = this.mainUsers.filter(user => user.id != userId)
                        this.users = this.users.filter(user => user.id != userId)
                        this.pagination()
                        M.toast({ html: 'User deleted successfully!', classes: 'rounded green' });
                    }
                }).finally(() => {
                    this.isLoading = false
                })
            },
            handleUpdateUser(user) {
                axios.get("https://jsonplaceholder.typicode.com/users" + user.id).then(res => {
                    if (res.status == 200) {
                        this.newUserInfo = {
                            name: res.data.name,
                            username: res.data.username,
                            email: res.data.email,
                        }
                        this.userIdToEdit = res.data.id
                    }
                })
                this.newUserInfo = {
                    name: user.name,
                    username: user.username,
                    email: user.email,
                }
                this.showAddModal = true
            },
            handleConfirmEditUser() {
                this.isLoading = true
                axios.put("https://jsonplaceholder.typicode.com/users"+ this.userIdToEdit, this.newUserInfo).then((res) => {
                    if (res.status == 200) {
                        const userIndex = this.mainUsers.findIndex(user=> user.id = this.userIdToEdit)
                        this.mainUsers[userIndex] = res.data
                        this.showAddModal = false
                        this.userIdToEdit = null
                        this.handleResetForm()
                        this.pagination()
                        M.toast({ html: 'User Updated successfully!', classes: 'rounded green' });
                    }
                }).finally(() => {
                    this.isLoading = false
                })
            }
        }
    })
})