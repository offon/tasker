import React from 'react';
import ReactDOM from 'react-dom/client';
// import { useHistory } from 'react-router-dom';
import './index.css';
import Modal from './Modal/Modal';
import api from './api'

class Group extends React.Component{
  constructor(props) {
    super(props);
    this.group = this.props.group
  }
  dragLeaveHandler(e) {
    e.target.style.boxShadow = 'none'
    e.target.style.marginBottom = '0px'
  }
  dragstartHandler(e, group, item) {
    this.props.dragstartHandler(e, group, item)
  }
  dragOverHandler(e) {
    e.preventDefault()
    if (e.target.className === 'item') {
      e.target.style.boxShadow = '0 4px 3px gray'
      e.target.style.marginBottom = '30px'
    }
  }
  dropHandler(e, group, item){
    this.props.dropHandler(e, group, item)
  }
  
  editItem(e, item) {
    this.props.editItem(e, item, this.group)
  }

  render(){
    return(
      this.group.items.map(item => 
      <div className='item' key = {item.id} group = {this.group.id}
      draggable={true}
      onDragStart={(e) => this.dragstartHandler(e, this.group, item)}
      onDragLeave={(e) => this.dragLeaveHandler(e)}
      onDragOver={(e) => this.dragOverHandler(e)}
      onDrop={(e) => this.dropHandler(e, this.group, item)}
      onClick={(e) => this.editItem(e, item)}
      >{item.title}
    </div>)
    );
    
  }
}
class Boards extends React.Component{
  constructor(props){
    super(props);
    this.state = {groups: [],
                  current_group: null,
                  current_item: null,
                  modal_active: false,
                  task: '',
                  modal_add_group: false,
                  modal_edit_group: false,
                  group: '',
                  modal_edit_item: false,
                  modal_login: false,
                  loggedIn: false,
                  user: {},
                  email: '',
                  password: '',
                  isChanged: false,
                  delete_groups:[],
                  delete_items: [],
                  create_items: [],
                  create_groups: [],
                  edit_items: []

                };
    this.dragstartHandler = this.dragstartHandler.bind(this)
    this.dropHandler = this.dropHandler.bind(this)
    this.setActiveAddTaskWindow = this.setActiveAddTaskWindow.bind(this)
    this.handleSaveTask = this.handleSaveTask.bind(this)
    this.handleSubmitAddTask = this.handleSubmitAddTask.bind(this)
    this.setActiveGroupWindow = this.setActiveGroupWindow.bind(this)
    this.handleSaveGroup = this.handleSaveGroup.bind(this)
    this.handleAddGroup = this.handleAddGroup.bind(this)
    this.editItem = this.editItem.bind(this)
    this.setActiveEditItemWindow = this.setActiveEditItemWindow.bind(this)
    this.handleEditTask = this.handleEditTask.bind(this)
    this.handleSaveEditTask = this.handleSaveEditTask.bind(this)
    this.setActiveGroupEditWindow = this.setActiveGroupEditWindow.bind(this)
    this.setCloseGroupEditWindow = this.setCloseGroupEditWindow.bind(this)
    this.handleEditGroup = this.handleEditGroup.bind(this)
  }
  set_index_for_items(group) {
    for (let i=0; i < group.items.length; i++) {
      group.items[i].position = i + 1
    }
  }

