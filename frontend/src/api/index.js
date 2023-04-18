class Api {
  constructor(url, headers) {
    this._url = url
    this._headers = headers
  }

  checkResponse(res) {
    return new Promise((resolve, reject) => {
      if (res.status === 204) {
        return resolve(res)
      }
      const func = res.status < 400 ? resolve : reject
      res.json().then(data => func(data))
    })
  }

  getBoardData(id) {
    const token = localStorage.getItem('token')
    const authorization = token ? { 'authorization': `Token ${token}` } : {}
    return fetch(
      `${this._url}/api/board/${id}/`,
      {
        method: 'GET',
        headers: {
          ...this._headers,
          ...authorization
        }
      }).then(this.checkResponse)
  }

  createBoard(data) {
    const token = localStorage.getItem('token')
    const authorization = token ? { 'authorization': `Token ${token}` } : {}
    return fetch(
      this._url + '/api/boards/',
      {
        method: 'POST',
        headers: {
          ...this._headers,
          ...authorization
        },
        body: JSON.stringify(data)
      }).then(this.checkResponse)
  }

  signin({ email, password }) {
    return fetch(
      this._url + '/api/users/login/',
      {
        method: 'POST',
        headers: this._headers,
        body: JSON.stringify({
          email, password
        })
      }
    ).then(this.checkResponse)
  }

  signout() {
    const token = localStorage.getItem('token')
    return fetch(
      this._url + '/api/users/logout/',
      {
        method: 'POST',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }

  signup({ email, password, username, first_name, last_name }) {
    return fetch(
      this._url + `/api/users/`,
      {
        method: 'POST',
        headers: this._headers,
        body: JSON.stringify({
          email, password, username, first_name, last_name
        })
      }
    ).then(this.checkResponse)
  }

  getUserData() {
    const token = localStorage.getItem('token')
    return fetch(
      this._url + `/api/users/me/`,
      {
        method: 'GET',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }

  changePassword({ current_password, new_password }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/users/set_password/`,
      {
        method: 'POST',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        },
        body: JSON.stringify({ current_password, new_password })
      }
    ).then(this.checkResponse)
  }

  createTasks(create_task) {
    const token = localStorage.getItem('token')
    const authorization = token ? { 'authorization': `Token ${token}` } : {}
    return fetch(
      this._url + '/api/tasks/',
      {
        method: 'POST',
        headers: {
          ...this._headers,
          ...authorization
        },
        body: JSON.stringify(create_task)
      }).then(this.checkResponse)
  }

  deleteTasks(task_id) {
    const token = localStorage.getItem('token')
    const authorization = token ? { 'authorization': `Token ${token}` } : {}
    return fetch(
      `${this._url}/api/tasks/${task_id.id}/`,
      {
        method: 'DELETE',
        headers: {
          ...this._headers,
          ...authorization
        }
      }).then(this.checkResponse)
  }

  editTasks(title, id) {
    const token = localStorage.getItem('token')
    const authorization = token ? { 'authorization': `Token ${token}` } : {}
    return fetch(
      `${this._url}/api/tasks/${id}/`,
      {
        method: 'PATCH',
        headers: {
          ...this._headers,
          ...authorization
        },
        body: JSON.stringify(title)
      }).then(this.checkResponse)
  }

  moveTasks(tasks_from, tasks_to) {
    const token = localStorage.getItem('token')
    const authorization = token ? { 'authorization': `Token ${token}` } : {}
    let tasks = [...tasks_from, ...tasks_to]
    return fetch(
      this._url + '/api/tasks/move/',
      {
        method: 'POST',
        headers: {
          ...this._headers,
          ...authorization
        },
        body: JSON.stringify({ tasks })
      }).then(this.checkResponse)
  }

  moveGroups(boards) {
    const token = localStorage.getItem('token')
    const authorization = token ? { 'authorization': `Token ${token}` } : {}
    return fetch(
      this._url + '/api/groups/move/',
      {
        method: 'POST',
        headers: {
          ...this._headers,
          ...authorization
        },
        body: JSON.stringify({ boards })
      }).then(this.checkResponse)
  }

  createGroups(create_group) {
    const token = localStorage.getItem('token')
    const authorization = token ? { 'authorization': `Token ${token}` } : {}
    return fetch(
      this._url + '/api/groups/',
      {
        method: 'POST',
        headers: {
          ...this._headers,
          ...authorization
        },
        body: JSON.stringify(create_group)
      }).then(this.checkResponse)
  }

  editGroup(title, id) {
    const token = localStorage.getItem('token')
    const authorization = token ? { 'authorization': `Token ${token}` } : {}
    return fetch(
      `${this._url}/api/groups/${id}/`,
      {
        method: 'PATCH',
        headers: {
          ...this._headers,
          ...authorization
        },
        body: JSON.stringify(title)
      }).then(this.checkResponse)
  }

  editBoard(title, id) {
    const token = localStorage.getItem('token')
    const authorization = token ? { 'authorization': `Token ${token}` } : {}
    return fetch(
      `${this._url}/api/board/${id}/`,
      {
        method: 'PATCH',
        headers: {
          ...this._headers,
          ...authorization
        },
        body: JSON.stringify(title)
      }).then(this.checkResponse)
    }

  getboards() {
    const token = localStorage.getItem('token')
    const authorization = token ? { 'authorization': `Token ${token}` } : {}
    return fetch(
      this._url + '/api/boards/',
      {
        method: 'GET',
        headers: {
          ...this._headers,
          ...authorization
        }
      }).then(this.checkResponse)
  }

  deleteGroup(group) {
    const token = localStorage.getItem('token')
    const authorization = token ? { 'authorization': `Token ${token}` } : {}
    return fetch(
      `${this._url}/api/groups/${group.id}/`,
      {
        method: 'DELETE',
        headers: {
          ...this._headers,
          ...authorization
        }
      }).then(this.checkResponse)
  }
  deleteBoard(id) {
    const token = localStorage.getItem('token')
    const authorization = token ? { 'authorization': `Token ${token}` } : {}
    console.log(id)
    return fetch(
      `${this._url}/api/boards/${id}/`,
      {
        method: 'DELETE',
        headers: {
          ...this._headers,
          ...authorization
        }
      }).then(this.checkResponse)
  }

}

export default new Api('http://localhost:8000', { 'content-type': 'application/json' })
