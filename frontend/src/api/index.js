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

  getGroupsData() {
    const token = localStorage.getItem('token')
    const authorization = token ? { 'authorization': `Token ${token}` } : {}
    return fetch(
      this._url + '/api/groups/',
      {
        method: 'GET',
        headers: {
          ...this._headers,
          ...authorization
        }
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
    console.log('Выход')
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

  deleteGroup(group) {
    const token = localStorage.getItem('token')
    const authorization = token ? { 'authorization': `Token ${token}` } : {}
    const url = this._url + `/api/groups/${group.current_group.id}/`
    console.log(url)
    return fetch(
      url,
      {
        method: 'DELETE',
        headers: {
          ...this._headers,
          ...authorization
        },
        // body: JSON.stringify(group)
      }).then(this.checkResponse)
  }

  editData(edit_items) {
    const token = localStorage.getItem('token')
    const authorization = token ? { 'authorization': `Token ${token}` } : {}
    return fetch(
      this._url + '/api/groups/edit/',
      {
        method: 'POST',
        headers: {
          ...this._headers,
          ...authorization
        },
        body: JSON.stringify(edit_items)
      }).then(this.checkResponse)
  }

}

export default new Api('http://localhost:8000', { 'content-type': 'application/json' })