  // item edit, func for group component, drop item on group location
  dragstartHandler(e, group, item) {
    this.setState({current_group: group, current_item: item})
  }
  dropHandler(e, group, item) {
    e.preventDefault()
    e.stopPropagation()
    this.state.current_item.group = group.id
    e.target.style.boxShadow = 'none'
    e.target.style.marginBottom = '0px'
    group.status = 'edit'
    this.state.current_group.status = 'edit'
    const current_index = this.state.current_group.items.indexOf(this.state.current_item)
    this.setState({current_group: this.state.current_group.items.splice(current_index, 1), isChanged: true}) 
    const drop_index = group.items.indexOf(item)
    group.items.splice(drop_index + 1, 0, this.state.current_item)
    this.set_index_for_items(group)
    this.set_index_for_items(this.state.current_group)

  }
  dropGroupHandler(e, group) {
    this.state.current_item.group = group.id
    group.items.push(this.state.current_item)
    group.status = 'edit'
    let edit_group = this.state.current_group
    edit_group.status = 'edit'
    this.setState({current_group: edit_group})
    const current_index = this.state.current_group.items.indexOf(this.state.current_item)
    this.setState({current_group: this.state.current_group.items.splice(current_index, 1), isChanged: true})
    this.set_index_for_items(group)
    this.set_index_for_items(this.state.current_group)
  }
  dragOverHandler(e) {
    e.preventDefault()
    if (e.target.className === 'item') {
      e.target.style.boxShadow = '0 4px 3px gray'
      e.target.style.marginBottom = '30px'
    }
  }
  // Add task by click on button "add task"
  additem(group) {
      this.setState({modal_active: true})
      this.setState({current_group: group})
  }
  setActiveAddTaskWindow(value){
    this.setState({modal_active: value})
  }
  handleSaveTask(event) {
    this.setState({task: event.target.value})
  }
  handleSubmitAddTask(event) {
    let item = {}
    if (this.state.task) {
      item = {
        title: this.state.task,
        group: this.state.current_group.id,
        position: this.state.current_group.items.length + 1}
      // this.state.current_group.items.push(item)
    }
    api.createItems({
      item
    }).then(res => {
      this.setState({groups: res})
    })
    .catch(err => {
      const errors = Object.values(err)
      if (errors) {
        alert(errors.join(', '))
      }
    })
    this.setState({task: '', current_group: null, modal_active: false})
    event.preventDefault();
    document.getElementById("form-add-task").reset();
  }
  // edit and delete item of task by double click by item in group of task
  editItem(event, item, group) {
    if (event.detail === 2) {
    this.setState({modal_edit_item: true, current_item: item, current_group: group})
    }
  }
  setActiveEditItemWindow(value) {
    this.setState({modal_edit_item: value})
    if (!value){
      this.setState({task: '', current_item: null, current_group: null})
    }
  }
  handleEditTask(e) {
    this.setState({task: e.target.value})
  }
  handleSaveEditTask(e) {
    if (this.state.task){
      const new_item = this.state.current_item
      new_item.title = this.state.task
      this.setState({current_item: new_item, modal_edit_item: false, task: '', current_group: null, isChanged: true})
      }
      e.preventDefault();
      document.getElementById("form-add-task").reset();
  }
  deleteItem(e) {
  const index = this.state.current_group.items.indexOf(this.state.current_item)
  if (this.state.current_item.status !== 'new') {
    this.state.delete_items.push(this.state.current_item.id)
  }
  this.setState({current_group: this.state.current_group.items.splice(index, 1),
    current_item: null,
    modal_edit_item: false,
    isChanged: true})
  e.preventDefault();
  }
  // Add group by click on button in header
  setActiveGroupWindow(value) {
    this.setState({modal_add_group: value})
  }
  handleAddGroup(e) {
    let group = {}
    if (this.state.group){
      group = {title: this.state.group, board: 1, position: this.state.groups.length + 1}
    this.state.groups.push({title: this.state.group, items: [], board: 1, group: 1})

    api.createGroups({
      group
    }).then(res => {
      this.setState({groups: res})
    })
    .catch(err => {
      const errors = Object.values(err)
      if (errors) {
        alert(errors.join(', '))
      }
    })

    this.setState({group: '', modal_add_group: false})
    }
    e.preventDefault();
    document.getElementById("form-add-task").reset();
  }
  handleSaveGroup(event) {
    this.setState({group: event.target.value, isChanged: true})
    event.preventDefault();
  }
 // Edit or delete group by clicking on head of group
  setActiveGroupEditWindow(e, value, group) {
  if (e.detail === 2) {
    this.setState({modal_edit_group: value, current_group: group})
  }
  }
  setCloseGroupEditWindow(value) {
      this.setState({modal_edit_group: value})
  }
  handleEditGroup(e) {
    if (this.state.group){
      // const index = this.state.boards.indexOf(current_group)
      const edit_group = this.state.current_group
      edit_group.title = this.state.group
      edit_group.status = 'edit'
      this.setState({group: '', modal_edit_group: false, current_group: edit_group, isChanged: true})
      }
      e.preventDefault();
      document.getElementById("form-add-task").reset();
  }


