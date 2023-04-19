import api from '../api'

const registration = ({
    values: {
        email,
        password,
        username,
        first_name,
        last_name },
    loginData: { setLoggedIn, navigate }
}) => {
    api.signup({ email, password, username, first_name, last_name })
        .then(res => {
            navigate('/signin')
        })
        .catch(err => {
            const errors = Object.values(err)
            if (errors) {
                alert(errors.join(', '))
            }
            setLoggedIn(false)
        })
}
const authorization = ({
    values: { email, password }, loginData: { setUser, setLoggedIn, navigate }

}) => {

    api.signin({
        email, password
    }).then(res => {
        if (res.auth_token) {
            localStorage.setItem('token', res.auth_token)
            api.getUserData()
                .then(res => {
                    setUser(res)
                    setLoggedIn(true)
                    navigate('/')
                })
                .catch(err => {
                    setLoggedIn(false)
                    navigate('/signin')
                })
        } else {
            setLoggedIn(false)
        }
    })
        .catch(err => {
            const errors = Object.values(err)
            if (errors) {
                alert(errors.join(', '))
            }
            setLoggedIn(false)
        })
}
const onSignOut = ({ setLoggedIn }) => {
    api
        .signout()
        .then(res => {
            localStorage.removeItem('token')
            setLoggedIn(false)
        })
        .catch(err => {
            const errors = Object.values(err)
            if (errors) {
                alert(errors.join(', '))
            }
        })
}
const changePassword = ({
    values: { new_password,
        current_password },
    navigate
}) => {
    api.changePassword({ new_password, current_password })
        .then(res => {
            navigate('/signin')
        })
        .catch(err => {
            const errors = Object.values(err)
            if (errors) {
                alert(errors.join(', '))
            }
        })
}
// const getBoardData = ({id, setGroup}) => {
//     api.getBoardData(id)
//         .then(res => {
//             setGroup(res);
//             navigate(`/board/${id}/`);
//         })
//         .catch(err => {
//             const errors = Object.values(err);
//             if (errors) {
//                 alert(errors.join(', '));
//             }
//         });
// };

// const getBoardsData = (setBoards) => {
//     api.getboards()
//         .then(res => {
//             setBoards(res)
//         }).catch(errors => {
//             if (errors) {
//                 alert(errors.join(', '))
//             }
//         })
// }

export { authorization, registration, onSignOut, changePassword }