  deleteGroup(e) {
    const index = this.state.groups.indexOf(this.state.current_group)
    this.state.delete_groups.push(this.state.current_group.id)
    let current_group = this.state.current_group
    this.setState({current_group: this.state.groups.splice(index, 1), modal_edit_group: false})
    api.deleteGroup({
      current_group
    }).then(res => {
      this.setState({delete_items: [], delete_groups:[]})
    })
    .catch(err => {
      const errors = Object.values(err)
      if (errors) {
        alert(errors.join(', '))
      }
    })
    this.setState({current_group: null})

  }


// Login logic
  handlemodalLogin(value) {
    this.setState({modal_login: value})
  }
  setLoginIn(value) {
    this.setState({loggedIn: value})
  }
  setUser(value) {
    this.setState({user: value})
  }
  getData(){
    api.getGroupsData().then(res => {
      this.setState({groups: res})
    })
  }
  login(event) {
    const email = this.state.email
    const password = this.state.password
    api.signin({
        email, password
      }).then(res => {
        if (res.auth_token) {
          localStorage.setItem('token', res.auth_token)
          api.getUserData()
          .then(res => {
            this.setUser(res)
            this.setState({loggedIn: true, modal_login: false, email: '', password: ''})
            this.getData()
          })
          .catch(err => {
            const errors = Object.values(err)
            if (errors) {
              alert(errors.join(', '))
            }
          })
        } else {
          this.setLoginIn(false)
        }
      }).catch(err => {
        const errors = Object.values(err)
        if (errors) {
          alert(errors.join(', '))
        }
      })
      event.preventDefault();
    }
  logout (event) {
    api
      .signout()
      .then(res => {
        localStorage.removeItem('token')
        this.setState({loggedIn: false, groups:[]})
      })
      .catch(err => {
        const errors = Object.values(err)
        if (errors) {
          alert(errors.join(', '))
        }
      })
  }

// Check status of user authorization
    componentDidMount() {
      api.getUserData()
      .then(res => {
        if (res.email) {
          this.setState({loggedIn: true})
          this.getData()
        } else {
          this.setState({loggedIn: false, groups:[]})
        }
      })
    }

// Send data to server
    saveDataToServer(){
      console.log('SandData')
      const delete_items = this.state.delete_items
      const delete_groups = this.state.delete_groups
      let data = []
      console.log(delete_items)
      for (let i=0;  i < this.state.groups.length; i++) {
        if (this.state.groups[i].status === 'edit') {
          let add_arr = this.state.groups[i].items
          data.push(...add_arr)
        }
      }
      for (let i=data.length-1;  i >= 0 ; i--) {
        let item_for_add = Object.keys(data[i])
        if (item_for_add.includes('status')) {
          this.state.create_items.push(data[i])
        } else {
          this.state.edit_items.push(data[i])
        }
      }
      //delete objects if exsist
      if (this.state.delete_items.length > 0 || this.state.delete_groups.length > 0) {
      console.log('delete items: ', this.state.delete_items)

    }

    // if (this.state.create_items.length > 0) {
    //   console.log('try create items')
    //   let create_items = this.state.create_items
    //   api.createItems({
    //     create_items
    //   }).then(res => {
    //     this.setState({isChanged: false, create_items: [], create_groups: []})
    //     create_items = []
    //   })
    //   .catch(err => {
    //     const errors = Object.values(err)
    //     if (errors) {
    //       alert(errors.join(', '))
    //     }
    //   })
    // }



    if (this.state.edit_items.length > 0) {
      console.log('try edit')
      let edit_items = this.state.edit_items
      api.editData({
        edit_items, 
      }).then(res => {
        this.setState({isChanged: false, edit_items: []})
        edit_items = []
      })
      .catch(err => {
        const errors = Object.values(err)
        if (errors) {
          alert(errors.join(', '))
        }
      })
    }



    }
  render() {
    return(
      <React.StrictMode>
      <header>
      {this.state.loggedIn ? 
        <div className='header-buttons-place'>
          <div className='headder-button' onClick={() => this.setActiveGroupWindow(true)}>Создать группу</div>
          </div> : null }
      {this.state.isChanged ?
        <div className='header-buttons-place'>
          <div className='headder-button'onClick={() => this.saveDataToServer()}>Сохранить изменения</div>
          <div className='headder-button'>Отменить изменения</div>
        </div>
        : null}
        <div className='logo'>
        <h1>
          Task Scheduler
        </h1>
        </div>
        {this.state.loggedIn ?
        <div className='headder-login-buttons'>
        <div className='headder-name'>
          {this.state.name ? this.state.name : this.state.email}
          </div>
        <div className='headder-button' onClick={(e) => this.logout(e)}>Выйти</div>
        </div>
        : <div className='headder-login-buttons'>
          <div className='headder-button'>Зарегестрироваться</div>
          <div className='headder-button' onClick={() => this.setState({modal_login: true})}>Войти</div>
          </div>}
      </header>
      <div className='board'>
        {this.state.groups.map(group => 
          <div className='group' key={group.id}
           onDragOver={(e) => this.dragOverHandler(e)}
           onDrop={(e) => this.dropGroupHandler(e, group)}
           >
            <div className='group-header' onClick={(e) => this.setActiveGroupEditWindow(e, true, group)}>
              {group.title}
            </div>
            <Group group={group} 
                  dragstartHandler={this.dragstartHandler}
                  dropHandler = {this.dropHandler}    
                  editItem = {this.editItem}              
                  />
          <div className='item-add' onClick={()=>this.additem(group)} > Добавить задачу </div>
          </div>
          )}

      {this.state.modal_active ? 
      <Modal modal_active = {this.state.modal_active} setActive = {this.setActiveAddTaskWindow}>
        <form onSubmit={this.handleSubmitAddTask} id='form-add-task'>
          <label>
            Новая задача
          <input type="text" onChange={this.handleSaveTask}/>
          </label>
          <button type='submit'>Сохранить</button>
          <button type='reset' onClick={() => this.setActiveAddTaskWindow(false)}>Отмена</button>
        </form>
      </Modal> : null }

      {this.state.modal_add_group ? 
      <Modal modal_active = {this.state.modal_add_group} setActive = {this.setActiveGroupWindow}>
        <form onSubmit={this.handleAddGroup} id='form-add-task'>
          <label>
            Новая группа
          <input type="text" onChange={this.handleSaveGroup}/>
          </label>
          <button type='submit' name='save'>Сохранить</button>
          <button type='reset' onClick={() => this.setActiveGroupWindow(false)}>Отмена</button>
        </form>
      </Modal> : null }

      {this.state.modal_edit_group ? 
      <Modal modal_active = {this.state.modal_edit_group} setActive = {this.setCloseGroupEditWindow}>
        <form onSubmit={this.handleEditGroup.bind(this)} id='form-add-task'>
          <label>
            Редактирование группы
          <input type="text" defaultValue={this.state.current_group.title} onChange={this.handleSaveGroup}/>
          </label>
          <button type='submit'>Сохранить</button>
          <button type='delete' onClick={(e) => this.deleteGroup(e)}>Удалить</button>
          <button type='reset' onClick={() => this.setCloseGroupEditWindow(false)}>Отмена</button>
        </form>
      </Modal> : null }

      {this.state.modal_edit_item ? 
      <Modal modal_active = {this.state.modal_edit_item}
             setActive = {this.setActiveEditItemWindow}>
        <form onSubmit={this.handleSaveEditTask} id='form-add-task'>
          <label>
            Редактирование задачи
          <input type="text" defaultValue={this.state.current_item.title} onChange={this.handleEditTask}/>
          </label>
          <button type='submit'>Сохранить</button>
          <button type='delete' onClick={(e) => this.deleteItem(e)}>Удалить</button>
          <button type='reset' onClick={() => this.setActiveEditItemWindow(false)}>Отмена</button>
        </form>
      </Modal> : null }

      {this.state.modal_login ? 
      <Modal modal_active = {this.state.modal_login}
             setActive = {this.handlemodalLogin.bind(this)}>
        <form onSubmit={this.login.bind(this)} id='form-add-task'>
          <h2>Авторизация:</h2>
          <label>
          Email
          <input type="text" placeholder='email'onChange={(e) => {this.setState({email: e.target.value})}}/>
          </label>
          <input type="password" placeholder='пароль' autocomplete='current-password' onChange={(e) => {this.setState({password: e.target.value})}}/>
          <button type='submit'>Войти</button>
          <button type='reset' onClick={() => this.handlemodalLogin(false)}>Отмена</button>
        </form>
      </Modal> : null }
      </div>
      </React.StrictMode>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Boards/>
);
